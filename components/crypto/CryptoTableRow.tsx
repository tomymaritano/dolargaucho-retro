/**
 * CryptoTableRow Component
 *
 * Unified design matching DolaresTable structure:
 * - Logo + Name
 * - Precio USD
 * - Precio ARS
 * - 24h %
 * - 30d %
 * - 30D Trend Sparkline
 * - Acciones (Gráfico, Favorito, Copy, Share)
 */

import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaCopy,
  FaShareAlt,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { useCryptoHistoricoRange } from '@/hooks/useCryptoHistoricalRange';
import type { CryptoData } from '@/types/api/crypto';
import type { DolarQuotation } from '@/types/api/dolar';

interface CryptoTableRowProps {
  crypto: CryptoData;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  selectedDolar: DolarQuotation | null | undefined;
}

/**
 * Expanded chart component for a specific cryptocurrency
 */
function ExpandedCryptoChart({ cryptoId, name }: { cryptoId: string; name: string }) {
  const { data: chartDataRange, isLoading } = useCryptoHistoricoRange(cryptoId, 365);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-secondary">Cargando gráfico...</div>
      </div>
    );
  }

  if (!chartDataRange || !chartDataRange.data || chartDataRange.data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-secondary text-sm">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-success' : 'text-error'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d) => ({ date: d.fecha, value: d.valor }))}
            title={name}
            color="#f59e0b"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

export function CryptoTableRow({
  crypto,
  index,
  isFavorite,
  onToggleFavorite,
  selectedDolar,
}: CryptoTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTrendData = (percentage: number) => {
    if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
    if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
    return { icon: FaMinus, color: 'text-warning' };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const TrendIcon = trend24h.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    return `$${(value / 1_000_000).toFixed(2)}M`;
  };

  return (
    <React.Fragment>
      <TableRow className="group hover:bg-background-secondary/30 transition-colors">
        {/* Logo + Nombre */}
        <TableCell>
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

        {/* Precio USD */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatPrice(crypto.current_price)}
          </span>
        </TableCell>

        {/* Precio ARS */}
        <TableCell align="right">
          {selectedDolar ? (
            <span className="text-sm font-bold text-brand tabular-nums">
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

        {/* 24h % */}
        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* Market Cap */}
        <TableCell align="right">
          <span className="text-sm text-foreground tabular-nums">
            {formatMarketCap(crypto.market_cap)}
          </span>
        </TableCell>

        {/* 30d % */}
        <TableCell align="right">
          {crypto.price_change_percentage_30d_in_currency !== undefined ? (
            <div
              className={`inline-flex items-center gap-1 ${
                crypto.price_change_percentage_30d_in_currency > 0
                  ? 'text-success'
                  : crypto.price_change_percentage_30d_in_currency < 0
                    ? 'text-error'
                    : 'text-warning'
              }`}
            >
              {crypto.price_change_percentage_30d_in_currency > 0 ? (
                <FaArrowUp className="text-xs" />
              ) : crypto.price_change_percentage_30d_in_currency < 0 ? (
                <FaArrowDown className="text-xs" />
              ) : (
                <FaMinus className="text-xs" />
              )}
              <span className="text-sm font-bold tabular-nums">
                {crypto.price_change_percentage_30d_in_currency > 0 ? '+' : ''}
                {crypto.price_change_percentage_30d_in_currency.toFixed(2)}%
              </span>
            </div>
          ) : (
            <span className="text-xs text-secondary">-</span>
          )}
        </TableCell>

        {/* 30D Trend Sparkline */}
        <TableCell align="center">
          <div className="flex items-center justify-center">
            {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
              <CryptoSparkline
                data={crypto.sparkline_in_7d.price}
                trend={
                  crypto.price_change_percentage_30d_in_currency &&
                  crypto.price_change_percentage_30d_in_currency > 0
                    ? 'up'
                    : crypto.price_change_percentage_30d_in_currency &&
                        crypto.price_change_percentage_30d_in_currency < 0
                      ? 'down'
                      : 'neutral'
                }
                isCrypto={true}
              />
            ) : (
              <span className="text-xs text-secondary">-</span>
            )}
          </div>
        </TableCell>

        {/* Acciones - matching DolaresTable style */}
        <TableCell align="right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                isExpanded
                  ? 'bg-brand/10 text-brand hover:bg-brand/20'
                  : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
              }`}
              aria-label={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
              title={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
            >
              <FaChartLine className="text-sm" />
            </button>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                isFavorite
                  ? 'bg-brand/10 text-brand hover:bg-brand/20'
                  : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${crypto.name}: ${formatPrice(crypto.current_price)}`
                );
              }}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-sm" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: crypto.name,
                    text: `${crypto.name}: ${formatPrice(crypto.current_price)}`,
                  });
                }
              }}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Compartir"
              title="Compartir"
            >
              <FaShareAlt className="text-sm" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable chart row */}
      {isExpanded && (
        <TableRow hoverable={false}>
          <TableCell colSpan={8} className="py-6 bg-background-secondary/20">
            <ExpandedCryptoChart cryptoId={crypto.id} name={crypto.name} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
