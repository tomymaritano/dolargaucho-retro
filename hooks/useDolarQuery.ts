'use client';

import { useQuery } from '@tanstack/react-query';
import { DolarQuotation, DolarType } from '@/types/api/dolar';
import { API_CONFIG, CACHE_CONFIG } from '@/lib/config/api';

/**
 * Hook to fetch all dollar quotations from DolarAPI
 * Uses TanStack Query for automatic caching, refetching, and state management
 *
 * Features:
 * - Auto-refetch every 30 seconds
 * - Data is cached for 30 seconds
 * - Automatic retries on failure
 * - Loading and error states
 *
 * @example
 * const { data, isLoading, error } = useDolarQuery();
 */
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async (): Promise<DolarQuotation[]> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.dolares}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener datos del dólar');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato inesperado de respuesta de API');
      }

      return data;
    },
    staleTime: CACHE_CONFIG.dolar.staleTime,
    refetchInterval: CACHE_CONFIG.dolar.refetchInterval,
    retry: 3,
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
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener dólar ${type}`);
      }

      return response.json();
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
 */
export default function useDolar() {
  const { data, isLoading, error } = useDolarQuery();

  return {
    dolar: data || [],
    loading: isLoading,
    error: error?.message || null,
    // Historical data function (not using React Query for now)
    fetchHistoricalData: async (date: Date) => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(`https://api.dolarapi.com/v1/dolares?fecha=${formattedDate}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error al obtener datos históricos', error);
        return [];
      }
    },
  };
}
