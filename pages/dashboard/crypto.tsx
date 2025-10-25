/**
 * Crypto Page (Redesigned)
 *
 * Unified crypto view matching main dashboard UI
 * - Professional header with breadcrumbs
 * - Search, filters, and sorting
 * - Sparklines and action buttons
 * - Help FAQ
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell } from '@/components/ui/Table';
import { useCryptoQuery } from '@/hooks/useCryptoQuery';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useDolarByType } from '@/hooks/useDolarQuery';
import type { DolarType } from '@/types/api/dolar';
import {
  FaBitcoin,
  FaSearch,
  FaInfoCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
} from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';
import { CryptoHeader } from '@/components/crypto/CryptoHeader';
import { CryptoTableRow } from '@/components/crypto/CryptoTableRow';
import { EmptyState } from '@/components/ui/EmptyState';

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
      'El precio en pesos argentinos se calcula multiplicando el valor en USD por la <strong>cotización del dólar seleccionado</strong>. Podés cambiar el tipo de dólar usado en el selector de la página.',
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
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortBy) {
        case 'market_cap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change_24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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

    return sorted;
  }, [cryptoData, search, sortBy, sortDirection, filterBy, favoriteCryptos]);

  const handleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortOption }) => {
    if (sortBy !== field) return <FaSort className="text-xs text-secondary/50" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-xs text-brand" />
    ) : (
      <FaSortDown className="text-xs text-brand" />
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-lg hover:bg-panel/10 transition-colors text-secondary hover:text-brand"
                aria-label="Volver al Dashboard"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <span
                  onClick={() => router.push('/dashboard')}
                  className="hover:text-brand cursor-pointer transition-colors"
                >
                  Dashboard
                </span>
                <span>/</span>
                <span className="text-foreground">Criptomonedas</span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                <FaBitcoin className="text-brand text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Criptomonedas</h1>
                <p className="text-sm text-secondary mt-1">
                  Precios en tiempo real de las principales criptomonedas del mercado
                </p>
              </div>
            </div>
          </div>
          <div className="mt-14">
            <HelpButton title="Ayuda - Criptomonedas" faqs={CRYPTO_FAQ} />
          </div>
        </div>

        {/* Search, Filters, and Sorting */}
        <CryptoHeader
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedDolarType={selectedDolarType}
          onDolarTypeChange={setSelectedDolarType}
        />

        {/* Loading State */}
        {isLoading && (
          <Card variant="outlined" padding="lg">
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              <p className="text-sm text-secondary">Cargando criptomonedas...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card variant="outlined" padding="lg">
            <div className="text-center py-8">
              <p className="text-error">Error al cargar datos de criptomonedas</p>
              <p className="text-sm text-secondary mt-2">Por favor, intenta nuevamente</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedData.length === 0 && (
          <EmptyState
            icon={FaSearch}
            title="No se encontraron resultados"
            description="Intenta con otros términos de búsqueda o ajusta los filtros para ver más criptomonedas"
            actionLabel="Limpiar filtros"
            onAction={() => {
              setSearch('');
              setFilterBy('all');
            }}
            variant="secondary"
          />
        )}

        {/* Crypto Table */}
        {!isLoading && !error && filteredAndSortedData.length > 0 && (
          <Card variant="outlined" padding="none">
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  {/* Nombre */}
                  <TableHeaderCell
                    align="left"
                    sortable
                    onSort={() => handleSort('name')}
                    width="25%"
                  >
                    <div className="flex items-center gap-2">
                      Nombre
                      <SortIcon field="name" />
                    </div>
                  </TableHeaderCell>

                  {/* Precio USD */}
                  <TableHeaderCell
                    align="right"
                    sortable
                    onSort={() => handleSort('price')}
                    width="12%"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Precio USD
                      <SortIcon field="price" />
                    </div>
                  </TableHeaderCell>

                  {/* Precio ARS */}
                  <TableHeaderCell align="right" width="12%">
                    Precio ARS
                  </TableHeaderCell>

                  {/* 24h % */}
                  <TableHeaderCell
                    align="right"
                    sortable
                    onSort={() => handleSort('change_24h')}
                    width="10%"
                  >
                    <div className="flex items-center justify-end gap-2">
                      24h %
                      <SortIcon field="change_24h" />
                    </div>
                  </TableHeaderCell>

                  {/* Market Cap */}
                  <TableHeaderCell
                    align="right"
                    sortable
                    onSort={() => handleSort('market_cap')}
                    width="12%"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Market Cap
                      <SortIcon field="market_cap" />
                    </div>
                  </TableHeaderCell>

                  {/* 30d % */}
                  <TableHeaderCell align="right" width="8%">
                    30d %
                  </TableHeaderCell>

                  {/* 30D Trend */}
                  <TableHeaderCell align="center" width="10%">
                    30D Trend
                  </TableHeaderCell>

                  {/* Acciones */}
                  <TableHeaderCell align="right" width="11%">
                    Acciones
                  </TableHeaderCell>
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

        {/* Disclaimer Footer */}
        {!isLoading && !error && filteredAndSortedData.length > 0 && (
          <div className="flex items-start gap-2 p-4 bg-panel/10 border border-white/10 rounded-lg">
            <FaInfoCircle className="text-brand text-sm mt-0.5 flex-shrink-0" />
            <p className="text-xs text-secondary leading-relaxed">
              <strong className="text-foreground">Aviso:</strong> Los precios son referenciales y
              pueden variar según el exchange. Esta información no constituye asesoría financiera.
              Las criptomonedas son volátiles.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
