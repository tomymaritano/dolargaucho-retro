/**
 * Format Constants
 * Centralized constants for formatting numbers, dates, currencies
 */

/**
 * Number Format Thresholds
 * For compact number formatting (K, M, B, T)
 */
export const NUMBER_THRESHOLDS = {
  thousand: 1_000,
  million: 1_000_000,
  billion: 1_000_000_000,
  trillion: 1_000_000_000_000,
} as const;

/**
 * Currency Format Configuration
 */
export const CURRENCY_FORMAT = {
  locale: 'es-AR',
  usd: {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigitsNormal: 2,
    maximumFractionDigitsSmall: 6, // For values < 1
  },
  ars: {
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
} as const;

/**
 * Date Format Configuration
 */
export const DATE_FORMAT = {
  locale: 'es-AR',
  short: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  long: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  withTime: {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
} as const;

/**
 * Percentage Format Configuration
 */
export const PERCENTAGE_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'auto' as const,
} as const;
