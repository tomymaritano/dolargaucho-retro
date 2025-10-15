/**
 * FavoritesList Component
 *
 * Single Responsibility: Render unified favorites table (dolares, currencies, cryptos)
 * Pure presentation component with typed data handling
 */

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface FavoritesListProps {
  items: Array<DolarWithVariation | CotizacionWithVariation | CryptoData>;
  selectedDolar: Quotation | undefined;
  onToggleDolar: (casa: string) => void;
  onToggleCurrency: (moneda: string) => void;
  onToggleCrypto: (id: string) => void;
}

export function FavoritesList({
  items,
  selectedDolar,
  onToggleDolar,
  onToggleCurrency,
  onToggleCrypto,
}: FavoritesListProps) {
  // Extract dolar casas for historical data
  const dolarCasas = items
    .filter(
      (item): item is DolarWithVariation =>
        'casa' in item && 'moneda' in item && item.moneda === 'USD'
    )
    .map((d) => d.casa);

  // Fetch 7-day historical data for dolares
  const { data: dolarHistorical, isLoading: loadingDolarHistorical } =
    useMultipleDolarHistoricoRange(dolarCasas, 7);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    return `$${(value / 1_000_000).toFixed(2)}M`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHeaderCell align="center" className="w-12">
            <FaStar className="inline-block text-accent-emerald" />
          </TableHeaderCell>
          <TableHeaderCell align="left">Nombre</TableHeaderCell>
          <TableHeaderCell align="right">Precio USD</TableHeaderCell>
          <TableHeaderCell align="right">Precio ARS</TableHeaderCell>
          <TableHeaderCell align="right">24h %</TableHeaderCell>
          <TableHeaderCell align="center">7D Trend</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          // Type guards
          const isDolar = 'casa' in item && 'moneda' in item && item.moneda === 'USD';
          const isCrypto = 'symbol' in item && 'market_cap' in item;

          if (isDolar) {
            const dolar = item as DolarWithVariation;
            const { trend, percentage } = dolar.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <React.Fragment key={`dolar-${dolar.casa}`}>
                <TableRow className="group">
                  <TableCell align="center">
                    <button
                      onClick={() => onToggleDolar(dolar.casa)}
                      className="p-2 rounded-lg transition-all text-accent-emerald bg-accent-emerald/10"
                      aria-label="Quitar de favoritos"
                    >
                      <FaStar className="text-base" />
                    </button>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent-emerald font-bold text-xs">$</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                        <p className="text-xs text-secondary uppercase">{dolar.casa}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      ${dolar.venta.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                      ${(dolar.venta * 1).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                      <TrendIcon className="text-xs" />
                      <span className="text-sm font-bold tabular-nums">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {loadingDolarHistorical ? (
                      <div className="w-28 h-12 mx-auto bg-white/5 rounded animate-pulse" />
                    ) : dolarHistorical?.[dolar.casa]?.data ? (
                      <CryptoSparkline
                        data={dolarHistorical[dolar.casa].data.map((d) => d.valor)}
                        trend={
                          dolarHistorical[dolar.casa].changePercent > 0
                            ? 'up'
                            : dolarHistorical[dolar.casa].changePercent < 0
                              ? 'down'
                              : 'neutral'
                        }
                      />
                    ) : (
                      <span className="text-xs text-secondary">-</span>
                    )}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          } else if (isCrypto) {
            const crypto = item as CryptoData;
            const getTrendData = (percentage: number) => {
              if (percentage > 0) return { icon: FaArrowUp, color: 'text-error' };
              if (percentage < 0) return { icon: FaArrowDown, color: 'text-success' };
              return { icon: FaMinus, color: 'text-warning' };
            };
            const trend24h = getTrendData(crypto.price_change_percentage_24h);
            const TrendIcon = trend24h.icon;

            return (
              <React.Fragment key={`crypto-${crypto.id}`}>
                <TableRow className="group">
                  <TableCell align="center">
                    <button
                      onClick={() => onToggleCrypto(crypto.id)}
                      className="p-2 rounded-lg transition-all text-accent-emerald bg-accent-emerald/10"
                      aria-label="Quitar de favoritos"
                    >
                      <FaStar className="text-base" />
                    </button>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                        <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {formatPrice(crypto.current_price)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    {selectedDolar ? (
                      <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                        $
                        {(crypto.current_price * selectedDolar.venta).toLocaleString('es-AR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-secondary">...</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
                      <TrendIcon className="text-xs" />
                      <span className="text-sm font-bold tabular-nums">
                        {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
                      <CryptoSparkline
                        data={crypto.sparkline_in_7d.price}
                        trend={
                          crypto.price_change_percentage_24h > 0
                            ? 'up'
                            : crypto.price_change_percentage_24h < 0
                              ? 'down'
                              : 'neutral'
                        }
                      />
                    ) : (
                      <span className="text-xs text-secondary">-</span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Expandable Row */}
                <TableRow
                  hoverable={false}
                  className="hidden group-hover:table-row bg-accent-emerald/5"
                >
                  <TableCell colSpan={6} className="py-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                      <div>
                        <p className="text-secondary text-[10px] mb-0.5">Market Cap</p>
                        <p className="font-semibold text-foreground text-xs">
                          {formatMarketCap(crypto.market_cap)}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary text-[10px] mb-0.5">24h High</p>
                        <p className="font-semibold text-success text-xs">
                          {formatPrice(crypto.high_24h)}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
                        <p className="font-semibold text-error text-xs">
                          {formatPrice(crypto.low_24h)}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
                        <p className="font-semibold text-foreground text-xs">
                          {formatMarketCap(crypto.total_volume)}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary text-[10px] mb-0.5">Suministro</p>
                        <p className="font-semibold text-foreground text-xs">
                          {formatMarketCap(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          } else {
            const cotizacion = item as CotizacionWithVariation;
            const { trend, percentage } = cotizacion.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <React.Fragment key={`currency-${cotizacion.moneda}`}>
                <TableRow className="group">
                  <TableCell align="center">
                    <button
                      onClick={() => onToggleCurrency(cotizacion.moneda)}
                      className="p-2 rounded-lg transition-all text-accent-emerald bg-accent-emerald/10"
                      aria-label="Quitar de favoritos"
                    >
                      <FaStar className="text-base" />
                    </button>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent-emerald font-bold text-xs">
                          {cotizacion.moneda}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{cotizacion.nombre}</p>
                        <p className="text-xs text-secondary">{cotizacion.casa}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      ${cotizacion.venta.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                      ${cotizacion.venta.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                      <TrendIcon className="text-xs" />
                      <span className="text-sm font-bold tabular-nums">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-xs text-secondary">-</span>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          }
        })}
      </TableBody>
    </Table>
  );
}
