/**
 * Finanzas Hooks - Tasas, FCI, Índices
 * Hooks para datos financieros de ArgentinaData API
 * NOW USES: ArgentinaDataService with Axios interceptors ✨
 */

import { useQuery } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/config/api';
import { ArgentinaDataService } from '@/lib/api/argentinaData';
import {
  InflacionMensualResponseSchema,
  InflacionInteranualResponseSchema,
  IndiceUVAResponseSchema,
  RiesgoPaisResponseSchema,
  TasaPlazoFijoResponseSchema,
  FondosComunesResponseSchema,
  validateAndParse,
} from '@/lib/schemas/api';
import { logger } from '@/lib/utils/logger';
import type {
  InflacionMensual,
  InflacionInteranual,
  IndiceUVA,
  RiesgoPais,
  TasaPlazoFijo,
  TasaDepositos,
  FondoComun,
  InflacionMensualResponse,
  InflacionInteranualResponse,
  IndiceUVAResponse,
  RiesgoPaisResponse,
  TasaPlazoFijoResponse,
  TasaDepositosResponse,
  FondosComunesResponse,
} from '@/types/api/argentina';

// =====================
// ÍNDICES ECONÓMICOS
// =====================

/**
 * Hook para obtener inflación mensual
 */
export function useInflacionMensual() {
  return useQuery<InflacionMensualResponse>({
    queryKey: ['inflacion-mensual'],
    queryFn: async () => {
      const startTime = performance.now();

      // Use ArgentinaDataService with Axios (has interceptors)
      const rawData = await ArgentinaDataService.getInflacion();

      const duration = performance.now() - startTime;

      // Validate with Zod
      const data = validateAndParse(
        InflacionMensualResponseSchema,
        rawData,
        'ArgentinaData /inflacion'
      );

      logger.info('✅ Inflación mensual fetched successfully', {
        duration: `${duration.toFixed(2)}ms`,
      });

      return data;
    },
    staleTime: CACHE_CONFIG.inflacion.staleTime,
    refetchInterval: CACHE_CONFIG.inflacion.refetchInterval,
    retry: CACHE_CONFIG.inflacion.retry,
    retryDelay: CACHE_CONFIG.inflacion.retryDelay,
  });
}

/**
 * Hook para obtener inflación interanual
 */
export function useInflacionInteranual() {
  return useQuery<InflacionInteranualResponse>({
    queryKey: ['inflacion-interanual'],
    queryFn: async () => {
      const startTime = performance.now();

      // Use ArgentinaDataService with Axios (has interceptors)
      const rawData = await ArgentinaDataService.getInflacionInteranual();

      const duration = performance.now() - startTime;

      // Validate with Zod
      const data = validateAndParse(
        InflacionInteranualResponseSchema,
        rawData,
        'ArgentinaData /inflacionInteranual'
      );

      logger.info('✅ Inflación interanual fetched successfully', {
        duration: `${duration.toFixed(2)}ms`,
      });

      return data;
    },
    staleTime: CACHE_CONFIG.inflacion.staleTime,
    retry: CACHE_CONFIG.inflacion.retry,
    retryDelay: CACHE_CONFIG.inflacion.retryDelay,
  });
}

/**
 * Hook para obtener última inflación mensual
 */
export function useUltimaInflacion() {
  return useQuery<InflacionMensual | null>({
    queryKey: ['ultima-inflacion'],
    queryFn: async () => {
      const data: InflacionMensualResponse = await ArgentinaDataService.getInflacion();
      return data.length > 0 ? data[data.length - 1] : null;
    },
    staleTime: CACHE_CONFIG.inflacion.staleTime,
  });
}

/**
 * Hook para obtener índice UVA
 */
