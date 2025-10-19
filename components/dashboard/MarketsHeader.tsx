/**
 * Markets Header Component
 *
 * Single Responsibility: Display "DolarGaucho Markets" title with global search
 * Professional header for the markets tables section
 */

import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface MarketsHeaderProps {
  onSearch?: (query: string) => void;
}

export function MarketsHeader({ onSearch }: MarketsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6">
        DolarGaucho Markets
      </h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Buscar cotizaciones..."
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
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-panel-hover transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <FaTimes className="text-xs text-secondary hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
