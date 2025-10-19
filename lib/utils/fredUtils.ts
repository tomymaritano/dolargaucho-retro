/**
 * fredUtils.ts - Federal Reserve Economic Data utilities
 *
 * Single Responsibility: Provide indicator configuration and formatting for FRED data
 */

export interface FredIndicatorConfig {
  id: string;
  label: string;
  description: string;
  format: (value: number) => string;
  color: string;
  chartId: string;
  showChange?: boolean;
  changeLabel?: string;
}

/**
 * FRED Economic Indicators Configuration
 */
export const FRED_INDICATORS: Record<string, FredIndicatorConfig> = {
  federalFundsRate: {
    id: 'federalFundsRate',
    label: 'Tasa FED',
    description: 'Fed Funds Rate',
    format: (value: number) => `${value.toFixed(2)}%`,
    color: '#3b82f6',
    chartId: 'fred-rate',
    showChange: true,
    changeLabel: 'vs mes anterior',
  },
  inflationCPI: {
    id: 'inflationCPI',
    label: 'Inflacion USA',
    description: 'CPI Year over Year',
    format: (value: number) => `${value.toFixed(1)}%`,
    color: '#8b5cf6',
    chartId: 'fred-cpi',
    showChange: false,
  },
  gdp: {
    id: 'gdp',
    label: 'PIB USA',
    description: 'Crecimiento QoQ',
    format: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
    color: '#10b981',
    chartId: 'fred-gdp',
    showChange: false,
  },
  unemploymentRate: {
    id: 'unemploymentRate',
    label: 'Desempleo',
    description: 'Tasa actual',
    format: (value: number) => `${value.toFixed(1)}%`,
    color: '#10b981',
    chartId: 'fred-unemployment',
    showChange: true,
    changeLabel: 'vs mes anterior',
  },
  treasury10y: {
    id: 'treasury10y',
    label: 'Bonos del Tesoro 10 anos',
    description: 'Rendimiento',
    format: (value: number) => `${value.toFixed(2)}%`,
    color: '#f59e0b',
    chartId: 'fred-treasury',
    showChange: false,
  },
};

/**
 * FRED Chart Indicators (those with historical data)
 */
export const FRED_CHART_INDICATORS = [
  'federalFundsRate',
  'inflationCPI',
  'unemploymentRate',
  'treasury10y',
] as const;

/**
 * Format FRED indicator value with indicator-specific formatting
 */
export function formatFredValue(value: number, indicatorId: string): string {
  const config = FRED_INDICATORS[indicatorId];
  if (!config) return value.toFixed(2);
  return config.format(value);
}
