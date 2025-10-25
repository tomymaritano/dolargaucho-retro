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
      className="group relative p-4 md:p-5 rounded-xl bg-panel/50 border border-border/5 hover:border-brand/30 hover:bg-panel/80 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onToggleCharts}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand/0 via-brand/20 to-brand/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs md:text-sm font-semibold text-secondary mb-2 group-hover:text-brand transition-colors duration-300 uppercase tracking-wide">
          {config.label}
        </p>
        <p className="text-2xl md:text-3xl font-black text-foreground group-hover:text-brand tabular-nums transition-all duration-300">
          {formatECBRate(rate, config.code)}
        </p>
        <p className="text-[10px] md:text-xs text-secondary/60 mt-1 group-hover:text-brand/60 transition-colors duration-300">
          {config.description}
        </p>
      </div>
    </div>
  );
});
