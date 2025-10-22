/**
 * useFavoritesSorting Hook
 * Custom hook para manejar el sorting de la lista de favoritos
 * Extraído de FavoritesList.tsx para reducir complejidad
 */

import { useMemo, useState } from 'react';
import type { DolarWithVariation } from './useDolarVariations';
import type { CotizacionWithVariation } from './useCotizaciones';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

type FavoriteItem = DolarWithVariation | CotizacionWithVariation | CryptoData;
export type SortField = 'nombre' | 'precioUSD' | 'precioARS' | 'variacion';
export type SortDirection = 'asc' | 'desc';

interface UseFavoritesSortingProps {
  items: FavoriteItem[];
  selectedDolar: Quotation | undefined;
}

/**
 * Hook para manejar sorting de favoritos
 * Soporta dolares, monedas y cryptos en una misma tabla
 */
export function useFavoritesSorting({ items, selectedDolar }: UseFavoritesSortingProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Helper functions
  const getName = (item: FavoriteItem): string => {
    if ('nombre' in item) return item.nombre;
    if ('name' in item) return item.name;
    return '';
  };

  const getPriceUSD = (item: FavoriteItem): number => {
    if ('venta' in item) return item.venta;
    if ('current_price' in item) return item.current_price;
    return 0;
  };

  const getVariation = (item: FavoriteItem): number => {
    if ('variation' in item) return item.variation.percentage;
    if ('price_change_percentage_24h' in item) return Math.abs(item.price_change_percentage_24h);
    return 0;
  };

  // Sorting logic
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = getName(a).toLowerCase();
          bValue = getName(b).toLowerCase();
          break;
        case 'precioUSD':
          aValue = getPriceUSD(a);
          bValue = getPriceUSD(b);
          break;
        case 'precioARS':
          const aPriceUSD = getPriceUSD(a);
          const bPriceUSD = getPriceUSD(b);
          aValue = selectedDolar ? aPriceUSD * selectedDolar.venta : aPriceUSD;
          bValue = selectedDolar ? bPriceUSD * selectedDolar.venta : bPriceUSD;
          break;
        case 'variacion':
          aValue = getVariation(a);
          bValue = getVariation(b);
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
  }, [items, sortField, sortDirection, selectedDolar]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedItems,
    sortField,
    sortDirection,
    handleSort,
  };
}
