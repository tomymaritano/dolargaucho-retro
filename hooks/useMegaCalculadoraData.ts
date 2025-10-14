/**
 * Data fetching hook for MegaCalculadora
 * Consolidates all API data sources
 */

import { useMemo } from 'react';
import { useTasaPlazoFijo, useInflacionInteranual, useUltimaInflacion } from '@/hooks/useFinanzas';
import { useDolarByType } from '@/hooks/useDolarQuery';
import { useDolarHistorico } from '@/hooks/useDolarHistorico';

/**
 * Consolidated data for MegaCalculadora
 */
export interface MegaCalculadoraData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasas: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dolarBlue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dolarMEP: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inflacionData: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ultimaInflacion: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dolarHistorico: any[];
  isLoading: boolean;
}

/**
 * Hook to fetch all required data for MegaCalculadora
 */
export function useMegaCalculadoraData() {
  const fechaMesAnterior = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }, []);

  const { data: tasas, isLoading: loadingTasas } = useTasaPlazoFijo();
  const { data: dolarBlue, isLoading: loadingBlue } = useDolarByType('blue');
  const { data: dolarMEP, isLoading: loadingMEP } = useDolarByType('bolsa');
  const { data: inflacionData, isLoading: loadingInflacion } = useInflacionInteranual();
  const { data: ultimaInflacion, isLoading: loadingUltima } = useUltimaInflacion();
  const { data: dolarHistorico, isLoading: loadingHistorico } = useDolarHistorico(fechaMesAnterior);

  const isLoading =
    loadingTasas ||
    loadingBlue ||
    loadingMEP ||
    loadingInflacion ||
    loadingUltima ||
    loadingHistorico;

  return {
    tasas: tasas || [],
    dolarBlue,
    dolarMEP,
    inflacionData: inflacionData || [],
    ultimaInflacion,
    dolarHistorico: dolarHistorico || [],
    isLoading,
  };
}
