/**
 * BCRAStatCard Component
 *
 * Single Responsibility: Display a single BCRA economic indicator stat card
 * with professional hover gradient effect
 *
 * Displays: Reservas, Tasas, Base Monetaria, EMAE
 */

import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { BCRAService } from '@/lib/services/BCRAService';

export type BCRAIndicatorType = 'reservas' | 'badlar' | 'tamar' | 'base-monetaria' | 'emae';

interface BCRAIndicatorConfig {
  id: BCRAIndicatorType;
  label: string;
  description: string;
  showChange?: boolean;
  invertColors?: boolean; // For rates where high is bad
}

interface BCRAStatCardProps {
  value: number;
  config: BCRAIndicatorConfig;
  variation?: number | null;
  onClick?: () => void;
  isLoading?: boolean;
}

/**
 * Format BCRA value based on indicator type
 */
function formatBCRAValue(value: number, indicatorType: BCRAIndicatorType): string {
  switch (indicatorType) {
    case 'reservas':
      return BCRAService.formatReservas(value);
    case 'badlar':
    case 'tamar':
      return BCRAService.formatTNA(value);
    case 'base-monetaria':
      return BCRAService.formatBaseMonetaria(value);
    case 'emae':
      return BCRAService.formatEMAE(value);
    default:
      return BCRAService.formatNumber(value);
  }
}

/**
 * Unified color classes matching site's design system
 * Same style as marketing cards and dashboard components
 */
function getColorClasses() {
  return {
    label: 'group-hover:text-brand',
    value: 'text-foreground group-hover:text-brand',
    description: 'group-hover:text-brand/60',
  };
}

export const BCRAStatCard = React.memo(function BCRAStatCard({
  value,
  config,
  variation,
  onClick,
  isLoading = false,
}: BCRAStatCardProps) {
  // Determine trend color
  const trendColor =
    variation !== null && variation !== undefined
      ? BCRAService.getTrendColor(variation, config.invertColors)
      : 'text-secondary';

  // Determine arrow icon
  const TrendIcon = !variation
    ? FaMinus
    : variation > 0.1
      ? FaArrowUp
      : variation < -0.1
        ? FaArrowDown
        : FaMinus;

  // Get unified color classes
  const colors = getColorClasses();

  return (
    <div
      className={`group relative p-4 md:p-5 rounded-xl bg-panel/50 border border-white/5 hover:border-brand/30 hover:bg-panel/80 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } overflow-hidden`}
      onClick={onClick}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand/0 via-brand/20 to-brand/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Label */}
        <p
          className={`text-xs md:text-sm font-semibold text-secondary mb-2 ${colors.label} transition-colors duration-300 uppercase tracking-wide`}
        >
          {config.label}
        </p>

        {/* Value */}
        {isLoading ? (
          <div className="h-8 md:h-10 bg-white/10 rounded animate-pulse mb-1" />
        ) : (
          <p
            className={`text-2xl md:text-3xl font-black ${colors.value} tabular-nums transition-all duration-300`}
          >
            {formatBCRAValue(value, config.id)}
          </p>
        )}

        {/* Variation indicator */}
        {config.showChange && variation !== null && variation !== undefined && !isLoading && (
          <div className="flex items-center gap-1.5 mt-1 mb-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <TrendIcon className={`text-xs ${trendColor}`} />
            <span className={`text-xs md:text-sm font-semibold ${trendColor}`}>
              {variation === 0
                ? 'Sin cambios'
                : `${variation > 0 ? '+' : ''}${variation.toFixed(2)}%`}
            </span>
          </div>
        )}

        {/* Description */}
        <p
          className={`text-[10px] md:text-xs text-secondary/60 ${colors.description} transition-colors duration-300`}
        >
          {config.description}
        </p>
      </div>
    </div>
  );
});

/**
 * Pre-configured BCRA indicator configs
 * Unified BingX blue theme for consistency
 */
export const BCRA_INDICATORS: Record<BCRAIndicatorType, BCRAIndicatorConfig> = {
  reservas: {
    id: 'reservas',
    label: 'Reservas Internacionales',
    description: 'BCRA - Millones de USD',
    showChange: true,
    invertColors: false, // High is good
  },
  badlar: {
    id: 'badlar',
    label: 'BADLAR',
    description: 'Tasa depósitos plazo fijo (TNA)',
    showChange: true,
    invertColors: true, // High is bad for depositors
  },
  tamar: {
    id: 'tamar',
    label: 'TAMAR',
    description: 'Tasa activa promedio (TNA)',
    showChange: true,
    invertColors: true, // High is bad for borrowers
  },
  'base-monetaria': {
    id: 'base-monetaria',
    label: 'Base Monetaria',
    description: 'Millones de ARS',
    showChange: true,
    invertColors: false,
  },
  emae: {
    id: 'emae',
    label: 'EMAE',
    description: 'Actividad Económica',
    showChange: false, // EMAE itself is a variation
    invertColors: false,
  },
};
