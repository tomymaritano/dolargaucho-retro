/**
 * @deprecated Este hook está deprecado.
 * Use useInflacionMensual() de /hooks/useFinanzas.ts en su lugar.
 * URLs están centralizadas en /lib/config/api.ts
 */

import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config/api';

const BASE_URL = API_CONFIG.argentinaData.baseUrl;

export interface InflacionData {
  fecha: string;
  valor: number; // IPC mensual en porcentaje
}

export function useInflacion() {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATED] useInflacion() está deprecado. ' +
      'Use useInflacionMensual() de /hooks/useFinanzas.ts'
    );
  }

  return useQuery({
    queryKey: ['inflacion'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}${API_CONFIG.argentinaData.endpoints.inflacion}`);
      if (!response.ok) {
        throw new Error('Error al cargar datos de inflación');
      }
      const data = await response.json();
      return data as InflacionData[];
    },
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
