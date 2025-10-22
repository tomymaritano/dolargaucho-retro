/**
 * Crypto API Types
 * Types for cryptocurrency data from CoinGecko API
 */

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  // Campos adicionales con price_change_percentage
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  // Sparkline data (array de precios últimos 7 días)
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CryptoSimple {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price_usd: number;
  current_price_ars: number;
  price_change_24h: number;
  price_change_7d?: number;
  price_change_30d?: number;
  market_cap: number;
  volume_24h: number;
}

export interface CryptoHistoricalData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// IDs de las criptomonedas principales
export const MAIN_CRYPTO_IDS = [
  'bitcoin',
  'ethereum',
  'tether',
  'usd-coin',
  'dai',
  'binancecoin',
  'cardano',
  'dogecoin',
  'solana',
  'polkadot',
] as const;

export type CryptoId = (typeof MAIN_CRYPTO_IDS)[number];

// Mapeo de símbolos a nombres completos
export const CRYPTO_NAMES: Record<string, string> = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  usdt: 'Tether',
  usdc: 'USD Coin',
  dai: 'Dai',
  bnb: 'Binance Coin',
  ada: 'Cardano',
  doge: 'Dogecoin',
  sol: 'Solana',
  dot: 'Polkadot',
};
