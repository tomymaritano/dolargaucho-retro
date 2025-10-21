/**
 * FavoriteChartsSection Component
 *
 * Single Responsibility: Display ALL available charts in a grid with category tabs
 * Users can favorite/unfavorite charts from this view
 */

import React, { useState } from 'react';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { FaChartLine, FaStar, FaGlobeAmericas, FaEuroSign, FaChartArea } from 'react-icons/fa';
import type { ECBHistoricalData } from '@/hooks/useECBHistorical';
import type { InflacionData } from '@/hooks/useInflacion';
import type { IndiceUVAResponse, RiesgoPaisResponse } from '@/types/api/argentina';

interface FavoriteChartsSectionProps {
  favoriteChartIds: string[];
  inflacionData: InflacionData[] | undefined;
  uvaData: IndiceUVAResponse | undefined;
  riesgoPaisData: RiesgoPaisResponse | undefined;
  fredData: any; // Accept any structure from useFredData
  ecbHistorical: Record<string, ECBHistoricalData> | undefined;
  onToggleChart: (chartId: string) => void;
}

type ChartCategory = 'favoritos' | 'argentina' | 'fred' | 'ecb' | 'todos';

interface ChartConfig {
  id: string;
  title: string;
  color: string;
  yAxisLabel: string;
  formatValue: (v: number) => string;
  category: ChartCategory;
  getData: (props: FavoriteChartsSectionProps) => Array<{ date: string; value: number }> | null;
}

