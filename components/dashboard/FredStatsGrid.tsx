/**
 * FredStatsGrid Component
 *
 * Single Responsibility: Display grid of FRED economic indicator stat cards
 */

import React from 'react';
import { FredStatCard } from './FredStatCard';
import { FRED_INDICATORS } from '@/lib/utils/fredUtils';

interface FredData {
  federalFundsRate?: {
    latest: number;
    change: number;
    changePercent: number;
  };
  inflationCPI?: {
    latest: number;
    yearOverYear: number;
  };
  gdp?: {
    quarterlyGrowth: number;
  };
  unemploymentRate?: {
    latest: number;
    change: number;
    changePercent: number;
  };
}

interface FredStatsGridProps {
  fredData: FredData;
  onToggleCharts: () => void;
}

export function FredStatsGrid({ fredData, onToggleCharts }: FredStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* FED Rate */}
      {fredData.federalFundsRate && (
        <FredStatCard
          value={fredData.federalFundsRate.latest}
          config={FRED_INDICATORS.federalFundsRate}
          change={fredData.federalFundsRate.change}
          changePercent={fredData.federalFundsRate.changePercent}
          onToggleCharts={onToggleCharts}
        />
      )}

      {/* Inflation CPI */}
      {fredData.inflationCPI && (
        <FredStatCard
          value={fredData.inflationCPI.yearOverYear}
          config={FRED_INDICATORS.inflationCPI}
          onToggleCharts={onToggleCharts}
        />
      )}

      {/* GDP */}
      {fredData.gdp && (
        <FredStatCard
          value={fredData.gdp.quarterlyGrowth}
          config={FRED_INDICATORS.gdp}
          onToggleCharts={onToggleCharts}
        />
      )}

      {/* Unemployment */}
      {fredData.unemploymentRate && (
        <FredStatCard
          value={fredData.unemploymentRate.latest}
          config={FRED_INDICATORS.unemploymentRate}
          change={fredData.unemploymentRate.change}
          changePercent={fredData.unemploymentRate.changePercent}
          onToggleCharts={onToggleCharts}
        />
      )}
    </div>
  );
}
