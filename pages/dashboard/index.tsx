/**
 * Dashboard Page (Refactored)
 *
 * Single Responsibility: Compose dashboard sections with centralized data
 * Follows React best practices: composition, SRP, clean architecture
 * File size: ~150 lines (down from 1710 lines - 91% reduction)
 */

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useFredData } from '@/hooks/useFredData';
import { useECBRates } from '@/hooks/useECBRates';
import { useECBHistorical } from '@/hooks/useECBHistorical';
import { useInflacion } from '@/hooks/useInflacion';
import { SEO } from '@/components/SEO';

// Extracted components
import { MarketsHeader } from '@/components/dashboard/MarketsHeader';
import { FavoritesSection } from '@/components/dashboard/FavoritesSection';
import { FavoriteChartsSection } from '@/components/dashboard/FavoriteChartsSection';
import { InflationSection } from '@/components/dashboard/InflationSection';
import { InternationalRatesSection } from '@/components/dashboard/InternationalRatesSection';
import { CryptoSection } from '@/components/dashboard/CryptoSection';
import { FredSection } from '@/components/dashboard/FredSection';
import { ECBSection } from '@/components/dashboard/ECBSection';
import { DolarSection } from '@/components/dashboard/DolarSection';

export default function DashboardPage() {
  const [showFredCharts, setShowFredCharts] = useState(false);
  const [showECBCharts, setShowECBCharts] = useState(false);
  const [selectedTableTab, setSelectedTableTab] = useState<
    'favoritos' | 'dolar' | 'internacional' | 'crypto'
  >('favoritos');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast, showToast, hideToast } = useToast();

  // Centralized data fetching
  const {
    dolares,
    cotizaciones,
    cryptos,
    selectedDolar,
    loadingDolares,
    loadingCotizaciones,
    loadingCryptos,
    cryptoPage,
    setCryptoPage,
    cryptoPerPage,
  } = useDashboardData();

  const { data: rawFredData, isLoading: fredLoading } = useFredData();
  // Adapt FRED data: hook returns null for nested fields, component expects undefined

  const fredData = rawFredData as any;
  const { data: ecbData, isLoading: ecbLoading } = useECBRates();
  const { data: ecbHistorical, isLoading: ecbHistoricalLoading } = useECBHistorical();
  const { data: inflacionData, isLoading: inflacionLoading } = useInflacion();

  // Favorites store
  const {
    dolares: favoriteDolarIds,
    currencies: favoriteCurrencyIds,
    cryptos: favoriteCryptoIds,
    charts: favoriteChartIds,
    toggleDolar,
    toggleCurrency,
    toggleCrypto,
    toggleChart,
  } = useFavoritesStore();

  // Derived favorites data
  const favoriteDolares = dolares?.filter((d) => favoriteDolarIds.includes(d.casa)) || [];
  const favoriteCurrencies =
    cotizaciones?.filter((c) => favoriteCurrencyIds.includes(c.moneda)) || [];
  const favoriteCryptos = cryptos?.filter((c) => favoriteCryptoIds.includes(c.id)) || [];

  // Filter data based on search query
  const filterBySearch = <T extends { nombre?: string; name?: string; casa?: string }>(
    items: T[] | undefined
  ): T[] => {
    if (!items) return [];
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const nombre = item.nombre?.toLowerCase() || '';
      const name = item.name?.toLowerCase() || '';
      const casa = item.casa?.toLowerCase() || '';
      return nombre.includes(query) || name.includes(query) || casa.includes(query);
    });
  };

  // Filtered data
  const filteredDolares = filterBySearch(dolares);
  const filteredCotizaciones = filterBySearch(cotizaciones);
  const filteredCryptos = filterBySearch(cryptos);
  const filteredFavoriteDolares = filterBySearch(favoriteDolares);
  const filteredFavoriteCurrencies = filterBySearch(favoriteCurrencies);
  const filteredFavoriteCryptos = filterBySearch(favoriteCryptos);

  // Handler for chart toggle with toast notifications
  const handleToggleChart = (chartId: string) => {
    const result = toggleChart(chartId);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error', 5000);
    }
  };

  return (
    <>
      <SEO
        title="Dashboard"
        description="Tu panel de control financiero completo. Seguí todas las cotizaciones del dólar, monedas internacionales, criptomonedas, inflación y más en tiempo real."
        noindex={true}
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Markets Header */}
          <MarketsHeader onSearch={setSearchQuery} />

          {/* Tabbed Tables Section */}
          <div className="space-y-4">
            {/* Tabs Navigation */}
            <div className="flex items-center gap-6 overflow-x-auto pb-3 border-b border-slate-700/10">
              <button
                onClick={() => setSelectedTableTab('favoritos')}
                className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
                  selectedTableTab === 'favoritos'
                    ? 'text-brand'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                <FaStar className="text-xs" />
                Favoritos
                {selectedTableTab === 'favoritos' && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
                )}
              </button>
              <button
                onClick={() => setSelectedTableTab('dolar')}
                className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative ${
                  selectedTableTab === 'dolar'
                    ? 'text-brand'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                Dólar
                {selectedTableTab === 'dolar' && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
                )}
              </button>
              <button
                onClick={() => setSelectedTableTab('internacional')}
                className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative ${
                  selectedTableTab === 'internacional'
                    ? 'text-brand'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                Internacional
                {selectedTableTab === 'internacional' && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
                )}
              </button>
              <button
                onClick={() => setSelectedTableTab('crypto')}
                className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative ${
                  selectedTableTab === 'crypto'
                    ? 'text-brand'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                Crypto
                {selectedTableTab === 'crypto' && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
                )}
              </button>
            </div>

            {/* Table Content */}
            {selectedTableTab === 'favoritos' && (
              <FavoritesSection
                favoriteDolares={filteredFavoriteDolares}
                favoriteCurrencies={filteredFavoriteCurrencies}
                favoriteCryptos={filteredFavoriteCryptos}
                selectedDolar={selectedDolar}
                onToggleDolar={toggleDolar}
                onToggleCurrency={toggleCurrency}
                onToggleCrypto={toggleCrypto}
              />
            )}

            {selectedTableTab === 'dolar' && (
              <DolarSection
                dolares={filteredDolares}
                loadingDolares={loadingDolares}
                favoriteDolarIds={favoriteDolarIds}
                onToggleDolar={toggleDolar}
              />
            )}

            {selectedTableTab === 'internacional' && (
              <InternationalRatesSection
                cotizaciones={filteredCotizaciones}
                loadingCotizaciones={loadingCotizaciones}
                favoriteCurrencyIds={favoriteCurrencyIds}
                onToggleCurrency={toggleCurrency}
              />
            )}

            {selectedTableTab === 'crypto' && (
              <CryptoSection
                cryptos={filteredCryptos}
                isLoading={loadingCryptos}
                selectedDolar={selectedDolar}
                favoriteCryptoIds={favoriteCryptoIds}
                cryptoPage={cryptoPage}
                cryptoPerPage={cryptoPerPage}
                onToggleFavorite={toggleCrypto}
                onPageChange={setCryptoPage}
              />
            )}
          </div>

          {/* Favorite Charts */}
          <FavoriteChartsSection
            favoriteChartIds={favoriteChartIds}
            inflacionData={inflacionData}
            fredData={fredData}
            ecbHistorical={ecbHistorical}
            onToggleChart={handleToggleChart}
          />

          {/* Inflation Section - Always Visible */}
          <InflationSection
            inflacionData={inflacionData}
            inflacionLoading={inflacionLoading}
            favoriteChartIds={favoriteChartIds}
            onToggleChart={handleToggleChart}
          />

          {/* FRED - USA Economic Data - Always Visible */}
          <FredSection
            fredData={fredData}
            fredLoading={fredLoading}
            showFredCharts={showFredCharts}
            onToggleCharts={() => setShowFredCharts(!showFredCharts)}
            favoriteChartIds={favoriteChartIds}
            onToggleChart={handleToggleChart}
          />

          {/* ECB - European Exchange Rates - Always Visible */}
          <ECBSection
            ecbData={ecbData}
            ecbLoading={ecbLoading}
            ecbHistorical={ecbHistorical}
            ecbHistoricalLoading={ecbHistoricalLoading}
            showECBCharts={showECBCharts}
            onToggleCharts={() => setShowECBCharts(!showECBCharts)}
            favoriteChartIds={favoriteChartIds}
            onToggleChart={handleToggleChart}
          />
        </div>

        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={toast.duration}
        />
      </DashboardLayout>
    </>
  );
}
