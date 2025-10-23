/**
 * Eventos Hooks - Feriados y Eventos Presidenciales
 * Hooks para datos de eventos de ArgentinaData API
 * NOW USES: ArgentinaDataService with Axios interceptors ✨
 */

import { useQuery } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/config/api';
import { ArgentinaDataService } from '@/lib/api/argentinaData';
import type {
  Feriado,
  EventoPresidencial,
  FeriadosResponse,
  EventosPresidencialesResponse,
} from '@/types/api/argentina';

// =====================
// FERIADOS
// =====================

/**
 * Hook para obtener todos los feriados
 */
export function useFeriados() {
  return useQuery<FeriadosResponse>({
    queryKey: ['feriados'],
    queryFn: () => ArgentinaDataService.getFeriados(),
    staleTime: CACHE_CONFIG.eventos.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener feriados del año actual
 */
export function useFeriadosActuales() {
  return useQuery<Feriado[]>({
    queryKey: ['feriados-actuales'],
    queryFn: async () => {
      const data: FeriadosResponse = await ArgentinaDataService.getFeriados();
      const currentYear = new Date().getFullYear();

      return data.filter((f) => {
        const feriadoYear = new Date(f.fecha).getFullYear();
        return feriadoYear === currentYear;
      });
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
  });
}

/**
 * Hook para obtener próximos feriados
 */
export function useProximosFeriados(limit = 5) {
  return useQuery<Feriado[]>({
    queryKey: ['proximos-feriados', limit],
    queryFn: async () => {
      const data: FeriadosResponse = await ArgentinaDataService.getFeriados();
      const now = new Date();

      return data
        .filter((f) => new Date(f.fecha) >= now)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(0, limit);
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
  });
}

/**
 * Hook para verificar si una fecha es feriado
 */
export function useIsFeriado(fecha: Date | string) {
  return useQuery<boolean>({
    queryKey: ['is-feriado', fecha],
    queryFn: async () => {
      const data: FeriadosResponse = await ArgentinaDataService.getFeriados();
      const targetDate = new Date(fecha).toISOString().split('T')[0];

      return data.some((f) => f.fecha === targetDate);
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
    enabled: !!fecha,
  });
}

// =====================
// EVENTOS PRESIDENCIALES
// =====================

/**
 * Hook para obtener todos los eventos presidenciales
 * NOTE: Endpoint no disponible en la API, retorna array vacío
 */
export function useEventosPresidenciales() {
  return useQuery<EventosPresidencialesResponse>({
    queryKey: ['eventos-presidenciales'],
    queryFn: async () => {
      // Endpoint no disponible en ArgentinaData API
      return [];
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
    enabled: false, // Disabled until endpoint is available
  });
}

/**
 * Hook para obtener próximos eventos presidenciales
 * TODO: Implementar cuando la API tenga este endpoint disponible
 */
export function useProximosEventosPresidenciales(limit = 10) {
  return useQuery<EventoPresidencial[]>({
    queryKey: ['proximos-eventos-presidenciales', limit],
    queryFn: async () => {
      // Endpoint no disponible en la API actual
      // const url = `${API_CONFIG.argentinaData.baseUrl}/eventos/presidenciales`;
      return [];
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
  });
}

/**
 * Hook para obtener eventos presidenciales por tipo
 * TODO: Implementar cuando la API tenga este endpoint disponible
 */
export function useEventosPresidencialesByTipo(tipo: string) {
  return useQuery<EventoPresidencial[]>({
    queryKey: ['eventos-presidenciales', 'tipo', tipo],
    queryFn: async () => {
      // Endpoint no disponible en la API actual
      return [];
    },
    staleTime: CACHE_CONFIG.eventos.staleTime,
    enabled: !!tipo,
  });
}

// =====================
// UTILITIES
// =====================

/**
 * Hook para obtener calendario completo (feriados + eventos)
 */
export function useCalendarioCompleto() {
  const { data: feriados } = useFeriados();
  const { data: eventos } = useEventosPresidenciales();

  return useQuery({
    queryKey: ['calendario-completo', feriados, eventos],
    queryFn: () => {
      const calendario: Array<{
        fecha: string;
        tipo: 'feriado' | 'evento';
        nombre: string;
        info?: string;
      }> = [];

      if (feriados) {
        calendario.push(
          ...feriados.map((f) => ({
            fecha: f.fecha,
            tipo: 'feriado' as const,
            nombre: f.nombre,
            info: f.info,
          }))
        );
      }

      if (eventos) {
        calendario.push(
          ...eventos.map((e) => ({
            fecha: e.fecha,
            tipo: 'evento' as const,
            nombre: e.descripcion,
            info: e.ubicacion,
          }))
        );
      }

      return calendario.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    },
    enabled: !!feriados || !!eventos,
  });
}
