/**
 * CurrencyBadge Component
 *
 * Single Responsibility: Display currency badge with code (USD, EUR, GBP, etc.)
 * Professional alternative to flag emojis
 */

import React from 'react';

interface CurrencyBadgeProps {
  moneda: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Get color based on currency code
 */
function getCurrencyColor(moneda: string): string {
  const monedaUpper = moneda.toUpperCase();

  const colorMap: Record<string, string> = {
    USD: 'bg-green-500/20 text-green-400 border-green-500/30',
    EUR: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    GBP: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    BRL: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    CLP: 'bg-red-500/20 text-red-400 border-red-500/30',
    UYU: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ARS: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    JPY: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    CNY: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    CHF: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    CAD: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    MXN: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    AUD: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    NZD: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    INR: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    RUB: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    KRW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    SEK: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    NOK: 'bg-red-600/20 text-red-300 border-red-600/30',
    DKK: 'bg-rose-600/20 text-rose-300 border-rose-600/30',
    PLN: 'bg-pink-600/20 text-pink-300 border-pink-600/30',
    TRY: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
    ZAR: 'bg-green-600/20 text-green-300 border-green-600/30',
  };

  return colorMap[monedaUpper] || 'bg-brand/20 text-brand border-brand/30';
}

/**
 * Get full currency name for tooltip
 */
function getCurrencyName(moneda: string): string {
  const monedaUpper = moneda.toUpperCase();

  const nameMap: Record<string, string> = {
    USD: 'Dólar Estadounidense',
    EUR: 'Euro',
    GBP: 'Libra Esterlina',
    BRL: 'Real Brasileño',
    CLP: 'Peso Chileno',
    UYU: 'Peso Uruguayo',
    ARS: 'Peso Argentino',
    JPY: 'Yen Japonés',
    CNY: 'Yuan Chino',
    CHF: 'Franco Suizo',
    CAD: 'Dólar Canadiense',
    MXN: 'Peso Mexicano',
    AUD: 'Dólar Australiano',
    NZD: 'Dólar Neozelandés',
    INR: 'Rupia India',
    RUB: 'Rublo Ruso',
    KRW: 'Won Surcoreano',
    SEK: 'Corona Sueca',
    NOK: 'Corona Noruega',
    DKK: 'Corona Danesa',
    PLN: 'Zloty Polaco',
    TRY: 'Lira Turca',
    ZAR: 'Rand Sudafricano',
  };

  return nameMap[monedaUpper] || monedaUpper;
}

export function CurrencyBadge({ moneda, size = 'md', className = '' }: CurrencyBadgeProps) {
  const code = moneda.toUpperCase();
  const colorClasses = getCurrencyColor(moneda);
  const fullName = getCurrencyName(moneda);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[9px]',
    md: 'w-8 h-8 text-[10px]',
    lg: 'w-10 h-10 text-xs',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border flex items-center justify-center font-bold ${colorClasses} ${className}`}
      title={fullName}
    >
      {code}
    </div>
  );
}
