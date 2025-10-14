'use client';

import { useQuery } from '@tanstack/react-query';
import { CurrencyQuotation, CurrencyType } from '@/types/api/dolar';
import { API_CONFIG } from '@/lib/config/api';
import { CurrencyQuotationsSchema, validateAndParse } from '@/lib/schemas/api';
import { logger } from '@/lib/utils/logger';

export interface CotizacionWithVariation extends CurrencyQuotation {
  variation: {
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    previousValue?: number;
    currentValue: number;
    difference: number;
  };
}

interface HistoricalCurrencyData {
  casa: string;
  compra: number;
  venta: number;
  fecha: string;
}

/**
 * Hook to fetch all currency quotations (EUR, BRL, CLP, UYU)
 * Uses TanStack Query for automatic caching, refetching, and state management
 *
 * Features:
 * - Auto-refetch every 30 seconds
 * - Data is cached for 30 seconds
 * - Automatic retries on failure
 * - Zod validation for API responses
 * - Structured logging
 *
 * @example
 * const { data, isLoading, error } = useCotizaciones();
 */
export function useCotizaciones() {
  return useQuery({
    queryKey: ['cotizaciones'],
    queryFn: async (): Promise<CurrencyQuotation[]> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.cotizaciones}`;
      const startTime = performance.now();

      logger.api.request(url, 'GET');

      const response = await fetch(url);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        logger.api.error(url, new Error(`HTTP ${response.status}`));
        throw new Error('Error al obtener cotizaciones');
      }

      const rawData = await response.json();
      const data = validateAndParse(CurrencyQuotationsSchema, rawData, 'DolarAPI /cotizaciones');

      logger.api.response(url, response.status, duration);

      return data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to fetch a specific currency quotation
 *
 * @param currency - Currency type (eur, brl, clp, uyu)
 *
 * @example
 * const { data: euro } = useCotizacionByType('eur');
 */
export function useCotizacionByType(currency: CurrencyType) {
  return useQuery({
    queryKey: ['cotizacion', currency],
    queryFn: async (): Promise<CurrencyQuotation> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}/cotizaciones/${currency}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener cotización ${currency.toUpperCase()}`);
      }

      return response.json();
    },
    enabled: !!currency,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

/**
 * Convenience hooks for specific currencies
 */
export function useEuro() {
  return useCotizacionByType('eur');
}

export function useReal() {
  return useCotizacionByType('brl');
}

export function usePesoChileno() {
  return useCotizacionByType('clp');
}

export function usePesoUruguayo() {
  return useCotizacionByType('uyu');
}

/**
 * Hook que calcula las variaciones reales de las cotizaciones internacionales
 * comparando el valor actual con el del día anterior (API ArgentinaData)
 */
export function useCotizacionesWithVariations() {
  const { data: cotizaciones, isLoading: loadingCurrent, error: errorCurrent } = useCotizaciones();

  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${String(yesterday.getDate()).padStart(2, '0')}`;

  // Currency codes that ArgentinaData uses
  const currencies = ['eur', 'brl', 'clp', 'uyu'];

  const { data: historicalData, isLoading: loadingHistorical } = useQuery({
    queryKey: ['cotizaciones-historical', yesterdayStr],
    queryFn: async (): Promise<Record<string, HistoricalCurrencyData>> => {
      const promises = currencies.map(async (currency) => {
        try {
          const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.cotizacionCurrencyHistorica(currency, yesterdayStr)}`;
          const response = await fetch(url);

          if (!response.ok) {
            return null;
          }

          const data: HistoricalCurrencyData = await response.json();
          return { currency, data };
        } catch (error) {
          logger.error('Error fetching historical currency data', error, { hook: 'useCotizacionesWithVariations', currency });
          return null;
        }
      });

      const results = await Promise.all(promises);

      const historicalMap: Record<string, HistoricalCurrencyData> = {};
      results.forEach((result) => {
        if (result && result.data) {
          historicalMap[result.currency] = result.data;
        }
      });

      return historicalMap;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - historical data doesn't change
    enabled: !!cotizaciones, // Only fetch when we have current data
  });

  // Calculate variations
  const cotizacionesWithVariations: CotizacionWithVariation[] = cotizaciones?.map((cotizacion) => {
    // Map moneda to currency code (EUR -> eur, BRL -> brl, etc)
    const currencyCode = cotizacion.moneda.toLowerCase();
    const historical = historicalData?.[currencyCode];
    const currentValue = cotizacion.venta;

    let percentage = 0;
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    let previousValue: number | undefined = undefined;
    let difference = 0;

    if (historical && historical.venta) {
      previousValue = historical.venta;

      if (previousValue !== currentValue) {
        difference = currentValue - previousValue;
        percentage = (difference / previousValue) * 100;
        trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';
      }
    }

    return {
      ...cotizacion,
      variation: {
        percentage: Math.abs(percentage),
        trend,
        previousValue,
        currentValue,
        difference: Math.abs(difference),
      },
    };
  }) || [];

  return {
    data: cotizacionesWithVariations,
    isLoading: loadingCurrent || loadingHistorical,
    error: errorCurrent,
  };
}
