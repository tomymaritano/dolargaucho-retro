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
      <FaSortUp className="text-xs text-accent-emerald" />
    ) : (
      <FaSortDown className="text-xs text-accent-emerald" />
    );
  };

  if (isLoading) {
    return <Table loading skeletonRows={8} skeletonCols={9} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          {/* Favorito */}
          <TableHeaderCell align="center" className="w-12">
            <FaStar className="inline-block text-accent-emerald" />
          </TableHeaderCell>

          {/* Tipo */}
          <TableHeaderCell align="left">Tipo</TableHeaderCell>

          {/* Nombre */}
          <TableHeaderCell align="left" sortable onSort={() => handleSort('nombre')}>
            <div className="flex items-center gap-2">
              Nombre
              <SortIcon field="nombre" />
            </div>
          </TableHeaderCell>

          {/* Compra */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('compra')}>
            <div className="flex items-center justify-end gap-2">
              Compra
              <SortIcon field="compra" />
            </div>
          </TableHeaderCell>

          {/* Venta */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('venta')}>
            <div className="flex items-center justify-end gap-2">
              Venta
              <SortIcon field="venta" />
            </div>
          </TableHeaderCell>

          {/* 24h % */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('variation')}>
            <div className="flex items-center justify-end gap-2">
              24h %
              <SortIcon field="variation" />
            </div>
          </TableHeaderCell>

          {/* 7d % */}
          <TableHeaderCell align="right" sortable onSort={() => handleSort('sparkline')}>
            <div className="flex items-center justify-end gap-2">
              7d %
              <SortIcon field="sparkline" />
            </div>
          </TableHeaderCell>

          {/* 7D Trend */}
          <TableHeaderCell align="center">
            <div className="flex items-center justify-center gap-2">7D Trend</div>
          </TableHeaderCell>

          {/* Info */}
          <TableHeaderCell align="right">Info</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody empty={sortedDolares.length === 0} emptyColSpan={9}>
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
              <TableRow className="group">
                {/* Favorito */}
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(dolar.casa)}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorite
                        ? 'text-accent-emerald bg-accent-emerald/10'
                        : 'text-secondary hover:text-accent-emerald hover:bg-white/5'
                    }`}
                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite ? (
                      <FaStar className="text-base" />
                    ) : (
                      <FaRegStar className="text-base" />
                    )}
                  </button>
                </TableCell>

                {/* Tipo */}
                <TableCell align="left">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                    DÓLAR
                  </span>
                </TableCell>

                {/* Nombre */}
                <TableCell>
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

                {/* Compra */}
                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${dolar.compra.toFixed(2)}
                  </span>
                </TableCell>

                {/* Venta */}
                <TableCell align="right">
                  <span className="text-sm font-bold text-accent-emerald tabular-nums">
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
                  {loadingHistorical ? (
                    <div className="w-28 h-12 mx-auto bg-white/5 rounded animate-pulse" />
                  ) : sparklineValues.length > 0 ? (
                    <CryptoSparkline data={sparklineValues} trend={sparklineTrend} />
                  ) : (
                    <span className="text-xs text-secondary">-</span>
                  )}
                </TableCell>

                {/* Info */}
                <TableCell align="right">
                  <span className="text-xs text-secondary">
                    {new Date(dolar.fechaActualizacion).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </TableCell>
              </TableRow>

              {/* Expandable row on hover */}
              <TableRow
                hoverable={false}
                className="hidden group-hover:table-row bg-accent-emerald/5"
              >
                <TableCell colSpan={9} className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Casa</p>
                      <p className="font-semibold text-foreground text-xs">{dolar.casa}</p>
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
