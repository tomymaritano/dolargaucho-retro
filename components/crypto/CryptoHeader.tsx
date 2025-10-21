/**
 * Crypto Header Component
 *
 * Unified header matching MarketsHeader design
 * Professional, clean search with filter tabs
 */

import React from 'react';
import { FaSearch, FaTimes, FaStar } from 'react-icons/fa';
import type { DolarType } from '@/types/api/dolar';

type SortOption = 'market_cap' | 'price' | 'change_24h' | 'name';
type FilterOption = 'all' | 'favorites' | 'stablecoins';

interface CryptoHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (value: FilterOption) => void;
  selectedDolarType: DolarType;
  onDolarTypeChange: (value: DolarType) => void;
}

export function CryptoHeader({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  selectedDolarType,
  onDolarTypeChange,
}: CryptoHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar - matching MarketsHeader style */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Buscar criptomonedas..."
          className={`w-full pl-10 pr-10 py-2.5 rounded-lg transition-all duration-200 text-sm text-foreground placeholder:text-secondary focus:outline-none ${
            isSearchFocused
              ? 'ring-2 ring-brand/40 bg-[#1B1B1B]'
              : 'bg-[#1B1B1B] hover:bg-[#222222]'
          }`}
        />
        <FaSearch
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
            isSearchFocused ? 'text-brand' : 'text-secondary'
          }`}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-panel-hover transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <FaTimes className="text-xs text-secondary hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Tabs - matching dashboard tabs style */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 border-b border-slate-700/10">
          <button
            onClick={() => onFilterChange('all')}
            className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative ${
              filterBy === 'all' ? 'text-brand' : 'text-secondary hover:text-foreground'
            }`}
          >
            Todas
            {filterBy === 'all' && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
          <button
            onClick={() => onFilterChange('favorites')}
            className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
              filterBy === 'favorites' ? 'text-brand' : 'text-secondary hover:text-foreground'
            }`}
          >
            <FaStar className="text-xs" />
            Favoritos
            {filterBy === 'favorites' && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
          <button
            onClick={() => onFilterChange('stablecoins')}
            className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative ${
              filterBy === 'stablecoins' ? 'text-brand' : 'text-secondary hover:text-foreground'
            }`}
          >
            Stablecoins
            {filterBy === 'stablecoins' && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
        </div>

        {/* Secondary Controls - Sort & Dolar Type */}
        <div className="flex items-center gap-3 text-xs">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-lg font-medium bg-[#1B1B1B] border border-slate-700/10 text-foreground hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <option value="market_cap">Market Cap</option>
            <option value="price">Precio</option>
            <option value="change_24h">Cambio 24h</option>
            <option value="name">Nombre</option>
          </select>

          {/* Dolar Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-secondary whitespace-nowrap">ARS con:</span>
            <div className="flex gap-1">
              {(['blue', 'oficial', 'cripto'] as DolarType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onDolarTypeChange(type)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    selectedDolarType === type
                      ? 'bg-brand text-background-dark'
                      : 'bg-[#1B1B1B] text-secondary hover:text-foreground hover:bg-[#222222]'
                  }`}
                >
                  {type === 'blue' ? 'Blue' : type === 'oficial' ? 'Oficial' : 'Cripto'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
