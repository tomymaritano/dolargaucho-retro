'use client';

/**
 * NavbarSearch - Fuzzy Search Component for NavbarFloating
 *
 * Features:
 * - Keyboard shortcut: ⌘K / Ctrl+K
 * - Fuzzy search with Fuse.js
 * - Modal dialog with backdrop
 * - Search across pages, features, and quick links
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';

interface SearchResult {
  title: string;
  path: string;
  category: string;
  description?: string;
}

const SEARCH_INDEX: SearchResult[] = [
  // Dashboard pages
  {
    title: 'Dashboard',
    path: '/dashboard',
    category: 'Principal',
    description: 'Panel principal con resumen',
  },
  {
    title: 'Análisis',
    path: '/dashboard/analisis',
    category: 'Dashboard',
    description: 'Análisis técnico y gráficos',
  },
  {
    title: 'Favoritos',
    path: '/dashboard/favoritos',
    category: 'Dashboard',
    description: 'Tus cotizaciones favoritas',
  },
  {
    title: 'Crypto',
    path: '/dashboard/crypto',
    category: 'Dashboard',
    description: 'Criptomonedas y precios',
  },
  {
    title: 'Alertas',
    path: '/dashboard/alertas',
    category: 'Dashboard',
    description: 'Configura alertas de precios',
  },
  {
    title: 'Economía',
    path: '/dashboard/economia',
    category: 'Dashboard',
    description: 'Indicadores económicos',
  },
  {
    title: 'Finanzas',
    path: '/dashboard/finanzas',
    category: 'Dashboard',
    description: 'Tasas y calculadoras',
  },
  {
    title: 'Política',
    path: '/dashboard/politica',
    category: 'Dashboard',
    description: 'Noticias políticas',
  },
  {
    title: 'Calendario',
    path: '/dashboard/calendario',
    category: 'Dashboard',
    description: 'Eventos importantes',
  },
  {
    title: 'Perfil',
    path: '/dashboard/perfil',
    category: 'Cuenta',
    description: 'Tu perfil y configuración',
  },

  // Calculadoras
  {
    title: 'Calculadoras',
    path: '/dashboard/calculadoras',
    category: 'Herramientas',
    description: 'Herramientas financieras',
  },
  {
    title: 'Mega Calculadora',
    path: '/dashboard/mega-calculadora',
    category: 'Herramientas',
    description: 'Calculadora avanzada',
  },

  // Quick searches - Dólares
  {
    title: 'Dólar Blue',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Precio del dólar blue hoy',
  },
  {
    title: 'Dólar Oficial',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Cotización oficial del dólar',
  },
  {
    title: 'Dólar Bolsa',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar MEP o Bolsa',
  },
  {
    title: 'Dólar CCL',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Contado con liquidación',
  },
  {
    title: 'Dólar Tarjeta',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar para compras en el exterior',
  },
  {
    title: 'Dólar Cripto',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar via criptomonedas',
  },

  // Crypto
  {
    title: 'Bitcoin',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Precio de Bitcoin (BTC)',
  },
  {
    title: 'Ethereum',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Precio de Ethereum (ETH)',
  },
  {
    title: 'USDT',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Tether (USDT) stablecoin',
  },
  {
    title: 'USDC',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'USD Coin stablecoin',
  },

  // Indicadores
  {
    title: 'Riesgo País',
    path: '/dashboard/economia',
    category: 'Indicadores',
    description: 'Riesgo país Argentina',
  },
  {
    title: 'Inflación',
    path: '/dashboard/economia',
    category: 'Indicadores',
    description: 'Índice de inflación',
  },
  {
    title: 'Reservas',
    path: '/dashboard/economia',
    category: 'Indicadores',
    description: 'Reservas del BCRA',
  },

  // Public pages
  {
    title: 'Roadmap',
    path: '/roadmap',
    category: 'Información',
    description: 'Plan de desarrollo',
  },
];

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = React.useMemo(
    () =>
      new Fuse(SEARCH_INDEX, {
        keys: ['title', 'category', 'description'],
        threshold: 0.3,
        minMatchCharLength: 2,
      }),
    []
  );

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = fuse.search(query);
      setResults(searchResults.map((r) => r.item).slice(0, 6));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      // Arrow navigation when modal is open
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex].path);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setQuery('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button - Desktop */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5
                   border border-white/10 hover:border-brand/30 hover:bg-white/10
                   text-secondary hover:text-foreground transition-all group"
      >
        <FaSearch className="text-xs group-hover:text-brand transition-colors" />
        <span className="text-xs">Buscar</span>
        <kbd
          className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono
                        bg-white/10 border border-white/10 rounded"
        >
          ⌘K
        </kbd>
      </button>

      {/* Search Button - Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-lg hover:bg-white/10 text-secondary
                   hover:text-foreground transition-all"
        aria-label="Buscar"
      >
        <FaSearch className="text-sm" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Search Dialog */}
            <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl bg-background border border-white/10 rounded-2xl
                           shadow-2xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  <FaSearch className="text-brand text-sm flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar páginas, cotizaciones, cryptos..."
                    className="flex-1 bg-transparent text-foreground placeholder-secondary
                               outline-none text-base"
                  />
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-secondary
                               hover:text-foreground transition-all"
                    aria-label="Cerrar búsqueda"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <button
                          key={`${result.path}-${index}`}
                          onClick={() => handleSelect(result.path)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3
                                     rounded-lg text-left transition-all group
                                     ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-sm font-medium transition-colors
                                          ${index === selectedIndex ? 'text-brand' : 'text-foreground group-hover:text-brand'}`}
                            >
                              {result.title}
                            </div>
                            <div className="text-xs text-secondary">
                              {result.category}
                              {result.description && ` • ${result.description}`}
                            </div>
                          </div>
                          <FaArrowRight
                            className={`text-xs transition-all
                                                   ${index === selectedIndex ? 'text-brand translate-x-1' : 'text-secondary group-hover:text-brand group-hover:translate-x-1'}`}
                          />
                        </button>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="p-8 text-center text-secondary">
                      <p className="text-sm">
                        No se encontraron resultados para &quot;{query}&quot;
                      </p>
                      <p className="text-xs mt-2">Intenta con otros términos de búsqueda</p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-secondary">
                      <p className="text-sm">Escribe al menos 2 caracteres para buscar</p>
                      <p className="text-xs mt-2">Busca páginas, cotizaciones, cryptos y más</p>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded font-mono">
                          ↑
                        </kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded font-mono">
                          ↓
                        </kbd>
                        navegar
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded font-mono">
                          ↵
                        </kbd>
                        seleccionar
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded font-mono">
                        ESC
                      </kbd>
                      cerrar
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
