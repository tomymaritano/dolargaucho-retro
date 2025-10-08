'use client';

import { useQuery } from '@tanstack/react-query';
import { CurrencyQuotation, CurrencyType } from '@/types/api/dolar';
import { API_CONFIG } from '@/lib/config/api';

/**
 * Hook to fetch all currency quotations (EUR, BRL, CLP, UYU)
 * Uses TanStack Query for automatic caching, refetching, and state management
 *
 * Features:
 * - Auto-refetch every 30 seconds
 * - Data is cached for 30 seconds
 * - Automatic retries on failure
 *
 * @example
 * const { data, isLoading, error } = useCotizaciones();
 */
export function useCotizaciones() {
  return useQuery({
    queryKey: ['cotizaciones'],
    queryFn: async (): Promise<CurrencyQuotation[]> => {
      const url = `${API_CONFIG.dolarAPI.baseUrl}${API_CONFIG.dolarAPI.endpoints.cotizaciones}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener cotizaciones');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato inesperado de respuesta de API');
      }

      return data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 3,
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
