/**
 * FavoritesSection Component
 *
 * Single Responsibility: Display user's favorite items (dolares, currencies, cryptos)
 * Composition: Uses FavoritesList for rendering
 * Controlled Data Flow: Props down, events up
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FavoritesList } from './FavoritesList';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface FavoritesSectionProps {
  favoriteDolares: DolarWithVariation[];
  favoriteCurrencies: CotizacionWithVariation[];
  favoriteCryptos: CryptoData[];
  selectedDolar: Quotation | undefined;
  onToggleDolar: (casa: string) => void;
  onToggleCurrency: (moneda: string) => void;
  onToggleCrypto: (id: string) => void;
  onSelectItem?: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function FavoritesSection({
  favoriteDolares,
  favoriteCurrencies,
  favoriteCryptos,
  selectedDolar,
  onToggleDolar,
  onToggleCurrency,
  onToggleCrypto,
  onSelectItem,
}: FavoritesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const allFavorites = [...favoriteDolares, ...favoriteCurrencies, ...favoriteCryptos];

  // Pagination logic
  const totalPages = Math.ceil(allFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFavorites = allFavorites.slice(startIndex, endIndex);
  const displayedCount = Math.min(endIndex, allFavorites.length);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (allFavorites.length === 0) {
    return (
      <Card variant="outlined" padding="none" className="mb-8">
        <div className="text-center py-12 px-6">
          <FaStar className="text-5xl text-secondary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No tenés favoritos</h3>
          <p className="text-secondary mb-4">
            Agregá tus cotizaciones favoritas para verlas acá rápidamente
          </p>
          <p className="text-sm text-secondary">
            Hacé clic en la estrella ⭐ de cualquier cotización para agregarla a favoritos
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="none" className="mb-8">
      <div>
        <FavoritesList
          items={paginatedFavorites}
          selectedDolar={selectedDolar}
          onToggleDolar={onToggleDolar}
          onToggleCurrency={onToggleCurrency}
          onToggleCrypto={onToggleCrypto}
          onSelectItem={onSelectItem}
        />

        {/* Pagination Controls - Only show if more than ITEMS_PER_PAGE */}
        {allFavorites.length > ITEMS_PER_PAGE && (
          <div className="mt-4 pt-4 px-4 border-t border-slate-700/10 flex items-center justify-between">
            <div className="text-sm text-secondary">
              Mostrando {startIndex + 1} - {displayedCount} de {allFavorites.length}{' '}
              {allFavorites.length === 1 ? 'favorito' : 'favoritos'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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
  );
}
