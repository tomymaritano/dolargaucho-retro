'use client';

import { useQuery } from '@tanstack/react-query';
import { useDolarQuery } from './useDolarQuery';
import { API_CONFIG } from '@/lib/config/api';
import { logger } from '@/lib/utils/logger';

export interface DolarWithVariation {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  moneda: string;
  fechaActualizacion: string;
  variation: {
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    previousValue?: number;
    currentValue: number;
    difference: number;
  };
}

interface HistoricalDolarData {
  casa: string;
  compra: number;
  venta: number;
  fecha: string;
}

/**
 * Hook que calcula las variaciones reales de los dólares
 * comparando el valor actual con el del día anterior (API ArgentinaData)
 */
export function useDolarVariations() {
  const { data: dolares, isLoading: loadingCurrent, error: errorCurrent } = useDolarQuery();

  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${String(yesterday.getDate()).padStart(2, '0')}`;

  // Fetch historical data for all casa types
  const casas = ['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta', 'mayorista', 'cripto'];

  const { data: historicalData, isLoading: loadingHistorical } = useQuery({
    queryKey: ['dolares-historical', yesterdayStr],
    queryFn: async (): Promise<Record<string, HistoricalDolarData>> => {
      const promises = casas.map(async (casa) => {
        try {
          const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.cotizacionDolarHistorica(casa, yesterdayStr)}`;
          const response = await fetch(url);

          if (!response.ok) {
            return null;
          }

          const data: HistoricalDolarData = await response.json();
          return { casa, data };
        } catch (error) {
          logger.error('Error fetching historical dolar data', error, {
            hook: 'useDolarVariations',
            casa,
          });
          return null;
        }
      });

      const results = await Promise.all(promises);

      const historicalMap: Record<string, HistoricalDolarData> = {};
      results.forEach((result) => {
        if (result && result.data) {
          historicalMap[result.casa] = result.data;
        }
      });

      return historicalMap;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - historical data doesn't change
    enabled: !!dolares, // Only fetch when we have current data
  });

  // Calculate variations
  const dolaresWithVariations: DolarWithVariation[] =
    dolares?.map((dolar) => {
      const historical = historicalData?.[dolar.casa];
      const currentValue = dolar.venta;

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
        ...dolar,
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
    data: dolaresWithVariations,
    isLoading: loadingCurrent || loadingHistorical,
    error: errorCurrent,
  };
}
