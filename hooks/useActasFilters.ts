/**
 * useActasFilters Hook
 *
 * Single Responsibility: Handle actas filtering by search term
 */

import { useMemo } from 'react';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';
import { categorizarActa } from '@/lib/utils/actasUtils';

interface UseActasFiltersParams {
  actas: (ActaSenado | ActaDiputados)[] | undefined;
  searchTerm: string;
  limit: number;
}

export function useActasFilters({
  actas,
  searchTerm,
  limit,
}: UseActasFiltersParams): (ActaSenado | ActaDiputados)[] {
  return useMemo(() => {
    if (!actas) return [];

    let filtered = actas;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (acta) =>
          categorizarActa(acta).toLowerCase().includes(term) ||
          acta.periodo?.toLowerCase().includes(term) ||
          acta.orden_dia?.toLowerCase().includes(term) ||
          acta.numero_reunion?.toString().includes(term) ||
          new Date(acta.fecha).getFullYear().toString().includes(term)
      );
    }

    // Sort by date descending
    return filtered
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limit);
  }, [actas, searchTerm, limit]);
}
