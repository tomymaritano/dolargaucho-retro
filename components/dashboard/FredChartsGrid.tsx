/**
 * FredChartsGrid Component
 *
 * Single Responsibility: Display grid of FRED historical charts with professional styling
 */

import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import { FredChartCard } from './FredChartCard';
import { FRED_INDICATORS } from '@/lib/utils/fredUtils';

interface FredData {
  federalFundsRate?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
  inflationCPI?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
  unemploymentRate?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
  treasury10y?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
}

interface FredChartsGridProps {
  fredData: FredData;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

export function FredChartsGrid({ fredData, favoriteChartIds, onToggleChart }: FredChartsGridProps) {
  return (
    <div className="mt-6 pt-6 border-t border-border/10">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <FaChartLine className="text-blue-400" />
        Evolucion Historica (ultimos 12 meses)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FED Rate Chart */}
        {fredData.federalFundsRate?.data && (
          <FredChartCard
            data={fredData.federalFundsRate.data}
            latest={fredData.federalFundsRate.latest}
            config={FRED_INDICATORS.federalFundsRate}
            isFavorite={favoriteChartIds.includes(FRED_INDICATORS.federalFundsRate.chartId)}
            onToggleFavorite={onToggleChart}
          />
        )}

        {/* CPI Chart */}
        {fredData.inflationCPI?.data && (
          <FredChartCard
            data={fredData.inflationCPI.data}
            latest={fredData.inflationCPI.latest}
            config={FRED_INDICATORS.inflationCPI}
            isFavorite={favoriteChartIds.includes(FRED_INDICATORS.inflationCPI.chartId)}
            onToggleFavorite={onToggleChart}
          />
        )}

        {/* Unemployment Chart */}
        {fredData.unemploymentRate?.data && (
          <FredChartCard
            data={fredData.unemploymentRate.data}
            latest={fredData.unemploymentRate.latest}
            config={FRED_INDICATORS.unemploymentRate}
            isFavorite={favoriteChartIds.includes(FRED_INDICATORS.unemploymentRate.chartId)}
            onToggleFavorite={onToggleChart}
          />
        )}

        {/* Treasury 10Y Chart */}
        {fredData.treasury10y?.data && (
          <FredChartCard
            data={fredData.treasury10y.data}
            latest={fredData.treasury10y.latest}
            config={FRED_INDICATORS.treasury10y}
            isFavorite={favoriteChartIds.includes(FRED_INDICATORS.treasury10y.chartId)}
            onToggleFavorite={onToggleChart}
          />
        )}
      </div>
    </div>
  );
}
