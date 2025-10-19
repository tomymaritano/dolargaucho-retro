/**
 * DolarLogo Component
 *
 * Single Responsibility: Display dollar type logo with initials
 * Examples: CCL, MEP, BLUE, OFICIAL, TARJETA
 */

import React from 'react';

interface DolarLogoProps {
  casa: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Get initials from casa name
 * Examples:
 * - "contadoconliqui" -> "CCL"
 * - "blue" -> "BLU"
 * - "oficial" -> "OFC"
 * - "mep" -> "MEP"
 * - "tarjeta" -> "TAR"
 */
function getDolarInitials(casa: string): string {
  const casaLower = casa.toLowerCase();

  // Special cases mapping
  const specialCases: Record<string, string> = {
    contadoconliqui: 'CCL',
    blue: 'BLU',
    oficial: 'OFC',
    mep: 'MEP',
    tarjeta: 'TAR',
    cripto: 'CRI',
    mayorista: 'MAY',
    bolsa: 'BOL',
  };

  if (specialCases[casaLower]) {
    return specialCases[casaLower];
  }

  // Default: take first 3 letters and uppercase
  return casaLower.substring(0, 3).toUpperCase();
}

/**
 * Get color based on casa type
 */
function getDolarColor(casa: string): string {
  const casaLower = casa.toLowerCase();

  const colorMap: Record<string, string> = {
    contadoconliqui: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    oficial: 'bg-green-500/20 text-green-400 border-green-500/30',
    mep: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    tarjeta: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    cripto: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    mayorista: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    bolsa: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  return colorMap[casaLower] || 'bg-brand/20 text-brand border-brand/30';
}

export function DolarLogo({ casa, size = 'md', className = '' }: DolarLogoProps) {
  const initials = getDolarInitials(casa);
  const colorClasses = getDolarColor(casa);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[9px]',
    md: 'w-8 h-8 text-[10px]',
    lg: 'w-10 h-10 text-xs',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border flex items-center justify-center font-bold ${colorClasses} ${className}`}
      title={casa}
    >
      {initials}
    </div>
  );
}
