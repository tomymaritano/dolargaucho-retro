/**
 * FRED (Federal Reserve Economic Data) Types
 * Centralized type definitions for FRED data
 */

/**
 * FRED Data Point
 * Single data point in a time series
 */
export interface FredDataPoint {
  date: string;
  value: number;
}

/**
 * FRED Indicator
 * Time series data for an economic indicator
 */
export interface FredIndicator {
  latest: number;
  change: number;
  changePercent: number;
  data: FredDataPoint[];
}

/**
 * FRED Data Response
 * Complete FRED data with all indicators
 */
export interface FredDataResponse {
  federalFundsRate?: FredIndicator;
  inflationCPI?: FredIndicator;
  unemploymentRate?: FredIndicator;
  treasury10y?: FredIndicator;
  gdp?: FredIndicator;
  [key: string]: FredIndicator | undefined;
}

/**
 * FRED Indicator IDs
 * Supported FRED indicator codes
 */
export type FredIndicatorId =
  | 'FEDFUNDS' // Federal Funds Rate
  | 'CPIAUCSL' // Consumer Price Index
  | 'UNRATE' // Unemployment Rate
  | 'DGS10' // 10-Year Treasury Constant Maturity Rate
  | 'GDP'; // Gross Domestic Product
