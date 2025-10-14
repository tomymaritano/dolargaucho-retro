import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useInflacionMensual, useInflacionInteranual } from '@/hooks/useFinanzas';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner, FaStar, FaRegStar } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

interface InflacionChartProps {
  showInteranual?: boolean;
  limit?: number;
  // Favorite props (optional)
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  chartId?: string;
}

export function InflacionChart({ showInteranual = true, limit = 12, isFavorite, onToggleFavorite, chartId }: InflacionChartProps) {
  const { data: mensual, isLoading: loadingMensual } = useInflacionMensual();
  const { data: interanual, isLoading: loadingInteranual } = useInflacionInteranual();
  const chartTheme = useChartTheme();

  const isLoading = loadingMensual || (showInteranual && loadingInteranual);

  const chartData = React.useMemo(() => {
    if (!mensual) return [];

    // Tomar los últimos N meses
    const limitedMensual = mensual.slice(-limit);

    // Combinar mensual e interanual
    return limitedMensual.map((m) => {
      const fecha = new Date(m.fecha);
      const mesAnio = fecha.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });

      const dataPoint: { fecha: string; mensual: number; interanual?: number } = {
        fecha: mesAnio,
        mensual: m.valor,
      };

      // Agregar interanual si está habilitado
      if (showInteranual && interanual) {
        const interanualMatch = interanual.find((i) => i.fecha === m.fecha);
        if (interanualMatch) {
          dataPoint.interanual = interanualMatch.valor;
        }
      }

      return dataPoint;
    });
  }, [mensual, interanual, showInteranual, limit]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center h-80">
          <FaSpinner className="animate-spin text-4xl text-accent-emerald" />
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center h-80 text-secondary">
          No hay datos disponibles
        </div>
      </Card>
    );
  }

  return (
    <div className="glass-strong p-6 md:p-8 rounded-2xl border border-border">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground mb-2">
            Evolución de la Inflación
          </h3>
          <p className="text-sm text-secondary">
            Últimos {limit} meses • Actualizado diariamente
          </p>
        </div>
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? 'bg-accent-emerald/20 text-accent-emerald'
                : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? <FaStar className="text-lg" /> : <FaRegStar className="text-lg" />}
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="p-4 rounded-xl bg-transparent border border-border">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
            <XAxis
              dataKey="fecha"
              stroke={chartTheme.axisColor}
              style={{ fontSize: '11px' }}
              tick={{ fill: chartTheme.axisColor }}
            />
            <YAxis
              stroke={chartTheme.axisColor}
              style={{ fontSize: '11px' }}
              tick={{ fill: chartTheme.axisColor }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '8px',
                color: chartTheme.tooltipColor,
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
            />
            <Legend
              wrapperStyle={{
                color: chartTheme.tooltipColor,
                paddingTop: '20px'
              }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="mensual"
              stroke="#10b981"
              strokeWidth={2.5}
              name="Inflación Mensual"
              dot={{ fill: '#10b981', r: 3 }}
              activeDot={{ r: 5 }}
            />
            {showInteranual && (
              <Line
                type="monotone"
                dataKey="interanual"
                stroke="#06b6d4"
                strokeWidth={2.5}
                name="Inflación Interanual"
                dot={{ fill: '#06b6d4', r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-secondary text-center">
          Fuente: ArgentinaData API
        </p>
      </div>
    </div>
  );
}
