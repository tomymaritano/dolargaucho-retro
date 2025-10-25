/**
 * DolarAreaChart Component
 *
 * Professional area chart for dollar evolution (better than candlesticks for daily-only data)
 * Features:
 * - Multiple timeframes (7, 30, 90 days, all history)
 * - Baseline showing profit/loss vs starting price (INVERTED: up=red, down=green)
 * - Moving average
 * - Controls integrated INSIDE the chart (TradingView style)
 */

'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, AreaSeries, LineSeries, BaselineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { useCotizacionHistoricoRange } from '@/hooks/useCotizacionesHistoricoRange';
import { useCryptoHistoricoRange } from '@/hooks/useCryptoHistoricalRange';

interface DolarAreaChartProps {
  defaultCasa?: string; // e.g., "blue", "oficial", "eur", "bitcoin"
  title?: string;
  showCasaSelector?: boolean; // Show casa selector
  selectedCasa?: string; // Controlled casa from parent (e.g., from table selection)
  onCasaChange?: (casa: string) => void; // Callback when casa changes
  assetType?: 'dolar' | 'internacional' | 'crypto'; // Type of asset to display
}

const DOLAR_TYPES = [
  { value: 'blue', label: 'Blue' },
  { value: 'oficial', label: 'Oficial' },
  { value: 'bolsa', label: 'MEP' },
  { value: 'contadoconliqui', label: 'CCL' },
  { value: 'tarjeta', label: 'Tarjeta' },
] as const;

