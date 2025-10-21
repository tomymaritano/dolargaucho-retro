/**
 * LightweightCandlestickChart Component
 *
 * Professional candlestick chart using TradingView Lightweight Charts
 * Features:
 * - OHLC candlesticks
 * - Volume histogram
 * - Moving averages (SMA)
 * - Responsive
 * - Dark theme matching DolarGaucho
 */

'use client';

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';

export interface CandlestickData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: number;
  value: number;
  color?: string;
}

interface LightweightCandlestickChartProps {
  data: CandlestickData[];
  volumeData?: VolumeData[];
  width?: number | string;
  height?: number;
  showVolume?: boolean;
  showMA?: boolean; // Moving Average
  maPeriod?: number;
  title?: string;
}

export function LightweightCandlestickChart({
  data,
  volumeData,
  width = '100%',
  height = 400,
  showVolume = false,
  showMA = false,
  maPeriod = 7,
  title,
}: LightweightCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

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
        mode: 1, // Normal crosshair
        vertLine: {
          color: 'rgba(0, 71, 255, 0.5)',
          width: 1,
          style: 3, // Dashed
        },
        horzLine: {
          color: 'rgba(0, 71, 255, 0.5)',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.3 : 0.1,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', // Green for up
      downColor: '#ef4444', // Red for down
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries as any;
    candlestickSeries.setData(data as any);

    // Add volume series if enabled
    if (showVolume && volumeData && volumeData.length > 0) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: 'rgba(0, 71, 255, 0.3)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Create separate price scale
      });

      (volumeSeries as any).priceScale().applyOptions({
        scaleMargins: {
          top: 0.7, // Volume takes bottom 30%
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries as any;
      volumeSeries.setData(volumeData as any);
    }

    // Add moving average if enabled
    if (showMA && data.length >= maPeriod) {
      const maData = calculateSMA(data, maPeriod);
      const maSeries = chart.addSeries(LineSeries, {
        color: '#0047FF',
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
  }, [data, volumeData, width, height, showVolume, showMA, maPeriod]);

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
}

/**
 * Calculate Simple Moving Average (SMA)
 */
function calculateSMA(
  data: CandlestickData[],
  period: number
): Array<{ time: number; value: number }> {
  const result: Array<{ time: number; value: number }> = [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return result;
}
