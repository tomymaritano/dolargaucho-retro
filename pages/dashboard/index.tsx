/**
 * Dashboard Page (Refactored)
 *
 * Single Responsibility: Compose dashboard sections with centralized data
 * Follows React best practices: composition, SRP, clean architecture
 * File size: ~150 lines (down from 1710 lines - 91% reduction)
 */

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useFredData } from '@/hooks/useFredData';
import { useECBRates } from '@/hooks/useECBRates';
import { useECBHistorical } from '@/hooks/useECBHistorical';
import { useInflacion } from '@/hooks/useInflacion';

// Extracted components
import { HeroBanner } from '@/components/dashboard/HeroBanner';
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
    selectedDolarType,
    setSelectedDolarType,
  } = useDashboardData();

  const { data: rawFredData, isLoading: fredLoading } = useFredData();
  // Adapt FRED data: hook returns null for nested fields, component expects undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <DashboardLayout>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Favorites Section */}
      <FavoritesSection
        favoriteDolares={favoriteDolares}
        favoriteCurrencies={favoriteCurrencies}
        favoriteCryptos={favoriteCryptos}
        selectedDolar={selectedDolar}
        onToggleDolar={toggleDolar}
        onToggleCurrency={toggleCurrency}
        onToggleCrypto={toggleCrypto}
      />

      {/* Favorite Charts */}
      <FavoriteChartsSection
        favoriteChartIds={favoriteChartIds}
        inflacionData={inflacionData}
        fredData={fredData}
        ecbHistorical={ecbHistorical}
        onToggleChart={handleToggleChart}
      />

      {/* Inflation & International Rates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InflationSection
          inflacionData={inflacionData}
          inflacionLoading={inflacionLoading}
          favoriteChartIds={favoriteChartIds}
          onToggleChart={handleToggleChart}
        />

        <InternationalRatesSection
          cotizaciones={cotizaciones}
          loadingCotizaciones={loadingCotizaciones}
          favoriteCurrencyIds={favoriteCurrencyIds}
          onToggleCurrency={toggleCurrency}
        />
      </div>

      {/* Cryptocurrencies */}
      <CryptoSection
        cryptos={cryptos}
        isLoading={loadingCryptos}
        selectedDolar={selectedDolar}
        selectedDolarType={selectedDolarType}
        favoriteCryptoIds={favoriteCryptoIds}
        cryptoPage={cryptoPage}
        cryptoPerPage={cryptoPerPage}
        onToggleFavorite={toggleCrypto}
        onPageChange={setCryptoPage}
        onDolarTypeChange={setSelectedDolarType}
      />

      {/* FRED - USA Economic Data */}
      <FredSection
        fredData={fredData}
        fredLoading={fredLoading}
        showFredCharts={showFredCharts}
        onToggleCharts={() => setShowFredCharts(!showFredCharts)}
        favoriteChartIds={favoriteChartIds}
        onToggleChart={handleToggleChart}
      />

      {/* ECB - European Exchange Rates */}
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

      {/* Dollar Rates */}
      <DolarSection
        dolares={dolares}
        loadingDolares={loadingDolares}
        favoriteDolarIds={favoriteDolarIds}
        onToggleDolar={toggleDolar}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </DashboardLayout>
  );
}
