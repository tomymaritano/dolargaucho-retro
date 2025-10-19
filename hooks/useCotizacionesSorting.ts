/**
 * useCotizacionesSorting Hook
 *
 * Single Responsibility: Handle cotizaciones table sorting logic
 */

import { useState, useMemo } from 'react';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

export type CotizacionSortField = 'nombre' | 'compra' | 'venta' | 'variation' | 'sparkline';
export type SortDirection = 'asc' | 'desc';

interface UseCotizacionesSortingParams {
  cotizaciones: CotizacionWithVariation[];
  historicalData?: Record<string, { data: Array<{ valor: number }>; changePercent: number }>;
}

export function useCotizacionesSorting({
  cotizaciones,
  historicalData,
}: UseCotizacionesSortingParams) {
  const [sortField, setSortField] = useState<CotizacionSortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedCotizaciones = useMemo(() => {
    const sorted = [...cotizaciones].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
          break;
        case 'compra':
          aValue = a.compra;
          bValue = b.compra;
          break;
        case 'venta':
          aValue = a.venta;
          bValue = b.venta;
          break;
        case 'variation':
          aValue = a.variation.percentage;
          bValue = b.variation.percentage;
          break;
        case 'sparkline':
          aValue = historicalData?.[a.moneda]?.changePercent || 0;
          bValue = historicalData?.[b.moneda]?.changePercent || 0;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [cotizaciones, sortField, sortDirection, historicalData]);

  const handleSort = (field: CotizacionSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedCotizaciones,
    sortField,
    sortDirection,
    handleSort,
  };
}
