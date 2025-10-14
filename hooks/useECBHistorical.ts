import { useQuery } from '@tanstack/react-query';

/**
 * Hook para obtener datos históricos del Banco Central Europeo
 *
 * Utiliza la API de Frankfurter para obtener tasas de cambio históricas
 * del Euro contra múltiples monedas.
 */

export interface ECBHistoricalPoint {
  date: string;
  rate: number;
}

export interface ECBHistoricalData {
  currency: string;
  data: ECBHistoricalPoint[];
  latest: number;
  change: number;
  changePercent: number;
}

/**
 * Fetch historical exchange rates from ECB (via Frankfurter)
 * Gets last 12 months of data for specified currencies
 */
async function fetchECBHistorical(): Promise<Record<string, ECBHistoricalData>> {
  try {
    // Get date range (last 12 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    // Fetch historical data for main currencies
    const currencies = ['USD', 'ARS', 'GBP', 'JPY', 'CHF', 'BRL'];
    const response = await fetch(
      `https://api.frankfurter.app/${start}..${end}?from=EUR&to=${currencies.join(',')}`
    );

    if (!response.ok) {
      throw new Error(`ECB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform data into chart-friendly format
    const result: Record<string, ECBHistoricalData> = {};

    currencies.forEach((currency) => {
      const points: ECBHistoricalPoint[] = [];

      // Sort dates and extract data points
      Object.keys(data.rates || {})
        .sort()
        .forEach((date) => {
          if (data.rates[date]?.[currency]) {
            points.push({
              date,
              rate: data.rates[date][currency],
            });
          }
        });

      if (points.length > 0) {
        const latest = points[points.length - 1].rate;
        const previous = points.length > 1 ? points[points.length - 2].rate : latest;
        const change = latest - previous;
        const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

        result[currency] = {
          currency,
          data: points,
          latest,
          change,
          changePercent,
        };
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching ECB historical data:', error);
    throw error;
  }
}

/**
 * Hook para obtener datos históricos del ECB
 *
 * Retorna tasas de cambio históricas (últimos 12 meses) del Euro
 * contra las principales monedas.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useECBHistorical();
 *
 * if (data) {
 *   console.log('EUR/USD histórico:', data.USD.data);
 *   console.log('Último valor:', data.USD.latest);
 *   console.log('Cambio:', data.USD.changePercent);
 * }
 * ```
 */
export function useECBHistorical() {
  return useQuery({
    queryKey: ['ecb', 'historical'],
    queryFn: fetchECBHistorical,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    refetchInterval: 1000 * 60 * 60 * 12, // 12 hours
    retry: 2,
  });
}
