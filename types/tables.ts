/**
 * Table Types
 * Common types for table components
 */

/**
 * Sort Direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort Field (Generic)
 */
export type SortField = string;

/**
 * Trend Direction
 * Used for price movements, sparklines, etc.
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Table Column Alignment
 */
export type ColumnAlignment = 'left' | 'center' | 'right';

/**
 * Sparkline Data Point
 * Simple data point for sparkline charts
 */
export interface SparklineDataPoint {
  value: number;
}

/**
 * Sparkline Props
 * Common props for sparkline components
 */
export interface SparklineProps {
  data: number[];
  color?: string;
  trend: TrendDirection;
  width?: number;
  height?: number;
}

/**
 * Table Pagination
 */
export interface TablePagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
}

/**
 * Table Filters (Generic)
 */
export interface TableFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  [key: string]: string | number | boolean | undefined;
}
