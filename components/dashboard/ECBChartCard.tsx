/**
 * ECBChartCard Component
 *
 * Single Responsibility: Display a single ECB historical chart with favorite toggle
 */

import React, { useCallback } from 'react';
import { ECBLightweightChart } from '@/components/charts/ECBLightweightChart';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatECBRate, type CurrencyConfig } from '@/lib/utils/ecbUtils';

interface ECBChartCardProps {
  data: Array<{ date: string; rate: number }>;
  latest: number;
  config: CurrencyConfig;
  isFavorite: boolean;
  onToggleFavorite: (chartId: string) => void;
}

export const ECBChartCard = React.memo(function ECBChartCard({
  data,
  latest,
  config,
  isFavorite,
  onToggleFavorite,
}: ECBChartCardProps) {
  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(config.chartId);
    },
    [onToggleFavorite, config.chartId]
  );

  return (
    <div className="group relative rounded-lg transition-all duration-300 overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Favorite button - absolute positioned */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isFavorite
              ? 'bg-brand/20 text-brand'
              : 'bg-background/90 backdrop-blur-sm text-secondary hover:text-brand border border-border/5'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
        </button>

        {/* Chart with integrated controls */}
        <div className="h-60 group-hover:scale-[1.01] transition-transform duration-300">
          <ECBLightweightChart
            data={data}
            title={config.label}
            color={config.color}
            formatValue={(v) => formatECBRate(v, config.code)}
            height={240}
          />
        </div>
      </div>
    </div>
  );
});
