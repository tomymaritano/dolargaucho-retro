/**
 * InflacionLightweightChart Component
 *
 * Professional inflation chart using TradingView Lightweight Charts
 * Features:
 * - Multiple series (mensual + interanual)
 * - Controls integrated INSIDE the chart (TradingView style)
 * - Responsive
 * - Dark theme
 */

'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useInflacionMensual, useInflacionInteranual } from '@/hooks/useFinanzas';

interface InflacionLightweightChartProps {
  showInteranual?: boolean;
  limit?: number;
  height?: number;
}

export const InflacionLightweightChart = React.memo(function InflacionLightweightChart({
  showInteranual: defaultShowInteranual = true,
  limit: defaultLimit = 12,
  height = 320,
}: InflacionLightweightChartProps) {
  const [limit, setLimit] = useState(defaultLimit);
  const [showInteranual, setShowInteranual] = useState(defaultShowInteranual);

  const { data: mensual, isLoading: loadingMensual } = useInflacionMensual();
  const { data: interanual, isLoading: loadingInteranual } = useInflacionInteranual();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mensualSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const interanualSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const isLoading = loadingMensual || (showInteranual && loadingInteranual);

  // Convert data to chart format
  const { mensualData, interanualData, latestMensual, previousMensual } = useMemo(() => {
    if (!mensual)
      return { mensualData: [], interanualData: [], latestMensual: 0, previousMensual: 0 };

    const limitedMensual = mensual.slice(-limit);
    const mensualData = limitedMensual.map((m) => ({
      time: new Date(m.fecha).getTime() / 1000,
      value: m.valor,
    }));

    const interanualData =
      showInteranual && interanual
        ? interanual.slice(-limit).map((i) => ({
            time: new Date(i.fecha).getTime() / 1000,
            value: i.valor,
          }))
        : [];

    const latestMensual = limitedMensual[limitedMensual.length - 1]?.valor || 0;
    const previousMensual = limitedMensual[limitedMensual.length - 2]?.valor || 0;

    return { mensualData, interanualData, latestMensual, previousMensual };
  }, [mensual, interanual, showInteranual, limit]);

  useEffect(() => {
    if (!chartContainerRef.current || mensualData.length === 0) return;

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
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add mensual line
    const mensualSeries = chart.addSeries(LineSeries, {
      color: '#0047FF',
      lineWidth: 3,
      title: 'Mensual',
    });
    mensualSeriesRef.current = mensualSeries as any;
    mensualSeries.setData(mensualData as any);

    // Add interanual line if enabled
    if (showInteranual && interanualData.length > 0) {
      const interanualSeries = chart.addSeries(LineSeries, {
        color: '#8B5CF6',
        lineWidth: 3,
        title: 'Interanual',
      });
      interanualSeriesRef.current = interanualSeries as any;
      interanualSeries.setData(interanualData as any);
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
  }, [mensualData, interanualData, showInteranual, height]);

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

  if (mensualData.length === 0) {
    return (
      <div className="flex items-center justify-center bg-background rounded-lg" style={{ height }}>
        <p className="text-sm text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  const changeMensual = latestMensual - previousMensual;
  const isPositive = changeMensual >= 0;

  return (
    <div className="relative">
      {/* Chart container */}
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />

      {/* Top: Title and all controls in one row (TradingView style) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-3">
        {/* Left: Title and stats */}
        <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5 pointer-events-none">
          <h3 className="text-sm font-bold text-foreground">Inflación</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-brand">{latestMensual.toFixed(1)}%</span>
            <span
              className={`text-xs font-semibold ${isPositive ? 'text-red-400' : 'text-green-400'}`}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(changeMensual).toFixed(1)}pp
            </span>
          </div>
        </div>

        {/* Right: All controls in one line */}
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-white/5 p-1 flex gap-1">
            {([6, 12, 24, 36] as const).map((period) => (
              <button
                key={period}
                onClick={() => setLimit(period)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  limit === period
                    ? 'bg-brand text-white'
                    : 'text-secondary hover:bg-white/10 hover:text-foreground'
                }`}
              >
                {period}M
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-white/5 p-1 flex gap-1">
            <button
              onClick={() => setShowInteranual(!showInteranual)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                showInteranual
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              Interanual
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Legend overlay */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5 flex gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-brand" />
            <span className="text-secondary">Mensual</span>
          </div>
          {showInteranual && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-[#8B5CF6]" />
              <span className="text-secondary">Interanual</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
