/**
 * DolarCandlestickChart Component
 *
 * Professional candlestick chart for dollar evolution
 * Features:
 * - Multiple timeframes (7, 30, 90 days)
 * - OHLC data from historical API
 * - Moving average
 * - Interactive controls
 */

'use client';

import React, { useState, useMemo } from 'react';
import { LightweightCandlestickChart, CandlestickData } from './LightweightCandlestickChart';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import type { Time } from 'lightweight-charts';

interface DolarCandlestickChartProps {
  defaultCasa?: string; // e.g., "blue", "oficial"
  title?: string;
  showCasaSelector?: boolean; // Show casa selector
}

const DOLAR_TYPES = [
  { value: 'blue', label: 'Blue' },
  { value: 'oficial', label: 'Oficial' },
  { value: 'bolsa', label: 'MEP' },
  { value: 'contadoconliqui', label: 'CCL' },
  { value: 'tarjeta', label: 'Tarjeta' },
] as const;

export const DolarCandlestickChart = React.memo(function DolarCandlestickChart({
  defaultCasa = 'blue',
  title,
  showCasaSelector = true,
}: DolarCandlestickChartProps) {
  const [casa, setCasa] = useState(defaultCasa);
  const [timeframe, setTimeframe] = useState<7 | 30 | 90 | 365>(30);
  const [showMA, setShowMA] = useState(true);

  const { data: historicalData, isLoading } = useMultipleDolarHistoricoRange(
    [casa],
    timeframe === 365 ? 365 : timeframe
  );

  // Convert historical data to OHLC candlesticks
  // Since we only have daily closing prices, we'll create synthetic OHLC
  const candlestickData: CandlestickData[] = useMemo(() => {
    if (!historicalData || !historicalData[casa]) return [];

    const data = historicalData[casa].data;

    return data.map((point, index) => {
      const valor = point.valor;
      const prevValor = index > 0 ? data[index - 1].valor : valor;
      const nextValor = index < data.length - 1 ? data[index + 1].valor : valor;

      // Create synthetic OHLC based on close price
      // This is a simplification - real OHLC would need intraday data
      const open = prevValor;
      const close = valor;
      const high = Math.max(open, close, valor * 1.002); // Add small variation
      const low = Math.min(open, close, valor * 0.998);

      return {
        time: (new Date(point.fecha).getTime() / 1000) as Time, // Convert to seconds
        open,
        high,
        low,
        close,
      };
    });
  }, [historicalData, casa]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-background rounded-lg border border-border">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm text-secondary">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (candlestickData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-background rounded-lg border border-border">
        <p className="text-sm text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Casa Selector */}
        {showCasaSelector && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary uppercase tracking-wider">Tipo:</span>
            {DOLAR_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setCasa(type.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  casa === type.value
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-secondary hover:bg-panel/20 hover:text-foreground'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Timeframe and MA */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary uppercase tracking-wider">Período:</span>
            {([7, 30, 90, 365] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === period
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-secondary hover:bg-panel/20 hover:text-foreground'
                }`}
              >
                {period === 365 ? 'Todo' : `${period}D`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMA(!showMA)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showMA
                ? 'bg-brand/10 text-brand border border-brand/30'
                : 'bg-white/5 text-secondary hover:bg-panel/20 hover:text-foreground'
            }`}
          >
            MA {showMA ? '✓' : ''}
          </button>
        </div>
      </div>

      {/* Chart */}
      <LightweightCandlestickChart
        data={candlestickData}
        height={400}
        showMA={showMA}
        maPeriod={7}
        title={
          title ||
          `Dólar ${DOLAR_TYPES.find((t) => t.value === casa)?.label || casa} - Evolución OHLC`
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-secondary px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-sm" />
          <span>Alza (Close {'>'} Open)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-error rounded-sm" />
          <span>Baja (Close {'<'} Open)</span>
        </div>
        {showMA && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-brand" />
            <span>Media Móvil 7D</span>
          </div>
        )}
      </div>
    </div>
  );
});
