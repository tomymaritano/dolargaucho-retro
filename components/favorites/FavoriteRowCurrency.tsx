/**
 * FavoriteRowCurrency Component
 *
 * Single Responsibility: Render a single currency row in favorites table
 */

import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { FavoriteActionsBar } from './FavoriteActionsBar';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

interface FavoriteRowCurrencyProps {
  cotizacion: CotizacionWithVariation;
  onToggleFavorite: () => void;
}

export function FavoriteRowCurrency({ cotizacion, onToggleFavorite }: FavoriteRowCurrencyProps) {
  const { trend, percentage } = cotizacion.variation;
  const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
  const trendColor =
    trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${cotizacion.nombre}: $${cotizacion.venta.toFixed(2)}`);
  };

  return (
    <TableRow className="group">
      {/* Nombre con badge de favorito */}
      <TableCell align="left">
        <div className="flex items-center gap-2">
          <FaStar className="text-brand text-xs flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{cotizacion.nombre}</p>
            <p className="text-xs text-secondary">{cotizacion.casa}</p>
          </div>
        </div>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm font-semibold text-foreground tabular-nums">
          ${cotizacion.venta.toFixed(2)}
        </span>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm font-semibold text-brand tabular-nums">
          ${cotizacion.venta.toFixed(2)}
        </span>
      </TableCell>

      <TableCell align="right">
        <div className={`inline-flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="text-xs" />
          <span className="text-sm font-bold tabular-nums">{percentage.toFixed(2)}%</span>
        </div>
      </TableCell>

      <TableCell align="center" className="relative">
        <span className="text-xs text-secondary">-</span>

        {/* Gradient lateral con acciones - aparece en hover */}
        <FavoriteActionsBar
          onToggleFavorite={onToggleFavorite}
          onCopy={handleCopy}
          itemName={cotizacion.nombre}
          itemValue={`$${cotizacion.venta.toFixed(2)}`}
        />
      </TableCell>
    </TableRow>
  );
}
