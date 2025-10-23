'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';

interface FredDataPoint {
  date: string;
  value: number;
}

interface FredChartProps {
  data: FredDataPoint[];
  title: string;
  color?: string;
  yAxisLabel?: string;
  formatValue?: (value: number) => string;
  showPoints?: boolean;
  monthsToShow?: number;
}

export const FredChart = React.memo(function FredChart({
  data,
  title,
  color = '#3b82f6',
  yAxisLabel = 'Value',
  formatValue = (value: number) => value.toFixed(2),
  showPoints = true,
  monthsToShow = 12,
}: FredChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Limitar datos a los últimos N meses
    const limitedData = data.slice(-monthsToShow);

    // Convertir datos al formato de Lightweight Charts
    const chartData = limitedData.map((point) => ({
      time: new Date(point.date).getTime() / 1000, // Unix timestamp en segundos
      value: point.value,
    }));

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 200,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: color,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: color,
        },
        horzLine: {
          color: color,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: color,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add area series with gradient
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}33`, // 20% opacity
      bottomColor: `${color}0D`, // 5% opacity
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;
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
  }, [data, color, monthsToShow]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div
        ref={chartContainerRef}
        className="rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});
