/**
 * UI Constants
 * Centralized constants for UI elements (dimensions, colors, limits, etc.)
 */

/**
 * Table Column Widths
 * Used across all tables (Crypto, Dolar, Cotizaciones, Favorites)
 */
export const TABLE_COLUMN_WIDTHS = {
  nombre: '30%',
  precioUSD: '12%',
  precioARS: '12%',
  compra: '12%',
  venta: '12%',
  variation: '10%',
  variation7d: '10%',
  trend: '12%',
  actions: '14%',
} as const;

/**
 * Sparkline Configuration
 * Settings for all sparkline charts in tables
 */
export const SPARKLINE_CONFIG = {
  // Dimensions
  width: 'w-28', // Tailwind class
  height: 'h-12', // Tailwind class
  widthPx: 112, // In pixels (28 * 4)
  heightPx: 48, // In pixels (12 * 4)

  // Visual properties
  strokeWidth: 1.5,
  chartType: 'natural' as const, // Recharts line type
  margin: { top: 4, right: 4, bottom: 4, left: 4 },

  // Interpolation settings
  minPointsForInterpolation: 20, // If less than this, interpolate
  interpolationPointsPerSegment: 30, // For sparse data (< 10 points)
  interpolationPointsDefault: 15, // For medium data (10-20 points)

  // Colors (matches Tailwind theme)
  colors: {
    success: '#10b981', // green-500
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
  },
} as const;

/**
 * Pagination Settings
 * Default pagination configuration
 */
export const PAGINATION = {
  cryptoPerPage: 50,
  dolaresPerPage: 20,
  cotizacionesPerPage: 10,
  defaultPage: 1,
} as const;

/**
 * Favorites Limits
 * Maximum number of favorites allowed per category
 */
export const FAVORITES_LIMITS = {
  maxCharts: 3,
  maxDolares: 10,
  maxCurrencies: 10,
  maxCryptos: 10,
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  toast: 3000,
  toastError: 5000,
  hover: 150,
  transition: 300,
} as const;

/**
 * Breakpoints (matches Tailwind)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Search/Filter Debounce
 */
export const DEBOUNCE_MS = {
  search: 300,
  filter: 200,
  resize: 150,
} as const;
