/**
 * RiesgoPaisLightweightChart Component
 *
 * Professional country risk chart using TradingView Lightweight Charts
 * Features:
 * - Area chart with gradient
 * - Controls integrated INSIDE the chart (TradingView style)
 * - Responsive
 * - Dark theme
 */

'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useRiesgoPais } from '@/hooks/useFinanzas';

interface RiesgoPaisLightweightChartProps {
  limit?: number;
  height?: number;
}

export const RiesgoPaisLightweightChart = React.memo(function RiesgoPaisLightweightChart({
  limit: defaultLimit = 60,
  height = 320,
}: RiesgoPaisLightweightChartProps) {
  const [limit, setLimit] = useState(defaultLimit);
  const { data: riesgoPais, isLoading } = useRiesgoPais();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  // Convert data to chart format
  const { chartData, latestValue, previousValue } = useMemo(() => {
    if (!riesgoPais) return { chartData: [], latestValue: 0, previousValue: 0 };

    const limitedData = riesgoPais.slice(-limit);
    const chartData = limitedData.map((r) => ({
      time: new Date(r.fecha).getTime() / 1000,
      value: r.valor,
    }));

    const latestValue = limitedData[limitedData.length - 1]?.valor || 0;
    const previousValue = limitedData[limitedData.length - 2]?.valor || 0;

    return { chartData, latestValue, previousValue };
  }, [riesgoPais, limit]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
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
          color: 'rgba(248, 113, 113, 0.5)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(248, 113, 113, 0.5)',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add area series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#f87171',
      topColor: 'rgba(248, 113, 113, 0.4)',
      bottomColor: 'rgba(248, 113, 113, 0.05)',
      lineWidth: 3,
    });

    seriesRef.current = areaSeries as any;
    areaSeries.setData(chartData as any);

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
  }, [chartData, height]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-background rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm text-secondary">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center bg-background rounded-lg" style={{ height }}>
        <p className="text-sm text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  const variation = latestValue - previousValue;
  const isPositive = variation >= 0;

  return (
    <div className="relative">
      {/* Chart container */}
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />

      {/* Top: Title and all controls in one row (TradingView style) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-3">
        {/* Left: Title and stats */}
        <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/5 pointer-events-none">
          <h3 className="text-sm font-bold text-foreground">Riesgo País</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-red-400">
              {latestValue.toLocaleString('es-AR')}
            </span>
            <span
              className={`text-xs font-semibold ${isPositive ? 'text-red-400' : 'text-green-400'}`}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(variation).toFixed(0)}pb
            </span>
          </div>
        </div>

        {/* Right: All controls in one line */}
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border/5 p-1 flex gap-1">
            {([30, 60, 90, 180] as const).map((period) => (
              <button
                key={period}
                onClick={() => setLimit(period)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  limit === period
                    ? 'bg-brand text-white'
                    : 'text-secondary hover:bg-panel/20 hover:text-foreground'
                }`}
              >
                {period}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Legend overlay */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/5 flex gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-red-400" />
            <span className="text-secondary">Riesgo País (pb)</span>
          </div>
        </div>
      </div>
    </div>
  );
});
