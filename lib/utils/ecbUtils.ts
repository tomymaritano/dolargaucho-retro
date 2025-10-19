/**
 * ecbUtils.ts - European Central Bank currency utilities
 *
 * Single Responsibility: Provide currency configuration and formatting for ECB rates
 */

export interface CurrencyConfig {
  code: string;
  label: string;
  description: string;
  symbol: string;
  decimals: number;
  color: string;
  chartId: string;
}

/**
 * Currency configuration for ECB rates
 */
export const ECB_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    label: 'EUR / USD',
    description: 'Dolar estadounidense',
    symbol: '$',
    decimals: 4,
    color: '#6366f1',
    chartId: 'ecb-usd',
  },
  ARS: {
    code: 'ARS',
    label: 'EUR / ARS',
    description: 'Peso argentino',
    symbol: '$',
    decimals: 2,
    color: '#8b5cf6',
    chartId: 'ecb-ars',
  },
  GBP: {
    code: 'GBP',
    label: 'EUR / GBP',
    description: 'Libra esterlina',
    symbol: '$',
    decimals: 4,
    color: '#10b981',
    chartId: 'ecb-gbp',
  },
  JPY: {
    code: 'JPY',
    label: 'EUR / JPY',
    description: 'Yen japones',
    symbol: '¥',
    decimals: 2,
    color: '#ef4444',
    chartId: 'ecb-jpy',
  },
  CHF: {
    code: 'CHF',
    label: 'EUR / CHF',
    description: 'Franco suizo',
    symbol: '',
    decimals: 4,
    color: '#f59e0b',
    chartId: 'ecb-chf',
  },
  BRL: {
    code: 'BRL',
    label: 'EUR / BRL',
    description: 'Real brasileno',
    symbol: 'R$',
    decimals: 4,
    color: '#f59e0b',
    chartId: 'ecb-brl',
  },
};

/**
 * Format ECB rate value with currency-specific formatting
 */
export function formatECBRate(value: number, currency: string): string {
  const config = ECB_CURRENCIES[currency];
  if (!config) return value.toFixed(2);

  const formatted = value.toFixed(config.decimals);
  return config.symbol ? `${config.symbol}${formatted}` : formatted;
}
