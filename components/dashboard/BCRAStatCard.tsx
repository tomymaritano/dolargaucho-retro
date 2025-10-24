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

/**
 * Get fixed Tailwind color classes based on indicator type
 * This ensures proper compilation with Tailwind JIT
 */
function getColorClasses(indicatorType: BCRAIndicatorType) {
  switch (indicatorType) {
    case 'reservas':
      return {
        border: 'hover:border-green-500/50',
        gradient: 'bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/5',
        label: 'group-hover:text-green-400',
        value: 'text-green-500',
        description: 'group-hover:text-green-500/80',
        shine: 'bg-gradient-to-tr from-transparent via-green-500/10 to-transparent',
      };
    case 'badlar':
      return {
        border: 'hover:border-blue-500/50',
        gradient: 'bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5',
        label: 'group-hover:text-blue-400',
        value: 'text-blue-500',
        description: 'group-hover:text-blue-500/80',
        shine: 'bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent',
      };
    case 'tamar':
      return {
        border: 'hover:border-purple-500/50',
        gradient: 'bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/5',
        label: 'group-hover:text-purple-400',
        value: 'text-purple-500',
        description: 'group-hover:text-purple-500/80',
        shine: 'bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent',
      };
    case 'base-monetaria':
      return {
        border: 'hover:border-amber-500/50',
        gradient: 'bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5',
        label: 'group-hover:text-amber-400',
        value: 'text-amber-500',
        description: 'group-hover:text-amber-500/80',
        shine: 'bg-gradient-to-tr from-transparent via-amber-500/10 to-transparent',
      };
    case 'emae':
      return {
        border: 'hover:border-cyan-500/50',
        gradient: 'bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/5',
        label: 'group-hover:text-cyan-400',
        value: 'text-cyan-500',
        description: 'group-hover:text-cyan-500/80',
        shine: 'bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent',
      };
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

  // Get fixed color classes
  const colors = getColorClasses(config.id);

  return (
    <div
      className={`group relative p-4 rounded-lg glass border border-border ${colors.border} transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } overflow-hidden`}
      onClick={onClick}
    >
      {/* Professional gradient overlay on hover */}
      <div
        className={`absolute inset-0 ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Label */}
        <p className={`text-xs text-secondary mb-2 ${colors.label} transition-colors duration-300`}>
          {config.label}
        </p>

        {/* Value */}
        {isLoading ? (
          <div className="h-8 bg-secondary/10 rounded animate-pulse mb-1" />
        ) : (
          <p
            className={`text-2xl font-bold ${colors.value} tabular-nums group-hover:scale-105 transition-transform duration-300`}
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
          className={`text-[10px] text-secondary mt-1 ${colors.description} transition-colors duration-300`}
        >
          {config.description}
        </p>
      </div>

      {/* Subtle shine effect on hover */}
      <div
        className={`absolute inset-0 ${colors.shine} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}
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
