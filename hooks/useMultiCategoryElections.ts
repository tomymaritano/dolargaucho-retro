/**
 * useMultiCategoryElections Hook
 *
 * Fetches election results for multiple categories (Presidente, Diputados, Senadores)
 * Returns data for all categories with separate loading/error states
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import type { ProcessedElectionResults } from '@/types/api/election';
import { ELECTION_CONSTANTS } from '@/types/api/election';
import { logger } from '@/lib/utils/logger';

/**
 * Fetch election results for a specific category
 */
async function fetchElectionResultsByCategory(
  categoryId: number
): Promise<ProcessedElectionResults> {
  const response = await fetch(`/api/elecciones/resultados?categoriaId=${categoryId}`, {
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
 * Hook to fetch results for a specific category
 */
export function useCategoryElectionResults(categoryId: number, enabled: boolean = true) {
  return useQuery<ProcessedElectionResults, Error>({
    queryKey: ['election-results', categoryId],
    queryFn: () => fetchElectionResultsByCategory(categoryId),
    enabled,

    // Polling config
    refetchInterval: ELECTION_CONSTANTS.POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    // Keep previous data while fetching
    placeholderData: (previousData) => previousData,

    // Cache config
    staleTime: ELECTION_CONSTANTS.CACHE_TTL_MS,
    gcTime: 5 * 60 * 1000,

    // Retry config
    retry: ELECTION_CONSTANTS.MAX_RETRIES,
    retryDelay: (attemptIndex) => {
      return ELECTION_CONSTANTS.RETRY_BACKOFF_MS[attemptIndex] || 5000;
    },
  });
}

/**
 * Hook to fetch all election categories at once
 */
export function useMultiCategoryElections(enabled: boolean = true) {
  const presidente = useCategoryElectionResults(ELECTION_CONSTANTS.CATEGORIA_PRESIDENTE, enabled);
  const diputados = useCategoryElectionResults(ELECTION_CONSTANTS.CATEGORIA_DIPUTADOS, enabled);
  const senadores = useCategoryElectionResults(ELECTION_CONSTANTS.CATEGORIA_SENADORES, enabled);

  return {
    presidente,
    diputados,
    senadores,

    // Aggregated states
    isAnyLoading: presidente.isLoading || diputados.isLoading || senadores.isLoading,
    hasAnyError: !!presidente.error || !!diputados.error || !!senadores.error,
    isAllSuccess: presidente.isSuccess && diputados.isSuccess && senadores.isSuccess,
  };
}
