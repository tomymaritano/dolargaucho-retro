/**
 * StrategyComparisonGrid Component
 *
 * Single Responsibility: Display grid comparison of all strategies
 */

import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { usePriceFormatters } from '@/hooks/usePriceFormatters';
import type { StrategyMetrics } from '@/lib/utils/financialMetrics';

interface StrategyComparisonGridProps {
  strategies: StrategyMetrics[];
}

export function StrategyComparisonGrid({ strategies }: StrategyComparisonGridProps) {
  const { formatPriceARS } = usePriceFormatters();

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Comparación Completa de Estrategias
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {strategies.map((strategy, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-border glass-strong">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-foreground">{strategy.nombre}</h4>
              {strategy.rendimientoReal > 0 ? (
                <FaArrowUp className="text-success text-lg" />
              ) : (
                <FaArrowDown className="text-error text-lg" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-secondary uppercase">Rend. Nominal</p>
                <p
                  className={`font-semibold ${strategy.rendimiento > 0 ? 'text-success' : 'text-error'}`}
                >
                  {strategy.rendimiento.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Rend. Real</p>
                <p
                  className={`font-semibold ${strategy.rendimientoReal > 0 ? 'text-success' : 'text-error'}`}
                >
                  {strategy.rendimientoReal.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">VAN</p>
                <p className="font-semibold text-foreground">${formatPriceARS(strategy.van)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">TIR Mensual</p>
                <p className="font-semibold text-foreground">{strategy.tir.toFixed(3)}%</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Sharpe Ratio</p>
                <p className="font-semibold text-foreground">{strategy.sharpe.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Volatilidad</p>
                <p className="font-semibold text-warning">{strategy.riesgo.toFixed(1)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-secondary uppercase">Total Final</p>
                <p className="font-bold text-foreground text-lg">
                  ${formatPriceARS(strategy.total)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
