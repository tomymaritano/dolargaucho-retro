/**
 * ECB (European Central Bank) Types
 * Centralized type definitions for ECB data
 */

/**
 * ECB Exchange Rates Response
 * Current exchange rates from ECB
 */
export interface ECBRatesData {
  rates: {
    USD: number;
    GBP?: number;
    JPY?: number;
    CHF?: number;
    BRL?: number;
    [key: string]: number | undefined;
  };
  date: string;
}

/**
 * ECB Historical Data Point
 * Single historical exchange rate point
 */
export interface ECBHistoricalPoint {
  date: string;
  rate: number;
}

/**
 * ECB Historical Data
 * Historical exchange rates for a currency
 */
export interface ECBHistoricalData {
  currency: string;
  data: ECBHistoricalPoint[];
  latest: number;
  change: number;
  changePercent: number;
}

/**
 * ECB Historical Response (Multiple Currencies)
 * Response from useECBHistorical hook
 */
export type ECBHistoricalResponse = Record<string, ECBHistoricalData>;
