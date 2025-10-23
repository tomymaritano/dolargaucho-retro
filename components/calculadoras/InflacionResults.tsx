/**
 * InflacionResults Component - COMPACT VERSION
 *
 * Single Responsibility: Render compact inflation calculation results
 * Maximum density with MetricCard
 */

import React from 'react';
import { MetricCard } from './shared';

interface InflacionResultsProps {
  initialAmount: number;
  years: number;
  futureValues: number[];
}

export function InflacionResults({ initialAmount, years, futureValues }: InflacionResultsProps) {
  const finalValue = futureValues[years] || 0;
  const lossPercentage = ((1 - finalValue / initialAmount) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="Valor Final"
        value={`$${finalValue.toFixed(0)}`}
        sublabel={`En ${years}a`}
        variant="info"
      />

      <MetricCard
        label="Pérdida"
        value={`${lossPercentage}%`}
        sublabel="Poder de compra"
        variant="error"
      />
    </div>
  );
}
