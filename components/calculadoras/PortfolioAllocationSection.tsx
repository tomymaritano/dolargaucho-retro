/**
 * Portfolio Allocation Section
 * Controls for diversified portfolio allocation
 */

import React from 'react';
import { CalculatorInput } from './CalculatorLayout';
import type { PortfolioAllocation } from '@/hooks/useMegaCalculadora';

interface PortfolioAllocationSectionProps {
  allocation: PortfolioAllocation;
  onAllocationChange: (allocation: PortfolioAllocation) => void;
}

export function PortfolioAllocationSection({
  allocation,
  onAllocationChange,
}: PortfolioAllocationSectionProps) {
  const totalAllocation = allocation.plazoFijo + allocation.dolarBlue + allocation.dolarMEP;

  return (
    <div className="mb-8 p-6 rounded-xl bg-panel/50 border border-white/5">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Portafolio Diversificado - Asignación de Capital
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CalculatorInput
          label="Plazo Fijo (%)"
          value={allocation.plazoFijo}
          onChange={(v) => onAllocationChange({ ...allocation, plazoFijo: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
        <CalculatorInput
          label="Dólar Blue (%)"
          value={allocation.dolarBlue}
          onChange={(v) => onAllocationChange({ ...allocation, dolarBlue: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
        <CalculatorInput
          label="Dólar MEP (%)"
          value={allocation.dolarMEP}
          onChange={(v) => onAllocationChange({ ...allocation, dolarMEP: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
      </div>
      <div className="mt-3 text-xs text-secondary">
        Total asignado: {totalAllocation}%
        {totalAllocation !== 100 && <span className="text-warning ml-2">⚠️ Debe sumar 100%</span>}
      </div>
    </div>
  );
}
