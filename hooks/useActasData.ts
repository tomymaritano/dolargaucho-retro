/**
 * useActasData Hook
 *
 * Single Responsibility: Consolidate all actas data fetching based on chamber and year
 */

import {
  useActasSenado,
  useActasSenadoByYear,
  useActasDiputados,
  useActasDiputadosByYear,
} from '@/hooks/usePolitica';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';

export type Camara = 'senado' | 'diputados';

interface UseActasDataParams {
  camara: Camara;
  añoSeleccionado: number | null;
}

interface UseActasDataResult {
  actas: (ActaSenado | ActaDiputados)[] | undefined;
  todasActas: (ActaSenado | ActaDiputados)[] | undefined;
  isLoading: boolean;
}

export function useActasData({ camara, añoSeleccionado }: UseActasDataParams): UseActasDataResult {
  const currentYear = new Date().getFullYear();

  // Fetch all data for both chambers
  const { data: todasActasSenado, isLoading: loadingSenado } = useActasSenado();
  const { data: actasSenadoPorAño, isLoading: loadingSenadoAño } = useActasSenadoByYear(
    añoSeleccionado || currentYear
  );
  const { data: todasActasDiputados, isLoading: loadingDiputados } = useActasDiputados();
  const { data: actasDiputadosPorAño, isLoading: loadingDiputadosAño } = useActasDiputadosByYear(
    añoSeleccionado || currentYear
  );

  // Determine loading state based on chamber
  const isLoading =
    camara === 'senado'
      ? loadingSenado || loadingSenadoAño
      : loadingDiputados || loadingDiputadosAño;

  // Select actas based on chamber and year filter
  const actas =
    camara === 'senado'
      ? añoSeleccionado
        ? actasSenadoPorAño
        : todasActasSenado
      : añoSeleccionado
        ? actasDiputadosPorAño
        : todasActasDiputados;

  // Get all actas for the selected chamber (for stats and available years)
  const todasActas = camara === 'senado' ? todasActasSenado : todasActasDiputados;

  return {
    actas,
    todasActas,
    isLoading,
  };
}
