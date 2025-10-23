/**
 * Strategy Comparison Grid
 * Compares all investment strategies side by side
 */

import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';
import type { Estrategia } from '@/hooks/useMegaCalculadora';

interface StrategyComparisonGridProps {
  estrategias: Estrategia[];
  formatCurrency: (value: number) => string;
}

export function StrategyComparisonGrid({
  estrategias,
  formatCurrency,
}: StrategyComparisonGridProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Comparación Completa de Estrategias
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {estrategias.map((est, idx) => (
          <Card
            key={idx}
            variant="elevated"
            padding="md"
            className="border border-border hover:border-brand/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-foreground">{est.nombre}</h4>
              {est.rendimientoReal > 0 ? (
                <FaArrowUp className="text-success text-lg" />
              ) : (
                <FaArrowDown className="text-error text-lg" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-secondary uppercase">Rend. Nominal</p>
                <p
                  className={`font-semibold ${est.rendimiento > 0 ? 'text-success' : 'text-error'}`}
                >
                  {est.rendimiento.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Rend. Real</p>
                <p
                  className={`font-semibold ${est.rendimientoReal > 0 ? 'text-success' : 'text-error'}`}
                >
                  {est.rendimientoReal.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">VAN</p>
                <p className="font-semibold text-foreground">{formatCurrency(est.van)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">TIR Mensual</p>
                <p className="font-semibold text-foreground">{est.tir.toFixed(3)}%</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Sharpe Ratio</p>
                <p className="font-semibold text-foreground">{est.sharpe.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase">Volatilidad</p>
                <p className="font-semibold text-warning">{est.riesgo.toFixed(1)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-secondary uppercase">Total Final</p>
                <p className="font-bold text-foreground text-lg">{formatCurrency(est.total)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
