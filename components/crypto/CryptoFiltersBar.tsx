import React from 'react';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import type { DolarType } from '@/types/api/dolar';

type SortOption = 'market_cap' | 'price' | 'change_24h' | 'name';
type FilterOption = 'all' | 'favorites' | 'stablecoins';

interface CryptoFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (value: FilterOption) => void;
  selectedDolarType: DolarType;
  onDolarTypeChange: (value: DolarType) => void;
}

export const CryptoFiltersBar = React.memo(function CryptoFiltersBar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  selectedDolarType,
  onDolarTypeChange,
}: CryptoFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-3 glass px-4 py-3 rounded-xl border border-border hover:border-brand/30 transition-colors focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/20">
          <FaSearch className="text-secondary text-sm" />
          <input
            type="text"
            placeholder="Buscar por nombre o símbolo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-secondary"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold glass border border-border text-foreground appearance-none cursor-pointer hover:bg-panel/10 transition-all pr-10"
          >
            <option value="market_cap">Market Cap</option>
            <option value="price">Precio</option>
            <option value="change_24h">Cambio 24h</option>
            <option value="name">Nombre</option>
          </select>
          <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-xs" />
        </div>
      </div>

      {/* Filter Buttons and Exchange Rate Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={
              'px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ' +
              (filterBy === 'all'
                ? 'bg-brand text-background-dark'
                : 'glass text-secondary hover:text-foreground hover:bg-panel/10')
            }
          >
            Todas
          </button>
          <button
            onClick={() => onFilterChange('favorites')}
            className={
              'px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ' +
              (filterBy === 'favorites'
                ? 'bg-brand text-background-dark'
                : 'glass text-secondary hover:text-foreground hover:bg-panel/10')
            }
          >
            <FaStar className="text-xs" />
            Favoritos
          </button>
          <button
            onClick={() => onFilterChange('stablecoins')}
            className={
              'px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ' +
              (filterBy === 'stablecoins'
                ? 'bg-brand text-background-dark'
                : 'glass text-secondary hover:text-foreground hover:bg-panel/10')
            }
          >
            Stablecoins
          </button>
        </div>

        {/* Exchange Rate Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary">Precio en ARS con:</span>
          <div className="flex gap-1">
            {['blue', 'oficial', 'cripto'].map((type) => (
              <button
                key={type}
                onClick={() => onDolarTypeChange(type as DolarType)}
                className={
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ' +
                  (selectedDolarType === type
                    ? 'bg-brand text-background-dark'
                    : 'glass text-secondary hover:text-foreground hover:bg-panel/10')
                }
              >
                {type === 'blue' ? 'Blue' : type === 'oficial' ? 'Oficial' : 'Cripto'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
