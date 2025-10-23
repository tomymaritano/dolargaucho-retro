/**
 * Argentina Datos API Client
 *
 * Dedicated client for api.argentinadatos.com
 * Provides data for:
 * - Historical quotations
 * - Political data (senators, deputies, actas)
 * - Economic indices (inflation, UVA, risk country)
 * - Financial rates
 * - Investment funds (FCI)
 * - Events (holidays)
 */

import axios, { AxiosInstance } from 'axios';
import type {
  ActaSenado,
  ActaDiputados,
  Senador,
  Diputado,
  BloqueStats,
} from '@/types/api/argentina';
import { logger } from '@/lib/utils/logger';

const BASE_URL = 'https://api.argentinadatos.com/v1';

/**
 * Argentina Data API client instance
 * Separate from main apiClient for external API isolation
 */
export const argentinaDataClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add logging interceptor
argentinaDataClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('Argentina Data API Error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

/**
 * Argentina Data API Service
 * Type-safe methods for all endpoints
 */
export const ArgentinaDataService = {
  // ============================================================================
  // POLÍTICA - SENADO
  // ============================================================================

  /**
   * Get all senators
   * GET /senado/senadores
   */
  async getSenadores(): Promise<Senador[]> {
    const response = await argentinaDataClient.get<Senador[]>('/senado/senadores');
    return response.data;
  },

  /**
   * Get all senate actas
   * GET /senado/actas
   */
  async getActasSenado(): Promise<ActaSenado[]> {
    const response = await argentinaDataClient.get<ActaSenado[]>('/senado/actas');
    return response.data;
  },

  /**
   * Get senate actas by year
   * GET /senado/actas/{year}
   */
  async getActasSenadoByYear(year: number): Promise<ActaSenado[]> {
    const response = await argentinaDataClient.get<ActaSenado[]>(`/senado/actas/${year}`);
    return response.data;
  },

  // ============================================================================
  // POLÍTICA - DIPUTADOS
  // ============================================================================

  /**
   * Get all deputies
   * GET /diputados/diputados
   */
  async getDiputados(): Promise<Diputado[]> {
    const response = await argentinaDataClient.get<Diputado[]>('/diputados/diputados');
    return response.data;
  },

  /**
   * Get all deputies actas
   * GET /diputados/actas
   */
  async getActasDiputados(): Promise<ActaDiputados[]> {
    const response = await argentinaDataClient.get<ActaDiputados[]>('/diputados/actas');
    return response.data;
  },

  /**
   * Get deputies actas by year
   * GET /diputados/actas/{year}
   */
  async getActasDiputadosByYear(year: number): Promise<ActaDiputados[]> {
    const response = await argentinaDataClient.get<ActaDiputados[]>(`/diputados/actas/${year}`);
    return response.data;
  },

  /**
   * Get political block statistics
   * Aggregates data from senators and deputies
   */
  async getBloqueStats(): Promise<BloqueStats[]> {
    const [senadores, diputados] = await Promise.all([this.getSenadores(), this.getDiputados()]);

    const bloqueMap = new Map<string, BloqueStats>();

    // Count senators
    senadores.forEach((senador) => {
      const current = bloqueMap.get(senador.bloque) || {
        bloque: senador.bloque,
        senadores: 0,
        diputados: 0,
        total: 0,
      };
      current.senadores++;
      current.total++;
      bloqueMap.set(senador.bloque, current);
    });

    // Count deputies
    diputados.forEach((diputado) => {
      const current = bloqueMap.get(diputado.bloque) || {
        bloque: diputado.bloque,
        senadores: 0,
        diputados: 0,
        total: 0,
      };
      current.diputados++;
      current.total++;
      bloqueMap.set(diputado.bloque, current);
    });

    return Array.from(bloqueMap.values());
  },

  // ============================================================================
  // FINANZAS - ÍNDICES
  // ============================================================================

  /**
   * Get inflation data
   * GET /finanzas/indices/inflacion
   */
  async getInflacion(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/indices/inflacion');
    return response.data;
  },

  /**
   * Get year-over-year inflation
   * GET /finanzas/indices/inflacionInteranual
   */
  async getInflacionInteranual(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/indices/inflacionInteranual');
    return response.data;
  },

  /**
   * Get UVA index
   * GET /finanzas/indices/uva
   */
  async getIndiceUVA(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/indices/uva');
    return response.data;
  },

  /**
   * Get country risk
   * GET /finanzas/indices/riesgo-pais
   */
  async getRiesgoPais(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/indices/riesgo-pais');
    return response.data;
  },

  // ============================================================================
  // FINANZAS - TASAS
  // ============================================================================

  /**
   * Get fixed term deposit rate
   * GET /finanzas/tasas/plazoFijo
   */
  async getTasaPlazoFijo(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/tasas/plazoFijo');
    return response.data;
  },

  /**
   * Get 30-day deposit rate
   * GET /finanzas/tasas/depositos30Dias
   */
  async getTasaDepositos30(): Promise<any> {
    const response = await argentinaDataClient.get('/finanzas/tasas/depositos30Dias');
    return response.data;
  },

  // ============================================================================
  // FINANZAS - FCI (Fondos Comunes de Inversión)
  // ============================================================================

  /**
   * Get money market funds
   * GET /finanzas/fci/mercadoDinero/{date?}
   */
  async getFCIMercadoDinero(date?: string): Promise<any> {
    const endpoint = date
      ? `/finanzas/fci/mercadoDinero/${date}`
      : '/finanzas/fci/mercadoDinero/ultimo';
    const response = await argentinaDataClient.get(endpoint);
    return response.data;
  },

  /**
   * Get variable income funds
   * GET /finanzas/fci/rentaVariable/{date?}
   */
  async getFCIRentaVariable(date?: string): Promise<any> {
    const endpoint = date
      ? `/finanzas/fci/rentaVariable/${date}`
      : '/finanzas/fci/rentaVariable/ultimo';
    const response = await argentinaDataClient.get(endpoint);
    return response.data;
  },

  /**
   * Get fixed income funds
   * GET /finanzas/fci/rentaFija/{date?}
   */
  async getFCIRentaFija(date?: string): Promise<any> {
    const endpoint = date ? `/finanzas/fci/rentaFija/${date}` : '/finanzas/fci/rentaFija/ultimo';
    const response = await argentinaDataClient.get(endpoint);
    return response.data;
  },

  /**
   * Get mixed income funds
   * GET /finanzas/fci/rentaMixta/{date?}
   */
  async getFCIRentaMixta(date?: string): Promise<any> {
    const endpoint = date ? `/finanzas/fci/rentaMixta/${date}` : '/finanzas/fci/rentaMixta/ultimo';
    const response = await argentinaDataClient.get(endpoint);
    return response.data;
  },

  /**
   * Get other funds
   * GET /finanzas/fci/otros/{date?}
   */
  async getFCIOtros(date?: string): Promise<any> {
    const endpoint = date ? `/finanzas/fci/otros/${date}` : '/finanzas/fci/otros/ultimo';
    const response = await argentinaDataClient.get(endpoint);
    return response.data;
  },

  // ============================================================================
  // EVENTOS
  // ============================================================================

  /**
   * Get holidays
   * GET /feriados
   */
  async getFeriados(): Promise<any> {
    const response = await argentinaDataClient.get('/feriados');
    return response.data;
  },

  // ============================================================================
  // COTIZACIONES HISTÓRICAS
  // ============================================================================

  /**
   * Get historical dollar quotation
   * GET /cotizaciones/dolares/{casa}/{fecha}
   */
  async getCotizacionDolarHistorica(casa: string, fecha: string): Promise<any> {
    const response = await argentinaDataClient.get(`/cotizaciones/dolares/${casa}/${fecha}/`);
    return response.data;
  },

  /**
   * Get historical currency quotation
   * GET /cotizaciones/{currency}/{fecha}
   */
  async getCotizacionCurrencyHistorica(currency: string, fecha: string): Promise<any> {
    const response = await argentinaDataClient.get(`/cotizaciones/${currency}/${fecha}/`);
    return response.data;
  },
};

export default ArgentinaDataService;
