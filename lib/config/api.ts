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

      // Other currencies endpoints
      cotizaciones: '/cotizaciones',
      cotizacionByType: (currency: string) => `/cotizaciones/${currency}`,
    },
  },

  // Argentina Datos API
  argentinaData: {
    baseUrl: 'https://api.argentinadatos.com/v1',
    endpoints: {
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

export const CACHE_CONFIG = {
  // Real-time data (30 seconds)
  dolar: {
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  },

  // Economic indices (1 hour)
  inflacion: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
  },
  riesgoPais: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
  },
  indiceUVA: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
  },

  // Interest rates (1 hour)
  tasas: {
    staleTime: 60 * 60 * 1000,
    refetchInterval: false,
  },

  // Investment funds (15 minutes)
  fci: {
    staleTime: 15 * 60 * 1000,
    refetchInterval: false,
  },

  // Political data (1 day)
  politica: {
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: false,
  },

  // Events (1 day)
  eventos: {
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: false,
  },
} as const;
