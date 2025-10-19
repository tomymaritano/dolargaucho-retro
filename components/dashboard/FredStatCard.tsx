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
      className="group relative p-4 rounded-lg glass border border-border hover:border-blue-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onToggleCharts}
    >
      {/* Professional gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/0 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs text-secondary mb-2 group-hover:text-blue-300 transition-colors duration-300">
          {config.label}
        </p>
        <p className="text-2xl font-bold text-blue-400 tabular-nums group-hover:scale-105 transition-transform duration-300">
          {formatFredValue(value, config.id)}
        </p>

        {/* Change indicator */}
        {config.showChange && change !== undefined && change !== 0 && (
          <div className="flex items-center gap-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {change > 0 ? (
              <FaArrowUp className="text-[10px] text-success" />
            ) : (
              <FaArrowDown className="text-[10px] text-error" />
            )}
            <span className="text-[10px] text-secondary">
              {Math.abs(changePercent || 0).toFixed(1)}%
            </span>
          </div>
        )}

        <p className="text-[10px] text-secondary mt-1 group-hover:text-blue-300/80 transition-colors duration-300">
          {config.description}
        </p>
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </div>
  );
}
