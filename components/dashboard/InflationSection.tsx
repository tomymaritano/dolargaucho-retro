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

  const isFavorite = favoriteChartIds.includes('inflacion-argentina');

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20"
    >
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <FaChartLine className="text-xl text-red-400" />
            </div>
            <div>
              <Card.Title className="mb-0">Inflacion Argentina</Card.Title>
              <p className="text-xs text-secondary mt-1">Indice de Precios al Consumidor (IPC)</p>
            </div>
          </div>
          <button
            onClick={() => onToggleChart('inflacion-argentina')}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? 'bg-accent-emerald/20 text-accent-emerald'
                : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? <FaStar className="text-lg" /> : <FaRegStar className="text-lg" />}
          </button>
        </div>
      </Card.Header>

      <Card.Content>
        {inflacionLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          </div>
        ) : inflacionData && inflacionData.length > 0 ? (
          <>
            {/* Chart */}
            <div className="h-64">
              <FredChart
                data={inflacionData.map((d) => ({ date: d.fecha, value: d.valor }))}
                title="Inflacion Argentina"
                color="#f87171"
                yAxisLabel="Inflacion"
                formatValue={(v) => `${v.toFixed(1)}%`}
                showPoints={true}
                monthsToShow={12}
              />
            </div>

            {/* Statistics */}
            <div className="mt-4 pt-4 border-t border-border">
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
          </>
        ) : (
          <p className="text-secondary text-center py-8">No hay datos disponibles</p>
        )}
      </Card.Content>
    </Card>
  );
}
