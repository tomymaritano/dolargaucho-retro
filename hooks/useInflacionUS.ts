import { useQuery } from '@tanstack/react-query';
import { logger } from '@/lib/utils/logger';

interface FREDObservation {
  date: string;
  value: string;
  realtime_start: string;
  realtime_end: string;
}

interface FREDResponse {
  observations: FREDObservation[];
}

interface InflacionUSData {
  fecha: string;
  valor: number; // CPI index value
}

/**
 * Hook para obtener datos de inflación estadounidense desde FRED API
 * Usa la serie CPIAUCSL (Consumer Price Index for All Urban Consumers)
 *
 * NOTA: Requiere API key de FRED (gratuita)
 * Para obtener una: https://fred.stlouisfed.org/docs/api/api_key.html
 */
export function useInflacionUS() {
  return useQuery<InflacionUSData[]>({
    queryKey: ['inflacion-us'],
    queryFn: async () => {
      // Check for API key in environment variables
      const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

      if (!apiKey) {
        console.warn('FRED API key not found. US inflation data will use fallback estimates.');
        return getFallbackUSInflation();
      }

      try {
        // Fetch CPI data from FRED API
        // CPIAUCSL = Consumer Price Index for All Urban Consumers: All Items
        const url = new URL('https://api.stlouisfed.org/fred/series/observations');
        url.searchParams.set('series_id', 'CPIAUCSL');
        url.searchParams.set('api_key', apiKey);
        url.searchParams.set('file_type', 'json');
        url.searchParams.set('observation_start', '2010-01-01'); // Last 15 years
        url.searchParams.set('frequency', 'm'); // Monthly
        url.searchParams.set('units', 'pc1'); // Percent change from year ago

        const response = await fetch(url.toString());

        if (!response.ok) {
          logger.error('FRED API error', new Error(response.statusText), { hook: 'useInflacionUS', status: response.status });
          return getFallbackUSInflation();
        }

        const data: FREDResponse = await response.json();

        // Transform to our format
        return data.observations
          .filter((obs) => obs.value !== '.' && !isNaN(parseFloat(obs.value)))
          .map((obs) => ({
            fecha: obs.date,
            valor: parseFloat(obs.value), // Already in percentage format
          }));
      } catch (error) {
        logger.error('Error fetching US inflation data', error, { hook: 'useInflacionUS' });
        return getFallbackUSInflation();
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 1,
  });
}

/**
 * Fallback: Datos aproximados de inflación US si la API falla
 * Basado en datos históricos del CPI estadounidense
 */
function getFallbackUSInflation(): InflacionUSData[] {
  // Inflación anual promedio de EE.UU. por año (aproximada)
  const annualInflation = [
    { year: 2010, rate: 1.6 },
    { year: 2011, rate: 3.1 },
    { year: 2012, rate: 2.1 },
    { year: 2013, rate: 1.5 },
    { year: 2014, rate: 1.6 },
    { year: 2015, rate: 0.1 },
    { year: 2016, rate: 1.3 },
    { year: 2017, rate: 2.1 },
    { year: 2018, rate: 2.4 },
    { year: 2019, rate: 1.8 },
    { year: 2020, rate: 1.2 },
    { year: 2021, rate: 4.7 },
    { year: 2022, rate: 8.0 },
    { year: 2023, rate: 4.1 },
    { year: 2024, rate: 2.9 },
    { year: 2025, rate: 2.9 }, // Estimated
  ];

  // Generar datos mensuales aproximados (dividir anual entre 12)
  const monthlyData: InflacionUSData[] = [];

  annualInflation.forEach(({ year, rate }) => {
    const monthlyRate = rate / 12; // Aproximación simple

    for (let month = 1; month <= 12; month++) {
      monthlyData.push({
        fecha: `${year}-${String(month).padStart(2, '0')}-01`,
        valor: monthlyRate,
      });
    }
  });

  return monthlyData;
}
