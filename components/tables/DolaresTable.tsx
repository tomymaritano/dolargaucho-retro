/**
 * Tabla profesional de Dólares con sparklines
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
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import {
  useMultipleDolarHistoricoRange,
  useDolarHistoricoRange,
} from '@/hooks/useDolarHistoricoRange';
import type { DolarHistoricoDataPoint } from '@/hooks/useDolarHistoricoRange';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { DolarLogo } from '@/components/ui/DolarLogo';

type SortField = 'nombre' | 'compra' | 'venta' | 'variation' | 'sparkline';
type SortDirection = 'asc' | 'desc';

interface DolaresTableProps {
  dolares: DolarWithVariation[];
  isLoading?: boolean;
  favoriteDolarIds: string[];
  onToggleFavorite: (casa: string) => void;
  onSelectDolar?: (casa: string) => void;
}

/**
 * Expanded chart component for a specific dollar
 */
function ExpandedDolarChart({ casa, nombre }: { casa: string; nombre: string }) {
  const { data: chartDataRange, isLoading } = useDolarHistoricoRange(casa, 365); // 1 year

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

export const DolaresTable = React.memo(function DolaresTable({
  dolares,
  isLoading,
  favoriteDolarIds,
  onToggleFavorite,
  onSelectDolar,
}: DolaresTableProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Obtener datos históricos de todos los dólares (30 días)
  const casas = dolares.map((d) => d.casa);
  const { data: historicalData, isLoading: loadingHistorical } = useMultipleDolarHistoricoRange(
    casas,
    30
  );

  // Sorting logic
  const sortedDolares = useMemo(() => {
    const sorted = [...dolares].sort((a, b) => {
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
          aValue = historicalData?.[a.casa]?.changePercent || 0;
          bValue = historicalData?.[b.casa]?.changePercent || 0;
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
  }, [dolares, sortField, sortDirection, historicalData]);

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

  const handleToggleExpand = useCallback((casa: string) => {
    setExpandedRow((prev) => (prev === casa ? null : casa));
  }, []);

  const handleCopyValue = useCallback((nombre: string, venta: number) => {
    navigator.clipboard.writeText(`${nombre}: $${venta.toFixed(2)}`);
  }, []);

  const handleShare = useCallback((nombre: string, venta: number) => {
    if (navigator.share) {
      navigator.share({
        title: nombre,
        text: `${nombre}: $${venta.toFixed(2)}`,
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
    return <Table loading skeletonRows={8} skeletonCols={6} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          {/* Nombre */}
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

      <TableBody empty={sortedDolares.length === 0} emptyColSpan={7}>
        {sortedDolares.map((dolar) => {
          const isFavorite = favoriteDolarIds.includes(dolar.casa);
          const { trend, percentage } = dolar.variation;

          const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
          const trendColor =
            trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

          // Datos históricos para sparkline
          const sparklineData = historicalData?.[dolar.casa];
          const sparklineValues = sparklineData?.data.map((d) => d.valor) || [];
          const sparklineTrend = sparklineData
            ? sparklineData.changePercent > 0
              ? 'up'
              : sparklineData.changePercent < 0
                ? 'down'
                : 'neutral'
            : 'neutral';

          const isExpanded = expandedRow === dolar.casa;

          return (
            <React.Fragment key={dolar.casa}>
              <TableRow className="group hover:bg-background-secondary/30 transition-colors relative">
                {/* Nombre con Logo */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <DolarLogo casa={dolar.casa} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                      <p className="text-xs text-secondary uppercase">{dolar.casa}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Compra */}
                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${dolar.compra.toFixed(2)}
                  </span>
                </TableCell>

                {/* Venta */}
                <TableCell align="right">
                  <span className="text-sm font-bold text-brand tabular-nums">
                    ${dolar.venta.toFixed(2)}
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
                    <div className="h-4 w-12 bg-white/5 rounded animate-pulse ml-auto" />
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

                {/* Acciones - siempre visibles */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand(dolar.casa);
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
                        onToggleFavorite(dolar.casa);
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
                        handleCopyValue(dolar.nombre, dolar.venta);
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
                        handleShare(dolar.nombre, dolar.venta);
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
                    <ExpandedDolarChart casa={dolar.casa} nombre={dolar.nombre} />
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
