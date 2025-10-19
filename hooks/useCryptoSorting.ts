/**
 * useCryptoSorting Hook
 *
 * Single Responsibility: Handle cryptocurrency table sorting logic
 */

import { useState, useMemo } from 'react';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

export type SortField = 'nombre' | 'precio_usd' | 'precio_ars' | '24h' | '7d';
export type SortDirection = 'asc' | 'desc';

interface UseCryptoSortingParams {
  cryptos: CryptoData[];
  selectedDolar: Quotation | undefined;
}

export function useCryptoSorting({ cryptos, selectedDolar }: UseCryptoSortingParams) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedCryptos = useMemo(() => {
    const sorted = [...cryptos].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'precio_usd':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'precio_ars':
          aValue = selectedDolar ? a.current_price * selectedDolar.venta : a.current_price;
          bValue = selectedDolar ? b.current_price * selectedDolar.venta : b.current_price;
          break;
        case '24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case '7d':
          aValue = a.price_change_percentage_7d_in_currency || 0;
          bValue = b.price_change_percentage_7d_in_currency || 0;
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
  }, [cryptos, sortField, sortDirection, selectedDolar]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedCryptos,
    sortField,
    sortDirection,
    handleSort,
  };
}
