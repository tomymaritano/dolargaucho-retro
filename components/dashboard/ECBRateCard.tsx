/**
 * ECBRateCard Component
 *
 * Single Responsibility: Display a single ECB exchange rate in a card
 */

import React from 'react';
import { formatECBRate, type CurrencyConfig } from '@/lib/utils/ecbUtils';

interface ECBRateCardProps {
  rate: number;
  config: CurrencyConfig;
  onToggleCharts: () => void;
}

export const ECBRateCard = React.memo(function ECBRateCard({
  rate,
  config,
  onToggleCharts,
}: ECBRateCardProps) {
  return (
    <div
      className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
      onClick={onToggleCharts}
    >
      <p className="text-xs text-secondary mb-2">{config.label}</p>
      <p className="text-2xl font-bold text-indigo-400 tabular-nums">
        {formatECBRate(rate, config.code)}
      </p>
      <p className="text-[10px] text-secondary mt-1">{config.description}</p>
    </div>
  );
});
