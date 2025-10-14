import { useQuery } from '@tanstack/react-query';

/**
 * Tipo de cambio del Euro desde el Banco Central Europeo (ECB)
 * API oficial: https://www.ecb.europa.eu/stats/eurofxref/
 */

export interface ECBRate {
  currency: string;
  rate: number;
}

export interface ECBData {
  base: string; // 'EUR'
  date: string; // Fecha de actualización
  rates: {
    USD: number;
    ARS: number;
    GBP: number;
    JPY: number;
    CHF: number;
    // ... otras monedas
    [key: string]: number;
  };
}

/**
 * Fetch exchange rates from European Central Bank
 * Free API, no key required
 */
async function fetchECBRates(): Promise<ECBData> {
  try {
    // ECB provides daily reference rates
    // https://data.ecb.europa.eu/help/api/data
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=EUR'
    );

    if (!response.ok) {
      throw new Error(`ECB API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      base: data.base,
      date: data.date,
      rates: data.rates,
    };
  } catch (error) {
    console.error('Error fetching ECB rates:', error);
    throw error;
  }
}

/**
 * Hook para obtener tipos de cambio del Euro (ECB oficial)
 *
 * Retorna los tipos de cambio del Euro contra múltiples monedas
 * desde la fuente oficial del Banco Central Europeo.
 *
 * La API se actualiza diariamente alrededor de las 16:00 CET.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useECBRates();
 *
 * if (data) {
 *   console.log(`EUR/USD: ${data.rates.USD}`);
 *   console.log(`EUR/ARS: ${data.rates.ARS}`);
 * }
 * ```
 */
export function useECBRates() {
  return useQuery({
    queryKey: ['ecb', 'rates'],
    queryFn: fetchECBRates,
    staleTime: 1000 * 60 * 60, // 1 hour - ECB updates once daily
    refetchInterval: 1000 * 60 * 60 * 6, // Refetch every 6 hours
    retry: 2,
  });
}

/**
 * Hook simplificado para obtener solo EUR/USD
 */
export function useEURUSD() {
  const { data, isLoading, error } = useECBRates();

  return {
    rate: data?.rates.USD ?? null,
    date: data?.date ?? null,
    isLoading,
    error,
  };
}

/**
 * Hook para obtener EUR/ARS (Euro a Peso Argentino)
 */
export function useEURARS() {
  const { data, isLoading, error } = useECBRates();

  return {
    rate: data?.rates.ARS ?? null,
    date: data?.date ?? null,
    isLoading,
    error,
  };
}

/**
 * Calcular tipo de cambio EUR/moneda específica
 */
export function useEURRate(currency: string) {
  const { data, isLoading, error } = useECBRates();

  return {
    rate: data?.rates[currency.toUpperCase()] ?? null,
    date: data?.date ?? null,
    isLoading,
    error,
  };
}
