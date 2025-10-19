/**
 * usePriceFormatters Hook
 * Custom hook con formatters comunes para precios y números
 * Elimina duplicación de código entre componentes
 */

import { useMemo } from 'react';
import { CURRENCY_FORMAT, NUMBER_THRESHOLDS } from '@/constants';

/**
 * Hook que retorna funciones de formateo memorizadas
 * Evita re-crear estas funciones en cada render
 */
export function usePriceFormatters() {
  const formatPrice = useMemo(
    () => (price: number) => {
      return new Intl.NumberFormat(CURRENCY_FORMAT.locale, {
        style: 'currency',
        currency: CURRENCY_FORMAT.usd.currency,
        minimumFractionDigits: CURRENCY_FORMAT.usd.minimumFractionDigits,
        maximumFractionDigits:
          price < 1
            ? CURRENCY_FORMAT.usd.maximumFractionDigitsSmall
            : CURRENCY_FORMAT.usd.maximumFractionDigitsNormal,
      }).format(price);
    },
    []
  );

  const formatPriceARS = useMemo(
    () => (price: number) => {
      return price.toLocaleString(CURRENCY_FORMAT.locale, {
        minimumFractionDigits: CURRENCY_FORMAT.ars.minimumFractionDigits,
        maximumFractionDigits: CURRENCY_FORMAT.ars.maximumFractionDigits,
      });
    },
    []
  );

  const formatMarketCap = useMemo(
    () => (value: number) => {
      if (value >= NUMBER_THRESHOLDS.trillion) {
        return `$${(value / NUMBER_THRESHOLDS.trillion).toFixed(2)}T`;
      }
      if (value >= NUMBER_THRESHOLDS.billion) {
        return `$${(value / NUMBER_THRESHOLDS.billion).toFixed(2)}B`;
      }
      if (value >= NUMBER_THRESHOLDS.million) {
        return `$${(value / NUMBER_THRESHOLDS.million).toFixed(2)}M`;
      }
      return `$${(value / NUMBER_THRESHOLDS.thousand).toFixed(2)}K`;
    },
    []
  );

  const formatPercentage = useMemo(
    () =>
      (value: number, includeSign: boolean = true) => {
        const sign = includeSign && value > 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
      },
    []
  );

  return {
    formatPrice,
    formatPriceARS,
    formatMarketCap,
    formatPercentage,
  };
}
