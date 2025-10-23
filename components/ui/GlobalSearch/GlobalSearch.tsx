'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useFuzzySearch, type SearchResult } from '@/hooks/useFuzzySearch';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch = React.memo(function GlobalSearch({
  isOpen,
  onClose,
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, isSearching } = useFuzzySearch(query);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle result selection
  const handleSelectResult = React.useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelectResult, onClose]);

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'dolar':
        return 'bg-brand/20 text-brand';
      case 'currency':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'page':
        return 'bg-accent-indigo/20 text-accent-indigo';
      case 'calculator':
        return 'bg-brand-light/20 text-brand-light';
      default:
        return 'bg-secondary/20 text-secondary';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'dolar':
        return 'Dólar';
      case 'currency':
        return 'Moneda';
      case 'page':
        return 'Página';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        <div
          className="w-full max-w-7xl bg-panel border border-border rounded-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Búsqueda global"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <FaSearch className="text-secondary text-lg flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cotizaciones, páginas..."
              className="flex-1 bg-transparent text-foreground placeholder-secondary focus:outline-none text-lg"
              aria-label="Campo de búsqueda"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              aria-label="Cerrar búsqueda"
            >
              <FaTimes className="text-secondary text-lg" aria-hidden="true" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!isSearching && (
              <div className="p-8 text-center text-secondary">
                <FaSearch className="text-4xl mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p>Escribe para buscar cotizaciones, páginas y más...</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
                  <kbd className="px-2 py-1 bg-background border border-border rounded">↑↓</kbd>
                  <span className="text-secondary">para navegar</span>
                  <kbd className="px-2 py-1 bg-background border border-border rounded">Enter</kbd>
                  <span className="text-secondary">para seleccionar</span>
                  <kbd className="px-2 py-1 bg-background border border-border rounded">Esc</kbd>
                  <span className="text-secondary">para cerrar</span>
                </div>
              </div>
            )}

            {isSearching && results.length === 0 && (
              <div className="p-8 text-center text-secondary">
                <p>No se encontraron resultados para &quot;{query}&quot;</p>
                <p className="text-sm mt-2">Intenta con otras palabras clave</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2" role="listbox">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full flex items-center gap-4 px-4 py-3 transition-colors text-left ${
                      index === selectedIndex
                        ? 'bg-brand/10 border-l-2 border-brand'
                        : 'hover:bg-background border-l-2 border-transparent'
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">{result.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground truncate">
                          {result.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-sm text-secondary truncate">{result.subtitle}</p>
                      )}
                    </div>

                    {/* Arrow */}
                    <FaArrowRight
                      className={`text-secondary flex-shrink-0 transition-transform ${
                        index === selectedIndex ? 'translate-x-1' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer with shortcuts */}
          {results.length > 0 && (
            <div className="border-t border-border px-4 py-3 bg-background/50">
              <div className="flex items-center gap-4 text-xs text-secondary">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-panel border border-border rounded">↑↓</kbd>
                  <span>Navegar</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-panel border border-border rounded">Enter</kbd>
                  <span>Abrir</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-panel border border-border rounded">Esc</kbd>
                  <span>Cerrar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
