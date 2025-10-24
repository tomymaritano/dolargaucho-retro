/**
 * Hook para obtener datos históricos de elecciones desde PostgreSQL
 *
 * Consume la API /api/elecciones/historical que sirve datos oficiales de DINE
 */

import { useQuery } from '@tanstack/react-query';
import type { HistoricalElectionData } from '@/types/api/historical-elections';

/**
 * Fetch historical elections data
 */
async function fetchHistoricalElections(year?: number): Promise<HistoricalElectionData[]> {
  // Agregar timestamp para bust caché en desarrollo
  const cacheBuster = process.env.NODE_ENV === 'development' ? `&_v=${Date.now()}` : '';
  const url = year
    ? `/api/elecciones/historical?year=${year}${cacheBuster}`
    : `/api/elecciones/historical?_v=2${cacheBuster}`; // v=2 para invalidar caché viejo

  const response = await fetch(url, {
    cache: 'no-store', // Forzar no-cache en fetch
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch historical elections: ${response.status}`);
  }

  const data = await response.json();

  // Si es un solo año, viene un objeto. Lo convertimos a array
  return Array.isArray(data) ? data : [data];
}

/**
 * Hook para obtener todas las elecciones históricas, opcionalmente filtradas por categoría
 */
export function useHistoricalElections(category?: string) {
  return useQuery({
    queryKey: ['historical-elections', 'v2', category], // v2 para invalidar caché viejo
    queryFn: () => fetchHistoricalElections(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (datos históricos no cambian)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 días en cache
    select: (data) => {
      if (!category) return data;

      // Filtrar por categoría
      const categoryMap: Record<string, string> = {
        diputados: 'Diputados Nacionales',
        senadores: 'Senadores Nacionales',
      };

      const categoryName = categoryMap[category];
      if (!categoryName) return data;

      return data.filter((election) => election.category === categoryName);
    },
  });
}

/**
 * Hook para obtener una elección específica por año
 */
export function useHistoricalElection(year: number) {
  return useQuery({
    queryKey: ['historical-election', year],
    queryFn: () => fetchHistoricalElections(year),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 días en cache
    select: (data) => data[0], // Retornar solo el primer elemento
  });
}
