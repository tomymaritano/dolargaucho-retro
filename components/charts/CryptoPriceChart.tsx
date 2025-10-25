/**
 * CryptoPriceChart Component
 *
 * Professional price chart for cryptocurrencies
 * Features:
 * - Area chart with baseline (profit/loss coloring)
 * - 30-day historical data
 * - Price change indicator
 * - Responsive
 */

'use client';

import React, { useMemo } from 'react';
import { LightweightAreaChart, AreaChartData } from './LightweightAreaChart';
import type { CryptoData } from '@/types/api/crypto';
import type { Time } from 'lightweight-charts';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface CryptoPriceChartProps {
  crypto: CryptoData;
  height?: number;
  showBaseline?: boolean;
}

export const CryptoPriceChart = React.memo(function CryptoPriceChart({
  crypto,
  height = 300,
  showBaseline = true,
}: CryptoPriceChartProps) {
  // Convert sparkline data to chart format
  const chartData: AreaChartData[] = useMemo(() => {
    if (!crypto.sparkline_in_7d?.price || crypto.sparkline_in_7d.price.length === 0) {
      return [];
    }

    const prices = crypto.sparkline_in_7d.price;
    const now = Date.now();
    const intervalMs = (30 * 24 * 60 * 60 * 1000) / prices.length; // 30 days divided by number of points

    return prices.map((price, index) => ({
      time: Math.floor((now - (prices.length - index) * intervalMs) / 1000) as Time, // Convert to seconds
      value: price,
    }));
  }, [crypto.sparkline_in_7d]);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-background rounded-lg border border-border/5"
        style={{ height }}
      >
        <p className="text-xs text-secondary">No hay datos de gráfico disponibles</p>
      </div>
    );
  }

  const firstPrice = chartData[0].value;
  const lastPrice = chartData[chartData.length - 1].value;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-3">
      {/* Header with price info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-xs text-secondary mb-1">{crypto.name}</p>
          <p className="text-2xl font-bold text-foreground">
            $
            {crypto.current_price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary mb-1">30 días</p>
          <div
            className={`flex items-center gap-1 text-sm font-bold ${
              isPositive ? 'text-success' : 'text-error'
            }`}
          >
            {isPositive ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
            <span>
              {isPositive ? '+' : ''}
              {priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <LightweightAreaChart
        data={chartData}
        height={height}
        color={isPositive ? '#10b981' : '#ef4444'}
        showBaseline={showBaseline}
        baselineValue={firstPrice}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-1 pt-2 border-t border-border/10">
        <div>
          <p className="text-[10px] text-secondary mb-0.5">Market Cap</p>
          <p className="text-xs font-semibold text-foreground">
            ${(crypto.market_cap / 1_000_000_000).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className="text-[10px] text-secondary mb-0.5">24h High</p>
          <p className="text-xs font-semibold text-success">${crypto.high_24h.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] text-secondary mb-0.5">24h Low</p>
          <p className="text-xs font-semibold text-error">${crypto.low_24h.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
});
