import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner, FaUniversity } from 'react-icons/fa';

interface TasasChartProps {
  limit?: number;
}

export function TasasChart({ limit = 10 }: TasasChartProps) {
  const { data: tasas, isLoading } = useTasaPlazoFijo();

  const chartData = React.useMemo(() => {
    if (!tasas) return [];

    // Ordenar por TNA de clientes (descendente) y tomar los primeros N
    return tasas
      .filter((t) => t.tnaClientes !== null)
      .sort((a, b) => (b.tnaClientes || 0) - (a.tnaClientes || 0))
      .slice(0, limit)
      .map((tasa) => ({
        entidad: tasa.entidad.split(' ').slice(0, 3).join(' '), // Acortar nombre
        tnaClientes: tasa.tnaClientes ? (tasa.tnaClientes * 100).toFixed(2) : 0,
        tnaNoClientes: tasa.tnaNoClientes ? (tasa.tnaNoClientes * 100).toFixed(2) : 0,
      }));
  }, [tasas, limit]);

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
        <div className="flex items-center gap-3">
          <div className="p-3 glass rounded-xl">
            <FaUniversity className="text-accent-emerald text-xl" />
          </div>
          <div>
            <Card.Title>Tasas de Plazo Fijo - Top {limit} Bancos</Card.Title>
            <p className="text-sm text-secondary mt-1">
              Ordenadas por TNA para clientes (mayor a menor)
            </p>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="entidad"
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
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
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="tnaClientes" fill="#10b981" name="TNA Clientes" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="tnaNoClientes"
              fill="#06b6d4"
              name="TNA No Clientes"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card.Content>

      <Card.Footer>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Fuente: ArgentinaData API (BCRA)</span>
          <span>TNA: Tasa Nominal Anual</span>
        </div>
      </Card.Footer>
    </Card>
  );
}
