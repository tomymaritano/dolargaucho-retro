'use client';

import { useQuery } from '@tanstack/react-query';
import { DolarQuotation, DolarType } from '@/types/api/dolar';
import { API_CONFIG, CACHE_CONFIG } from '@/lib/config/api';
import { DolarQuotationsSchema, validateAndParse } from '@/lib/schemas/api';
import { logger } from '@/lib/utils/logger';

/**
 * Hook to fetch all dollar quotations from DolarAPI
 * Uses TanStack Query for automatic caching, refetching, and state management
 *
 * Features:
 * - Auto-refetch every 30 seconds
 * - Data is cached for 30 seconds
 * - Automatic retries on failure
 * - Loading and error states
 * - Zod validation for API responses
 * - Structured logging
 *
 * @example
 * const { data, isLoading, error } = useDolarQuery();
 */
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async (): Promise<DolarQuotation[]> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.dolares}`;
      const startTime = performance.now();

      logger.api.request(url, 'GET');

      const response = await fetch(url);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        logger.api.error(url, new Error(`HTTP ${response.status}: ${response.statusText}`));
        throw new Error('Error al obtener datos del dólar');
      }

      const rawData = await response.json();

      // Validate with Zod
      const data = validateAndParse(DolarQuotationsSchema, rawData, 'DolarAPI /dolares');

      logger.api.response(url, response.status, duration);

      return data;
    },
    staleTime: CACHE_CONFIG.dolar.staleTime,
    refetchInterval: CACHE_CONFIG.dolar.refetchInterval,
    retry: CACHE_CONFIG.dolar.retry,
    retryDelay: CACHE_CONFIG.dolar.retryDelay,
  });
}

/**
 * Hook to fetch a specific dollar type
 *
 * @param type - Type of dollar (oficial, blue, bolsa, contadoconliqui, etc.)
 *
 * @example
 * const { data: blue } = useDolarByType('blue');
 */
export function useDolarByType(type: DolarType) {
  return useQuery({
    queryKey: ['dolar', type],
    queryFn: async (): Promise<DolarQuotation> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.dolarByType(type)}`;
      const startTime = performance.now();

      logger.api.request(url, 'GET');

      const response = await fetch(url);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        logger.api.error(url, new Error(`HTTP ${response.status}: ${response.statusText}`));
        throw new Error(`Error al obtener dólar ${type}`);
      }

      const rawData = await response.json();
      const data = validateAndParse(DolarQuotationsSchema.element, rawData, `DolarAPI /dolares/${type}`);

      logger.api.response(url, response.status, duration);

      return data;
    },
    enabled: !!type,
    staleTime: CACHE_CONFIG.dolar.staleTime,
    refetchInterval: CACHE_CONFIG.dolar.refetchInterval,
  });
}

/**
 * Backward compatible hook that mimics the old useDolar interface
 * Uses TanStack Query internally for better performance
 *
 * @deprecated Use useDolarQuery() directly for better type safety
 * For historical data, use useDolarHistorico() from hooks/useDolarHistorico
 */
export default function useDolar() {
  const { data, isLoading, error } = useDolarQuery();

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATED] useDolar() está deprecado. ' +
      'Use useDolarQuery() para datos actuales o useDolarHistorico() para datos históricos.'
    );
  }

  return {
    dolar: data || [],
    loading: isLoading,
    error: error?.message || null,
    /**
     * @deprecated Use useDolarHistorico(date) hook instead
     */
    fetchHistoricalData: async (date: Date) => {
      console.warn('[DEPRECATED] fetchHistoricalData está deprecado. Use useDolarHistorico(date) hook.');
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const { dolarAPI } = await import('@/lib/config/api').then(m => m.API_CONFIG);
        const response = await fetch(`${dolarAPI.baseUrl}${dolarAPI.endpoints.dolarHistorico(formattedDate)}`);
        const data = await response.json();
        return data;
      } catch (error) {
        logger.error('Error al obtener datos históricos', error, { hook: 'useDolar', date: date.toISOString() });
        return [];
      }
    },
  };
}
