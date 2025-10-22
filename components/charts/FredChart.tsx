'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  showPoints?: boolean; // Nueva opción para mostrar puntos siempre
  monthsToShow?: number; // Nueva opción para limitar meses
}

export function FredChart({
  data,
  title,
  color = '#3b82f6',
  yAxisLabel = 'Value',
  formatValue = (value: number) => value.toFixed(2),
  showPoints = true, // Por defecto mostrar puntos (consistente)
  monthsToShow = 12, // Por defecto 12 meses (consistente)
}: FredChartProps) {
  // Limitar datos a los últimos N meses
  const limitedData = data.slice(-monthsToShow);

  const labels = limitedData.map((point) => {
    const date = new Date(point.date);
    return date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
  });

  const values = limitedData.map((point) => point.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: `${color}20`, // Transparencia consistente
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        // Puntos visibles siempre (si showPoints = true)
        pointRadius: showPoints ? 3 : 0,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${yAxisLabel}: ${formatValue(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
          callback: (value: any) => formatValue(value),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
