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
import { FaSpinner } from 'react-icons/fa';

interface RiesgoPaisChartProps {
  limit?: number;
}

export function RiesgoPaisChart({ limit = 30 }: RiesgoPaisChartProps) {
  const { data: riesgoPais, isLoading } = useRiesgoPais();

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
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="fecha" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fff',
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
