/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

export const API_CONFIG = {
  // DolarAPI
  dolarAPI: {
    baseUrl: 'https://dolarapi.com/v1',
    endpoints: {
      // Dollar endpoints
      dolares: '/dolares',
      dolarByType: (type: string) => `/dolares/${type}`,
      dolarHistorico: (fecha: string) => `/dolares?fecha=${fecha}`,

      // Other currencies endpoints
      cotizaciones: '/cotizaciones',
      cotizacionByType: (currency: string) => `/cotizaciones/${currency}`,
    },
  },

  // Argentina Datos API
  argentinaData: {
    baseUrl: 'https://api.argentinadatos.com/v1',
    endpoints: {
      // Cotizaciones Históricas
      cotizacionDolarHistorica: (casa: string, fecha: string) =>
        `/cotizaciones/dolares/${casa}/${fecha}/`,
      cotizacionCurrencyHistorica: (currency: string, fecha: string) =>
        `/cotizaciones/${currency}/${fecha}/`,

      // Política - Senado
      senadores: '/senado/senadores',
      actasSenado: '/senado/actas',
      actasSenadoByYear: (year: number) => `/senado/actas/${year}`,

      // Política - Diputados
      diputados: '/diputados/diputados',
      actasDiputados: '/diputados/actas',
      actasDiputadosByYear: (year: number) => `/diputados/actas/${year}`,

      // Finanzas - Índices
      inflacion: '/finanzas/indices/inflacion',
      inflacionInteranual: '/finanzas/indices/inflacionInteranual',
      indiceUVA: '/finanzas/indices/uva',
      riesgoPais: '/finanzas/indices/riesgo-pais',

      // Finanzas - Tasas
      tasaPlazoFijo: '/finanzas/tasas/plazoFijo',
      tasaDepositos30: '/finanzas/tasas/depositos30Dias',

      // Finanzas - FCI
      fciMercadoDinero: (fecha?: string) =>
        fecha ? `/finanzas/fci/mercadoDinero/${fecha}` : '/finanzas/fci/mercadoDinero/ultimo',
      fciRentaVariable: (fecha?: string) =>
        fecha ? `/finanzas/fci/rentaVariable/${fecha}` : '/finanzas/fci/rentaVariable/ultimo',
      fciRentaFija: (fecha?: string) =>
        fecha ? `/finanzas/fci/rentaFija/${fecha}` : '/finanzas/fci/rentaFija/ultimo',
      fciRentaMixta: (fecha?: string) =>
        fecha ? `/finanzas/fci/rentaMixta/${fecha}` : '/finanzas/fci/rentaMixta/ultimo',
      fciOtros: (fecha?: string) =>
        fecha ? `/finanzas/fci/otros/${fecha}` : '/finanzas/fci/otros/ultimo',

      // Eventos
      feriados: '/feriados',
    },
  },

  // Internal API
  internal: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    endpoints: {
      news: {
        analyze: '/news/analyze',
      },
      documents: {
        upload: '/documents/upload',
        list: '/documents',
        download: (id: string) => `/documents/${id}/download`,
      },
    },
  },
} as const;

/**
 * APIs oficiales deprecadas o no disponibles
 * Mantenidas solo como referencia histórica
 *
 * NOTA: ArgentinaDatos agrega datos de estas fuentes oficiales
 * y provee una API más estable y confiable.
 */
export const DEPRECATED_APIS = {
  // BCRA API Oficial v2 (DEPRECADA desde 2024)
  bcraOficial: {
    baseUrl: 'https://api.bcra.gob.ar',
    status: 'deprecated',
    reason: 'API v2 deprecada por BCRA',
    alternative: 'Usar argentinaData para datos del BCRA',
  },

  // INDEC API Oficial (NO DISPONIBLE)
  indecOficial: {
    baseUrl: 'https://apis.datos.gob.ar/series/api',
    status: 'unavailable',
    reason: 'Error 502 - servidor no responde',
    alternative: 'Usar argentinaData para datos del INDEC',
  },
} as const;

/**
 * Retry configuration for TanStack Query
 * Implements exponential backoff strategy
 */
export const RETRY_CONFIG = {
  // Maximum number of retry attempts
  maxRetries: 3,

  // Exponential backoff function
  retryDelay: (attemptIndex: number) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },

  // Determine if error should be retried
  shouldRetry: (failureCount: number, error: unknown) => {
    // Don't retry on 4xx errors (client errors)
    if (error instanceof Error && error.message.includes('HTTP 4')) {
      return false;
    }

    // Retry on network errors and 5xx server errors
    return failureCount < 3;
  },
} as const;

export const CACHE_CONFIG = {
  // Real-time data (30 seconds)
  dolar: {
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },

  // Economic indices (1 hour)
  inflacion: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },
  riesgoPais: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },
  indiceUVA: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },

  // Interest rates (1 hour)
  tasas: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },

  // Investment funds (15 minutes)
  fci: {
    staleTime: 15 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },

  // Political data (1 day)
  politica: {
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },

  // Events (1 day)
  eventos: {
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: false,
    retry: RETRY_CONFIG.maxRetries,
    retryDelay: RETRY_CONFIG.retryDelay,
  },
} as const;
