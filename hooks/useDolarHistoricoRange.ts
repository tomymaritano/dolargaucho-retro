/**
 * Hook para obtener datos históricos de dólares en un rango de días
 * Útil para sparklines y gráficos de tendencia
 */

import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config/api';
import { logger } from '@/lib/utils/logger';

export interface DolarHistoricoDataPoint {
  fecha: string;
  valor: number;
}

export interface DolarHistoricoRange {
  casa: string;
  data: DolarHistoricoDataPoint[]; // Array ordenado por fecha ascendente
  latest: number; // Último valor
  oldest: number; // Primer valor
  change: number; // Cambio absoluto
  changePercent: number; // Cambio porcentual
}

interface HistoricalDolarResponse {
  casa: string;
  compra: number;
  venta: number;
  fecha: string;
}

/**
 * Hook para obtener datos históricos de UN tipo de dólar en un rango de días
 *
 * @param casa - Tipo de dólar (blue, oficial, etc.)
 * @param days - Número de días históricos (default: 7)
 * @param enabled - Si el query debe ejecutarse
 *
 * @example
 * const { data } = useDolarHistoricoRange('blue', 7);
 * // data.data = [{ fecha: '2025-01-01', valor: 1000 }, ...]
 */
export function useDolarHistoricoRange(casa: string, days: number = 7, enabled: boolean = true) {
  return useQuery<DolarHistoricoRange>({
    queryKey: ['dolar-historico-range', casa, days],
    queryFn: async () => {
      const today = new Date();
      const promises: Promise<HistoricalDolarResponse | null>[] = [];

      // Crear array de fechas (últimos N días)
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const fechaStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

        const promise = fetch(
          `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.cotizacionDolarHistorica(casa, fechaStr)}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);

        promises.push(promise);
      }

      const results = await Promise.all(promises);

      // Filtrar nulls y mapear a formato sparkline
      const dataPoints: DolarHistoricoDataPoint[] = results
        .filter((r): r is HistoricalDolarResponse => r !== null)
        .map((r) => ({
          fecha: r.fecha,
          valor: r.venta, // Usamos el precio de venta
        }));

      if (dataPoints.length === 0) {
        throw new Error(`No hay datos históricos para ${casa}`);
      }

      const latest = dataPoints[dataPoints.length - 1].valor;
      const oldest = dataPoints[0].valor;
      const change = latest - oldest;
      const changePercent = (change / oldest) * 100;

      return {
        casa,
        data: dataPoints,
        latest,
        oldest,
        change,
        changePercent,
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour - historical data doesn't change much
    enabled: enabled && !!casa,
    retry: 2,
  });
}

/**
 * Hook para obtener datos históricos de MÚLTIPLES tipos de dólar
 * Optimizado para obtener todos los tipos en paralelo
 *
 * @param casas - Array de tipos de dólar
 * @param days - Número de días históricos (default: 7)
 * @param enabled - Si el query debe ejecutarse
 *
 * @example
 * const { data } = useMultipleDolarHistoricoRange(['blue', 'oficial', 'mep'], 7);
 * // data = { blue: {...}, oficial: {...}, mep: {...} }
 */
export function useMultipleDolarHistoricoRange(
  casas: string[],
  days: number = 7,
  enabled: boolean = true
) {
  return useQuery<Record<string, DolarHistoricoRange>>({
    queryKey: ['multiple-dolar-historico-range', casas.sort().join(','), days],
    queryFn: async () => {
      const today = new Date();
      const result: Record<string, DolarHistoricoRange> = {};

      // Para cada casa, obtener datos históricos
      const casaPromises = casas.map(async (casa) => {
        const dayPromises: Promise<HistoricalDolarResponse | null>[] = [];

        // Para cada día
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const fechaStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

          const promise = fetch(
            `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.cotizacionDolarHistorica(casa, fechaStr)}`
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch((error) => {
              logger.error('Error fetching dolar historico', error, { casa, fecha: fechaStr });
              return null;
            });

          dayPromises.push(promise);
        }

        const dayResults = await Promise.all(dayPromises);

        // Filtrar nulls y mapear
        const dataPoints: DolarHistoricoDataPoint[] = dayResults
          .filter((r): r is HistoricalDolarResponse => r !== null)
          .map((r) => ({
            fecha: r.fecha,
            valor: r.venta,
          }));

        if (dataPoints.length > 0) {
          const latest = dataPoints[dataPoints.length - 1].valor;
          const oldest = dataPoints[0].valor;
          const change = latest - oldest;
          const changePercent = (change / oldest) * 100;

          result[casa] = {
            casa,
            data: dataPoints,
            latest,
            oldest,
            change,
            changePercent,
          };
        }
      });

      await Promise.all(casaPromises);

      return result;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: enabled && casas.length > 0,
    retry: 2,
  });
}