export function FavoriteChartsSection({
  favoriteChartIds,
  inflacionData,
  uvaData,
  riesgoPaisData,
  fredData,
  ecbHistorical,
  onToggleChart,
}: FavoriteChartsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>('favoritos');

  // Helper to calculate interannual data
  const calculateInterannualData = (inflacionData: InflacionData[] | undefined) => {
    if (!inflacionData || inflacionData.length < 12) return [];

    const interannual: { date: string; value: number }[] = [];
    for (let i = 11; i < inflacionData.length; i++) {
      const last12Months = inflacionData.slice(i - 11, i + 1);
      const accumulated = last12Months.reduce((acc, m) => acc + m.valor, 0);
      interannual.push({
        date: inflacionData[i].fecha,
        value: accumulated,
      });
    }
    return interannual;
  };

  // All available charts configuration
  const allCharts: ChartConfig[] = [
    // IPC Argentina - Mensual
    {
      id: 'inflacion-mensual',
      title: 'IPC Mensual',
      color: '#f87171',
      yAxisLabel: 'IPC',
      formatValue: (v) => `${v.toFixed(1)}%`,
      category: 'argentina',
      getData: (props) =>
        props.inflacionData?.map((d) => ({ date: d.fecha, value: d.valor })) || null,
    },
    // IPC Argentina - Interanual
    {
      id: 'inflacion-interanual',
      title: 'IPC Interanual',
      color: '#ef4444',
      yAxisLabel: 'IPC acumulado',
      formatValue: (v) => `${v.toFixed(1)}%`,
      category: 'argentina',
      getData: (props) => calculateInterannualData(props.inflacionData),
    },
    // UVA - Argentina
    {
      id: 'indice-uva',
      title: 'Índice UVA',
      color: '#8b5cf6',
      yAxisLabel: 'Valor UVA',
      formatValue: (v) => `$${v.toFixed(2)}`,
      category: 'argentina',
      getData: (props) => props.uvaData?.map((d) => ({ date: d.fecha, value: d.valor })) || null,
    },
    // Riesgo País - Argentina
    {
      id: 'riesgo-pais',
      title: 'Riesgo País',
      color: '#06b6d4',
      yAxisLabel: 'EMBI+',
      formatValue: (v) => `${v.toFixed(0)} bps`,
      category: 'argentina',
      getData: (props) =>
        props.riesgoPaisData?.map((d) => ({ date: d.fecha, value: d.valor })) || null,
    },
    // FRED - USA
    {
      id: 'fred-rate',
      title: 'Tasa FED',
      color: '#3b82f6',
      yAxisLabel: 'Tasa',
      formatValue: (v) => `${v.toFixed(2)}%`,
      category: 'fred',
      getData: (props) => props.fredData?.federalFundsRate?.data || null,
    },
    {
      id: 'fred-cpi',
      title: 'CPI USA',
      color: '#8b5cf6',
      yAxisLabel: 'Índice',
      formatValue: (v) => v.toFixed(1),
      category: 'fred',
      getData: (props) => props.fredData?.inflationCPI?.data || null,
    },
    {
      id: 'fred-unemployment',
      title: 'Desempleo USA',
      color: '#10b981',
      yAxisLabel: 'Tasa',
      formatValue: (v) => `${v.toFixed(1)}%`,
      category: 'fred',
      getData: (props) => props.fredData?.unemploymentRate?.data || null,
    },
    {
      id: 'fred-treasury',
      title: 'Treasury 10Y',
      color: '#f59e0b',
      yAxisLabel: 'Rendimiento',
      formatValue: (v) => `${v.toFixed(2)}%`,
      category: 'fred',
      getData: (props) => props.fredData?.treasury10y?.data || null,
    },
    // ECB - Europa
    {
      id: 'ecb-usd',
      title: 'EUR / USD',
      color: '#6366f1',
      yAxisLabel: 'Tipo de cambio',
      formatValue: (v) => `$${v.toFixed(4)}`,
      category: 'ecb',
      getData: (props) =>
        props.ecbHistorical?.USD?.data?.map((d: { date: string; rate: number }) => ({
          date: d.date,
          value: d.rate,
        })) || null,
    },
    {
      id: 'ecb-gbp',
      title: 'EUR / GBP',
      color: '#10b981',
      yAxisLabel: 'Tipo de cambio',
      formatValue: (v) => `$${v.toFixed(4)}`,
      category: 'ecb',
      getData: (props) =>
        props.ecbHistorical?.GBP?.data?.map((d: { date: string; rate: number }) => ({
          date: d.date,
          value: d.rate,
        })) || null,
    },
    {
      id: 'ecb-brl',
      title: 'EUR / BRL',
      color: '#f59e0b',
      yAxisLabel: 'Tipo de cambio',
      formatValue: (v) => `R$${v.toFixed(4)}`,
      category: 'ecb',
      getData: (props) =>
        props.ecbHistorical?.BRL?.data?.map((d: { date: string; rate: number }) => ({
          date: d.date,
          value: d.rate,
        })) || null,
    },
  ];

  // Filter charts by selected category
  const filteredCharts =
    selectedCategory === 'favoritos'
      ? allCharts.filter((chart) => favoriteChartIds.includes(chart.id))
      : selectedCategory === 'todos'
        ? allCharts
        : allCharts.filter((chart) => chart.category === selectedCategory);

  // Count charts per category
  const countByCategory = {
    favoritos: favoriteChartIds.length,
    argentina: allCharts.filter((c) => c.category === 'argentina').length,
    fred: allCharts.filter((c) => c.category === 'fred').length,
    ecb: allCharts.filter((c) => c.category === 'ecb').length,
    todos: allCharts.length,
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gráficos Disponibles</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              favoriteChartIds.length >= 3 ? 'bg-warning/20 text-warning' : 'bg-brand/20 text-brand'
            }`}
          >
            {favoriteChartIds.length}/3
          </span>
          <span className="text-xs text-secondary hidden sm:block">favoritos guardados</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto pb-3 mb-4 border-b border-slate-700/10">
        <button
          onClick={() => setSelectedCategory('favoritos')}
          className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
            selectedCategory === 'favoritos' ? 'text-brand' : 'text-secondary hover:text-foreground'
          }`}
        >
          <FaStar className="text-xs" />
          Favoritos
          <span className="text-xs opacity-70">({countByCategory.favoritos})</span>
          {selectedCategory === 'favoritos' && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          onClick={() => setSelectedCategory('argentina')}
          className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
            selectedCategory === 'argentina' ? 'text-brand' : 'text-secondary hover:text-foreground'
          }`}
        >
          <FaChartArea className="text-xs" />
          ARG
          <span className="text-xs opacity-70">({countByCategory.argentina})</span>
          {selectedCategory === 'argentina' && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          onClick={() => setSelectedCategory('fred')}
          className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
            selectedCategory === 'fred' ? 'text-brand' : 'text-secondary hover:text-foreground'
          }`}
        >
          <FaGlobeAmericas className="text-xs" />
          FRED (USA)
          <span className="text-xs opacity-70">({countByCategory.fred})</span>
          {selectedCategory === 'fred' && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          onClick={() => setSelectedCategory('ecb')}
          className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
            selectedCategory === 'ecb' ? 'text-brand' : 'text-secondary hover:text-foreground'
          }`}
        >
          <FaEuroSign className="text-xs" />
          ECB (Europa)
          <span className="text-xs opacity-70">({countByCategory.ecb})</span>
          {selectedCategory === 'ecb' && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          onClick={() => setSelectedCategory('todos')}
          className={`pb-3 font-semibold text-sm transition-all whitespace-nowrap relative flex items-center gap-2 ${
            selectedCategory === 'todos' ? 'text-brand' : 'text-secondary hover:text-foreground'
          }`}
        >
          <FaChartLine className="text-xs" />
          Todos
          <span className="text-xs opacity-70">({countByCategory.todos})</span>
          {selectedCategory === 'todos' && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
      </div>

      {/* Charts Grid - Consistent structure across all tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharts.map((chart) => {
          const chartData = chart.getData({
            favoriteChartIds,
            inflacionData,
            uvaData,
            riesgoPaisData,
            fredData,
            ecbHistorical,
            onToggleChart,
          });
          const isFavorite = favoriteChartIds.includes(chart.id);

          // Show placeholder if no data
          if (!chartData || chartData.length === 0) {
            return (
              <div
                key={chart.id}
                className="relative overflow-hidden opacity-50 rounded-lg bg-background-secondary/30"
              >
                <div className="h-72 flex items-center justify-center">
                  <p className="text-xs text-secondary">Cargando datos...</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={chart.id}
              className="relative overflow-hidden rounded-lg bg-background-secondary/30"
            >
              {/* Chart with integrated controls and favorite button */}
              <div className="h-72">
                <UniversalLightweightChart
                  data={chartData}
                  title={chart.title}
                  color={chart.color}
                  formatValue={chart.formatValue}
                  height={288}
                  isFavorite={isFavorite}
                  onToggleFavorite={() => onToggleChart(chart.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
