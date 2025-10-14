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
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12"></th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Moneda
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                Compra
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                Venta
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                24h %
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-secondary uppercase tracking-wider">
                7D Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                <td className="py-3 px-4">
                  <div className="h-4 w-4 bg-white/10 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-20 bg-white/10 rounded ml-auto" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-20 bg-white/10 rounded ml-auto" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-white/10 rounded ml-auto" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-8 w-28 bg-white/10 rounded mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {/* Favorito */}
            <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12">
              <FaStar className="inline-block text-accent-emerald" />
            </th>

            {/* Moneda */}
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-emerald transition-colors"
              onClick={() => handleSort('nombre')}
            >
              <div className="flex items-center gap-2">
                Moneda
                <SortIcon field="nombre" />
              </div>
            </th>

            {/* Compra */}
            <th
              className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-emerald transition-colors"
              onClick={() => handleSort('compra')}
            >
              <div className="flex items-center justify-end gap-2">
                Compra
                <SortIcon field="compra" />
              </div>
            </th>

            {/* Venta */}
            <th
              className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-emerald transition-colors"
              onClick={() => handleSort('venta')}
            >
              <div className="flex items-center justify-end gap-2">
                Venta
                <SortIcon field="venta" />
              </div>
            </th>

            {/* 24h % */}
            <th
              className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-emerald transition-colors"
              onClick={() => handleSort('variation')}
            >
              <div className="flex items-center justify-end gap-2">
                24h %
                <SortIcon field="variation" />
              </div>
            </th>

            {/* 7D Trend */}
            <th
              className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-emerald transition-colors"
              onClick={() => handleSort('sparkline')}
            >
              <div className="flex items-center justify-center gap-2">
                7D Trend
                <SortIcon field="sparkline" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
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
              <tr
                key={cotizacion.moneda}
                className="border-b border-border hover:bg-white/5 transition-colors group"
              >
                {/* Favorito */}
                <td className="py-3 px-4 text-center">
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
                </td>

                {/* Moneda */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-emerald font-bold text-xs">
                        {cotizacion.moneda}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cotizacion.nombre}</p>
                      <p className="text-xs text-secondary">{cotizacion.casa}</p>
                    </div>
                  </div>
                </td>

                {/* Compra */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${cotizacion.compra.toFixed(2)}
                  </span>
                </td>

                {/* Venta */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-bold text-accent-emerald tabular-nums">
                    ${cotizacion.venta.toFixed(2)}
                  </span>
                </td>

                {/* 24h % */}
                <td className="py-3 px-4 text-right">
                  <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">
                      {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                      {percentage.toFixed(2)}%
                    </span>
                  </div>
                </td>

                {/* 7D Trend Sparkline */}
                <td className="py-3 px-4 text-center">
                  {loadingHistorical ? (
                    <div className="w-28 h-12 mx-auto bg-white/5 rounded animate-pulse" />
                  ) : sparklineValues.length > 0 ? (
                    <CryptoSparkline data={sparklineValues} trend={sparklineTrend} />
                  ) : (
                    <span className="text-xs text-secondary">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sortedCotizaciones.length === 0 && !isLoading && (
        <div className="text-center py-12 text-secondary">
          <p>No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
}
