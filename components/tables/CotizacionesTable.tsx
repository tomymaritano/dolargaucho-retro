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
import { useMultipleCotizacionesHistoricoRange } from '@/hooks/useCotizacionesHistoricoRange';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
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

interface CotizacionesTableProps {
  cotizaciones: CotizacionWithVariation[];
  isLoading?: boolean;
  favoriteCurrencyIds: string[];
  onToggleFavorite: (moneda: string) => void;
}

export function CotizacionesTable({
  cotizaciones,
  isLoading,
  favoriteCurrencyIds,
  onToggleFavorite,
}: CotizacionesTableProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Obtener datos históricos de todas las cotizaciones
  const monedas = cotizaciones.map((c) => c.moneda.toLowerCase());
  const { data: historicalData, isLoading: loadingHistorical } =
    useMultipleCotizacionesHistoricoRange(monedas, 7);

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
    return <Table loading skeletonRows={4} skeletonCols={6} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          {/* Favorito */}
          <TableHeaderCell align="center" className="w-12">
            <FaStar className="inline-block text-accent-emerald" />
          </TableHeaderCell>

          {/* Moneda */}
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

          {/* 7D Trend */}
          <TableHeaderCell align="center" sortable onSort={() => handleSort('sparkline')}>
            <div className="flex items-center justify-center gap-2">
              7D Trend
              <SortIcon field="sparkline" />
            </div>
          </TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody empty={sortedCotizaciones.length === 0} emptyColSpan={6}>
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

          return (
            <React.Fragment key={cotizacion.moneda}>
              <TableRow className="group">
                {/* Favorito */}
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(cotizacion.moneda)}
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

                {/* Moneda */}
                <TableCell>
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

                {/* Compra */}
                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${cotizacion.compra.toFixed(2)}
                  </span>
                </TableCell>

                {/* Venta */}
                <TableCell align="right">
                  <span className="text-sm font-bold text-accent-emerald tabular-nums">
                    ${cotizacion.venta.toFixed(2)}
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
              </TableRow>

              {/* Expandable row on hover */}
              <TableRow
                hoverable={false}
                className="hidden group-hover:table-row bg-accent-emerald/5"
              >
                <TableCell colSpan={6} className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Casa</p>
                      <p className="font-semibold text-foreground text-xs">{cotizacion.casa}</p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Moneda</p>
                      <p className="font-semibold text-foreground text-xs uppercase">
                        {cotizacion.moneda}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Última actualización</p>
                      <p className="font-semibold text-foreground text-xs">
                        {new Date(cotizacion.fechaActualizacion).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
