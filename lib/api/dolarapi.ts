/**
 * DolarAPI Client
 *
 * Dedicated client for DolarAPI.com
 * Documentation: https://dolarapi.com/docs
 */

import axios, { AxiosInstance } from 'axios';
import type { DolarQuotation, AllQuotations, DolarType, CurrencyType } from '@/types/api/dolar';
import { logger } from '@/lib/utils/logger';

const BASE_URL = 'https://dolarapi.com/v1';

/**
 * DolarAPI client instance
 * Separate from main apiClient for external API isolation
 */
export const dolarApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add logging interceptor
dolarApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('DolarAPI Error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

/**
 * DolarAPI Service
 * Type-safe methods for all DolarAPI endpoints
 */
export const DolarAPIService = {
  /**
   * Get all dollar quotations
   * GET /v1/dolares
   */
  async getAllDolares(): Promise<DolarQuotation[]> {
    const response = await dolarApiClient.get<DolarQuotation[]>('/dolares');
    return response.data;
  },

  /**
   * Get specific dollar type quotation
   * GET /v1/dolares/{type}
   *
   * @param type - Dollar type (oficial, blue, bolsa, etc.)
   */
  async getDolarByType(type: DolarType): Promise<DolarQuotation> {
    const response = await dolarApiClient.get<DolarQuotation>(`/dolares/${type}`);
    return response.data;
  },

  /**
   * Get all quotations (USD, EUR, BRL, etc.)
   * GET /v1/cotizaciones
   */
  async getAllCotizaciones(): Promise<AllQuotations[]> {
    const response = await dolarApiClient.get<AllQuotations[]>('/cotizaciones');
    return response.data;
  },

  /**
   * Get specific currency quotation
   * GET /v1/cotizaciones/{currency}
   *
   * @param currency - Currency type (eur, brl, etc.)
   */
  async getCotizacionByCurrency(currency: CurrencyType): Promise<AllQuotations> {
    const response = await dolarApiClient.get<AllQuotations>(`/cotizaciones/${currency}`);
    return response.data;
  },

  /**
   * Get historical dollar data by date
   * GET /v1/dolares?fecha={date}
   *
   * @param date - Date in YYYY-MM-DD format
   */
  async getDolarHistorico(date: string): Promise<DolarQuotation[]> {
    const response = await dolarApiClient.get<DolarQuotation[]>('/dolares', {
      params: { fecha: date },
    });
    return response.data;
  },

  /**
   * Get multiple dollar types
   * Utility function for fetching specific types in parallel
   *
   * @param types - Array of dollar types to fetch
   */
  async getMultipleDolares(types: DolarType[]): Promise<DolarQuotation[]> {
    const promises = types.map((type) => this.getDolarByType(type));
    return Promise.all(promises);
  },
};

export default DolarAPIService;
