/**
 * FredLightweightChart Component
 *
 * Professional FRED chart using TradingView Lightweight Charts
 * Features:
 * - Area chart with gradient
 * - Controls integrated INSIDE the chart (TradingView style)
 * - Multiple timeframe options
 * - Responsive
 * - Dark theme
 */

'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';

interface FredDataPoint {
  date: string;
  value: number;
}

interface FredLightweightChartProps {
  data: FredDataPoint[];
  title: string;
  color?: string;
  formatValue?: (value: number) => string;
  height?: number;
}

export const FredLightweightChart = React.memo(function FredLightweightChart({
  data,
  title,
  color = '#3b82f6',
  formatValue = (value: number) => value.toFixed(2),
  height = 240,
}: FredLightweightChartProps) {
  const [monthsToShow, setMonthsToShow] = useState<6 | 12 | 24 | 60>(12);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  // Convert data to chart format
  const { chartData, latestValue, previousValue } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], latestValue: 0, previousValue: 0 };

    const limitedData = data.slice(-monthsToShow);
    const chartData = limitedData.map((point) => ({
      time: new Date(point.date).getTime() / 1000,
      value: point.value,
    }));

    const latestValue = limitedData[limitedData.length - 1]?.value || 0;
    const previousValue = limitedData[limitedData.length - 2]?.value || 0;

    return { chartData, latestValue, previousValue };
  }, [data, monthsToShow]);

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
          color: `${color}80`,
          width: 1,
          style: 3,
        },
        horzLine: {
          color: `${color}80`,
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
      lineColor: color,
      topColor: `${color}4D`,
      bottomColor: `${color}0D`,
      lineWidth: 2,
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
  }, [chartData, height, color]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-background rounded-lg" style={{ height }}>
        <p className="text-sm text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  const variation = latestValue - previousValue;
  const percentChange = previousValue !== 0 ? (variation / previousValue) * 100 : 0;
  const isPositive = variation >= 0;

  return (
    <div className="relative">
      {/* Chart container */}
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />

      {/* Top: Title and all controls in one row (TradingView style) */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between gap-2">
        {/* Left: Title and stats */}
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/5 pointer-events-none">
          <h3 className="text-[10px] font-bold text-foreground">{title}</h3>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-black" style={{ color }}>
              {formatValue(latestValue)}
            </span>
            <span
              className={`text-[9px] font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(percentChange).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right: Period selector */}
        <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-white/5 p-0.5 flex gap-0.5">
          {([6, 12, 24, 60] as const).map((period) => (
            <button
              key={period}
              onClick={() => setMonthsToShow(period)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                monthsToShow === period
                  ? 'bg-brand text-white'
                  : 'text-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {period === 60 ? '5Y' : `${period}M`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
