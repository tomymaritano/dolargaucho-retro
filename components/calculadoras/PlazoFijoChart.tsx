/**
 * PlazoFijoChart Component
 *
 * Single Responsibility: Render plazo fijo evolution chart
 * Extracted from CalculadoraPlazoFijo.tsx
 * Uses Lightweight Charts for professional visualization
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CalculatorChartContainer } from './CalculatorLayout';
import type { PlazoFijoResult } from '@/hooks/usePlazoFijoCalculation';
import type { NumericChartDataPoint, TickFormatter } from '@/types/charts';

interface PlazoFijoChartProps {
  resultado: PlazoFijoResult;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function PlazoFijoChart({ resultado }: PlazoFijoChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !resultado.chartData.length) return;

    // Convertir datos al formato de Lightweight Charts
    // Usamos índices numéricos como time (válido en Lightweight Charts)
    const chartData: NumericChartDataPoint[] = resultado.chartData.map((value, index) => ({
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
          return resultado.chartLabels[index] || '';
        }) as TickFormatter,
      },
    });

    chartRef.current = chart;

    // Add area series (verde porque plazo fijo siempre sube)
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#10B981',
      topColor: 'rgba(16, 185, 129, 0.28)',
      bottomColor: 'rgba(16, 185, 129, 0.05)',
      lineWidth: 3,
    });

    seriesRef.current = areaSeries;
    areaSeries.setData(chartData);

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
  }, [resultado]);

  return (
    <CalculatorChartContainer title="Evolución del Capital">
      <div
        ref={chartContainerRef}
        className="rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </CalculatorChartContainer>
  );
}
