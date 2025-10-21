/**
 * FavoritesList Component
 *
 * Single Responsibility: Render unified favorites table (dolares, currencies, cryptos)
 * Features: Sorting, sparklines, hover actions
 */

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import {
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
  FaRegStar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import {
  useMultipleDolarHistoricoRange,
  useDolarHistoricoRange,
} from '@/hooks/useDolarHistoricoRange';
import {
  useCotizacionHistoricoRange,
  useMultipleCotizacionesHistoricoRange,
} from '@/hooks/useCotizacionesHistoricoRange';
import { useCryptoHistoricoRange } from '@/hooks/useCryptoHistoricalRange';
import type { DolarHistoricoDataPoint } from '@/hooks/useDolarHistoricoRange';
import type { CotizacionHistoricoDataPoint } from '@/hooks/useCotizacionesHistoricoRange';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';
import { DolarLogo } from '@/components/ui/DolarLogo';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';

interface FavoritesListProps {
  items: Array<DolarWithVariation | CotizacionWithVariation | CryptoData>;
  selectedDolar: Quotation | undefined;
  onToggleDolar: (casa: string) => void;
  onToggleCurrency: (moneda: string) => void;
  onToggleCrypto: (id: string) => void;
  onSelectItem?: (id: string) => void;
}

type SortField = 'nombre' | 'precioUSD' | 'precioARS' | 'variacion';
type SortDirection = 'asc' | 'desc';

/**
 * Expanded chart component for a specific dollar
 */
function ExpandedDolarChart({ casa, nombre }: { casa: string; nombre: string }) {
  const { data: chartDataRange, isLoading } = useDolarHistoricoRange(casa, 365);

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
          <h3 className="text-lg font-bold text-foreground">{nombre}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-error' : 'text-success'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d: DolarHistoricoDataPoint) => ({
              date: d.fecha,
              value: d.valor,
            }))}
            title={nombre}
            color="#3b82f6"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Expanded chart component for a specific currency
 */
function ExpandedCurrencyChart({ moneda, nombre }: { moneda: string; nombre: string }) {
  const { data: chartDataRange, isLoading } = useCotizacionHistoricoRange(
    moneda.toLowerCase(),
    365
  );

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
          <h3 className="text-lg font-bold text-foreground">{nombre}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-error' : 'text-success'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d: CotizacionHistoricoDataPoint) => ({
              date: d.fecha,
              value: d.valor,
            }))}
            title={nombre}
            color="#10b981"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
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

