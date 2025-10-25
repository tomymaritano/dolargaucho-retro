/**
 * FavoriteDolarRow Component
 *
 * Renders a single dolar favorite row with actions and expandable chart
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
import { useDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import type { DolarHistoricoDataPoint } from '@/hooks/useDolarHistoricoRange';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import { DolarLogo } from '@/components/ui/DolarLogo';

interface FavoriteDolarRowProps {
  dolar: DolarWithVariation;
  dolarHistorical: Record<string, { data: DolarHistoricoDataPoint[]; changePercent: number }>;
  loadingHistorical: boolean;
  isExpanded: boolean;
  onToggle: (casa: string) => void;
  onExpand: (id: string) => void;
}

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

export const FavoriteDolarRow = React.memo(function FavoriteDolarRow({
  dolar,
  dolarHistorical,
  loadingHistorical,
  isExpanded,
  onToggle,
  onExpand,
}: FavoriteDolarRowProps) {
  const { trend, percentage } = dolar.variation;
  const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
  const trendColor =
    trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExpand(`dolar-${dolar.casa}`);
    },
    [onExpand, dolar.casa]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(dolar.casa);
    },
    [onToggle, dolar.casa]
  );

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`${dolar.nombre}: $${dolar.venta.toFixed(2)}`);
    },
    [dolar.nombre, dolar.venta]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({
          title: dolar.nombre,
          text: `${dolar.nombre}: $${dolar.venta.toFixed(2)}`,
        });
      }
    },
    [dolar.nombre, dolar.venta]
  );

  return (
    <React.Fragment>
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

        {/* Precio USD */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            ${dolar.venta.toFixed(2)}
          </span>
        </TableCell>

        {/* Precio ARS */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-brand tabular-nums">
            ${(dolar.venta * 1).toFixed(2)}
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
          <div className="flex items-center justify-center gap-2">
            {loadingHistorical ? (
              <div className="w-28 h-12 bg-panel/10 rounded animate-pulse" />
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
            <ExpandedDolarChart casa={dolar.casa} nombre={dolar.nombre} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
});
