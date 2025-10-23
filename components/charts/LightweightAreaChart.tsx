/**
 * LightweightAreaChart Component
 *
 * Professional area chart using TradingView Lightweight Charts
 * Perfect for crypto prices, dólar evolution, etc.
 * Features:
 * - Smooth area with gradient
 * - Baseline (shows profit/loss vs starting price)
 * - Responsive
 * - Dark theme
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, BaselineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';

export interface AreaChartData {
  time: Time; // Unix timestamp in seconds
  value: number;
}

interface LightweightAreaChartProps {
  data: AreaChartData[];
  width?: number | string;
  height?: number;
  color?: string;
  title?: string;
  showBaseline?: boolean; // Show profit/loss coloring
  baselineValue?: number; // Reference value for baseline
}

export const LightweightAreaChart = React.memo(function LightweightAreaChart({
  data,
  width = '100%',
  height = 300,
  color = '#0047FF',
  title,
  showBaseline = false,
  baselineValue,
}: LightweightAreaChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area' | 'Baseline'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: typeof width === 'number' ? width : chartContainerRef.current.clientWidth,
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

    // Add area or baseline series
    if (showBaseline && baselineValue !== undefined) {
      // Baseline series (shows profit/loss)
      const baselineSeries = chart.addSeries(BaselineSeries, {
        baseValue: { type: 'price', price: baselineValue },
        topLineColor: '#10b981', // Green above baseline
        topFillColor1: 'rgba(16, 185, 129, 0.28)',
        topFillColor2: 'rgba(16, 185, 129, 0.05)',
        bottomLineColor: '#ef4444', // Red below baseline
        bottomFillColor1: 'rgba(239, 68, 68, 0.05)',
        bottomFillColor2: 'rgba(239, 68, 68, 0.28)',
        lineWidth: 2,
      });

      seriesRef.current = baselineSeries;
      baselineSeries.setData(data);
    } else {
      // Regular area series
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: color,
        topColor: `${color}4D`, // 30% opacity
        bottomColor: `${color}0D`, // 5% opacity
        lineWidth: 2,
      });

      seriesRef.current = areaSeries;
      areaSeries.setData(data);
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
  }, [data, width, height, color, showBaseline, baselineValue]);

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-xs font-semibold text-foreground">{title}</p>
        </div>
      )}
      <div
        ref={chartContainerRef}
        className="rounded-lg overflow-hidden"
        style={{ width, height }}
      />
    </div>
  );
});