export function FavoritesList({
  items,
  selectedDolar,
  onToggleDolar,
  onToggleCurrency,
  onToggleCrypto,
  onSelectItem,
}: FavoritesListProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  // Extract dolar casas for historical data
  const dolarCasas = items
    .filter(
      (item): item is DolarWithVariation =>
        'casa' in item && 'moneda' in item && item.moneda === 'USD'
    )
    .map((d) => d.casa);

  // Extract currency monedas for historical data
  const currencyMonedas = items
    .filter(
      (item): item is CotizacionWithVariation =>
        'casa' in item && 'moneda' in item && item.moneda !== 'USD'
    )
    .map((c) => c.moneda.toLowerCase());

  // Fetch 30-day historical data for dolares
  const { data: dolarHistorical, isLoading: loadingDolarHistorical } =
    useMultipleDolarHistoricoRange(dolarCasas, 30);

  // Fetch 30-day historical data for currencies
  const { data: currencyHistorical, isLoading: loadingCurrencyHistorical } =
    useMultipleCotizacionesHistoricoRange(currencyMonedas, 30);

  // Sorting logic
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      // Helper para obtener nombre
      const getName = (item: typeof a) => {
        if ('nombre' in item) return item.nombre;
        if ('name' in item) return item.name;
        return '';
      };

      // Helper para obtener precio USD
      const getPriceUSD = (item: typeof a) => {
        if ('venta' in item) return item.venta;
        if ('current_price' in item) return item.current_price;
        return 0;
      };

      // Helper para obtener variación
      const getVariation = (item: typeof a) => {
        if ('variation' in item) return item.variation.percentage;
        if ('price_change_percentage_24h' in item)
          return Math.abs(item.price_change_percentage_24h);
        return 0;
      };

      switch (sortField) {
        case 'nombre':
          aValue = getName(a).toLowerCase();
          bValue = getName(b).toLowerCase();
          break;
        case 'precioUSD':
          aValue = getPriceUSD(a);
          bValue = getPriceUSD(b);
          break;
        case 'precioARS':
          const aPriceUSD = getPriceUSD(a);
          const bPriceUSD = getPriceUSD(b);
          aValue = selectedDolar ? aPriceUSD * selectedDolar.venta : aPriceUSD;
          bValue = selectedDolar ? bPriceUSD * selectedDolar.venta : bPriceUSD;
          break;
        case 'variacion':
          aValue = getVariation(a);
          bValue = getVariation(b);
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [items, sortField, sortDirection, selectedDolar]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="text-xs text-secondary/50" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-xs text-brand" />
    ) : (
      <FaSortDown className="text-xs text-brand" />
    );
  };

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
          <TableHeaderCell align="left" sortable onSort={() => handleSort('nombre')} width="30%">
            <div className="flex items-center gap-2">
              Nombre
              <SortIcon field="nombre" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('precioUSD')}
            width="14%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio USD
              <SortIcon field="precioUSD" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('precioARS')}
            width="14%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio ARS
              <SortIcon field="precioARS" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('variacion')}
            width="10%"
          >
            <div className="flex items-center justify-end gap-2">
              24h %
              <SortIcon field="variacion" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell align="center" width="12%">
            30D Trend
          </TableHeaderCell>
          <TableHeaderCell align="right" width="14%">
            Acciones
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedItems.map((item) => {
          // Type guards
          const isDolar = 'casa' in item && 'moneda' in item && item.moneda === 'USD';
          const isCrypto = 'symbol' in item && 'market_cap' in item;

          if (isDolar) {
            const dolar = item as DolarWithVariation;
            const { trend, percentage } = dolar.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';
            const isExpanded = expandedRow === `dolar-${dolar.casa}`;

            return (
              <React.Fragment key={`dolar-${dolar.casa}`}>
                <TableRow className="group hover:bg-background-secondary/30 transition-colors">
                  {/* Nombre con Logo */}
                  <TableCell align="left">
                    <div className="flex items-center gap-3">
                      <DolarLogo casa={dolar.casa} size="md" />
                      <div className="flex-1">
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
                    <span className="text-sm font-semibold text-brand tabular-nums">
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
                    <div className="flex items-center justify-center gap-2">
                      {loadingDolarHistorical ? (
                        <div className="w-28 h-12 bg-white/5 rounded animate-pulse" />
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
                          isCrypto={false}
                        />
                      ) : (
                        <span className="text-xs text-secondary">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Acciones - nueva columna */}
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(isExpanded ? null : `dolar-${dolar.casa}`);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDolar(dolar.casa);
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-brand/10 text-brand hover:bg-brand/20"
                        aria-label="Quitar de favoritos"
                        title="Quitar de favoritos"
                      >
                        <FaStar className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `${dolar.nombre}: $${dolar.venta.toFixed(2)}`
                          );
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
                        aria-label="Copiar"
                        title="Copiar valor"
                      >
                        <FaCopy className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({
                              title: dolar.nombre,
                              text: `${dolar.nombre}: $${dolar.venta.toFixed(2)}`,
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
                    <TableCell colSpan={6} className="py-6 bg-background-secondary/20">
                      <ExpandedDolarChart casa={dolar.casa} nombre={dolar.nombre} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          } else if (isCrypto) {
            const crypto = item as CryptoData;
            const getTrendData = (percentage: number) => {
              // Crypto: up=bueno (verde), down=malo (rojo)
              if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
              if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
              return { icon: FaMinus, color: 'text-warning' };
            };
            const trend24h = getTrendData(crypto.price_change_percentage_24h);
            const TrendIcon = trend24h.icon;
            const isExpanded = expandedRow === `crypto-${crypto.id}`;

            return (
              <React.Fragment key={`crypto-${crypto.id}`}>
                <TableRow className="group hover:bg-background-secondary/30 transition-colors">
                  {/* Nombre */}
                  <TableCell align="left">
                    <div className="flex items-center gap-2">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1">
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
                      <span className="text-sm font-semibold text-brand tabular-nums">
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
                    <div className="flex items-center justify-center gap-2">
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
                          isCrypto={true}
                        />
                      ) : (
                        <span className="text-xs text-secondary">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Acciones - nueva columna */}
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(isExpanded ? null : `crypto-${crypto.id}`);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCrypto(crypto.id);
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-brand/10 text-brand hover:bg-brand/20"
                        aria-label="Quitar de favoritos"
                        title="Quitar de favoritos"
                      >
                        <FaStar className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const price = formatPrice(crypto.current_price);
                          navigator.clipboard.writeText(`${crypto.name}: ${price}`);
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
                        aria-label="Copiar"
                        title="Copiar valor"
                      >
                        <FaCopy className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            const price = formatPrice(crypto.current_price);
                            navigator.share({
                              title: crypto.name,
                              text: `${crypto.name}: ${price}`,
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
                    <TableCell colSpan={6} className="py-6 bg-background-secondary/20">
                      <ExpandedCryptoChart cryptoId={crypto.id} name={crypto.name} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          } else {
            const cotizacion = item as CotizacionWithVariation;
            const { trend, percentage } = cotizacion.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';
            const isExpanded = expandedRow === `currency-${cotizacion.moneda}`;

            // Datos históricos para sparkline
            const sparklineData = currencyHistorical?.[cotizacion.moneda];
            const sparklineValues = sparklineData?.data.map((d) => d.valor) || [];
            const sparklineTrend = sparklineData
              ? sparklineData.changePercent > 0
                ? 'up'
                : sparklineData.changePercent < 0
                  ? 'down'
                  : 'neutral'
              : 'neutral';

            return (
              <React.Fragment key={`currency-${cotizacion.moneda}`}>
                <TableRow className="group hover:bg-background-secondary/30 transition-colors">
                  {/* Nombre con Badge */}
                  <TableCell align="left">
                    <div className="flex items-center gap-3">
                      <CurrencyBadge moneda={cotizacion.moneda} size="md" />
                      <div className="flex-1">
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
                    <span className="text-sm font-semibold text-brand tabular-nums">
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
                    <div className="flex items-center justify-center">
                      {loadingCurrencyHistorical ? (
                        <div className="w-28 h-12 mx-auto bg-white/5 rounded animate-pulse" />
                      ) : sparklineValues.length > 0 ? (
                        <CryptoSparkline
                          data={sparklineValues}
                          trend={sparklineTrend}
                          isCrypto={false}
                        />
                      ) : (
                        <span className="text-xs text-secondary">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Acciones - nueva columna */}
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(isExpanded ? null : `currency-${cotizacion.moneda}`);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCurrency(cotizacion.moneda);
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-brand/10 text-brand hover:bg-brand/20"
                        aria-label="Quitar de favoritos"
                        title="Quitar de favoritos"
                      >
                        <FaStar className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`
                          );
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
                        aria-label="Copiar"
                        title="Copiar valor"
                      >
                        <FaCopy className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({
                              title: cotizacion.nombre,
                              text: `${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`,
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
                    <TableCell colSpan={6} className="py-6 bg-background-secondary/20">
                      <ExpandedCurrencyChart
                        moneda={cotizacion.moneda}
                        nombre={cotizacion.nombre}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          }
        })}
      </TableBody>
    </Table>
  );
}
