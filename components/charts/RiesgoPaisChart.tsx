import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRiesgoPais } from '@/hooks/useFinanzas';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner, FaStar, FaRegStar } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

interface RiesgoPaisChartProps {
  limit?: number;
  // Favorite props (optional)
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  chartId?: string;
}

export function RiesgoPaisChart({ limit = 30, isFavorite, onToggleFavorite, chartId }: RiesgoPaisChartProps) {
  const { data: riesgoPais, isLoading } = useRiesgoPais();
  const chartTheme = useChartTheme();

  const chartData = React.useMemo(() => {
    if (!riesgoPais) return [];

    // Tomar los últimos N días
    return riesgoPais.slice(-limit).map((r) => {
      const fecha = new Date(r.fecha);
      const fechaFormat = fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
      });

      return {
        fecha: fechaFormat,
        valor: r.valor,
      };
    });
  }, [riesgoPais, limit]);

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

  const latestValue = chartData[chartData.length - 1]?.valor;
  const previousValue = chartData[chartData.length - 2]?.valor;
  const variation = previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = variation >= 0;

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <div className="flex items-start justify-between">
          <div>
            <Card.Title>Riesgo País</Card.Title>
            <p className="text-sm text-secondary mt-1">Últimos {limit} días</p>
          </div>
          <div className="flex items-center gap-4">
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
            <div className="text-right">
            <div className="text-3xl font-bold text-foreground">
              {latestValue?.toLocaleString('es-AR')}
            </div>
            <div
              className={`text-sm font-semibold ${isPositive ? 'text-red-500' : 'text-green-500'}`}
            >
              {isPositive ? '+' : ''}
              {variation.toFixed(2)}% vs ayer
            </div>
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRiesgo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
            <XAxis dataKey="fecha" stroke={chartTheme.axisColor} style={{ fontSize: '12px' }} />
            <YAxis stroke={chartTheme.axisColor} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '8px',
                color: chartTheme.tooltipColor,
              }}
              formatter={(value: number) => [value.toLocaleString('es-AR'), 'Puntos']}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRiesgo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Content>

      <Card.Footer>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Fuente: ArgentinaData API</span>
          <span>Actualizado diariamente</span>
        </div>
      </Card.Footer>
    </Card>
  );
}
