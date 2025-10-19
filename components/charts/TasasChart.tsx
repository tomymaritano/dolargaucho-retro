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
import { FaSpinner, FaUniversity, FaStar, FaRegStar } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

interface TasasChartProps {
  limit?: number;
  // Favorite props (optional)
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TasasChart({ limit = 10, isFavorite, onToggleFavorite }: TasasChartProps) {
  const { data: tasas, isLoading } = useTasaPlazoFijo();
  const chartTheme = useChartTheme();

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

  const topTasa = chartData[0];

  return (
    <div className="space-y-4">
      {/* Header con valor destacado */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Tasas de Plazo Fijo</h3>
          <p className="text-xs text-secondary">Top {limit} mejores tasas TNA</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-green-400">{topTasa?.tnaClientes}%</div>
          <div className="text-xs text-secondary truncate max-w-[200px]">{topTasa?.entidad}</div>
        </div>
      </div>

      {/* Chart - Sin bordes ni fondos pesados */}
      <div className="bg-white/[0.02] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="entidad"
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '9px' }}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '10px' }}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(0, 71, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Bar
              dataKey="tnaClientes"
              fill="#0047FF"
              name="Clientes"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey="tnaNoClientes"
              fill="#8B5CF6"
              name="No Clientes"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer minimalista */}
      <div className="text-xs text-secondary text-right">
        Fuente: BCRA vía ArgentinaData • TNA: Tasa Nominal Anual
      </div>
    </div>
  );
}
