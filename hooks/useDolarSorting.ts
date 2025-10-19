/**
 * useDolarSorting Hook
 *
 * Single Responsibility: Handle dolar table sorting logic
 */

import { useState, useMemo } from 'react';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';

export type DolarSortField = 'nombre' | 'compra' | 'venta' | 'variation' | 'sparkline';
export type SortDirection = 'asc' | 'desc';

interface UseDolarSortingParams {
  dolares: DolarWithVariation[];
  historicalData?: Record<string, { data: Array<{ valor: number }>; changePercent: number }>;
}

export function useDolarSorting({ dolares, historicalData }: UseDolarSortingParams) {
  const [sortField, setSortField] = useState<DolarSortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedDolares = useMemo(() => {
    const sorted = [...dolares].sort((a, b) => {
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
          aValue = historicalData?.[a.casa]?.changePercent || 0;
          bValue = historicalData?.[b.casa]?.changePercent || 0;
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
  }, [dolares, sortField, sortDirection, historicalData]);

  const handleSort = (field: DolarSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedDolares,
    sortField,
    sortDirection,
    handleSort,
  };
}
