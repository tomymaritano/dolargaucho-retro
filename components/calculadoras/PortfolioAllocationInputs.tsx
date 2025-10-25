/**
 * PortfolioAllocationInputs Component
 *
 * Single Responsibility: Portfolio allocation percentage inputs
 */

import React from 'react';
import { CalculatorInput } from './CalculatorLayout';
import type { PortfolioAllocation } from '@/hooks/useFinancialCalculations';

interface PortfolioAllocationInputsProps {
  allocation: PortfolioAllocation;
  onChange: (allocation: PortfolioAllocation) => void;
}

export function PortfolioAllocationInputs({
  allocation,
  onChange,
}: PortfolioAllocationInputsProps) {
  const total = allocation.plazoFijo + allocation.dolarBlue + allocation.dolarMEP;
  const isValid = total === 100;

  return (
    <div className="mb-8 p-6 rounded-xl bg-panel/50 border border-white/5">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
        Portafolio Diversificado - Asignación de Capital
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CalculatorInput
          label="Plazo Fijo (%)"
          value={allocation.plazoFijo}
          onChange={(v) => onChange({ ...allocation, plazoFijo: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
        <CalculatorInput
          label="Dólar Blue (%)"
          value={allocation.dolarBlue}
          onChange={(v) => onChange({ ...allocation, dolarBlue: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
        <CalculatorInput
          label="Dólar MEP (%)"
          value={allocation.dolarMEP}
          onChange={(v) => onChange({ ...allocation, dolarMEP: Number(v) })}
          type="number"
          min="0"
          max="100"
          prefix="%"
        />
      </div>
      <div className="mt-3 text-xs text-secondary">
        Total asignado: {total}%
        {!isValid && <span className="text-warning ml-2">⚠️ Debe sumar 100%</span>}
      </div>
    </div>
  );
}
