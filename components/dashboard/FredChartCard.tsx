/**
 * FredChartCard Component
 *
 * Single Responsibility: Display a single FRED historical chart with favorite toggle
 * and professional hover effects
 */

import React from 'react';
import { FredChart } from '@/components/charts/FredChart';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatFredValue, type FredIndicatorConfig } from '@/lib/utils/fredUtils';

interface FredChartCardProps {
  data: Array<{ date: string; value: number }>;
  latest: number;
  config: FredIndicatorConfig;
  isFavorite: boolean;
  onToggleFavorite: (chartId: string) => void;
}

export function FredChartCard({
  data,
  latest,
  config,
  isFavorite,
  onToggleFavorite,
}: FredChartCardProps) {
  return (
    <div className="group relative p-4 rounded-lg transition-all duration-300 overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Header with favorite button */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-secondary flex-1 group-hover:text-blue-300 transition-colors duration-300">
            <div className="mb-1">{config.label}</div>
            <span className="text-blue-400 group-hover:scale-105 inline-block transition-transform duration-300">
              {formatFredValue(latest, config.id)}
            </span>
          </h4>

          {/* Favorite button with gradient hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(config.chartId);
            }}
            className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
              isFavorite ? 'bg-brand/20 text-brand' : 'text-secondary hover:text-brand'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
          </button>
        </div>

        {/* Chart */}
        <div className="h-48 group-hover:scale-[1.01] transition-transform duration-300">
          <FredChart
            data={data}
            title={config.label}
            color={config.color}
            yAxisLabel={config.description}
            formatValue={(v) => formatFredValue(v, config.id)}
            showPoints={true}
            monthsToShow={12}
          />
        </div>
      </div>
    </div>
  );
}