export const DolarAreaChart = React.memo(function DolarAreaChart({
  defaultCasa = 'blue',
  title,
  showCasaSelector = true,
  selectedCasa,
  onCasaChange,
  assetType = 'dolar',
}: DolarAreaChartProps) {
  const [internalCasa, setInternalCasa] = useState(defaultCasa);

  // Use controlled casa if provided, otherwise use internal state
  const casa = selectedCasa !== undefined ? selectedCasa : internalCasa;

  const handleCasaChange = useCallback(
    (newCasa: string) => {
      setInternalCasa(newCasa);
      onCasaChange?.(newCasa);
    },
    [onCasaChange]
  );

  const [timeframe, setTimeframe] = useState<7 | 30 | 90 | 365>(30);
  const [showMA, setShowMA] = useState(true);
  const [showBaseline, setShowBaseline] = useState(true);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<'Area' | 'Baseline'> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  // Fetch data based on asset type
  const { data: dolarHistoricalData, isLoading: dolarLoading } = useMultipleDolarHistoricoRange(
    [casa],
    timeframe === 365 ? 365 : timeframe,
    assetType === 'dolar'
  );

  const { data: cotizacionHistoricalData, isLoading: cotizacionLoading } =
    useCotizacionHistoricoRange(
      casa.toLowerCase(),
      timeframe === 365 ? 365 : timeframe,
      assetType === 'internacional'
    );

  const { data: cryptoHistoricalData, isLoading: cryptoLoading } = useCryptoHistoricoRange(
    casa, // CoinGecko IDs are already lowercase (bitcoin, ethereum, etc.)
    timeframe === 365 ? 365 : timeframe,
    assetType === 'crypto'
  );

  // Combine data based on asset type
  const historicalData =
    assetType === 'dolar'
      ? dolarHistoricalData
      : assetType === 'internacional' && cotizacionHistoricalData
        ? { [casa]: cotizacionHistoricalData }
        : assetType === 'crypto' && cryptoHistoricalData
          ? { [casa]: cryptoHistoricalData }
          : null;

  const isLoading =
    assetType === 'dolar'
      ? dolarLoading
      : assetType === 'internacional'
        ? cotizacionLoading
        : cryptoLoading;

  // Get display name based on asset type
  const getDisplayName = () => {
    if (title) return title;
    if (assetType === 'dolar') {
      return `Dólar ${DOLAR_TYPES.find((t) => t.value === casa)?.label || casa}`;
    }
    if (assetType === 'internacional') {
      return casa.toUpperCase();
    }
    // Crypto - capitalize first letter
    return casa.charAt(0).toUpperCase() + casa.slice(1);
  };

  // Convert historical data to chart format
  const { chartData, baselineValue, latestValue, firstValue, percentChange } = useMemo(() => {
    if (!historicalData || !historicalData[casa])
      return {
        chartData: [],
        baselineValue: 0,
        latestValue: 0,
        firstValue: 0,
        percentChange: 0,
      };

    const data = historicalData[casa].data;
    const chartData = data.map((point) => ({
      time: new Date(point.fecha).getTime() / 1000,
      value: point.valor,
    }));

    const firstValue = data[0]?.valor || 0;
    const latestValue = data[data.length - 1]?.valor || 0;
    const percentChange = firstValue > 0 ? ((latestValue - firstValue) / firstValue) * 100 : 0;

    return {
      chartData,
      baselineValue: firstValue,
      latestValue,
      firstValue,
      percentChange,
    };
  }, [historicalData, casa]);

  // Calculate moving average
  const maData = useMemo(() => {
    if (!showMA || chartData.length < 7) return [];

    const result: Array<{ time: number; value: number }> = [];
    const period = 7;

    for (let i = period - 1; i < chartData.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += chartData[i - j].value;
      }
      result.push({
        time: chartData[i].time,
        value: sum / period,
      });
    }

    return result;
  }, [chartData, showMA]);

  // Event handlers
  const handleTimeframeChange = useCallback((period: 7 | 30 | 90 | 365) => {
    setTimeframe(period);
  }, []);

  const handleToggleMA = useCallback(() => {
    setShowMA((prev) => !prev);
  }, []);

  const handleToggleBaseline = useCallback(() => {
    setShowBaseline((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#0D0D0D' },
        textColor: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(0, 71, 255, 0.5)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(0, 71, 255, 0.5)',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: 'transparent',
      },
      timeScale: {
        borderColor: 'transparent',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add main series (area or baseline)
    if (showBaseline && baselineValue > 0) {
      // Baseline series - INVERTIDO: subir = malo (rojo), bajar = bueno (verde) para el argentino
      const baselineSeries = chart.addSeries(BaselineSeries, {
        baseValue: { type: 'price', price: baselineValue },
        topLineColor: '#ef4444', // RED above baseline (dólar más caro = malo)
        topFillColor1: 'rgba(239, 68, 68, 0.28)',
        topFillColor2: 'rgba(239, 68, 68, 0.05)',
        bottomLineColor: '#10b981', // GREEN below baseline (dólar más barato = bueno)
        bottomFillColor1: 'rgba(16, 185, 129, 0.05)',
        bottomFillColor2: 'rgba(16, 185, 129, 0.28)',
        lineWidth: 2,
      });

      mainSeriesRef.current = baselineSeries as any;
      baselineSeries.setData(chartData as any);
    } else {
      // Regular area series
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: '#0047FF',
        topColor: 'rgba(0, 71, 255, 0.3)',
        bottomColor: 'rgba(0, 71, 255, 0.05)',
        lineWidth: 2,
      });

      mainSeriesRef.current = areaSeries as any;
      areaSeries.setData(chartData as any);
    }

    // Add moving average if enabled
    if (showMA && maData.length > 0) {
      const maSeries = chart.addSeries(LineSeries, {
        color: '#8B5CF6',
        lineWidth: 2,
      });

      maSeriesRef.current = maSeries as any;
      maSeries.setData(maData as any);
    }

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartData, maData, showMA, showBaseline, baselineValue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-background rounded-lg">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm text-secondary">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-background rounded-lg">
        <p className="text-sm text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  const isPositive = percentChange >= 0;

  // For crypto and internacional: green = up (good), red = down (bad)
  // For dolar: red = up (bad for Argentine), green = down (good)
  const getColorClass = () => {
    if (assetType === 'crypto' || assetType === 'internacional') {
      return isPositive ? 'text-green-400' : 'text-red-400';
    }
    // Dolar (inverted)
    return isPositive ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="relative">
      {/* Chart container */}
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />

      {/* Top: Title and all controls in one row (TradingView style) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-3">
        {/* Left: Title and stats */}
        <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/5 pointer-events-none">
          <h3 className="text-sm font-bold text-foreground">{getDisplayName()}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-brand">${latestValue.toFixed(2)}</span>
            <span className={`text-xs font-semibold ${getColorClass()}`}>
              {isPositive ? '▲' : '▼'} {Math.abs(percentChange).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right: All controls in one line */}
        <div className="flex items-center gap-2">
          {/* Casa selector (if enabled and is dolar) */}
          {showCasaSelector && assetType === 'dolar' && (
            <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border/5 p-1 flex gap-1">
              {DOLAR_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleCasaChange(type.value)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                    casa === type.value
                      ? 'bg-brand text-white'
                      : 'text-secondary hover:bg-panel/20 hover:text-foreground'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}

          {/* Timeframe selector */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border/5 p-1 flex gap-1">
            {([7, 30, 90, 365] as const).map((period) => (
              <button
                key={period}
                onClick={() => handleTimeframeChange(period)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  timeframe === period
                    ? 'bg-brand text-white'
                    : 'text-secondary hover:bg-panel/20 hover:text-foreground'
                }`}
              >
                {period === 365 ? 'MAX' : `${period}D`}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border/5 p-1 flex gap-1">
            <button
              onClick={handleToggleMA}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                showMA
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-secondary hover:bg-panel/20 hover:text-foreground'
              }`}
            >
              MA7
            </button>
            <button
              onClick={handleToggleBaseline}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                showBaseline
                  ? 'bg-brand/20 text-brand border border-brand/30'
                  : 'text-secondary hover:bg-panel/20 hover:text-foreground'
              }`}
            >
              BASE
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Legend overlay */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/5 flex gap-3 text-[10px]">
          {showBaseline ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-400 rounded-sm" />
                <span className="text-secondary">Más caro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-sm" />
                <span className="text-secondary">Más barato</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-brand" />
              <span className="text-secondary">Precio</span>
            </div>
          )}
          {showMA && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-purple-400" />
              <span className="text-secondary">MA7</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
