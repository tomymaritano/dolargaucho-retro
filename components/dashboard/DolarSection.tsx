/**
 * DolarSection Component
 *
 * Single Responsibility: Display all dollar exchange rate quotations
 * Composition: Uses Card and DolaresTable components
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { DolaresTable } from '@/components/tables/DolaresTable';

import type { DolarWithVariation } from '@/hooks/useDolarVariations';

interface DolarSectionProps {
  dolares: DolarWithVariation[] | undefined;
  loadingDolares: boolean;
  favoriteDolarIds: string[];
  onToggleDolar: (dolarId: string) => void;
  onSelectDolar?: (casa: string) => void;
}

/**
 * Renders dollar exchange rates section with DolaresTable
 * @param dolares - Array of dollar exchange rates
 * @param loadingDolares - Loading state
 * @param favoriteDolarIds - Array of favorited dollar IDs
 * @param onToggleDolar - Function to toggle dollar favorite status
 * @param onSelectDolar - Function to select a dollar for chart display
 */
export function DolarSection({
  dolares,
  loadingDolares,
  favoriteDolarIds,
  onToggleDolar,
  onSelectDolar,
}: DolarSectionProps) {
  return (
    <Card variant="outlined" padding="none">
      <DolaresTable
        dolares={dolares || []}
        isLoading={loadingDolares}
        favoriteDolarIds={favoriteDolarIds}
        onToggleFavorite={onToggleDolar}
        onSelectDolar={onSelectDolar}
      />
    </Card>
  );
}
