import React from 'react';
import { FaArrowUp, FaArrowDown, FaExternalLinkAlt } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';

interface FredDataMetric {
  latest: number;
  change?: number;
  data?: Array<{ date: string; value: number }>;
}

interface FREDStatsCardsProps {
  federalFundsRate?: FredDataMetric;
  inflationCPI?: {
    yearOverYear: number;
    latest: number;
    data?: Array<{ date: string; value: number }>;
  };
  gdp?: {
    quarterlyGrowth: number;
    latest: number;
    data?: Array<{ date: string; value: number }>;
  };
  unemploymentRate?: FredDataMetric;
}

/**
 * FREDStatsCards Component
 *
 * Displays key economic metrics from FRED in a card grid.
 * Each card includes the metric value, change indicator, and link to FRED source.
 */
export function FREDStatsCards({
  federalFundsRate,
  inflationCPI,
  gdp,
  unemploymentRate,
}: FREDStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Fed Funds Rate */}
      <Card
        variant="elevated"
        padding="md"
        className="border border-border hover:border-blue-400/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground">Tasa FED</h3>
          <span className="text-[10px] text-secondary">Fed Funds</span>
        </div>
        <div className="mb-2">
          <p className="text-2xl font-bold text-blue-400 tabular-nums">
            {federalFundsRate?.latest.toFixed(2)}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            {federalFundsRate && federalFundsRate.change && federalFundsRate.change > 0 ? (
              <FaArrowUp className="text-[10px] text-success" />
            ) : federalFundsRate && federalFundsRate.change && federalFundsRate.change < 0 ? (
              <FaArrowDown className="text-[10px] text-error" />
            ) : null}
            <span className="text-[10px] text-secondary">vs mes anterior</span>
          </div>
        </div>
        <a
          href="https://fred.stlouisfed.org/series/FEDFUNDS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </Card>

      {/* Inflation (CPI) */}
      <Card
        variant="elevated"
        padding="md"
        className="border border-border hover:border-blue-400/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground">Inflación</h3>
          <span className="text-[10px] text-secondary">CPI YoY</span>
        </div>
        <div className="mb-2">
          <p className="text-2xl font-bold text-blue-400 tabular-nums">
            {inflationCPI?.yearOverYear.toFixed(1)}%
          </p>
          <p className="text-[10px] text-secondary mt-1">Anual</p>
        </div>
        <a
          href="https://fred.stlouisfed.org/series/CPIAUCSL"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </Card>

      {/* GDP */}
      <Card
        variant="elevated"
        padding="md"
        className="border border-border hover:border-blue-400/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground">PIB</h3>
          <span className="text-[10px] text-secondary">Real GDP</span>
        </div>
        <div className="mb-2">
          <p className="text-2xl font-bold text-blue-400 tabular-nums">
            {gdp && gdp.quarterlyGrowth > 0 ? '+' : ''}
            {gdp?.quarterlyGrowth.toFixed(1)}%
          </p>
          <p className="text-[10px] text-secondary mt-1">Trimestral</p>
        </div>
        <a
          href="https://fred.stlouisfed.org/series/GDPC1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </Card>

      {/* Unemployment */}
      <Card
        variant="elevated"
        padding="md"
        className="border border-border hover:border-blue-400/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground">Desempleo</h3>
          <span className="text-[10px] text-secondary">Rate</span>
        </div>
        <div className="mb-2">
          <p className="text-2xl font-bold text-blue-400 tabular-nums">
            {unemploymentRate?.latest.toFixed(1)}%
          </p>
          <p className="text-[10px] text-secondary mt-1">Tasa actual</p>
        </div>
        <a
          href="https://fred.stlouisfed.org/series/UNRATE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </Card>
    </div>
  );
}
