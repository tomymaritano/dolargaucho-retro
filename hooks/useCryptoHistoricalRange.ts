/**
 * Hook para obtener datos históricos de crypto en formato compatible con gráficos
 * Similar a useDolarHistoricoRange y useCotizacionHistoricoRange
 */

import { useQuery } from '@tanstack/react-query';
import { logger } from '@/lib/utils/logger';

export interface CryptoHistoricoDataPoint {
  fecha: string;
  valor: number;
}

export interface CryptoHistoricoRange {
  cryptoId: string;
  data: CryptoHistoricoDataPoint[]; // Array ordenado por fecha ascendente
  latest: number; // Último valor
  oldest: number; // Primer valor
  change: number; // Cambio absoluto
  changePercent: number; // Cambio porcentual
}

interface CoinGeckoMarketChartResponse {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Hook para obtener datos históricos de UNA crypto en un rango de días
 *
 * @param cryptoId - ID de CoinGecko (bitcoin, ethereum, etc.)
 * @param days - Número de días históricos (default: 30)
 * @param enabled - Si el query debe ejecutarse
 *
 * @example
 * const { data } = useCryptoHistoricoRange('bitcoin', 30);
 * // data.data = [{ fecha: '2025-01-01', valor: 45000 }, ...]
 */
export function useCryptoHistoricoRange(
  cryptoId: string,
  days: number = 30,
  enabled: boolean = true
) {
  return useQuery<CryptoHistoricoRange>({
    queryKey: ['crypto-historico-range', cryptoId, days],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
        );

        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const apiData: CoinGeckoMarketChartResponse = await response.json();

        // Convert CoinGecko format to our format and deduplicate by date
        const dataMap = new Map<string, number>();

        apiData.prices.forEach(([timestamp, price]) => {
          const fecha = new Date(timestamp).toISOString().split('T')[0];
          // Keep the last price for each date if there are duplicates
          dataMap.set(fecha, price);
        });

        // Convert map to array and sort by date ascending
        const data: CryptoHistoricoDataPoint[] = Array.from(dataMap.entries())
          .map(([fecha, valor]) => ({ fecha, valor }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        const latest = data[data.length - 1]?.valor || 0;
        const oldest = data[0]?.valor || 0;
        const change = latest - oldest;
        const changePercent = oldest !== 0 ? (change / oldest) * 100 : 0;

        logger.info('Crypto historical data fetched', {
          cryptoId,
          days,
          dataPoints: data.length,
          latest,
          changePercent: changePercent.toFixed(2),
        });

        return {
          cryptoId,
          data,
          latest,
          oldest,
          change,
          changePercent,
        };
      } catch (error) {
        logger.error('Error fetching crypto historical data', error, {
          cryptoId,
          days,
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: enabled && !!cryptoId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
