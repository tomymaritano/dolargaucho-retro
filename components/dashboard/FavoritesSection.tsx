/**
 * FavoritesSection Component
 *
 * Single Responsibility: Display user's favorite items (dolares, currencies, cryptos)
 * Composition: Uses FavoritesList for rendering
 * Controlled Data Flow: Props down, events up
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaStar } from 'react-icons/fa';
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
}

export function FavoritesSection({
  favoriteDolares,
  favoriteCurrencies,
  favoriteCryptos,
  selectedDolar,
  onToggleDolar,
  onToggleCurrency,
  onToggleCrypto,
}: FavoritesSectionProps) {
  const allFavorites = [...favoriteDolares, ...favoriteCurrencies, ...favoriteCryptos];

  if (allFavorites.length === 0) {
    return (
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="text-center py-8">
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
    <Card variant="elevated" padding="lg" className="mb-8">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaStar className="text-accent-emerald text-xl" />
            <div>
              <Card.Title className="mb-0">Mis Favoritos</Card.Title>
              <p className="text-sm text-secondary mt-1">
                {allFavorites.length} {allFavorites.length === 1 ? 'favorito' : 'favoritos'}
              </p>
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <FavoritesList
          items={allFavorites}
          selectedDolar={selectedDolar}
          onToggleDolar={onToggleDolar}
          onToggleCurrency={onToggleCurrency}
          onToggleCrypto={onToggleCrypto}
        />
      </Card.Content>
    </Card>
  );
}
