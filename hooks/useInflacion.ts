/**
 * @deprecated Este hook está deprecado.
 * Use useInflacionMensual() de /hooks/useFinanzas.ts en su lugar.
 * NOW USES: ArgentinaDataService with Axios interceptors ✨
 */

import { useQuery } from '@tanstack/react-query';
import { ArgentinaDataService } from '@/lib/api/argentinaData';

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
    queryFn: () => ArgentinaDataService.getInflacion(),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
