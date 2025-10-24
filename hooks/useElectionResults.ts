/**
 * useElectionResults Hook
 *
 * Fetches election results with automatic polling every 10 seconds
 * Uses React Query for caching and background updates
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import type { ProcessedElectionResults } from '@/types/api/election';
import { ELECTION_CONSTANTS } from '@/types/api/election';
import { logger } from '@/lib/utils/logger';

/**
 * Fetch election results from our API endpoint
 */
async function fetchElectionResults(): Promise<ProcessedElectionResults> {
  const response = await fetch('/api/elecciones/resultados', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Hook para obtener resultados electorales con polling automático
 *
 * @param enabled - Si debe hacer polling (default: true)
 * @returns React Query result con datos, loading, error
 *
 * @example
 * const { data, isLoading, error, lastFetch } = useElectionResults();
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * return <Results data={data} />;
 */
export function useElectionResults(enabled: boolean = true) {
  const query = useQuery<ProcessedElectionResults, Error>({
    queryKey: ['election-results'],
    queryFn: fetchElectionResults,
    enabled,

    // Polling config - refetch every 10 seconds
    refetchInterval: ELECTION_CONSTANTS.POLL_INTERVAL_MS,

    // Refetch on window focus (user comes back to tab)
    refetchOnWindowFocus: true,

    // Refetch on reconnect (network comes back)
    refetchOnReconnect: true,

    // Keep previous data while fetching new data (no loading flicker)
    placeholderData: (previousData) => previousData,

    // Cache config
    staleTime: ELECTION_CONSTANTS.CACHE_TTL_MS, // Consider data stale after 10s
    gcTime: 5 * 60 * 1000, // Garbage collect after 5 minutes of inactivity

    // Retry config (3 retries with exponential backoff)
    retry: ELECTION_CONSTANTS.MAX_RETRIES,
    retryDelay: (attemptIndex) => {
      return ELECTION_CONSTANTS.RETRY_BACKOFF_MS[attemptIndex] || 5000;
    },

    // Logging
    meta: {
      errorMessage: 'Failed to fetch election results',
    },
  });

  // Log errors (only once per error)
  if (query.error && query.fetchStatus !== 'fetching') {
    logger.error('[useElectionResults] Query error', {
      error: query.error.message,
    });
  }

  // Calculate time since last successful fetch
  const lastFetch = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;
  const timeSinceLastFetch = lastFetch
    ? Math.floor((Date.now() - lastFetch.getTime()) / 1000)
    : null;

  return {
    // Data
    data: query.data,

    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,

    // Error state
    error: query.error,

    // Fetch status
    fetchStatus: query.fetchStatus,

    // Timestamps
    lastFetch,
    timeSinceLastFetch,
    dataUpdatedAt: query.dataUpdatedAt,

    // Actions
    refetch: query.refetch,
  };
}

/**
 * Hook simplificado solo para saber si hay elecciones en curso
 *
 * @returns True if election day is today
 *
 * PRODUCTION MODE: Verifica fecha real de elección (26 Oct 2025)
 * Para testing/preview, cambiar TESTING_MODE a true
 */
export function isElectionDay(): boolean {
  // PRODUCTION MODE: Check actual date
  const TESTING_MODE = false;

  if (TESTING_MODE) {
    return true; // Always show election results for testing
  }

  // Production mode: Check actual date
  const now = new Date();
  const electionDate = new Date('2025-10-26T00:00:00-03:00');

  return (
    now.getFullYear() === electionDate.getFullYear() &&
    now.getMonth() === electionDate.getMonth() &&
    now.getDate() === electionDate.getDate()
  );
}
