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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import {
  FaSearch,
  FaTimes,
  FaArrowRight,
  FaHome,
  FaChartLine,
  FaStar,
  FaBitcoin,
  FaCalculator,
  FaBell,
  FaDollarSign,
  FaLandmark,
  FaGlobeAmericas,
  FaCalendar,
  FaUser,
  FaCoins,
  FaChartBar,
  FaMap,
} from 'react-icons/fa';

interface SearchResult {
  title: string;
  path: string;
  category: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Mapeo de categorías a colores
const CATEGORY_COLORS: Record<string, string> = {
  Principal: 'bg-brand/20 text-brand border-brand/30',
  Dashboard: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Herramientas: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Cotizaciones: 'bg-green-500/20 text-green-400 border-green-500/30',
  Crypto: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Indicadores: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Cuenta: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Información: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

const SEARCH_INDEX: SearchResult[] = [
  // Dashboard pages
  {
    title: 'Dashboard',
    path: '/dashboard',
    category: 'Principal',
    description: 'Panel principal con resumen',
    icon: FaHome,
  },
  {
    title: 'Análisis',
    path: '/dashboard/analisis',
    category: 'Dashboard',
    description: 'Análisis técnico y gráficos',
    icon: FaChartLine,
  },
  {
    title: 'Favoritos',
    path: '/dashboard/favoritos',
    category: 'Dashboard',
    description: 'Tus cotizaciones favoritas',
    icon: FaStar,
  },
  {
    title: 'Crypto',
    path: '/dashboard/crypto',
    category: 'Dashboard',
    description: 'Criptomonedas y precios',
    icon: FaBitcoin,
  },
  {
    title: 'Alertas',
    path: '/dashboard/alertas',
    category: 'Dashboard',
    description: 'Configura alertas de precios',
    icon: FaBell,
  },
  {
    title: 'Calendario',
    path: '/dashboard/calendario',
    category: 'Dashboard',
    description: 'Eventos importantes',
    icon: FaCalendar,
  },
  {
    title: 'Perfil',
    path: '/dashboard/perfil',
    category: 'Cuenta',
    description: 'Tu perfil y configuración',
    icon: FaUser,
  },

  // Calculadoras
  {
    title: 'Calculadoras',
    path: '/dashboard/calculadoras',
    category: 'Herramientas',
    description: 'Herramientas financieras',
    icon: FaCalculator,
  },
  {
    title: 'Mega Calculadora',
    path: '/dashboard/mega-calculadora',
    category: 'Herramientas',
    description: 'Calculadora avanzada',
    icon: FaCalculator,
  },

  // Quick searches - Dólares
  {
    title: 'Dólar Blue',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Precio del dólar blue hoy',
    icon: FaDollarSign,
  },
  {
    title: 'Dólar Oficial',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Cotización oficial del dólar',
    icon: FaDollarSign,
  },
  {
    title: 'Dólar Bolsa',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar MEP o Bolsa',
    icon: FaDollarSign,
  },
  {
    title: 'Dólar CCL',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Contado con liquidación',
    icon: FaDollarSign,
  },
  {
    title: 'Dólar Tarjeta',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar para compras en el exterior',
    icon: FaDollarSign,
  },
  {
    title: 'Dólar Cripto',
    path: '/dashboard',
    category: 'Cotizaciones',
    description: 'Dólar via criptomonedas',
    icon: FaDollarSign,
  },

  // Crypto
  {
    title: 'Bitcoin',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Precio de Bitcoin (BTC)',
    icon: FaBitcoin,
  },
  {
    title: 'Ethereum',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Precio de Ethereum (ETH)',
    icon: FaCoins,
  },
  {
    title: 'USDT',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'Tether (USDT) stablecoin',
    icon: FaCoins,
  },
  {
    title: 'USDC',
    path: '/dashboard/crypto',
    category: 'Crypto',
    description: 'USD Coin stablecoin',
    icon: FaCoins,
  },

  // Indicadores
  {
    title: 'Riesgo País',
    path: '/dashboard',
    category: 'Indicadores',
    description: 'Riesgo país Argentina',
    icon: FaChartBar,
  },
  {
    title: 'Inflación',
    path: '/dashboard',
    category: 'Indicadores',
    description: 'Índice de inflación',
    icon: FaChartBar,
  },
  {
    title: 'Reservas',
    path: '/dashboard',
    category: 'Indicadores',
    description: 'Reservas del BCRA',
    icon: FaChartBar,
  },

  // Public pages
  {
    title: 'Roadmap',
    path: '/roadmap',
    category: 'Información',
    description: 'Plan de desarrollo',
    icon: FaMap,
  },
];

export const NavbarSearch = React.memo(function NavbarSearch() {
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

  // Event handlers - defined before useEffect that uses them
  const handleSelect = useCallback(
    (path: string) => {
      router.push(path);
      setIsOpen(false);
      setQuery('');
    },
    [router]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleResultMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

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
  }, [isOpen, results, selectedIndex, handleSelect]);

  return (
    <>
      {/* Search Button - Desktop */}
      <button
        onClick={handleOpen}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-panel/10 border border-border hover:border-brand/30 hover:bg-panel/20 text-secondary hover:text-foreground transition-all group"
      >
        <FaSearch className="text-xs group-hover:text-brand transition-colors" />
        <span className="text-xs">Buscar</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-panel/20 border border-border rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Button - Mobile */}
      <button
        onClick={handleOpen}
        className="sm:hidden p-2 rounded-lg hover:bg-panel/20 text-secondary hover:text-foreground transition-all"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />

            {/* Search Dialog */}
            <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -30 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-2xl bg-panel/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-b from-panel to-panel/95 backdrop-blur-sm px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <FaSearch className="text-brand text-lg" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      placeholder="Buscar páginas, cotizaciones, cryptos..."
                      className="flex-1 bg-transparent text-foreground placeholder-secondary outline-none text-lg font-medium"
                    />
                    <button
                      onClick={handleClose}
                      className="p-2 rounded-lg hover:bg-panel/20 text-secondary hover:text-foreground transition-all"
                      aria-label="Cerrar búsqueda"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                  {results.length > 0 ? (
                    <div className="p-3 space-y-1">
                      {results.map((result, index) => {
                        const Icon = result.icon || FaSearch;
                        const categoryColor =
                          CATEGORY_COLORS[result.category] || CATEGORY_COLORS.Dashboard;
                        const isSelected = index === selectedIndex;

                        return (
                          <motion.button
                            key={`${result.path}-${index}`}
                            onClick={() => handleSelect(result.path)}
                            onMouseEnter={() => handleResultMouseEnter(index)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all group ${isSelected ? 'bg-brand/10 border border-brand/30 shadow-lg shadow-brand/10' : 'hover:bg-panel/10 border border-transparent'}`}
                          >
                            {/* Icon */}
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-brand/20' : 'bg-panel/10 group-hover:bg-panel/20'}`}
                            >
                              <Icon
                                className={`text-base transition-colors ${isSelected ? 'text-brand' : 'text-foreground/70 group-hover:text-brand'}`}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm font-semibold transition-colors mb-1 ${isSelected ? 'text-brand' : 'text-foreground group-hover:text-brand'}`}
                              >
                                {result.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryColor}`}
                                >
                                  {result.category}
                                </span>
                                {result.description && (
                                  <span className="text-xs text-secondary truncate">
                                    {result.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Arrow */}
                            <FaArrowRight
                              className={`text-sm transition-all flex-shrink-0 ${isSelected ? 'text-brand translate-x-1' : 'text-secondary group-hover:text-brand group-hover:translate-x-1'}`}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-panel/10 flex items-center justify-center">
                        <FaSearch className="text-2xl text-secondary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        No se encontraron resultados
                      </p>
                      <p className="text-xs text-secondary">
                        No encontramos &quot;{query}&quot;. Intenta con otros términos
                      </p>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand/10 flex items-center justify-center">
                        <FaSearch className="text-2xl text-brand" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Búsqueda Universal</p>
                      <p className="text-xs text-secondary">
                        Busca páginas, cotizaciones, cryptos y más...
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-gradient-to-t from-panel to-panel/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <kbd className="px-2 py-1 bg-panel/20 border border-border rounded-md font-mono text-foreground shadow-sm">
                          ↑
                        </kbd>
                        <kbd className="px-2 py-1 bg-panel/20 border border-border rounded-md font-mono text-foreground shadow-sm">
                          ↓
                        </kbd>
                        <span>navegar</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-secondary">
                        <kbd className="px-2 py-1 bg-panel/20 border border-border rounded-md font-mono text-foreground shadow-sm">
                          ↵
                        </kbd>
                        <span>seleccionar</span>
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-secondary">
                      <kbd className="px-2 py-1 bg-panel/20 border border-border rounded-md font-mono text-foreground shadow-sm">
                        ESC
                      </kbd>
                      <span>cerrar</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 71, 255, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 71, 255, 0.7);
        }
      `}</style>
    </>
  );
});
