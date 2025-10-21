import { useQuery } from '@tanstack/react-query';
import type { CryptoData } from '@/types/api/crypto';
import { logger } from '@/lib/utils/logger';

/**
 * Hook para obtener datos de criptomonedas desde CoinGecko API
 * Ahora con soporte para paginación
 *
 * @param page - Número de página (default: 1)
 * @param perPage - Cantidad de resultados por página (default: 50, max: 250)
 */
export function useCryptoQuery(page: number = 1, perPage: number = 50) {
  return useQuery<CryptoData[]>({
    queryKey: ['crypto', 'list', page, perPage],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d,30d&sparkline_days=30`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        logger.info('Crypto data fetched successfully', {
          count: data.length,
          page,
          perPage,
        });
        return data;
      } catch (error) {
        logger.error('Error fetching crypto data', error, {
          source: 'useCryptoQuery',
          page,
          perPage,
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - Los precios de crypto no necesitan actualizarse cada 30s
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos (menos agresivo)
    refetchOnWindowFocus: false, // No refetch al volver a la pestaña (reduce llamadas innecesarias)
    refetchOnMount: false, // Solo refetch si los datos están stale
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obtener datos de una criptomoneda específica
 */
export function useCryptoById(cryptoId: string) {
  return useQuery<CryptoData>({
    queryKey: ['crypto', cryptoId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoId}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d,30d`
        );

        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return data[0];
      } catch (error) {
        logger.error('Error fetching crypto by id', error, { cryptoId });
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: !!cryptoId,
  });
}

/**
 * Hook para obtener precios en ARS
 * Combina datos de crypto con cotización del dólar blue
 */
export function useCryptoPricesARS() {
  const { data: cryptoData, ...cryptoQuery } = useCryptoQuery();

  return useQuery({
    queryKey: ['crypto', 'prices-ars'],
    queryFn: async () => {
      try {
        // Obtener cotización del dólar blue para conversión
        const dolarResponse = await fetch('https://dolarapi.com/v1/dolares/blue');
        const dolarData = await dolarResponse.json();
        const dolarBlueVenta = dolarData.venta;

        if (!cryptoData) return [];

        // Convertir precios a ARS
        return cryptoData.map((crypto) => ({
          ...crypto,
          current_price_ars: crypto.current_price * dolarBlueVenta,
        }));
      } catch (error) {
        logger.error('Error calculating ARS prices', error);
        // Si falla, devolver data sin conversión ARS
        return (
          cryptoData?.map((crypto) => ({
            ...crypto,
            current_price_ars: 0,
          })) || []
        );
      }
    },
    enabled: !!cryptoData,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

/**
 * Hook para obtener datos históricos de una crypto
 */
export function useCryptoHistorical(cryptoId: string, days: number = 7) {
  return useQuery({
    queryKey: ['crypto', 'historical', cryptoId, days],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        logger.error('Error fetching historical crypto data', error, { cryptoId, days });
        throw error;
      }
    },
    staleTime: 300000, // 5 minutos (datos históricos no cambian tanto)
    enabled: !!cryptoId,
  });
}
