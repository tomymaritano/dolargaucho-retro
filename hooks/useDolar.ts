// hooks/useDolar.ts
// LEGACY HOOK - Now uses TanStack Query internally for better performance
// For new code, use hooks/useDolarQuery.ts instead

import { useDolarQuery } from './useDolarQuery';
import { logger } from '@/lib/utils/logger';

export type DolarType = {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion?: string;
};

/**
 * @deprecated Use useDolarQuery() from hooks/useDolarQuery.ts for better type safety
 * This hook is kept for backward compatibility
 */
const useDolar = () => {
  // Use TanStack Query internally
  const { data, isLoading, error } = useDolarQuery();

  // Historical data function (not using React Query for now)
  const fetchHistoricalData = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`https://api.dolarapi.com/v1/dolares?fecha=${formattedDate}`);
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('Error al obtener datos históricos', error, { hook: 'useDolar', date: formattedDate });
      return [];
    }
  };

  // Return data in the same format as before for backward compatibility
  return {
    dolar: data || [],
    loading: isLoading,
    error: error?.message || null,
    fetchHistoricalData,
  };
};

export default useDolar;
