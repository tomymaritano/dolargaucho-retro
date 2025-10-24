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
  color: string; // Tailwind color class
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

  return (
    <div
      className={`group relative p-4 rounded-lg glass border border-border hover:border-${config.color}/50 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } overflow-hidden`}
      onClick={onClick}
    >
      {/* Professional gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${config.color}/0 via-${config.color}/0 to-${config.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Label */}
        <p
          className={`text-xs text-secondary mb-2 group-hover:text-${config.color} transition-colors duration-300`}
        >
          {config.label}
        </p>

        {/* Value */}
        {isLoading ? (
          <div className="h-8 bg-secondary/10 rounded animate-pulse mb-1" />
        ) : (
          <p
            className={`text-2xl font-bold text-${config.color} tabular-nums group-hover:scale-105 transition-transform duration-300`}
          >
            {formatBCRAValue(value, config.id)}
          </p>
        )}

        {/* Variation indicator */}
        {config.showChange && variation !== null && variation !== undefined && !isLoading && (
          <div className="flex items-center gap-1 mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <TrendIcon className={`text-[10px] ${trendColor}`} />
            <span className="text-[10px] text-secondary">
              {variation === 0
                ? 'Sin cambios'
                : `${variation > 0 ? '+' : ''}${variation.toFixed(2)}%`}
            </span>
          </div>
        )}

        {/* Description */}
        <p
          className={`text-[10px] text-secondary mt-1 group-hover:text-${config.color}/80 transition-colors duration-300`}
        >
          {config.description}
        </p>
      </div>

      {/* Subtle shine effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-${config.color}/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}
      />
    </div>
  );
});

/**
 * Pre-configured BCRA indicator configs
 */
export const BCRA_INDICATORS: Record<BCRAIndicatorType, BCRAIndicatorConfig> = {
  reservas: {
    id: 'reservas',
    label: 'Reservas Internacionales',
    description: 'BCRA - Millones de USD',
    color: 'green-500',
    showChange: true,
    invertColors: false, // High is good
  },
  badlar: {
    id: 'badlar',
    label: 'BADLAR',
    description: 'Tasa depósitos plazo fijo (TNA)',
    color: 'blue-500',
    showChange: true,
    invertColors: true, // High is bad for depositors
  },
  tamar: {
    id: 'tamar',
    label: 'TAMAR',
    description: 'Tasa activa promedio (TNA)',
    color: 'purple-500',
    showChange: true,
    invertColors: true, // High is bad for borrowers
  },
  'base-monetaria': {
    id: 'base-monetaria',
    label: 'Base Monetaria',
    description: 'Millones de ARS',
    color: 'amber-500',
    showChange: true,
    invertColors: false,
  },
  emae: {
    id: 'emae',
    label: 'EMAE',
    description: 'Actividad Económica (variación)',
    color: 'cyan-500',
    showChange: false, // EMAE itself is a variation
    invertColors: false,
  },
};
