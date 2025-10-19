/**
 * ECBChartsGrid Component
 *
 * Single Responsibility: Display grid of ECB historical charts
 */

import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import { ECBChartCard } from './ECBChartCard';
import { ECB_CURRENCIES } from '@/lib/utils/ecbUtils';

interface ECBHistoricalData {
  USD?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  ARS?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  GBP?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  BRL?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
}

interface ECBChartsGridProps {
  ecbHistorical: ECBHistoricalData;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

export function ECBChartsGrid({
  ecbHistorical,
  favoriteChartIds,
  onToggleChart,
}: ECBChartsGridProps) {
  // Currencies that have historical chart data
  const chartCurrencies = ['USD', 'ARS', 'GBP', 'BRL'];

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <FaChartLine className="text-indigo-400" />
        Evolucion Historica (ultimos 12 meses)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartCurrencies.map((currency) => {
          const historicalData = ecbHistorical[currency as keyof ECBHistoricalData];
          if (!historicalData?.data) return null;

          const config = ECB_CURRENCIES[currency];
          if (!config) return null;

          return (
            <ECBChartCard
              key={currency}
              data={historicalData.data}
              latest={historicalData.latest}
              config={config}
              isFavorite={favoriteChartIds.includes(config.chartId)}
              onToggleFavorite={onToggleChart}
            />
          );
        })}
      </div>
    </div>
  );
}
