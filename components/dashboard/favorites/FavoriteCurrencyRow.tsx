/**
 * FavoriteCurrencyRow Component
 *
 * Renders a single currency favorite row with actions and expandable chart
 * Extracted from FavoritesList.tsx for better separation of concerns
 */

import React, { useCallback } from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import {
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { useCotizacionHistoricoRange } from '@/hooks/useCotizacionesHistoricoRange';
import type { CotizacionHistoricoDataPoint } from '@/hooks/useCotizacionesHistoricoRange';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';

interface FavoriteCurrencyRowProps {
  cotizacion: CotizacionWithVariation;
  currencyHistorical: Record<
    string,
    { data: CotizacionHistoricoDataPoint[]; changePercent: number }
  >;
  loadingHistorical: boolean;
  isExpanded: boolean;
  onToggle: (moneda: string) => void;
  onExpand: (id: string) => void;
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

export const FavoriteCurrencyRow = React.memo(function FavoriteCurrencyRow({
  cotizacion,
  currencyHistorical,
  loadingHistorical,
  isExpanded,
  onToggle,
  onExpand,
}: FavoriteCurrencyRowProps) {
  const { trend, percentage } = cotizacion.variation;
  const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
  const trendColor =
    trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

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

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExpand(`currency-${cotizacion.moneda}`);
    },
    [onExpand, cotizacion.moneda]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(cotizacion.moneda);
    },
    [onToggle, cotizacion.moneda]
  );

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`);
    },
    [cotizacion.nombre, cotizacion.venta]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({
          title: cotizacion.nombre,
          text: `${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`,
        });
      }
    },
    [cotizacion.nombre, cotizacion.venta]
  );

  return (
    <React.Fragment>
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

        {/* Precio USD */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            ${cotizacion.venta.toFixed(2)}
          </span>
        </TableCell>

        {/* Precio ARS */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-brand tabular-nums">
            ${cotizacion.venta.toFixed(2)}
          </span>
        </TableCell>

        {/* Variación 24h */}
        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">{percentage.toFixed(2)}%</span>
          </div>
        </TableCell>

        {/* Sparkline 30D */}
        <TableCell align="center">
          <div className="flex items-center justify-center">
            {loadingHistorical ? (
              <div className="w-28 h-12 mx-auto bg-white/5 rounded animate-pulse" />
            ) : sparklineValues.length > 0 ? (
              <CryptoSparkline data={sparklineValues} trend={sparklineTrend} isCrypto={false} />
            ) : (
              <span className="text-xs text-secondary">-</span>
            )}
          </div>
        </TableCell>

        {/* Acciones */}
        <TableCell align="right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleExpand}
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
              onClick={handleToggle}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-brand/10 text-brand hover:bg-brand/20"
              aria-label="Quitar de favoritos"
              title="Quitar de favoritos"
            >
              <FaStar className="text-sm" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-sm" />
            </button>
            <button
              onClick={handleShare}
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
            <ExpandedCurrencyChart moneda={cotizacion.moneda} nombre={cotizacion.nombre} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
});
