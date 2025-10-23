/**
 * Evolution Chart
 * Chart showing evolution of investment strategies over time
 * Uses Lightweight Charts with multiple line series
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle, LineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CalculatorChartContainer } from './CalculatorLayout';
import type { AnalisisCompleto } from '@/hooks/useMegaCalculadora';
import type { LineChartDataPoint, TickFormatter } from '@/types/charts';

interface EvolutionChartProps {
  chartData: AnalisisCompleto['chartData'];
}

export function EvolutionChart({ chartData }: EvolutionChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<ISeriesApi<'Line'>[]>([]);

  useEffect(() => {
    if (!chartContainerRef.current || !chartData.datasets || chartData.datasets.length === 0) {
      return;
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 384, // h-96 = 384px
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
          color: 'rgba(16, 185, 129, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: 'rgba(16, 185, 129, 0.5)',
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
          const index = typeof time === 'number' ? time : 0;
          return chartData.labels?.[index]?.toString() || '';
        }) as TickFormatter,
      },
    });

    chartRef.current = chart;
    seriesRefs.current = [];

    // Add a line series for each dataset
    chartData.datasets.forEach((dataset) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: dataset.borderColor?.toString() || '#10B981',
        lineWidth: 2,
        title: dataset.label,
      });

      // Convert data to Lightweight Charts format
      const data: LineChartDataPoint[] = (dataset.data as number[]).map((value, index) => ({
        time: index as Time,
        value: value,
      }));

      lineSeries.setData(data);
      seriesRefs.current.push(lineSeries);
    });

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
      seriesRefs.current = [];
    };
  }, [chartData]);

  return (
    <CalculatorChartContainer title="Evolución Comparativa de Estrategias" height="h-96">
      <div
        ref={chartContainerRef}
        className="rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </CalculatorChartContainer>
  );
}
