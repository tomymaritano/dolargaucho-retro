/**
 * FRED (Federal Reserve Economic Data) Types
 */

export interface FredDataPoint {
  date: string;
  value: number;
}

export interface FredIndicator {
  latest: number;
  previousMonth: number;
  change: number;
  changePercent: number;
  data: FredDataPoint[];
  lastUpdate: string;
}

/**
 * Structured FRED data for dashboard display
 */
export interface FredData {
  federalFundsRate?: {
    latest: number;
    change: number;
    changePercent: number;
    data: Array<{ date: string; value: number }>;
    lastUpdate: string;
  };
  inflationCPI?: {
    latest: number;
    yearOverYear: number;
    data: Array<{ date: string; value: number }>;
  };
  gdp?: {
    quarterlyGrowth: number;
  };
  unemploymentRate?: {
    latest: number;
    change: number;
    changePercent: number;
    data: Array<{ date: string; value: number }>;
  };
  treasury10y?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
  m2MoneySupply?: FredIndicator;
  dollarIndex?: FredIndicator;
}
