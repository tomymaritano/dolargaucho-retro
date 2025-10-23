/**
 * Shared Chart Types
 *
 * Defines reusable TypeScript types for Lightweight Charts
 * to eliminate 'as any' usage across the codebase.
 */

import type { Time, UTCTimestamp } from 'lightweight-charts';

/**
 * Chart data point with numeric time (for index-based charts)
 * Used in: PlazoFijo, Inflacion, Evolution, Financial calculators
 */
export interface NumericChartDataPoint {
  time: Time;
  value: number;
}

/**
 * Chart data point with timestamp
 * Used in: Real-time charts, historical data
 */
export interface TimestampChartDataPoint {
  time: UTCTimestamp;
  value: number;
}

/**
 * Generic chart data point that accepts any Time type
 */
export interface ChartDataPoint {
  time: Time;
  value: number;
}

/**
 * Baseline chart data point (for profit/loss visualization)
 * Used in: Inflacion chart
 */
export interface BaselineChartDataPoint {
  time: Time;
  value: number;
}

/**
 * Line chart data point with multiple series support
 * Used in: Evolution chart with multiple strategies
 */
export interface LineChartDataPoint {
  time: Time;
  value: number;
}

/**
 * Bar chart data point
 * Used in: Rentabilidad chart
 */
export interface BarChartDataPoint {
  time: Time;
  value: number;
  color?: string;
}

/**
 * Candlestick chart data point
 */
export interface CandlestickDataPoint {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Volume data point (for candlestick charts)
 */
export interface VolumeDataPoint {
  time: UTCTimestamp;
  value: number;
  color?: string;
}

/**
 * Tick formatter function type
 */
export type TickFormatter = (time: Time) => string;

/**
 * Chart options for custom formatting
 */
export interface ChartFormatterOptions {
  labels?: string[];
  formatValue?: (value: number) => string;
  formatTime?: TickFormatter;
}