export function useIndiceUVA() {
  return useQuery<IndiceUVAResponse>({
    queryKey: ['indice-uva'],
    queryFn: () => ArgentinaDataService.getIndiceUVA(),
    staleTime: CACHE_CONFIG.indiceUVA.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener último índice UVA
 */
export function useUltimoUVA() {
  return useQuery<IndiceUVA | null>({
    queryKey: ['ultimo-uva'],
    queryFn: async () => {
      const data: IndiceUVAResponse = await ArgentinaDataService.getIndiceUVA();
      return data.length > 0 ? data[data.length - 1] : null;
    },
    staleTime: CACHE_CONFIG.indiceUVA.staleTime,
  });
}

/**
 * Hook para obtener riesgo país
 */
export function useRiesgoPais() {
  return useQuery<RiesgoPaisResponse>({
    queryKey: ['riesgo-pais'],
    queryFn: () => ArgentinaDataService.getRiesgoPais(),
    staleTime: CACHE_CONFIG.riesgoPais.staleTime,
    refetchInterval: CACHE_CONFIG.riesgoPais.refetchInterval,
    retry: 3,
  });
}

/**
 * Hook para obtener último riesgo país
 */
export function useUltimoRiesgoPais() {
  return useQuery<RiesgoPais | null>({
    queryKey: ['ultimo-riesgo-pais'],
    queryFn: async () => {
      const data: RiesgoPaisResponse = await ArgentinaDataService.getRiesgoPais();
      return data.length > 0 ? data[data.length - 1] : null;
    },
    staleTime: CACHE_CONFIG.riesgoPais.staleTime,
  });
}

/**
 * Hook para obtener riesgo país con variación
 */
export function useRiesgoPaisWithVariation() {
  return useQuery<{
    current: RiesgoPais | null;
    previous: RiesgoPais | null;
    variation: {
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
    };
  }>({
    queryKey: ['riesgo-pais-variation'],
    queryFn: async () => {
      const data: RiesgoPaisResponse = await ArgentinaDataService.getRiesgoPais();

      const current = data.length > 0 ? data[data.length - 1] : null;
      const previous = data.length > 1 ? data[data.length - 2] : null;

      let percentage = 0;
      let trend: 'up' | 'down' | 'neutral' = 'neutral';

      if (current && previous && previous.valor !== 0) {
        percentage = ((current.valor - previous.valor) / previous.valor) * 100;
        trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';
      }

      return {
        current,
        previous,
        variation: {
          percentage: Math.abs(percentage),
          trend,
        },
      };
    },
    staleTime: CACHE_CONFIG.riesgoPais.staleTime,
    refetchInterval: CACHE_CONFIG.riesgoPais.refetchInterval,
  });
}

// =====================
// TASAS DE INTERÉS
// =====================

/**
 * Hook para obtener tasas de plazo fijo
 */
export function useTasaPlazoFijo() {
  return useQuery<TasaPlazoFijoResponse>({
    queryKey: ['tasa-plazo-fijo'],
    queryFn: () => ArgentinaDataService.getTasaPlazoFijo(),
    staleTime: CACHE_CONFIG.tasas.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener mejor tasa de plazo fijo (mayor TNA para clientes)
 */
export function useUltimaTasaPlazoFijo() {
  return useQuery<TasaPlazoFijo | null>({
    queryKey: ['ultima-tasa-plazo-fijo'],
    queryFn: async () => {
      const data: TasaPlazoFijoResponse = await ArgentinaDataService.getTasaPlazoFijo();
      if (data.length === 0) return null;

      // Devolver la entidad con mayor TNA para clientes
      return data.reduce((max, current) => {
        if (!current.tnaClientes) return max;
        if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
          return current;
        }
        return max;
      }, data[0]);
    },
    staleTime: CACHE_CONFIG.tasas.staleTime,
  });
}

/**
 * Hook para obtener tasas de depósitos a 30 días
 */
export function useTasaDepositos30() {
  return useQuery<TasaDepositosResponse>({
    queryKey: ['tasa-depositos-30'],
    queryFn: () => ArgentinaDataService.getTasaDepositos30(),
    staleTime: CACHE_CONFIG.tasas.staleTime,
    retry: 3,
  });
}

// =====================
// FONDOS COMUNES DE INVERSIÓN (FCI)
// =====================

/**
 * Hook para obtener fondos de mercado de dinero
 */
export function useFCIMercadoDinero(fecha?: string) {
  return useQuery<FondosComunesResponse>({
    queryKey: ['fci-mercado-dinero', fecha],
    queryFn: () => ArgentinaDataService.getFCIMercadoDinero(fecha),
    staleTime: CACHE_CONFIG.fci.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener fondos de renta variable
 */
export function useFCIRentaVariable(fecha?: string) {
  return useQuery<FondosComunesResponse>({
    queryKey: ['fci-renta-variable', fecha],
    queryFn: () => ArgentinaDataService.getFCIRentaVariable(fecha),
    staleTime: CACHE_CONFIG.fci.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener fondos de renta fija
 */
export function useFCIRentaFija(fecha?: string) {
  return useQuery<FondosComunesResponse>({
    queryKey: ['fci-renta-fija', fecha],
    queryFn: () => ArgentinaDataService.getFCIRentaFija(fecha),
    staleTime: CACHE_CONFIG.fci.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener fondos de renta mixta
 */
export function useFCIRentaMixta(fecha?: string) {
  return useQuery<FondosComunesResponse>({
    queryKey: ['fci-renta-mixta', fecha],
    queryFn: () => ArgentinaDataService.getFCIRentaMixta(fecha),
    staleTime: CACHE_CONFIG.fci.staleTime,
    retry: 3,
  });
}

/**
 * Hook para obtener otros fondos
 */
export function useFCIOtros(fecha?: string) {
  return useQuery<FondosComunesResponse>({
    queryKey: ['fci-otros', fecha],
    queryFn: () => ArgentinaDataService.getFCIOtros(fecha),
    staleTime: CACHE_CONFIG.fci.staleTime,
    retry: 3,
  });
}

// =====================
// UTILITIES
// =====================

/**
 * Hook para obtener resumen de todos los índices económicos
 */
export function useResumenIndices() {
  const { data: inflacion } = useUltimaInflacion();
  const { data: uva } = useUltimoUVA();
  const { data: riesgoPais } = useUltimoRiesgoPais();

  return useQuery({
    queryKey: ['resumen-indices', inflacion, uva, riesgoPais],
    queryFn: () => {
      return {
        inflacion: inflacion?.valor ?? null,
        uva: uva?.valor ?? null,
        riesgoPais: riesgoPais?.valor ?? null,
      };
    },
    enabled: !!inflacion || !!uva || !!riesgoPais,
  });
}

/**
 * Hook para obtener todos los FCI de todas las categorías
 */
export function useAllFCI(fecha?: string) {
  const mercadoDinero = useFCIMercadoDinero(fecha);
  const rentaVariable = useFCIRentaVariable(fecha);
  const rentaFija = useFCIRentaFija(fecha);
  const rentaMixta = useFCIRentaMixta(fecha);
  const otros = useFCIOtros(fecha);

  return useQuery({
    queryKey: ['all-fci', fecha],
    queryFn: () => {
      const allFunds: FondoComun[] = [];

      if (mercadoDinero.data) allFunds.push(...mercadoDinero.data);
      if (rentaVariable.data) allFunds.push(...rentaVariable.data);
      if (rentaFija.data) allFunds.push(...rentaFija.data);
      if (rentaMixta.data) allFunds.push(...rentaMixta.data);
      if (otros.data) allFunds.push(...otros.data);

      return allFunds;
    },
    enabled:
      mercadoDinero.isSuccess ||
      rentaVariable.isSuccess ||
      rentaFija.isSuccess ||
      rentaMixta.isSuccess ||
      otros.isSuccess,
  });
}
