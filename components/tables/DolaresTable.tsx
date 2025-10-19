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

import React, { useState, useMemo } from 'react';
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
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
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
}

export function DolaresTable({
  dolares,
  isLoading,
  favoriteDolarIds,
  onToggleFavorite,
}: DolaresTableProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Obtener datos históricos de todos los dólares
  const casas = dolares.map((d) => d.casa);
  const { data: historicalData, isLoading: loadingHistorical } = useMultipleDolarHistoricoRange(
    casas,
    7
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

          {/* 7d % */}
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('sparkline')}
            width="10%"
          >
            <div className="flex items-center justify-end gap-2">
              7d %
              <SortIcon field="sparkline" />
            </div>
          </TableHeaderCell>

          {/* 7D Trend */}
          <TableHeaderCell align="center" width="12%">
            <div className="flex items-center justify-center gap-2">7D Trend</div>
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

          return (
            <React.Fragment key={dolar.casa}>
              <TableRow className="group hover:bg-background-secondary/30 transition-colors">
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
                      onClick={() => onToggleFavorite(dolar.casa)}
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
                      onClick={() => {
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
                      onClick={() => {
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

              {/* Expandable row on hover */}
              <TableRow hoverable={false} className="hidden group-hover:table-row">
                <TableCell colSpan={7} className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Casa</p>
                      <p className="font-semibold text-foreground text-xs uppercase">
                        {dolar.casa}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Última actualización</p>
                      <p className="font-semibold text-foreground text-xs">
                        {new Date(dolar.fechaActualizacion).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Spread</p>
                      <p className="font-semibold text-foreground text-xs">
                        ${(dolar.venta - dolar.compra).toFixed(2)} (
                        {(((dolar.venta - dolar.compra) / dolar.compra) * 100).toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
