/**
 * Política Hooks - Senadores y Diputados
 * Hooks para datos políticos de ArgentinaData API
 */

import { useQuery } from '@tanstack/react-query';
import { API_CONFIG, CACHE_CONFIG } from '@/lib/config/api';
import type {
  Senador,
  Diputado,
  ActaSenado,
  ActaDiputados,
  SenadoresResponse,
  DiputadosResponse,
  ActasSenadoResponse,
  ActasDiputadosResponse,
} from '@/types/api/argentina';

// =====================
// SENADORES
// =====================

/**
 * Hook para obtener lista completa de senadores
 * @returns Query con lista de senadores
 */
export function useSenadores() {
  return useQuery<SenadoresResponse>({
    queryKey: ['senadores'],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.senadores}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener senadores');
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    refetchInterval: CACHE_CONFIG.politica.refetchInterval,
    retry: 3,
  });
}

/**
 * Hook para obtener senadores por provincia
 * @param provincia - Nombre de la provincia
 */
export function useSenadoresByProvincia(provincia: string) {
  return useQuery<Senador[]>({
    queryKey: ['senadores', 'provincia', provincia],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.senadores}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener senadores');
      }

      const data: SenadoresResponse = await response.json();
      return data.filter((s) => s.provincia.toLowerCase() === provincia.toLowerCase());
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!provincia,
  });
}

/**
 * Hook para obtener senadores por bloque político
 * @param bloque - Nombre del bloque
 */
export function useSenadoresByBloque(bloque: string) {
  return useQuery<Senador[]>({
    queryKey: ['senadores', 'bloque', bloque],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.senadores}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener senadores');
      }

      const data: SenadoresResponse = await response.json();
      return data.filter((s) => s.bloque.toLowerCase().includes(bloque.toLowerCase()));
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!bloque,
  });
}

// =====================
// ACTAS SENADO
// =====================

/**
 * Hook para obtener todas las actas del Senado
 */
export function useActasSenado() {
  return useQuery<ActasSenadoResponse>({
    queryKey: ['actas-senado'],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.actasSenado}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener actas del Senado');
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener actas del Senado por año
 * @param year - Año de las actas
 */
export function useActasSenadoByYear(year: number) {
  return useQuery<ActasSenadoResponse>({
    queryKey: ['actas-senado', year],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.actasSenadoByYear(year)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener actas del Senado del año ${year}`);
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!year && year > 1900,
  });
}

// =====================
// DIPUTADOS
// =====================

/**
 * Hook para obtener lista completa de diputados
 * @returns Query con lista de diputados
 */
export function useDiputados() {
  return useQuery<DiputadosResponse>({
    queryKey: ['diputados'],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.diputados}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener diputados');
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    refetchInterval: CACHE_CONFIG.politica.refetchInterval,
    retry: 3,
  });
}

/**
 * Hook para obtener diputados por provincia
 * @param provincia - Nombre de la provincia
 */
export function useDiputadosByProvincia(provincia: string) {
  return useQuery<Diputado[]>({
    queryKey: ['diputados', 'provincia', provincia],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.diputados}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener diputados');
      }

      const data: DiputadosResponse = await response.json();
      return data.filter((d) => d.provincia.toLowerCase() === provincia.toLowerCase());
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!provincia,
  });
}

/**
 * Hook para obtener diputados por bloque político
 * @param bloque - Nombre del bloque
 */
export function useDiputadosByBloque(bloque: string) {
  return useQuery<Diputado[]>({
    queryKey: ['diputados', 'bloque', bloque],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.diputados}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener diputados');
      }

      const data: DiputadosResponse = await response.json();
      return data.filter((d) => d.bloque.toLowerCase().includes(bloque.toLowerCase()));
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!bloque,
  });
}

// =====================
// ACTAS DIPUTADOS
// =====================

/**
 * Hook para obtener todas las actas de Diputados
 */
export function useActasDiputados() {
  return useQuery<ActasDiputadosResponse>({
    queryKey: ['actas-diputados'],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.actasDiputados}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener actas de Diputados');
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener actas de Diputados por año
 * @param year - Año de las actas
 */
export function useActasDiputadosByYear(year: number) {
  return useQuery<ActasDiputadosResponse>({
    queryKey: ['actas-diputados', year],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.actasDiputadosByYear(year)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener actas de Diputados del año ${year}`);
      }

      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    enabled: !!year && year > 1900,
  });
}

// =====================
// UTILITIES
// =====================

/**
 * Hook para obtener estadísticas de bloques políticos
 */
export function useBloqueStats() {
  const { data: senadores } = useSenadores();
  const { data: diputados } = useDiputados();

  return useQuery({
    queryKey: ['bloque-stats', senadores, diputados],
    queryFn: () => {
      if (!senadores || !diputados) return null;

      const bloqueCounts = new Map<string, { senadores: number; diputados: number }>();

      // Count senadores by bloque
      senadores.forEach((s) => {
        const current = bloqueCounts.get(s.bloque) || { senadores: 0, diputados: 0 };
        bloqueCounts.set(s.bloque, { ...current, senadores: current.senadores + 1 });
      });

      // Count diputados by bloque
      diputados.forEach((d) => {
        const current = bloqueCounts.get(d.bloque) || { senadores: 0, diputados: 0 };
        bloqueCounts.set(d.bloque, { ...current, diputados: current.diputados + 1 });
      });

      return Array.from(bloqueCounts.entries()).map(([bloque, counts]) => ({
        bloque,
        ...counts,
        total: counts.senadores + counts.diputados,
      }));
    },
    enabled: !!senadores && !!diputados,
  });
}

/**
 * Hook para obtener representantes por provincia
 */
export function useProvinciaStats() {
  const { data: senadores } = useSenadores();
  const { data: diputados } = useDiputados();

  return useQuery({
    queryKey: ['provincia-stats', senadores, diputados],
    queryFn: () => {
      if (!senadores || !diputados) return null;

      const provinciaCounts = new Map<string, { senadores: number; diputados: number }>();

      // Count senadores by provincia
      senadores.forEach((s) => {
        const current = provinciaCounts.get(s.provincia) || { senadores: 0, diputados: 0 };
        provinciaCounts.set(s.provincia, { ...current, senadores: current.senadores + 1 });
      });

      // Count diputados by provincia
      diputados.forEach((d) => {
        const current = provinciaCounts.get(d.provincia) || { senadores: 0, diputados: 0 };
        provinciaCounts.set(d.provincia, { ...current, diputados: current.diputados + 1 });
      });

      return Array.from(provinciaCounts.entries()).map(([provincia, counts]) => ({
        provincia,
        ...counts,
        total: counts.senadores + counts.diputados,
      }));
    },
    enabled: !!senadores && !!diputados,
  });
}
