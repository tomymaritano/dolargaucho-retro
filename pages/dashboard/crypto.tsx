'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { useCryptoQuery } from '@/hooks/useCryptoQuery';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useDolarByType } from '@/hooks/useDolarQuery';
import type { DolarType } from '@/types/api/dolar';
import { FaSearch, FaBitcoin, FaStar, FaFilter, FaInfoCircle, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';

const CRYPTO_FAQ = [
  {
    question: '¿De dónde vienen los datos?',
    answer:
      'Los datos provienen de <strong>CoinGecko API</strong>, una de las fuentes más confiables de información sobre criptomonedas. Se actualizan cada 60 segundos para mantenerte informado en tiempo real.',
  },
  {
    question: '¿Qué son las stablecoins?',
    answer:
      'Las <strong>stablecoins</strong> (USDT, USDC, DAI) son criptomonedas diseñadas para mantener un valor estable de ~$1 USD. En Argentina son populares como forma de ahorro digital en dólares sin necesidad de una cuenta bancaria en el extranjero.',
  },
  {
    question: '¿Cómo se calcula el precio en ARS?',
    answer:
      'El precio en pesos argentinos se calcula multiplicando el valor en USD por la <strong>cotización del dólar blue</strong>. Esto te da una referencia aproximada del valor en el mercado paralelo.',
  },
  {
    question: '¿Qué significa Market Cap?',
    answer:
      '<strong>Market Cap</strong> (Capitalización de Mercado) es el valor total de todas las monedas en circulación. Se calcula multiplicando el precio actual por la cantidad de monedas disponibles. Es un indicador del tamaño y relevancia de la criptomoneda.',
  },
  {
    question: '¿Son seguras las criptomonedas?',
    answer:
      'Las criptomonedas son <strong>volátiles</strong> y pueden subir o bajar rápidamente. Solo invierte lo que estés dispuesto a perder. Te recomendamos investigar y usar exchanges regulados. Esta plataforma solo brinda información, no es asesoría financiera.',
  },
];

type SortOption = 'market_cap' | 'price' | 'change_24h' | 'name';
type FilterOption = 'all' | 'favorites' | 'stablecoins';

export default function CryptoPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('cripto');

  const { data: cryptoData, isLoading, error } = useCryptoQuery();
  const { data: selectedDolar } = useDolarByType(selectedDolarType);
  const { cryptos: favoriteCryptos, toggleCrypto } = useFavoritesStore();

  // Usar cryptoData directamente (ya no usamos useCryptoPricesARS)
  const displayData = cryptoData;

  // Filtrar y ordenar datos
  const filteredAndSortedData = useMemo(() => {
    if (!displayData) return [];

    let filtered = displayData;

    // Aplicar búsqueda
    if (search) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(search.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filterBy === 'favorites') {
      filtered = filtered.filter((crypto) => favoriteCryptos.includes(crypto.id));
    } else if (filterBy === 'stablecoins') {
      const stablecoins = ['tether', 'usd-coin', 'dai'];
      filtered = filtered.filter((crypto) => stablecoins.includes(crypto.id));
    }

    // Ordenar
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
  }, [displayData, search, sortBy, filterBy, favoriteCryptos]);

  const favoriteCount = favoriteCryptos.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaBitcoin className="text-accent-emerald text-3xl" />
              <h1 className="text-3xl font-bold text-foreground">Criptomonedas</h1>
            </div>
            <p className="text-secondary">
              Precios en tiempo real de las principales criptomonedas
            </p>
          </div>
          <HelpButton title="Ayuda - Criptomonedas" faqs={CRYPTO_FAQ} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                  Total Cryptos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {displayData?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl glass">
                <FaBitcoin className="text-accent-emerald text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                  Favoritos
                </p>
                <p className="text-2xl font-bold text-foreground">{favoriteCount}</p>
              </div>
              <div className="p-3 rounded-xl glass">
                <FaStar className="text-accent-emerald text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                  Actualización
                </p>
                <p className="text-sm font-semibold text-accent-emerald">Cada 5min</p>
              </div>
              <div className="p-3 rounded-xl glass">
                <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search, Filters, and Exchange Rate Selector */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 flex items-center gap-3 glass px-4 py-3 rounded-xl border border-border hover:border-accent-emerald/30 transition-colors focus-within:border-accent-emerald/50 focus-within:ring-2 focus-within:ring-accent-emerald/20">
              <FaSearch className="text-secondary text-sm" />
              <input
                type="text"
                placeholder="Buscar por nombre o símbolo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-secondary"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold glass border border-border text-foreground appearance-none cursor-pointer hover:bg-white/5 transition-all pr-10"
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
              onClick={() => setFilterBy('all')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                filterBy === 'all'
                  ? 'bg-accent-emerald text-background-dark'
                  : 'glass text-secondary hover:text-foreground hover:bg-white/5'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterBy('favorites')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterBy === 'favorites'
                  ? 'bg-accent-emerald text-background-dark'
                  : 'glass text-secondary hover:text-foreground hover:bg-white/5'
              }`}
            >
              <FaStar className="text-xs" />
              Favoritos
            </button>
            <button
              onClick={() => setFilterBy('stablecoins')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                filterBy === 'stablecoins'
                  ? 'bg-accent-emerald text-background-dark'
                  : 'glass text-secondary hover:text-foreground hover:bg-white/5'
              }`}
            >
              Stablecoins
            </button>
          </div>

            {/* Exchange Rate Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Precio en ARS con:</span>
              <div className="flex gap-1">
                {(['blue', 'oficial', 'cripto'] as DolarType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedDolarType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDolarType === type
                        ? 'bg-accent-emerald text-background-dark'
                        : 'glass text-secondary hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {type === 'blue' ? 'Blue' : type === 'oficial' ? 'Oficial' : 'Cripto'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-accent-emerald text-lg mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm text-secondary">
              <p>
                <strong className="text-foreground">Aviso importante:</strong> Los precios son
                referenciales y pueden variar según el exchange. Esta información no constituye
                asesoría financiera. Las criptomonedas son volátiles y su valor puede cambiar
                rápidamente.
              </p>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card variant="elevated" padding="lg">
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-emerald border-t-transparent" />
              <p className="text-sm text-secondary">Cargando criptomonedas...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-8">
              <p className="text-error">Error al cargar datos de criptomonedas</p>
              <p className="text-sm text-secondary mt-2">Por favor, intenta nuevamente</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedData.length === 0 && (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-12">
              <FaSearch className="text-4xl text-secondary mx-auto mb-3 opacity-30" />
              <p className="text-secondary">No se encontraron resultados</p>
              <p className="text-sm text-secondary mt-2">
                Intenta con otros términos de búsqueda o filtros
              </p>
            </div>
          </Card>
        )}

        {/* Crypto Table */}
        {!isLoading && !error && filteredAndSortedData.length > 0 && (
          <Card variant="elevated" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12">
                      <FaStar className="inline-block text-accent-emerald" />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                      Precio USD
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                      Precio ARS
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                      24h %
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((crypto, index) => {
                    const isFavorite = favoriteCryptos.includes(crypto.id);

                    const getTrendData = (percentage: number) => {
                      if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
                      if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
                      return { icon: FaMinus, color: 'text-warning' };
                    };

                    const trend24h = getTrendData(crypto.price_change_percentage_24h);
                    const TrendIcon = trend24h.icon;

                    const formatPrice = (price: number) => {
                      return new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: price < 1 ? 6 : 2,
                      }).format(price);
                    };

                    const formatMarketCap = (value: number) => {
                      if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
                      if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
                      return `$${(value / 1_000_000).toFixed(2)}M`;
                    };

                    return (
                      <React.Fragment key={crypto.id}>
                        <tr className="border-b border-border hover:bg-white/5 transition-colors group">
                          {/* Favorito */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleCrypto(crypto.id)}
                              className={`p-2 rounded-lg transition-all ${
                                isFavorite
                                  ? 'text-accent-emerald bg-accent-emerald/10'
                                  : 'text-secondary hover:text-accent-emerald hover:bg-white/5'
                              }`}
                              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                              {isFavorite ? <FaStar className="text-base" /> : <FaRegStar className="text-base" />}
                            </button>
                          </td>

                          {/* Ranking */}
                          <td className="py-3 px-4">
                            <span className="text-sm text-secondary font-medium">{index + 1}</span>
                          </td>

                          {/* Logo + Nombre */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={crypto.image}
                                alt={crypto.name}
                                className="w-8 h-8 rounded-full"
                                loading="lazy"
                              />
                              <div>
                                <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                                <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
                              </div>
                            </div>
                          </td>

                          {/* Precio USD */}
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-semibold text-foreground tabular-nums">
                              {formatPrice(crypto.current_price)}
                            </span>
                          </td>

                          {/* Precio ARS */}
                          <td className="py-3 px-4 text-right">
                            {selectedDolar ? (
                              <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                                ${(crypto.current_price * selectedDolar.venta).toLocaleString('es-AR', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            ) : (
                              <span className="text-xs text-secondary">...</span>
                            )}
                          </td>

                          {/* 24h Change */}
                          <td className="py-3 px-4 text-right">
                            <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
                              <TrendIcon className="text-xs" />
                              <span className="text-sm font-bold tabular-nums">
                                {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            </div>
                          </td>

                          {/* Market Cap */}
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm text-foreground tabular-nums">
                              {formatMarketCap(crypto.market_cap)}
                            </span>
                          </td>
                        </tr>

                        {/* Fila expandible con detalles (visible al hover) */}
                        <tr className="hidden group-hover:table-row bg-accent-emerald/5">
                          <td colSpan={7} className="py-2 px-4 border-b border-border">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="text-secondary text-[10px] mb-0.5">24h High</p>
                                <p className="font-semibold text-success text-xs">{formatPrice(crypto.high_24h)}</p>
                              </div>
                              <div>
                                <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
                                <p className="font-semibold text-error text-xs">{formatPrice(crypto.low_24h)}</p>
                              </div>
                              <div>
                                <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
                                <p className="font-semibold text-foreground text-xs">{formatMarketCap(crypto.total_volume)}</p>
                              </div>
                              <div>
                                <p className="text-secondary text-[10px] mb-0.5">Suministro</p>
                                <p className="font-semibold text-foreground text-xs">{formatMarketCap(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
