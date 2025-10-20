/**
 * FredSection Component
 *
 * Single Responsibility: Display US economic data from Federal Reserve (FRED)
 * Composition: Uses Card, FredChart, and displays interactive charts with favorites
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import {
  FaUniversity,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';

interface FredData {
  federalFundsRate?: {
    latest: number;
    change: number;
    changePercent: number;
    data: Array<{ date: string; value: number }>;
    lastUpdate: string;
  };
  inflationCPI?: {
    latest: number;
    yearOverYear: number;
    data: Array<{ date: string; value: number }>;
  };
  gdp?: {
    quarterlyGrowth: number;
  };
  unemploymentRate?: {
    latest: number;
    change: number;
    changePercent: number;
    data: Array<{ date: string; value: number }>;
  };
  treasury10y?: {
    latest: number;
    data: Array<{ date: string; value: number }>;
  };
}

interface FredSectionProps {
  fredData: FredData | undefined;
  fredLoading: boolean;
  showFredCharts: boolean;
  onToggleCharts: () => void;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

/**
 * Renders FRED section with economic indicators and interactive charts
 * @param fredData - Federal Reserve economic data
 * @param fredLoading - Loading state
 * @param showFredCharts - Whether to show charts
 * @param onToggleCharts - Function to toggle charts visibility
 * @param favoriteChartIds - Array of favorited chart IDs
 * @param onToggleChart - Function to toggle chart favorite status
 */
export function FredSection({
  fredData,
  fredLoading,
  showFredCharts,
  onToggleCharts,
  favoriteChartIds,
  onToggleChart,
}: FredSectionProps) {
  if (fredLoading || !fredData) {
    return null;
  }

  return (
    <Card variant="outlined" padding="none">
      <div className="p-6 pb-4 border-b border-slate-700/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUniversity className="text-xl text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Datos Económicos USA</h2>
              <p className="text-xs text-secondary mt-1">Reserva Federal (FRED)</p>
            </div>
          </div>
          <button
            onClick={onToggleCharts}
            className="px-4 py-2 rounded-lg text-blue-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-blue-300"
          >
            <FaChartLine />
            {showFredCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* FED Rate */}
          <div
            className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">Tasa FED</p>
            <p className="text-2xl font-bold text-blue-400 tabular-nums">
              {fredData.federalFundsRate?.latest.toFixed(2)}%
            </p>
            <div className="flex items-center gap-1 mt-1">
              {fredData.federalFundsRate && fredData.federalFundsRate.change !== 0 && (
                <>
                  {fredData.federalFundsRate.change > 0 ? (
                    <FaArrowUp className="text-[10px] text-success" />
                  ) : (
                    <FaArrowDown className="text-[10px] text-error" />
                  )}
                  <span className="text-[10px] text-secondary">
                    {Math.abs(fredData.federalFundsRate.changePercent).toFixed(1)}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-secondary mt-1">Fed Funds Rate</p>
          </div>

          {/* Inflation */}
          <div
            className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">Inflación USA</p>
            <p className="text-2xl font-bold text-blue-400 tabular-nums">
              {fredData.inflationCPI?.yearOverYear.toFixed(1)}%
            </p>
            <p className="text-[10px] text-secondary mt-3">CPI Year over Year</p>
          </div>

          {/* GDP */}
          <div
            className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">PIB USA</p>
            <p className="text-2xl font-bold text-blue-400 tabular-nums">
              {fredData.gdp?.quarterlyGrowth && fredData.gdp.quarterlyGrowth > 0 ? '+' : ''}
              {fredData.gdp?.quarterlyGrowth.toFixed(1)}%
            </p>
            <p className="text-[10px] text-secondary mt-3">Crecimiento QoQ</p>
          </div>

          {/* Unemployment */}
          <div
            className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">Desempleo</p>
            <p className="text-2xl font-bold text-blue-400 tabular-nums">
              {fredData.unemploymentRate?.latest.toFixed(1)}%
            </p>
            <div className="flex items-center gap-1 mt-1">
              {fredData.unemploymentRate && fredData.unemploymentRate.change !== 0 && (
                <>
                  {fredData.unemploymentRate.change > 0 ? (
                    <FaArrowUp className="text-[10px] text-error" />
                  ) : (
                    <FaArrowDown className="text-[10px] text-success" />
                  )}
                  <span className="text-[10px] text-secondary">
                    {Math.abs(fredData.unemploymentRate.changePercent).toFixed(1)}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-secondary mt-1">Tasa actual</p>
          </div>
        </div>

        {/* Interactive Charts */}
        {showFredCharts && (
          <div className="mt-6 pt-6 border-t border-slate-700/10">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-400" />
              Evolución Histórica (últimos 24 meses)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FED Rate Chart */}
              {fredData.federalFundsRate?.data && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={fredData.federalFundsRate.data}
                      title="Tasa FED"
                      color="#3b82f6"
                      formatValue={(v) => `${v.toFixed(2)}%`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('fred-rate')}
                      onToggleFavorite={() => onToggleChart('fred-rate')}
                    />
                  </div>
                </div>
              )}

              {/* CPI Chart */}
              {fredData.inflationCPI?.data && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={fredData.inflationCPI.data}
                      title="CPI USA"
                      color="#8b5cf6"
                      formatValue={(v) => v.toFixed(1)}
                      height={288}
                      isFavorite={favoriteChartIds.includes('fred-cpi')}
                      onToggleFavorite={() => onToggleChart('fred-cpi')}
                    />
                  </div>
                </div>
              )}

              {/* Unemployment Chart */}
              {fredData.unemploymentRate?.data && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={fredData.unemploymentRate.data}
                      title="Desempleo USA"
                      color="#10b981"
                      formatValue={(v) => `${v.toFixed(1)}%`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('fred-unemployment')}
                      onToggleFavorite={() => onToggleChart('fred-unemployment')}
                    />
                  </div>
                </div>
              )}

              {/* Treasury 10Y Chart */}
              {fredData.treasury10y?.data && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={fredData.treasury10y.data}
                      title="Treasury 10Y"
                      color="#f59e0b"
                      formatValue={(v) => `${v.toFixed(2)}%`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('fred-treasury')}
                      onToggleFavorite={() => onToggleChart('fred-treasury')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-4 pt-6 border-t border-slate-700/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-secondary">
              <strong className="text-foreground">FRED</strong> (Federal Reserve Economic Data) -
              Datos oficiales de la Reserva Federal.
              {fredData.federalFundsRate?.lastUpdate && (
                <span className="text-blue-400 ml-2">
                  Actualizado:{' '}
                  {new Date(fredData.federalFundsRate.lastUpdate).toLocaleDateString('es-AR')}
                </span>
              )}
            </p>
            <a
              href="https://fred.stlouisfed.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 rounded-lg text-blue-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-blue-300"
            >
              Explorar FRED →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
