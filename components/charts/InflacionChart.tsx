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
import { FaSpinner } from 'react-icons/fa';

interface InflacionChartProps {
  showInteranual?: boolean;
  limit?: number;
}

export function InflacionChart({ showInteranual = true, limit = 12 }: InflacionChartProps) {
  const { data: mensual, isLoading: loadingMensual } = useInflacionMensual();
  const { data: interanual, isLoading: loadingInteranual } = useInflacionInteranual();

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
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <Card.Title>Inflación Argentina</Card.Title>
        <p className="text-sm text-secondary mt-1">Últimos {limit} meses</p>
      </Card.Header>

      <Card.Content>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="fecha" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: '12px' }} />
            <YAxis
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
            />
            <Legend wrapperStyle={{ color: '#fff' }} iconType="line" />
            <Line
              type="monotone"
              dataKey="mensual"
              stroke="#10b981"
              strokeWidth={3}
              name="Inflación Mensual"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            {showInteranual && (
              <Line
                type="monotone"
                dataKey="interanual"
                stroke="#06b6d4"
                strokeWidth={3}
                name="Inflación Interanual"
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
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
