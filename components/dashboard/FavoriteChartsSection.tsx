/**
 * FavoriteChartsSection Component
 *
 * Single Responsibility: Display user's favorite charts in a grid
 * Handles chart mapping and rendering for inflation, FRED, and ECB data
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FredChart } from '@/components/charts/FredChart';
import { FaChartLine, FaStar } from 'react-icons/fa';
import type { ECBHistoricalData } from '@/hooks/useECBHistorical';
import type { InflacionData } from '@/hooks/useInflacion';

interface FavoriteChartsSectionProps {
  favoriteChartIds: string[];
  inflacionData: InflacionData[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fredData: any; // Accept any structure from useFredData
  ecbHistorical: Record<string, ECBHistoricalData> | undefined;
  onToggleChart: (chartId: string) => void;
}

export function FavoriteChartsSection({
  favoriteChartIds,
  inflacionData,
  fredData,
  ecbHistorical,
  onToggleChart,
}: FavoriteChartsSectionProps) {
  if (favoriteChartIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaChartLine className="text-accent-emerald text-xl" />
          <h2 className="text-xl font-bold text-foreground">Mis Gráficos Favoritos</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              favoriteChartIds.length >= 3
                ? 'bg-warning/20 text-warning'
                : 'bg-accent-emerald/20 text-accent-emerald'
            }`}
          >
            {favoriteChartIds.length}/3
          </span>
          <span className="text-xs text-secondary hidden sm:block">gráficos guardados</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteChartIds.map((chartId) => {
          // Chart configuration mapping
          let chartData = null;
          let chartTitle = '';
          let chartColor = '';
          let yAxisLabel = '';
          let formatValue = (v: number) => v.toFixed(2);

          if (chartId === 'inflacion-argentina' && inflacionData) {
            chartData = inflacionData.map((d) => ({ date: d.fecha, value: d.valor }));
            chartTitle = 'Inflación Argentina';
            chartColor = '#f87171';
            yAxisLabel = 'Inflación';
            formatValue = (v) => `${v.toFixed(1)}%`;
          } else if (chartId === 'fred-rate' && fredData?.federalFundsRate?.data) {
            chartData = fredData.federalFundsRate.data;
            chartTitle = 'Tasa FED';
            chartColor = '#3b82f6';
            yAxisLabel = 'Tasa';
            formatValue = (v) => `${v.toFixed(2)}%`;
          } else if (chartId === 'fred-cpi' && fredData?.inflationCPI?.data) {
            chartData = fredData.inflationCPI.data;
            chartTitle = 'CPI USA';
            chartColor = '#8b5cf6';
            yAxisLabel = 'Índice';
            formatValue = (v) => v.toFixed(1);
          } else if (chartId === 'fred-unemployment' && fredData?.unemploymentRate?.data) {
            chartData = fredData.unemploymentRate.data;
            chartTitle = 'Desempleo USA';
            chartColor = '#10b981';
            yAxisLabel = 'Tasa';
            formatValue = (v) => `${v.toFixed(1)}%`;
          } else if (chartId === 'fred-treasury' && fredData?.treasury10y?.data) {
            chartData = fredData.treasury10y.data;
            chartTitle = 'Treasury 10Y';
            chartColor = '#f59e0b';
            yAxisLabel = 'Rendimiento';
            formatValue = (v) => `${v.toFixed(2)}%`;
          } else if (chartId === 'ecb-usd' && ecbHistorical?.USD?.data) {
            chartData = ecbHistorical.USD.data.map((d: { date: string; rate: number }) => ({
              date: d.date,
              value: d.rate,
            }));
            chartTitle = 'EUR / USD';
            chartColor = '#6366f1';
            yAxisLabel = 'Tipo de cambio';
            formatValue = (v) => `$${v.toFixed(4)}`;
          } else if (chartId === 'ecb-ars' && ecbHistorical?.ARS?.data) {
            chartData = ecbHistorical.ARS.data.map((d: { date: string; rate: number }) => ({
              date: d.date,
              value: d.rate,
            }));
            chartTitle = 'EUR / ARS';
            chartColor = '#8b5cf6';
            yAxisLabel = 'Tipo de cambio';
            formatValue = (v) => `$${v.toFixed(2)}`;
          } else if (chartId === 'ecb-gbp' && ecbHistorical?.GBP?.data) {
            chartData = ecbHistorical.GBP.data.map((d: { date: string; rate: number }) => ({
              date: d.date,
              value: d.rate,
            }));
            chartTitle = 'EUR / GBP';
            chartColor = '#10b981';
            yAxisLabel = 'Tipo de cambio';
            formatValue = (v) => `$${v.toFixed(4)}`;
          } else if (chartId === 'ecb-brl' && ecbHistorical?.BRL?.data) {
            chartData = ecbHistorical.BRL.data.map((d: { date: string; rate: number }) => ({
              date: d.date,
              value: d.rate,
            }));
            chartTitle = 'EUR / BRL';
            chartColor = '#f59e0b';
            yAxisLabel = 'Tipo de cambio';
            formatValue = (v) => `R$${v.toFixed(4)}`;
          }

          if (!chartData) return null;

          return (
            <Card key={chartId} variant="default" padding="md" className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{chartTitle}</h3>
                <button
                  onClick={() => onToggleChart(chartId)}
                  className="p-1.5 rounded-lg bg-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald/30 transition-all"
                  aria-label="Quitar de favoritos"
                >
                  <FaStar className="text-sm" />
                </button>
              </div>
              <div className="h-64">
                <FredChart
                  data={chartData}
                  title={chartTitle}
                  color={chartColor}
                  yAxisLabel={yAxisLabel}
                  formatValue={formatValue}
                  showPoints={true}
                  monthsToShow={12}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
