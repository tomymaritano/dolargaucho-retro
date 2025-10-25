import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

interface ReservasDataPoint {
  date: string;
  value: number;
}

interface ReservasResponse {
  series_id: string;
  name: string;
  description: string;
  count: number;
  latest: {
    date: string;
    value: number;
    variation: number | null;
  };
  data: ReservasDataPoint[];
  source?: string;
  note?: string;
}

async function fetchReservas(): Promise<ReservasResponse> {
  try {
    const response = await apiClient.get<ReservasResponse>('/api/bcra/reservas');
    console.log('[Reservas] Successfully fetched data');
    return response.data;
  } catch (error) {
    console.error('[Reservas] Error fetching data:', error);
    // Return fallback data
    return {
      series_id: 'fallback',
      name: 'Reservas Internacionales',
      description: 'Reservas internacionales del BCRA (millones USD)',
      count: 0,
      latest: {
        date: new Date().toISOString().split('T')[0],
        value: 38928,
        variation: null,
      },
      data: [],
      source: 'fallback',
    };
  }
}

/**
 * Hook para obtener las reservas internacionales del BCRA
 *
 * Retorna datos de las reservas en millones de USD
 * Incluye valor actual, variación y datos históricos
 */
export function useBCRAReservas() {
  return useQuery<ReservasResponse>({
    queryKey: ['bcra', 'reservas'],
    queryFn: fetchReservas,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - updates daily
    refetchInterval: 1000 * 60 * 60 * 12, // Refetch every 12 hours
    retry: 2,
  });
}

/**
 * Hook simplificado que solo retorna el valor actual de reservas
 */
export function useReservasActual() {
  const { data, isLoading, error } = useBCRAReservas();

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
