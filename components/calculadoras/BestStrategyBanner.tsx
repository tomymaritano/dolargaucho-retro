/**
 * BestStrategyBanner Component
 *
 * Single Responsibility: Display the best performing strategy
 */

import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { usePriceFormatters } from '@/hooks/usePriceFormatters';
import type { StrategyMetrics } from '@/lib/utils/financialMetrics';

interface BestStrategyBannerProps {
  strategy: StrategyMetrics;
}

export function BestStrategyBanner({ strategy }: BestStrategyBannerProps) {
  const { formatPriceARS } = usePriceFormatters();

  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-brand/20 via-brand-light/20 to-brand/20 border border-brand/30">
      <div className="flex items-start gap-4">
        <FaTrophy className="text-3xl text-brand" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Mejor Estrategia (por Rendimiento Real)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Estrategia</p>
              <p className="text-xl font-bold text-brand">{strategy.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Rendimiento Real</p>
              <p className="text-xl font-bold text-foreground">
                {strategy.rendimientoReal.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Total Final</p>
              <p className="text-xl font-bold text-foreground">${formatPriceARS(strategy.total)}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase mb-1">Sharpe Ratio</p>
              <p className="text-xl font-bold text-foreground">{strategy.sharpe.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
