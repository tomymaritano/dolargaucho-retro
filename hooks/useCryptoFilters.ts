import { useMemo, useState } from 'react';
import type { CryptoData } from '@/types/api/crypto';

export type SortOption = 'market_cap' | 'price' | 'change_24h' | 'name';
export type FilterOption = 'all' | 'favorites' | 'stablecoins';

interface UseCryptoFiltersProps {
  cryptoData?: CryptoData[];
  favoriteCryptos: string[];
}

/**
 * Custom hook for crypto filtering and sorting logic
 *
 * Handles:
 * - Search by name or symbol
 * - Filter by favorites or stablecoins
 * - Sort by market cap, price, change, or name
 *
 * @param cryptoData - Raw crypto data from API
 * @param favoriteCryptos - List of favorite crypto IDs
 * @returns Filtered and sorted crypto data with filter state
 */
export function useCryptoFilters({ cryptoData, favoriteCryptos }: UseCryptoFiltersProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredAndSortedData = useMemo(() => {
    if (!cryptoData) return [];

    let filtered = cryptoData;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(search.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filters
    if (filterBy === 'favorites') {
      filtered = filtered.filter((crypto) => favoriteCryptos.includes(crypto.id));
    } else if (filterBy === 'stablecoins') {
      const stablecoins = ['tether', 'usd-coin', 'dai'];
      filtered = filtered.filter((crypto) => stablecoins.includes(crypto.id));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'market_cap':
          return b.market_cap - a.market_cap;
        case 'price':
          return b.current_price - a.current_price;
        case 'change_24h':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [cryptoData, search, sortBy, filterBy, favoriteCryptos]);

  return {
    // State
    search,
    sortBy,
    filterBy,
    // Data
    filteredAndSortedData,
    // Actions
    setSearch,
    setSortBy,
    setFilterBy,
  };
}
