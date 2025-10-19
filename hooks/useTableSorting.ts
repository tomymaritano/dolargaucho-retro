/**
 * useTableSorting Hook
 * Generic hook para manejar sorting en cualquier tabla
 * Reusable across DolaresTable, CotizacionesTable, CryptoTable
 */

import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

interface UseTableSortingProps<T, F extends string> {
  data: T[];
  defaultSortField?: F;
  defaultSortDirection?: SortDirection;
  getSortValue: (item: T, field: F) => number | string;
}

/**
 * Hook genérico para sorting de tablas
 *
 * @example
 * const { sortedData, sortField, sortDirection, handleSort } = useTableSorting({
 *   data: dolares,
 *   defaultSortField: 'nombre',
 *   getSortValue: (dolar, field) => {
 *     switch (field) {
 *       case 'nombre': return dolar.nombre.toLowerCase();
 *       case 'venta': return dolar.venta;
 *       default: return 0;
 *     }
 *   }
 * });
 */
export function useTableSorting<T, F extends string>({
  data,
  defaultSortField,
  defaultSortDirection = 'asc',
  getSortValue,
}: UseTableSortingProps<T, F>) {
  const [sortField, setSortField] = useState<F | undefined>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, sortField, sortDirection, getSortValue]);

  const handleSort = (field: F) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
  };
}
