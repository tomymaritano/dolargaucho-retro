/**
 * FavoriteRowDolar Component
 *
 * Single Responsibility: Render a single dolar row in favorites table
 */

import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { FavoriteActionsBar } from './FavoriteActionsBar';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';

interface FavoriteRowDolarProps {
  dolar: DolarWithVariation;
  historical?: { data: Array<{ valor: number }>; changePercent: number };
  loadingHistorical: boolean;
  onToggleFavorite: () => void;
}

export function FavoriteRowDolar({
  dolar,
  historical,
  loadingHistorical,
  onToggleFavorite,
}: FavoriteRowDolarProps) {
  const { trend, percentage } = dolar.variation;
  const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
  const trendColor =
    trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${dolar.nombre}: $${dolar.venta.toFixed(2)}`);
  };

  return (
    <TableRow className="group">
      {/* Nombre con badge de favorito */}
      <TableCell align="left">
        <div className="flex items-center gap-2">
          <FaStar className="text-brand text-xs flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
            <p className="text-xs text-secondary uppercase">{dolar.casa}</p>
          </div>
        </div>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm font-semibold text-foreground tabular-nums">
          ${dolar.venta.toFixed(2)}
        </span>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm font-semibold text-brand tabular-nums">
          ${(dolar.venta * 1).toFixed(2)}
        </span>
      </TableCell>

      <TableCell align="right">
        <div className={`inline-flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="text-xs" />
          <span className="text-sm font-bold tabular-nums">{percentage.toFixed(2)}%</span>
        </div>
      </TableCell>

      <TableCell align="center" className="relative">
        {loadingHistorical ? (
          <div className="w-28 h-12 mx-auto bg-panel/10 rounded animate-pulse" />
        ) : historical?.data ? (
          <CryptoSparkline
            data={historical.data.map((d) => d.valor)}
            trend={
              historical.changePercent > 0
                ? 'up'
                : historical.changePercent < 0
                  ? 'down'
                  : 'neutral'
            }
          />
        ) : (
          <span className="text-xs text-secondary">-</span>
        )}

        {/* Gradient lateral con acciones - aparece en hover */}
        <FavoriteActionsBar
          onToggleFavorite={onToggleFavorite}
          onCopy={handleCopy}
          itemName={dolar.nombre}
          itemValue={`$${dolar.venta.toFixed(2)}`}
        />
      </TableCell>
    </TableRow>
  );
}
