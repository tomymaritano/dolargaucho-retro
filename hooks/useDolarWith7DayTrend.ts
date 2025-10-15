'use client';

import { useMemo } from 'react';
import { useDolarVariations } from './useDolarVariations';
import { useMultipleDolarHistoricoRange } from './useDolarHistoricoRange';

/**
 * Extended dolar data with both 24h and 7-day trends
 */
export interface DolarWithTrends {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  moneda: string;
  fechaActualizacion: string;
  variation24h: {
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    previousValue?: number;
    currentValue: number;
    difference: number;
  };
  variation7d: {
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    change: number;
    oldestValue?: number;
    latestValue: number;
  };
}

/**
 * Hook que combina datos actuales de dólares con tendencias de 24h y 7 días
 *
 * @example
 * const { data, isLoading } = useDolarWith7DayTrend();
 * // data[0].variation24h.percentage = 2.5
 * // data[0].variation7d.percentage = 8.3
 */
export function useDolarWith7DayTrend() {
  // Get current data with 24h variations
  const { data: dolaresWithDaily, isLoading: loadingDaily, error } = useDolarVariations();

  // Get 7-day historical data for all casas
  const casas = ['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta', 'mayorista', 'cripto'];
  const { data: historicalWeek, isLoading: loadingWeek } = useMultipleDolarHistoricoRange(
    casas,
    7,
    !!dolaresWithDaily
  );

  // Combine both datasets
  const dolaresWithTrends: DolarWithTrends[] = useMemo(() => {
    if (!dolaresWithDaily) return [];

    return dolaresWithDaily.map((dolar) => {
      const weekData = historicalWeek?.[dolar.casa];

      // Calculate 7-day variation
      let variation7d: {
        percentage: number;
        trend: 'up' | 'down' | 'neutral';
        change: number;
        oldestValue: number | undefined;
        latestValue: number;
      };

      if (weekData && weekData.data.length >= 2) {
        const changePercent = weekData.changePercent;
        const trend: 'up' | 'down' | 'neutral' =
          changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral';

        variation7d = {
          percentage: Math.abs(changePercent),
          trend,
          change: Math.abs(weekData.change),
          oldestValue: weekData.oldest,
          latestValue: weekData.latest,
        };
      } else {
        // Default if no historical data
        variation7d = {
          percentage: 0,
          trend: 'neutral',
          change: 0,
          oldestValue: undefined,
          latestValue: dolar.venta,
        };
      }

      return {
        ...dolar,
        variation24h: dolar.variation,
        variation7d,
      };
    });
  }, [dolaresWithDaily, historicalWeek]);

  return {
    data: dolaresWithTrends,
    isLoading: loadingDaily || loadingWeek,
    error,
  };
}
