/**
 * BCRAStatsGrid Component
 *
 * Single Responsibility: Display a grid of BCRA economic indicators
 *
 * Composition: Uses BCRAStatCard for individual stats
 * Data: Fetches from BCRA hooks
 */

import React from 'react';
import { BCRAStatCard, BCRA_INDICATORS } from './BCRAStatCard';
import { useReservasActual } from '@/hooks/useBCRAReservas';
import { useTasasActuales } from '@/hooks/useBCRATasas';
import { useEMAEActual } from '@/hooks/useEMAE';
import { useBaseMonetariaActual } from '@/hooks/useBaseMonetaria';

interface BCRAStatsGridProps {
  /**
   * Optional click handlers for each stat card
   */
  onCardClick?: (indicatorId: string) => void;

  /**
   * Which indicators to show
   * Default: all 4 priority indicators
   */
  indicators?: Array<'reservas' | 'badlar' | 'tamar' | 'base-monetaria' | 'emae'>;

  /**
   * Grid columns (responsive)
   * Default: 1 on mobile, 2 on md, 4 on lg
   */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const BCRAStatsGrid = React.memo(function BCRAStatsGrid({
  onCardClick,
  indicators = ['reservas', 'badlar', 'base-monetaria', 'emae'],
  columns = { mobile: 1, tablet: 2, desktop: 4 },
}: BCRAStatsGridProps) {
  // Fetch data from hooks
  const reservas = useReservasActual();
  const tasas = useTasasActuales();
  const emae = useEMAEActual();
  const baseMonetaria = useBaseMonetariaActual();

  // Grid responsive classes
  const gridCols = `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {/* Reservas Internacionales */}
      {indicators.includes('reservas') && (
        <BCRAStatCard
          value={reservas.value ?? 0}
          config={BCRA_INDICATORS.reservas}
          variation={reservas.variation}
          isLoading={reservas.isLoading}
          onClick={() => onCardClick?.('reservas')}
        />
      )}

      {/* BADLAR */}
      {indicators.includes('badlar') && (
        <BCRAStatCard
          value={tasas.badlar ?? 0}
          config={BCRA_INDICATORS.badlar}
          isLoading={tasas.isLoading}
          onClick={() => onCardClick?.('badlar')}
        />
      )}

      {/* TAMAR */}
      {indicators.includes('tamar') && (
        <BCRAStatCard
          value={tasas.tamar ?? 0}
          config={BCRA_INDICATORS.tamar}
          isLoading={tasas.isLoading}
          onClick={() => onCardClick?.('tamar')}
        />
      )}

      {/* Base Monetaria */}
      {indicators.includes('base-monetaria') && (
        <BCRAStatCard
          value={baseMonetaria.value ?? 0}
          config={BCRA_INDICATORS['base-monetaria']}
          variation={baseMonetaria.variation}
          isLoading={baseMonetaria.isLoading}
          onClick={() => onCardClick?.('base-monetaria')}
        />
      )}

      {/* EMAE */}
      {indicators.includes('emae') && (
        <BCRAStatCard
          value={emae.value ?? 0}
          config={BCRA_INDICATORS.emae}
          variation={emae.variation}
          isLoading={emae.isLoading}
          onClick={() => onCardClick?.('emae')}
        />
      )}
    </div>
  );
});

/**
 * Simplified version for dashboard header
 * Shows only the 4 priority indicators in a compact row
 */
export const BCRAStatsCompact = React.memo(function BCRAStatsCompact() {
  return (
    <BCRAStatsGrid
      indicators={['reservas', 'badlar', 'base-monetaria', 'emae']}
      columns={{ mobile: 2, tablet: 4, desktop: 4 }}
    />
  );
});
