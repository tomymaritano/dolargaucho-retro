/**
 * Hook para obtener datos históricos de cotizaciones internacionales en un rango de días
 * Útil para sparklines y gráficos de tendencia
 * NOW USES: ArgentinaDataService with Axios interceptors ✨
 */

import { useQuery } from '@tanstack/react-query';
import { ArgentinaDataService } from '@/lib/api/argentinaData';
import { logger } from '@/lib/utils/logger';

export interface CotizacionHistoricoDataPoint {
  fecha: string;
  valor: number;
}

export interface CotizacionHistoricoRange {
  moneda: string;
  data: CotizacionHistoricoDataPoint[]; // Array ordenado por fecha ascendente
  latest: number; // Último valor
  oldest: number; // Primer valor
  change: number; // Cambio absoluto
  changePercent: number; // Cambio porcentual
}

interface HistoricalCotizacionResponse {
  casa: string;
  compra: number;
  venta: number;
  fecha: string;
}

/**
 * Hook para obtener datos históricos de UNA cotización en un rango de días
 *
 * @param moneda - Código de moneda (eur, brl, clp, uyu)
 * @param days - Número de días históricos (default: 7)
 * @param enabled - Si el query debe ejecutarse
 *
 * @example
 * const { data } = useCotizacionHistoricoRange('eur', 7);
 * // data.data = [{ fecha: '2025-01-01', valor: 1150 }, ...]
 */
export function useCotizacionHistoricoRange(
  moneda: string,
  days: number = 7,
  enabled: boolean = true
) {
  return useQuery<CotizacionHistoricoRange>({
    queryKey: ['cotizacion-historico-range', moneda, days],
    queryFn: async () => {
      const today = new Date();
      const promises: Promise<HistoricalCotizacionResponse | null>[] = [];

      // Crear array de fechas (últimos N días)
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const fechaStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

        // Use ArgentinaDataService with Axios (has interceptors)
        const promise = ArgentinaDataService.getCotizacionCurrencyHistorica(moneda, fechaStr)
          .then((data) => data)
          .catch(() => null);

        promises.push(promise);
      }

      const results = await Promise.all(promises);

      // Filtrar nulls y mapear a formato sparkline
      const dataPoints: CotizacionHistoricoDataPoint[] = results
        .filter((r): r is HistoricalCotizacionResponse => r !== null)
        .map((r) => ({
          fecha: r.fecha,
          valor: r.venta, // Usamos el precio de venta
        }));

      if (dataPoints.length === 0) {
        throw new Error(`No hay datos históricos para ${moneda.toUpperCase()}`);
      }

      const latest = dataPoints[dataPoints.length - 1].valor;
      const oldest = dataPoints[0].valor;
      const change = latest - oldest;
      const changePercent = (change / oldest) * 100;

      return {
        moneda: moneda.toUpperCase(),
        data: dataPoints,
        latest,
        oldest,
        change,
        changePercent,
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour - historical data doesn't change much
    enabled: enabled && !!moneda,
    retry: 2,
  });
}

/**
 * Hook para obtener datos históricos de MÚLTIPLES cotizaciones
 * Optimizado para obtener todos los tipos en paralelo
 *
 * @param monedas - Array de códigos de moneda (eur, brl, clp, uyu)
 * @param days - Número de días históricos (default: 7)
 * @param enabled - Si el query debe ejecutarse
 *
 * @example
 * const { data } = useMultipleCotizacionesHistoricoRange(['eur', 'brl', 'clp'], 7);
 * // data = { EUR: {...}, BRL: {...}, CLP: {...} }
 */
export function useMultipleCotizacionesHistoricoRange(
  monedas: string[],
  days: number = 7,
  enabled: boolean = true
) {
  return useQuery<Record<string, CotizacionHistoricoRange>>({
    queryKey: ['multiple-cotizacion-historico-range', monedas.sort().join(','), days],
    queryFn: async () => {
      const today = new Date();
      const result: Record<string, CotizacionHistoricoRange> = {};

      // Para cada moneda, obtener datos históricos
      const monedaPromises = monedas.map(async (moneda) => {
        const dayPromises: Promise<HistoricalCotizacionResponse | null>[] = [];

        // Para cada día
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const fechaStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

          // Use ArgentinaDataService with Axios (has interceptors)
          const promise = ArgentinaDataService.getCotizacionCurrencyHistorica(moneda, fechaStr)
            .then((data) => data)
            .catch((error) => {
              logger.error('Error fetching cotizacion historico', error, {
                moneda,
                fecha: fechaStr,
              });
              return null;
            });

          dayPromises.push(promise);
        }

        const dayResults = await Promise.all(dayPromises);

        // Filtrar nulls y mapear
        const dataPoints: CotizacionHistoricoDataPoint[] = dayResults
          .filter((r): r is HistoricalCotizacionResponse => r !== null)
          .map((r) => ({
            fecha: r.fecha,
            valor: r.venta,
          }));

        if (dataPoints.length > 0) {
          const latest = dataPoints[dataPoints.length - 1].valor;
          const oldest = dataPoints[0].valor;
          const change = latest - oldest;
          const changePercent = (change / oldest) * 100;

          result[moneda.toUpperCase()] = {
            moneda: moneda.toUpperCase(),
            data: dataPoints,
            latest,
            oldest,
            change,
            changePercent,
          };
        }
      });

      await Promise.all(monedaPromises);

      return result;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: enabled && monedas.length > 0,
    retry: 2,
  });
}
