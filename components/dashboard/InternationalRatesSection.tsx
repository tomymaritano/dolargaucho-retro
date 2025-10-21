/**
 * InternationalRatesSection Component
 *
 * Single Responsibility: Display international currency exchange rates
 * Composition: Uses Card and CotizacionesTable components
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { CotizacionesTable } from '@/components/tables/CotizacionesTable';
import { FaGlobeAmericas } from 'react-icons/fa';

import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

interface InternationalRatesSectionProps {
  cotizaciones: CotizacionWithVariation[] | undefined;
  loadingCotizaciones: boolean;
  favoriteCurrencyIds: string[];
  onToggleCurrency: (currencyId: string) => void;
  onSelectCurrency?: (moneda: string) => void;
}

/**
 * Renders international rates section with CotizacionesTable
 * @param cotizaciones - Array of currency exchange rates
 * @param loadingCotizaciones - Loading state
 * @param favoriteCurrencyIds - Array of favorited currency IDs
 * @param onToggleCurrency - Function to toggle currency favorite status
 * @param onSelectCurrency - Function to select a currency for chart display
 */
export function InternationalRatesSection({
  cotizaciones,
  loadingCotizaciones,
  favoriteCurrencyIds,
  onToggleCurrency,
  onSelectCurrency,
}: InternationalRatesSectionProps) {
  return (
    <Card variant="outlined" padding="none">
      <CotizacionesTable
        cotizaciones={cotizaciones || []}
        isLoading={loadingCotizaciones}
        favoriteCurrencyIds={favoriteCurrencyIds}
        onToggleFavorite={onToggleCurrency}
        onSelectCurrency={onSelectCurrency}
      />
    </Card>
  );
}
