/**
 * ECBChartCard Component
 *
 * Single Responsibility: Display a single ECB historical chart with favorite toggle
 */

import React from 'react';
import { FredChart } from '@/components/charts/FredChart';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatECBRate, type CurrencyConfig } from '@/lib/utils/ecbUtils';

interface ECBChartCardProps {
  data: Array<{ date: string; rate: number }>;
  latest: number;
  config: CurrencyConfig;
  isFavorite: boolean;
  onToggleFavorite: (chartId: string) => void;
}

export function ECBChartCard({
  data,
  latest,
  config,
  isFavorite,
  onToggleFavorite,
}: ECBChartCardProps) {
  return (
    <div className="p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-secondary flex-1">
          <div className="mb-1">{config.label}</div>
          <span className="text-indigo-400">{formatECBRate(latest, config.code)}</span>
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(config.chartId);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            isFavorite ? 'bg-brand/20 text-brand' : 'text-secondary hover:text-brand'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
        </button>
      </div>
      <div className="h-48">
        <FredChart
          data={data.map((d) => ({ date: d.date, value: d.rate }))}
          title={config.label}
          color={config.color}
          yAxisLabel="Tipo de cambio"
          formatValue={(v) => formatECBRate(v, config.code)}
          showPoints={true}
          monthsToShow={12}
        />
      </div>
    </div>
  );
}
