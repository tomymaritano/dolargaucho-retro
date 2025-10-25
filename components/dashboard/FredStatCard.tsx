/**
 * FredStatCard Component
 *
 * Single Responsibility: Display a single FRED economic indicator stat card
 * with professional hover gradient effect
 */

import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { formatFredValue, type FredIndicatorConfig } from '@/lib/utils/fredUtils';

interface FredStatCardProps {
  value: number;
  config: FredIndicatorConfig;
  change?: number;
  changePercent?: number;
  onToggleCharts: () => void;
}

export function FredStatCard({
  value,
  config,
  change,
  changePercent,
  onToggleCharts,
}: FredStatCardProps) {
  return (
    <div
      className="group relative p-4 md:p-5 rounded-xl bg-panel/50 border border-white/5 hover:border-brand/30 hover:bg-panel/80 transition-all duration-300 cursor-pointer overflow-hidden"
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
          {formatFredValue(value, config.id)}
        </p>

        {/* Change indicator */}
        {config.showChange && change !== undefined && change !== 0 && (
          <div className="flex items-center gap-1.5 mt-1 mb-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {change > 0 ? (
              <FaArrowUp className="text-xs text-success" />
            ) : (
              <FaArrowDown className="text-xs text-error" />
            )}
            <span className="text-xs md:text-sm font-semibold text-secondary">
              {Math.abs(changePercent || 0).toFixed(1)}%
            </span>
          </div>
        )}

        <p className="text-[10px] md:text-xs text-secondary/60 group-hover:text-brand/60 transition-colors duration-300">
          {config.description}
        </p>
      </div>
    </div>
  );
}
