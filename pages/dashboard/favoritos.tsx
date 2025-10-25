/**
 * Favoritos Page (Redesigned)
 *
 * Unified favorites view matching main dashboard UI
 * - Uses dashboard's FavoritesList component with all features
 * - Sparklines, expandable charts, sorting, pagination
 * - Full action buttons (chart, favorite, copy, share)
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { useCotizacionesWithVariations } from '@/hooks/useCotizaciones';
import { useCryptoQuery } from '@/hooks/useCryptoQuery';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useToastStore } from '@/lib/store/toast-store';
import { FavoritesList } from '@/components/dashboard/FavoritesList';
import { Card } from '@/components/ui/Card/Card';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function FavoritosPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching
  const { data: dolares } = useDolarVariations();
  const { data: cotizaciones } = useCotizacionesWithVariations();
  const { data: cryptos } = useCryptoQuery();

  const { addToast } = useToastStore();

  // Get state and actions from Zustand store
  const {
    dolares: favoriteDolarIds,
    currencies: favoriteCurrencyIds,
    cryptos: favoriteCryptoIds,
    toggleDolar,
    toggleCurrency,
    toggleCrypto,
  } = useFavoritesStore();

  // Derived favorites data
  const favoriteDolares = dolares?.filter((d) => favoriteDolarIds.includes(d.casa)) || [];
  const favoriteCurrencies =
    cotizaciones?.filter((c) => favoriteCurrencyIds.includes(c.moneda)) || [];
  const favoriteCryptos = cryptos?.filter((c) => favoriteCryptoIds.includes(c.id)) || [];

  // Combine all favorites
  const allFavorites = [...favoriteDolares, ...favoriteCurrencies, ...favoriteCryptos];
  const hasFavorites = allFavorites.length > 0;

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(allFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFavorites = allFavorites.slice(startIndex, endIndex);
  const displayedCount = Math.min(endIndex, allFavorites.length);

  // Handlers with toast notifications
  const handleToggleDolar = (casa: string) => {
    const result = toggleDolar(casa);
    addToast(result.message, result.success ? 'success' : 'info');
  };

  const handleToggleCurrency = (moneda: string) => {
    const result = toggleCurrency(moneda);
    addToast(result.message, result.success ? 'success' : 'info');
  };

  const handleToggleCrypto = (id: string) => {
    const result = toggleCrypto(id);
    addToast(result.message, result.success ? 'success' : 'info');
  };

  return (
    <>
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
                  <span className="text-foreground">Favoritos</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-12">
                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                  <FaStar className="text-brand text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Mis Favoritos</h1>
                  <p className="text-sm text-secondary mt-1">
                    Accede rápidamente a tus cotizaciones favoritas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorites List */}
          {!hasFavorites ? (
            <Card variant="outlined" padding="none">
              <div className="text-center py-16 px-6">
                <FaStar className="text-6xl text-secondary/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No tenés favoritos</h3>
                <p className="text-secondary mb-6 max-w-md mx-auto">
                  Agregá tus cotizaciones favoritas para verlas acá rápidamente. Hacé clic en la
                  estrella ⭐ de cualquier cotización.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-light transition-all hover:scale-[1.02] active:scale-95"
                >
                  Ir al Dashboard
                </button>
              </div>
            </Card>
          ) : (
            <Card variant="outlined" padding="none">
              <div>
                <FavoritesList
                  items={paginatedFavorites}
                  selectedDolar={dolares?.find((d) => d.casa === 'blue')}
                  onToggleDolar={handleToggleDolar}
                  onToggleCurrency={handleToggleCurrency}
                  onToggleCrypto={handleToggleCrypto}
                />

                {/* Pagination */}
                {allFavorites.length > ITEMS_PER_PAGE && (
                  <div className="mt-4 pt-4 px-4 border-t border-slate-700/10 flex items-center justify-between">
                    <div className="text-sm text-secondary">
                      Mostrando {startIndex + 1} - {displayedCount} de {allFavorites.length}{' '}
                      {allFavorites.length === 1 ? 'favorito' : 'favoritos'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          currentPage === 1
                            ? 'text-secondary/50 cursor-not-allowed'
                            : 'text-foreground hover:text-brand'
                        }`}
                      >
                        <FaChevronLeft className="text-xs" />
                        Anterior
                      </button>

                      <div className="px-4 py-2 rounded-lg">
                        <span className="text-sm font-semibold text-foreground">
                          Página {currentPage} de {totalPages}
                        </span>
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          currentPage === totalPages
                            ? 'text-secondary/50 cursor-not-allowed'
                            : 'text-foreground hover:text-brand'
                        }`}
                      >
                        Siguiente
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
