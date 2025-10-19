/**
 * API Constants
 * Centralized constants for API configuration
 */

/**
 * Cache/Stale Times (in milliseconds)
 * Used by TanStack Query hooks
 */
export const CACHE_TIMES = {
  // Real-time data (30 seconds)
  realtime: {
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  },

  // Financial data (1 minute)
  financial: {
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  },

  // Historical data (1 hour)
  historical: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
  },

  // Static data (24 hours)
  static: {
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: false,
  },
} as const;

/**
 * Retry Configuration
 * For failed API requests
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  exponentialBackoff: true,
} as const;

/**
 * API Endpoints
 * External API URLs (complementary to lib/config/api.ts)
 */
export const EXTERNAL_APIS = {
  coingecko: 'https://api.coingecko.com/api/v3',
  dolarapi: 'https://dolarapi.com/v1',
  argentinaData: 'https://api.argentinadatos.com/v1',
  fred: 'https://api.stlouisfed.org/fred',
  ecb: 'https://api.frankfurter.app',
} as const;

/**
 * Rate Limits (requests per minute)
 */
export const RATE_LIMITS = {
  coingecko: 50,
  dolarapi: 100,
  argentinaData: 100,
  internal: 1000,
} as const;
