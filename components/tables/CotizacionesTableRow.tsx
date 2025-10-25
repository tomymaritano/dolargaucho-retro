/**
 * CotizacionesTableRow Component
 *
 * Single Responsibility: Render single cotizacion row with professional hover effects
 * Extracted from CotizacionesTable.tsx (322 → 150 lines)
 *
 * Professional hover improvements:
 * - Enhanced gradient lateral action bar (w-36, 300ms transitions)
 * - Subtle glow effect layer (from-brand/5)
 * - Button scale animations (1.10x on hover)
 * - Expandable row with slide-in animation
 * - Individual stat cards with micro-interactions
 * - Proper z-index layering for clickable buttons
 */

import React from 'react';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { TableRow, TableCell } from '@/components/ui/Table';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

interface CotizacionesTableRowProps {
  cotizacion: CotizacionWithVariation;
  isFavorite: boolean;
  historicalData?: Record<string, { data: Array<{ valor: number }>; changePercent: number }>;
  loadingHistorical: boolean;
  onToggleFavorite: (moneda: string) => void;
}

export const CotizacionesTableRow = React.memo(function CotizacionesTableRow({
  cotizacion,
  isFavorite,
  historicalData,
  loadingHistorical,
  onToggleFavorite,
}: CotizacionesTableRowProps) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cotizacion.nombre,
        text: `${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`,
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow className="group">
        {/* Moneda con badge de favorito */}
        <TableCell>
          <div className="flex items-center gap-2">
            {isFavorite && <FaStar className="text-brand text-xs flex-shrink-0" />}
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors duration-300">
                {cotizacion.nombre}
              </p>
              <p className="text-xs text-secondary">{cotizacion.casa}</p>
            </div>
          </div>
        </TableCell>

        {/* Compra */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums group-hover:scale-105 transition-transform duration-300 inline-block">
            ${cotizacion.compra.toFixed(2)}
          </span>
        </TableCell>

        {/* Venta */}
        <TableCell align="right">
          <span className="text-sm font-bold text-brand tabular-nums group-hover:scale-105 transition-transform duration-300 inline-block">
            ${cotizacion.venta.toFixed(2)}
          </span>
        </TableCell>

        {/* 24h % */}
        <TableCell align="right">
          <div
            className={`inline-flex items-center gap-1 ${trendColor} group-hover:scale-105 transition-transform duration-300`}
          >
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
            <div className="w-28 h-12 mx-auto bg-panel/10 rounded animate-pulse" />
          ) : sparklineValues.length > 0 ? (
            <div className="group-hover:scale-105 transition-transform duration-300">
              <CryptoSparkline data={sparklineValues} trend={sparklineTrend} />
            </div>
          ) : (
            <span className="text-xs text-secondary">-</span>
          )}
        </TableCell>

        {/* Acciones - Always visible, more prominent on hover */}
        <TableCell align="center">
          <div className="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onToggleFavorite(cotizacion.moneda)}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                isFavorite
                  ? 'text-brand bg-brand/10'
                  : 'text-secondary hover:text-brand hover:bg-panel/10'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? <FaStar className="text-xs" /> : <FaRegStar className="text-xs" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 text-secondary hover:text-brand hover:bg-panel/10"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-xs" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 text-secondary hover:text-brand hover:bg-panel/10"
              aria-label="Compartir"
              title="Compartir"
            >
              <FaShareAlt className="text-xs" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable row on hover with slide-in animation */}
      <TableRow
        hoverable={false}
        className="hidden group-hover:table-row animate-in slide-in-from-top-2 duration-300"
      >
        <TableCell colSpan={6} className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Casa</p>
              <p className="font-semibold text-foreground text-xs">{cotizacion.casa}</p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Moneda</p>
              <p className="font-semibold text-foreground text-xs uppercase">{cotizacion.moneda}</p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
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
});
