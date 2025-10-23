/**
 * InflacionChart Component
 *
 * Single Responsibility: Render inflation evolution chart
 * Extracted from CalculadoraInflacion.tsx
 * Uses Lightweight Charts for professional visualization
 */

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, LineStyle, BaselineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CalculatorChartContainer } from './CalculatorLayout';
import type { BaselineChartDataPoint, TickFormatter } from '@/types/charts';

interface InflacionChartProps {
  futureValues: number[];
  years: number;
}

export function InflacionChart({ futureValues, years }: InflacionChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Baseline'> | null>(null);

  const isPowerDecreasing = useMemo(
    () => futureValues.length > 1 && futureValues[futureValues.length - 1] < futureValues[0],
    [futureValues]
  );

  const baselineValue = useMemo(() => futureValues[0] || 0, [futureValues]);

  useEffect(() => {
    if (!chartContainerRef.current || futureValues.length === 0) return;

    // Convertir datos al formato de Lightweight Charts
    // Usamos índices numéricos como time (años como índices)
    const chartData: BaselineChartDataPoint[] = futureValues.map((value, index) => ({
      time: index as Time,
      value: value,
    }));

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 320,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isPowerDecreasing ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: isPowerDecreasing ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
        timeVisible: false,
        tickMarkFormatter: ((time: Time) => {
          const year = typeof time === 'number' ? time : 0;
          return `${year} año${year === 1 ? '' : 's'}`;
        }) as TickFormatter,
      },
    });

    chartRef.current = chart;

    // Add baseline series (muestra profit/loss del poder adquisitivo)
    const baselineSeries = chart.addSeries(BaselineSeries, {
      baseValue: { type: 'price', price: baselineValue },
      topLineColor: '#10b981', // Verde si sube poder adquisitivo
      topFillColor1: 'rgba(16, 185, 129, 0.28)',
      topFillColor2: 'rgba(16, 185, 129, 0.05)',
      bottomLineColor: '#ef4444', // Rojo si baja poder adquisitivo
      bottomFillColor1: 'rgba(239, 68, 68, 0.05)',
      bottomFillColor2: 'rgba(239, 68, 68, 0.28)',
      lineWidth: 2,
    });

    seriesRef.current = baselineSeries;
    baselineSeries.setData(chartData);

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
  }, [futureValues, years, isPowerDecreasing, baselineValue]);

  return (
    <CalculatorChartContainer title="Evolución del Poder Adquisitivo">
      <div
        ref={chartContainerRef}
        className="rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </CalculatorChartContainer>
  );
}
