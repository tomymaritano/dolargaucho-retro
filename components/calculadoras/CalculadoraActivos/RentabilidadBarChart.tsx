/**
 * RentabilidadBarChart Component
 *
 * Single Responsibility: Display rentability comparison bar chart
 * Uses Lightweight Charts Histogram Series
 */

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartBar } from 'react-icons/fa';
import { createChart, ColorType, HistogramSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import type { ResultadoAnalisis } from './types';
import type { BarChartDataPoint, TickFormatter } from '@/types/charts';

interface RentabilidadBarChartProps {
  resultado: Pick<
    ResultadoAnalisis,
    'rentabilidadNominal' | 'rentabilidadReal' | 'inflacionAcumulada'
  >;
}

export function RentabilidadBarChart({ resultado }: RentabilidadBarChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<ISeriesApi<'Histogram'>[]>([]);

  const dataBarras = useMemo(
    () => [
      {
        name: 'Nominal',
        valor: resultado.rentabilidadNominal,
        color: resultado.rentabilidadNominal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Real',
        valor: resultado.rentabilidadReal,
        color: resultado.rentabilidadReal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Inflación',
        valor: resultado.inflacionAcumulada,
        color: '#F59E0B',
      },
    ],
    [resultado]
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
        timeVisible: false,
        tickMarkFormatter: ((time: Time) => {
          const index = typeof time === 'number' ? time : 0;
          return dataBarras[index]?.name || '';
        }) as TickFormatter,
      },
    });

    chartRef.current = chart;
    seriesRefs.current = [];

    // Add histogram series for each bar
    dataBarras.forEach((bar, index) => {
      const histogramSeries = chart.addSeries(HistogramSeries, {
        color: bar.color,
        priceFormat: {
          type: 'custom',
          formatter: (price: number) => `${price.toFixed(2)}%`,
        },
      });

      const dataPoint: BarChartDataPoint[] = [
        {
          time: index as Time,
          value: bar.valor,
          color: bar.color,
        },
      ];

      histogramSeries.setData(dataPoint);

      seriesRefs.current.push(histogramSeries);
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
  }, [dataBarras]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand/30 transition-all duration-300"
    >
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-brand transition-colors duration-300">
        <FaChartBar className="text-brand" />
        Comparativa de Rentabilidades
      </h4>
      <div className="group-hover:scale-[1.01] transition-transform duration-300">
        <div
          ref={chartContainerRef}
          className="rounded-lg"
          style={{ width: '100%', height: '300px' }}
        />
      </div>
    </Card>
  );
}
