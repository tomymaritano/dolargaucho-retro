/**
 * PlazoFijoResults Component - COMPACT VERSION
 *
 * Single Responsibility: Render compact plazo fijo calculation results
 * Maximum density with MetricCard
 */

import React from 'react';
import { MetricCard, CollapsibleSection } from './shared';
import type { PlazoFijoResult } from '@/hooks/usePlazoFijoCalculation';
import { FaTable } from 'react-icons/fa';

interface PlazoFijoResultsProps {
  resultado: PlazoFijoResult;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function PlazoFijoResults({ resultado }: PlazoFijoResultsProps) {
  // Calculate breakdown for collapsible table
  const breakdown = [
    { label: 'Capital Inicial', value: formatCurrency(resultado.total - resultado.interes) },
    { label: 'Interés Generado', value: formatCurrency(resultado.interes) },
    { label: 'Total Final', value: formatCurrency(resultado.total), highlight: true },
  ];

  return (
    <div className="space-y-3">
      {/* Main Metrics - Compact 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Interés"
          value={formatCurrency(resultado.interes)}
          sublabel={`${resultado.rendimientoPorcentaje.toFixed(2)}%`}
          variant="success"
        />

        <MetricCard
          label="Total"
          value={formatCurrency(resultado.total)}
          sublabel={`${resultado.dias}d`}
          variant="info"
        />

        <MetricCard
          label="TNA"
          value={`${resultado.tna.toFixed(2)}%`}
          sublabel="Anual"
          variant="info"
        />
      </div>

      {/* Collapsible Breakdown Table */}
      <CollapsibleSection title="Detalle del Cálculo" icon={<FaTable />}>
        <div className="space-y-2">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center p-2 rounded ${
                item.highlight ? 'bg-brand/10 border border-brand/20' : 'bg-background-dark/30'
              }`}
            >
              <span className="text-xs text-secondary">{item.label}</span>
              <span
                className={`text-sm font-mono font-bold ${item.highlight ? 'text-brand' : 'text-foreground'}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
