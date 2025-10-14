import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { useCotizacionesWithVariations } from '@/hooks/useCotizaciones';
import { useFavoritesStore } from '@/lib/store/favorites';
import Toast, { ToastType } from '@/components/Toast';
import { EmptyFavoritesState } from '@/components/favorites/EmptyFavoritesState';
import { FavoriteDolaresSection } from '@/components/favorites/FavoriteDolaresSection';
import { FavoriteCurrenciesSection } from '@/components/favorites/FavoriteCurrenciesSection';
import { AvailableDolaresSection } from '@/components/favorites/AvailableDolaresSection';
import { AvailableCurrenciesSection } from '@/components/favorites/AvailableCurrenciesSection';

/**
 * FavoritosPage
 *
 * Manage user's favorite exchange rates (dolares and currencies)
 * - Display favorite items with quick toggle
 * - Show all available items with favorite toggle
 * - Toast notifications for user actions
 */
export default function FavoritosPage() {
  const { data: dolares } = useDolarVariations();
  const { data: cotizaciones } = useCotizacionesWithVariations();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');

  // Get state and actions from Zustand store
  const {
    dolares: favoriteDolares,
    currencies: favoriteCurrencies,
    toggleDolar,
    toggleCurrency,
  } = useFavoritesStore();

  const showToast = (message: string, type: ToastType = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleToggleDolar = (casa: string) => {
    const result = toggleDolar(casa);
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const handleToggleCurrency = (moneda: string) => {
    const result = toggleCurrency(moneda);
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const favoriteDolaresData = React.useMemo(
    () => dolares?.filter((d) => favoriteDolares.includes(d.casa)) || [],
    [dolares, favoriteDolares]
  );

  const favoriteCotizacionesData = React.useMemo(
    () => cotizaciones?.filter((c) => favoriteCurrencies.includes(c.moneda)) || [],
    [cotizaciones, favoriteCurrencies]
  );

  const hasFavorites = React.useMemo(
    () => favoriteDolares.length > 0 || favoriteCurrencies.length > 0,
    [favoriteDolares.length, favoriteCurrencies.length]
  );

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={3000}
      />
      <DashboardLayout>
        {/* Empty State */}
        {!hasFavorites && <EmptyFavoritesState />}

        {/* Favorites Sections */}
        {hasFavorites && (
          <div className="space-y-8">
            <FavoriteDolaresSection
              dolares={favoriteDolaresData}
              onToggleFavorite={handleToggleDolar}
            />
            <FavoriteCurrenciesSection
              currencies={favoriteCotizacionesData}
              onToggleFavorite={handleToggleCurrency}
            />
          </div>
        )}

        {/* Available Items */}
        <AvailableDolaresSection
          dolares={dolares || []}
          favoriteDolares={favoriteDolares}
          onToggleFavorite={handleToggleDolar}
        />
        <AvailableCurrenciesSection
          currencies={cotizaciones || []}
          favoriteCurrencies={favoriteCurrencies}
          onToggleFavorite={handleToggleCurrency}
        />
      </DashboardLayout>
    </>
  );
}
