/**
 * Tabla profesional de Cotizaciones Internacionales con sparklines
 * Estilo: CoinMarketCap / Bloomberg Terminal
 *
 * Features:
 * - Sparklines de 7 días
 * - Sorting por columna
 * - Favoritos
 * - Hover effects
 * - Fully responsive
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaShareAlt,
  FaCopy,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import {
  useMultipleCotizacionesHistoricoRange,
  useCotizacionHistoricoRange,
} from '@/hooks/useCotizacionesHistoricoRange';
import type { CotizacionHistoricoDataPoint } from '@/hooks/useCotizacionesHistoricoRange';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { DolarService } from '@/lib/services/DolarService';

type SortField = 'nombre' | 'compra' | 'venta' | 'variation' | 'sparkline';
type SortDirection = 'asc' | 'desc';

interface CotizacionesTableProps {
  cotizaciones: CotizacionWithVariation[];
  isLoading?: boolean;
  favoriteCurrencyIds: string[];
  onToggleFavorite: (moneda: string) => void;
  onSelectCurrency?: (moneda: string) => void;
}

/**
 * Expanded chart component for a specific currency
 */
function ExpandedCurrencyChart({ moneda, nombre }: { moneda: string; nombre: string }) {
  const { data: chartDataRange, isLoading } = useCotizacionHistoricoRange(
    moneda.toLowerCase(),
    365
  ); // 1 year

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
            formatValue={(v) => DolarService.formatPrice(v)}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

export const CotizacionesTable = React.memo(function CotizacionesTable({
  cotizaciones,
  isLoading,
  favoriteCurrencyIds,
  onToggleFavorite,
  onSelectCurrency,
}: CotizacionesTableProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Obtener datos históricos de todas las cotizaciones (30 días)
  const monedas = cotizaciones.map((c) => c.moneda.toLowerCase());
  const { data: historicalData, isLoading: loadingHistorical } =
    useMultipleCotizacionesHistoricoRange(monedas, 30);

  // Sorting logic
  const sortedCotizaciones = useMemo(() => {
    const sorted = [...cotizaciones].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
          break;
        case 'compra':
          aValue = a.compra;
          bValue = b.compra;
          break;
        case 'venta':
          aValue = a.venta;
          bValue = b.venta;
          break;
        case 'variation':
          aValue = a.variation.percentage;
          bValue = b.variation.percentage;
          break;
        case 'sparkline':
          aValue = historicalData?.[a.moneda]?.changePercent || 0;
          bValue = historicalData?.[b.moneda]?.changePercent || 0;
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

    return sorted;
  }, [cotizaciones, sortField, sortDirection, historicalData]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField, sortDirection]
  );

  const handleToggleExpand = useCallback((moneda: string) => {
    setExpandedRow((prev) => (prev === moneda ? null : moneda));
  }, []);

  const handleCopyValue = useCallback((nombre: string, venta: number) => {
    navigator.clipboard.writeText(`${nombre}: ${DolarService.formatPrice(venta)}`);
  }, []);

  const handleShare = useCallback((nombre: string, venta: number) => {
    if (navigator.share) {
      navigator.share({
        title: nombre,
        text: `${nombre}: ${DolarService.formatPrice(venta)}`,
      });
    }
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="text-xs text-secondary/50" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-xs text-brand" />
    ) : (
      <FaSortDown className="text-xs text-brand" />
    );
  };

  if (isLoading) {
    return <Table loading skeletonRows={4} skeletonCols={5} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          {/* Moneda */}
          <TableHeaderCell align="left" sortable onSort={() => handleSort('nombre')} width="30%">
            <div className="flex items-center gap-2">
              Nombre
              <SortIcon field="nombre" />
            </div>
          </TableHeaderCell>

          {/* Compra */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('compra')} width="12%">
            <div className="flex items-center justify-end gap-2">
              Compra
              <SortIcon field="compra" />
            </div>
          </TableHeaderCell>

          {/* Venta */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('venta')} width="12%">
            <div className="flex items-center justify-end gap-2">
              Venta
              <SortIcon field="venta" />
            </div>
          </TableHeaderCell>

          {/* 24h % */}
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('variation')}
            width="10%"
          >
            <div className="flex items-center justify-end gap-2">
              24h %
              <SortIcon field="variation" />
            </div>
          </TableHeaderCell>

          {/* 30d % */}
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('sparkline')}
            width="10%"
          >
            <div className="flex items-center justify-end gap-2">
              30d %
              <SortIcon field="sparkline" />
            </div>
          </TableHeaderCell>

          {/* 30D Trend */}
          <TableHeaderCell align="center" width="12%">
            <div className="flex items-center justify-center gap-2">30D Trend</div>
          </TableHeaderCell>

          {/* Acciones */}
          <TableHeaderCell align="right" width="14%">
            Acciones
          </TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody empty={sortedCotizaciones.length === 0} emptyColSpan={7}>
        {sortedCotizaciones.map((cotizacion) => {
          const isFavorite = favoriteCurrencyIds.includes(cotizacion.moneda);
          const { trend, percentage } = cotizacion.variation;

          const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
          const trendColor =
            trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

          // Datos históricos para sparkline
          const sparklineData = historicalData?.[cotizacion.moneda];
          const sparklineValues = sparklineData?.data.map((d) => d.valor) || [];
          const sparklineTrend = sparklineData
            ? sparklineData.changePercent > 0
              ? 'up'
              : sparklineData.changePercent < 0
                ? 'down'
                : 'neutral'
            : 'neutral';

          const isExpanded = expandedRow === cotizacion.moneda;

          return (
            <React.Fragment key={cotizacion.moneda}>
              <TableRow className="group hover:bg-background-secondary/30 transition-colors relative">
                {/* Moneda con Badge */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CurrencyBadge moneda={cotizacion.moneda} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cotizacion.nombre}</p>
                      <p className="text-xs text-secondary">{cotizacion.casa}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Compra */}
                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {DolarService.formatPrice(cotizacion.compra)}
                  </span>
                </TableCell>

                {/* Venta */}
                <TableCell align="right">
                  <span className="text-sm font-bold text-brand tabular-nums">
                    {DolarService.formatPrice(cotizacion.venta)}
                  </span>
                </TableCell>

                {/* 24h % */}
                <TableCell align="right">
                  <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">
                      {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                      {percentage.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>

                {/* 7d % */}
                <TableCell align="right">
                  {loadingHistorical ? (
                    <div className="h-4 w-12 bg-panel/10 rounded animate-pulse ml-auto" />
                  ) : sparklineData ? (
                    <div
                      className={`inline-flex items-center gap-1 ${
                        sparklineTrend === 'up'
                          ? 'text-error'
                          : sparklineTrend === 'down'
                            ? 'text-success'
                            : 'text-warning'
                      }`}
                    >
                      {sparklineTrend === 'up' ? (
                        <FaArrowUp className="text-xs" />
                      ) : sparklineTrend === 'down' ? (
                        <FaArrowDown className="text-xs" />
                      ) : (
                        <FaMinus className="text-xs" />
                      )}
                      <span className="text-sm font-bold tabular-nums">
                        {sparklineTrend === 'up' ? '+' : sparklineTrend === 'down' ? '-' : ''}
                        {Math.abs(sparklineData.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-secondary">-</span>
                  )}
                </TableCell>

                {/* 7D Trend Sparkline */}
                <TableCell align="center">
                  <div className="flex items-center justify-center">
                    {loadingHistorical ? (
                      <div className="w-28 h-12 mx-auto bg-panel/10 rounded animate-pulse" />
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

                {/* Acciones - siempre visibles */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand(cotizacion.moneda);
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
                        onToggleFavorite(cotizacion.moneda);
                      }}
                      className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                        isFavorite
                          ? 'bg-brand/10 text-brand hover:bg-brand/20'
                          : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
                      }`}
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      {isFavorite ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyValue(cotizacion.nombre, cotizacion.venta);
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
                        handleShare(cotizacion.nombre, cotizacion.venta);
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
                  <TableCell colSpan={7} className="py-6 bg-background-secondary/20">
                    <ExpandedCurrencyChart moneda={cotizacion.moneda} nombre={cotizacion.nombre} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
});
