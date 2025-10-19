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
  FaShareAlt,
  FaCopy,
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
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';

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

          return (
            <React.Fragment key={cotizacion.moneda}>
              <TableRow className="group hover:bg-background-secondary/30 transition-colors">
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
                    ${cotizacion.compra.toFixed(2)}
                  </span>
                </TableCell>

                {/* Venta */}
                <TableCell align="right">
                  <span className="text-sm font-bold text-brand tabular-nums">
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
                      onClick={() => onToggleFavorite(cotizacion.moneda)}
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
                      onClick={() => {
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

              {/* Expandable row on hover */}
              <TableRow hoverable={false} className="hidden group-hover:table-row">
                <TableCell colSpan={7} className="py-4">
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
