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
}

export function InflacionChart({
  showInteranual = true,
  limit = 12,
  isFavorite,
  onToggleFavorite,
}: InflacionChartProps) {
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

  const latestMensual = chartData[chartData.length - 1]?.mensual;
  const previousMensual = chartData[chartData.length - 2]?.mensual;
  const changeMensual = previousMensual ? latestMensual - previousMensual : 0;

  return (
    <div className="space-y-4">
      {/* Header con valor destacado */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Inflación</h3>
          <p className="text-xs text-secondary">Últimos {limit} meses</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-brand">{latestMensual?.toFixed(1)}%</div>
          <div
            className={`text-xs font-semibold ${changeMensual > 0 ? 'text-red-400' : 'text-green-400'}`}
          >
            {changeMensual > 0 ? '+' : ''}
            {changeMensual.toFixed(1)}pp vs mes anterior
          </div>
        </div>
      </div>

      {/* Chart - Sin bordes ni fondos pesados */}
      <div className="bg-white/[0.02] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              tickFormatter={(value) => `${value}%`}
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
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
            />
            <Line
              type="monotone"
              dataKey="mensual"
              stroke="#0047FF"
              strokeWidth={3}
              name="Mensual"
              dot={false}
              activeDot={{ r: 6, fill: '#0047FF', strokeWidth: 2, stroke: '#fff' }}
            />
            {showInteranual && (
              <Line
                type="monotone"
                dataKey="interanual"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Interanual"
                dot={false}
                activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer minimalista */}
      <div className="text-xs text-secondary text-right">Fuente: INDEC vía ArgentinaData</div>
    </div>
  );
}
