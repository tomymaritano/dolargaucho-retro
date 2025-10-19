/**
 * PlazoFijoChart Component
 *
 * Single Responsibility: Render plazo fijo evolution chart
 * Extracted from CalculadoraPlazoFijo.tsx
 */

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { CalculatorChartContainer } from './CalculatorLayout';
import type { PlazoFijoResult } from '@/hooks/usePlazoFijoCalculation';

Chart.register(...registerables);

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
  const chartData = useMemo(
    () => ({
      labels: resultado.chartLabels,
      datasets: [
        {
          label: 'Capital Total (ARS)',
          data: resultado.chartData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          tension: 0.4,
          borderWidth: 3,
        },
      ],
    }),
    [resultado]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(18, 23, 46, 0.95)',
          titleColor: '#fff',
          bodyColor: '#10B981',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (tooltipItems: TooltipItem<'line'>[]) => {
              return tooltipItems[0].label;
            },
            label: (tooltipItem: TooltipItem<'line'>) => {
              const value = tooltipItem.raw as number;
              return `Total: ${formatCurrency(value)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: true,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          ticks: {
            color: '#9CA3AF',
            font: { size: 11 },
            callback: (value: number | string) => formatCurrency(Number(value)),
          },
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: true,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          ticks: {
            color: '#9CA3AF',
            font: { size: 11 },
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    }),
    []
  );

  return (
    <CalculatorChartContainer title="Evolución del Capital">
      <Line data={chartData} options={chartOptions} />
    </CalculatorChartContainer>
  );
}
