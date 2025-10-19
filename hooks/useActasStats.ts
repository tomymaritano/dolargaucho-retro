/**
 * useActasStats Hook
 *
 * Single Responsibility: Calculate statistics from actas data
 */

import { useMemo } from 'react';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';
import { categorizarActa } from '@/lib/utils/actasUtils';

interface ActasStats {
  total: number;
  ordinarias: number;
  extraordinarias: number;
}

export function useActasStats(actas: (ActaSenado | ActaDiputados)[] | undefined): ActasStats {
  return useMemo(() => {
    if (!actas) {
      return { total: 0, ordinarias: 0, extraordinarias: 0 };
    }

    const categorized = actas.map(categorizarActa);
    return {
      total: actas.length,
      ordinarias: categorized.filter((c) => c === 'Ordinaria').length,
      extraordinarias: categorized.filter((c) => c === 'Extraordinaria').length,
    };
  }, [actas]);
}
