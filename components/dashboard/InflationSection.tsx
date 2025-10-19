/**
 * InflationSection Component
 *
 * Single Responsibility: Display Argentine inflation data with chart and statistics
 * Composition: Uses Card, FredChart for visualization
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FredChart } from '@/components/charts/FredChart';
import { FaChartLine, FaStar, FaRegStar } from 'react-icons/fa';

interface InflationDataPoint {
  fecha: string;
  valor: number;
}

interface InflationSectionProps {
  inflacionData: InflationDataPoint[] | undefined;
  inflacionLoading: boolean;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

/**
 * Renders inflation section with chart and accumulated statistics
 * @param inflacionData - Array of inflation data points
 * @param inflacionLoading - Loading state
 * @param favoriteChartIds - Array of favorited chart IDs
 * @param onToggleChart - Function to toggle chart favorite status
 */
export function InflationSection({
  inflacionData,
  inflacionLoading,
  favoriteChartIds,
  onToggleChart,
}: InflationSectionProps) {
  const calculateAccumulated12Months = () => {
    if (!inflacionData || inflacionData.length === 0) return 0;
    return inflacionData.slice(-12).reduce((acc, m) => acc + m.valor, 0);
  };

  const calculateMonthlyAverage = () => {
    const accumulated = calculateAccumulated12Months();
    return accumulated / 12;
  };

  // Calculate interannual (rolling 12-month accumulated) for each month
  const calculateInterannualData = () => {
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

  const isFavoriteMensual = favoriteChartIds.includes('inflacion-mensual');
  const isFavoriteInteranual = favoriteChartIds.includes('inflacion-interanual');

  const interannualData = calculateInterannualData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <FaChartLine className="text-xl text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Inflación Argentina</h2>
          <p className="text-xs text-secondary mt-1">Índice de Precios al Consumidor (IPC)</p>
        </div>
      </div>

      {inflacionLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        </div>
      ) : inflacionData && inflacionData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inflación Mensual */}
          <Card variant="outlined" padding="none">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Inflación Mensual</h3>
                <button
                  onClick={() => onToggleChart('inflacion-mensual')}
                  className={`p-1.5 rounded-lg transition-all ${
                    isFavoriteMensual ? 'bg-brand/20 text-brand' : 'text-secondary hover:text-brand'
                  }`}
                  aria-label={isFavoriteMensual ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isFavoriteMensual ? (
                    <FaStar className="text-sm" />
                  ) : (
                    <FaRegStar className="text-sm" />
                  )}
                </button>
              </div>
            </div>
            <div className="h-72 p-2 pt-0">
              <FredChart
                data={inflacionData.map((d) => ({ date: d.fecha, value: d.valor }))}
                title="Inflación Mensual"
                color="#f87171"
                yAxisLabel="Inflación"
                formatValue={(v) => `${v.toFixed(1)}%`}
                showPoints={true}
                monthsToShow={12}
              />
            </div>
            <div className="p-4 pt-2 border-t border-slate-700/10">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-secondary mb-1">Acumulada 12 meses</p>
                  <p className="text-lg font-bold text-red-400">
                    {calculateAccumulated12Months().toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-secondary mb-1">Promedio mensual</p>
                  <p className="text-lg font-bold text-red-400">
                    {calculateMonthlyAverage().toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Inflación Interanual */}
          <Card variant="outlined" padding="none">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Inflación Interanual</h3>
                <button
                  onClick={() => onToggleChart('inflacion-interanual')}
                  className={`p-1.5 rounded-lg transition-all ${
                    isFavoriteInteranual
                      ? 'bg-brand/20 text-brand'
                      : 'text-secondary hover:text-brand'
                  }`}
                  aria-label={isFavoriteInteranual ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isFavoriteInteranual ? (
                    <FaStar className="text-sm" />
                  ) : (
                    <FaRegStar className="text-sm" />
                  )}
                </button>
              </div>
            </div>
            <div className="h-72 p-2 pt-0">
              <FredChart
                data={interannualData}
                title="Inflación Interanual"
                color="#ef4444"
                yAxisLabel="Inflación acumulada"
                formatValue={(v) => `${v.toFixed(1)}%`}
                showPoints={true}
                monthsToShow={12}
              />
            </div>
            <div className="p-4 pt-2 border-t border-slate-700/10">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-secondary mb-1">Actual (12 meses)</p>
                  <p className="text-lg font-bold text-red-500">
                    {interannualData.length > 0
                      ? interannualData[interannualData.length - 1].value.toFixed(1)
                      : '0.0'}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-secondary mb-1">Promedio interanual</p>
                  <p className="text-lg font-bold text-red-500">
                    {interannualData.length > 0
                      ? (
                          interannualData.reduce((acc, d) => acc + d.value, 0) /
                          interannualData.length
                        ).toFixed(1)
                      : '0.0'}
                    %
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <p className="text-secondary text-center py-8">No hay datos disponibles</p>
      )}
    </div>
  );
}
