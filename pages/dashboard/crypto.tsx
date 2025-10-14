'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell } from '@/components/ui/Table';
import { useCryptoQuery } from '@/hooks/useCryptoQuery';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useDolarByType } from '@/hooks/useDolarQuery';
import type { DolarType } from '@/types/api/dolar';
import { FaBitcoin, FaStar, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';
import { CryptoStatsCards } from '@/components/crypto/CryptoStatsCards';
import { CryptoFiltersBar } from '@/components/crypto/CryptoFiltersBar';
import { CryptoTableRow } from '@/components/crypto/CryptoTableRow';

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

/**
 * CryptoPage
 *
 * Display cryptocurrency prices with:
 * - Real-time prices from CoinGecko
 * - ARS conversion using selected dolar rate
 * - Search, filter, and sort capabilities
 * - Favorites management
 */
export default function CryptoPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('cripto');

  const { data: cryptoData, isLoading, error } = useCryptoQuery();
  const { data: selectedDolar } = useDolarByType(selectedDolarType);
  const { cryptos: favoriteCryptos, toggleCrypto } = useFavoritesStore();

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!cryptoData) return [];

    let filtered = cryptoData;

    // Apply search
    if (search) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(search.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filterBy === 'favorites') {
      filtered = filtered.filter((crypto) => favoriteCryptos.includes(crypto.id));
    } else if (filterBy === 'stablecoins') {
      const stablecoins = ['tether', 'usd-coin', 'dai'];
      filtered = filtered.filter((crypto) => stablecoins.includes(crypto.id));
    }

    // Sort
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
        <CryptoStatsCards
          totalCryptos={cryptoData?.length || 0}
          favoriteCount={favoriteCryptos.length}
        />

        {/* Search, Filters, and Sorting */}
        <CryptoFiltersBar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedDolarType={selectedDolarType}
          onDolarTypeChange={setSelectedDolarType}
        />

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
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHeaderCell align="center" className="w-12">
                    <FaStar className="inline-block text-accent-emerald" />
                  </TableHeaderCell>
                  <TableHeaderCell align="left" className="w-16">
                    #
                  </TableHeaderCell>
                  <TableHeaderCell align="left">Nombre</TableHeaderCell>
                  <TableHeaderCell align="right">Precio USD</TableHeaderCell>
                  <TableHeaderCell align="right">Precio ARS</TableHeaderCell>
                  <TableHeaderCell align="right">24h %</TableHeaderCell>
                  <TableHeaderCell align="right">Market Cap</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((crypto, index) => (
                  <CryptoTableRow
                    key={crypto.id}
                    crypto={crypto}
                    index={index}
                    isFavorite={favoriteCryptos.includes(crypto.id)}
                    onToggleFavorite={() => toggleCrypto(crypto.id)}
                    selectedDolar={selectedDolar}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
