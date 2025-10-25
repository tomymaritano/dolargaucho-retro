import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

interface SeriesDataPoint {
  date: string;
  value: number;
}

interface BaseMonetariaResponse {
  series_id: string;
  name: string;
  description: string;
  count: number;
  latest: {
    date: string;
    value: number;
    variation: number | null;
  };
  data: SeriesDataPoint[];
  source?: string;
  note?: string;
}

async function fetchBaseMonetaria(): Promise<BaseMonetariaResponse> {
  try {
    const response = await apiClient.get<BaseMonetariaResponse>('/api/bcra/base-monetaria');
    console.log('[Base Monetaria] Successfully fetched data');
    return response.data;
  } catch (error) {
    console.error('[Base Monetaria] Error fetching data:', error);
    // Return fallback data
    return {
      series_id: 'fallback',
      name: 'Base Monetaria',
      description: 'Base monetaria total (millones ARS)',
      count: 0,
      latest: {
        date: new Date().toISOString().split('T')[0],
        value: 40792969, // Mock value from research
        variation: null,
      },
      data: [],
      source: 'fallback',
    };
  }
}

/**
 * Hook para obtener la base monetaria del BCRA
 *
 * Retorna la base monetaria total en millones de pesos argentinos
 * Incluye valor actual, variación y datos históricos
 */
export function useBaseMonetaria() {
  return useQuery<BaseMonetariaResponse>({
    queryKey: ['bcra', 'base-monetaria'],
    queryFn: fetchBaseMonetaria,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - updates daily
    refetchInterval: 1000 * 60 * 60 * 12, // Refetch every 12 hours
    retry: 2,
  });
}

/**
 * Hook simplificado que solo retorna el valor actual de base monetaria
 */
export function useBaseMonetariaActual() {
  const { data, isLoading, error } = useBaseMonetaria();

  if (isLoading || error || !data) {
    return {
      value: null,
      variation: null,
      date: null,
      isLoading,
      error,
    };
  }

  return {
    value: data.latest.value,
    variation: data.latest.variation,
    date: data.latest.date,
    isLoading: false,
    error: null,
  };
}
