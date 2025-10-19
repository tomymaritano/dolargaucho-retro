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
}

export function RiesgoPaisChart({
  limit = 30,
  isFavorite,
  onToggleFavorite,
}: RiesgoPaisChartProps) {
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
          <FaSpinner className="animate-spin text-4xl text-brand" />
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
  const variation = previousValue ? latestValue - previousValue : 0;
  const isPositive = variation >= 0;

  return (
    <div className="space-y-4">
      {/* Header con valor destacado */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Riesgo País</h3>
          <p className="text-xs text-secondary">Últimos {limit} días</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-red-400">
            {latestValue?.toLocaleString('es-AR')}
          </div>
          <div
            className={`text-xs font-semibold ${isPositive ? 'text-red-400' : 'text-green-400'}`}
          >
            {isPositive ? '+' : ''}
            {variation.toFixed(0)} pb vs día anterior
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="pt-4">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRiesgo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="fecha"
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '10px' }}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '10px' }}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
              formatter={(value: number) => [`${value.toLocaleString('es-AR')} pb`, '']}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#f87171"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRiesgo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
