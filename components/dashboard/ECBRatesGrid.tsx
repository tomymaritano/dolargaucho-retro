/**
 * ECBRatesGrid Component
 *
 * Single Responsibility: Display grid of ECB exchange rate cards
 */

import React from 'react';
import { ECBRateCard } from './ECBRateCard';
import { ECB_CURRENCIES } from '@/lib/utils/ecbUtils';

interface ECBRatesData {
  rates: {
    USD: number;
    ARS?: number;
    GBP?: number;
    JPY?: number;
    CHF?: number;
    BRL?: number;
  };
  date: string;
}

interface ECBRatesGridProps {
  ecbData: ECBRatesData;
  onToggleCharts: () => void;
}

export function ECBRatesGrid({ ecbData, onToggleCharts }: ECBRatesGridProps) {
  // Define the order we want to display currencies
  const currencyOrder = ['USD', 'ARS', 'GBP', 'JPY', 'CHF', 'BRL'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {currencyOrder.map((currency) => {
        const rate = ecbData.rates[currency as keyof typeof ecbData.rates];
        if (rate === undefined) return null;

        const config = ECB_CURRENCIES[currency];
        if (!config) return null;

        return (
          <ECBRateCard key={currency} rate={rate} config={config} onToggleCharts={onToggleCharts} />
        );
      })}
    </div>
  );
}
