/**
 * Hook para obtener datos históricos de dólares
 * Centraliza la lógica de fetching histórico que estaba duplicada
 */

import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config/api';
import type { DolarQuotation } from '@/types/api/dolar';

/**
 * Hook para obtener datos históricos de dólares por fecha
 *
 * @param date - Fecha para consultar (formato Date)
 * @param enabled - Si el query debe ejecutarse (default: true)
 *
 * @example
 * const yesterday = new Date();
 * yesterday.setDate(yesterday.getDate() - 1);
 * const { data } = useDolarHistorico(yesterday);
 */
export function useDolarHistorico(date: Date, enabled: boolean = true) {
  const formattedDate = date.toISOString().split('T')[0];

  return useQuery<DolarQuotation[]>({
    queryKey: ['dolar-historico', formattedDate],
    queryFn: async () => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.dolarHistorico(formattedDate)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener datos históricos del ${formattedDate}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato inesperado de respuesta de API');
      }

      return data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - historical data doesn't change
    enabled: enabled && !!date,
    retry: 2,
  });
}

/**
 * Hook para obtener datos del día anterior
 * Conveniente wrapper para el caso de uso más común
 *
 * @example
 * const { data: yesterday } = useYesterdayDolar();
 */
export function useYesterdayDolar() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return useDolarHistorico(yesterday);
}
