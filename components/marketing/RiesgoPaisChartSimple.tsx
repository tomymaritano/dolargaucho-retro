'use client';

/**
 * RiesgoPaisChartSimple - Versión simplificada para landing page
 *
 * UI adaptado al estilo de la landing (bg-panel/50, borders sutiles)
 */

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
import { FaSpinner } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

interface RiesgoPaisChartSimpleProps {
  limit?: number;
}

export function RiesgoPaisChartSimple({ limit = 30 }: RiesgoPaisChartSimpleProps) {
  const { data: riesgoPais, isLoading } = useRiesgoPais();
  const chartTheme = useChartTheme();

  const chartData = React.useMemo(() => {
    if (!riesgoPais) return [];

    return riesgoPais.slice(-limit).map((r) => {
      const fecha = new Date(r.fecha);
      const fechaFormat = fecha.toLocaleDateString('es-AR', {
        month: 'short',
        year: 'numeric',
      });

      return {
        fecha: fechaFormat,
        fechaCompleta: fecha.toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        valor: r.valor,
      };
    });
  }, [riesgoPais, limit]);

  if (isLoading) {
    return (
      <div className="rounded-xl p-6 flex items-center justify-center h-[400px]">
        <FaSpinner className="animate-spin text-3xl text-brand" />
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="rounded-xl p-6 flex items-center justify-center h-[400px]">
        <p className="text-secondary">No hay datos disponibles</p>
      </div>
    );
  }

  const latestValue = chartData[chartData.length - 1]?.valor;
  const firstValue = chartData[0]?.valor;
  const variation = firstValue ? ((latestValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = variation >= 0;

  return (
    <div className="rounded-xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-secondary mb-1">Riesgo País</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">
              {latestValue?.toLocaleString('es-AR')}
            </span>
            <span className="text-sm text-secondary">pts</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary mb-1">{limit} meses</p>
          <span className={`text-lg font-bold ${isPositive ? 'text-error' : 'text-success'}`}>
            {isPositive ? '+' : ''}
            {variation.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRiesgoSimple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} opacity={0.2} />
            <XAxis
              dataKey="fecha"
              stroke={chartTheme.axisColor}
              style={{ fontSize: '11px' }}
              tick={{ fill: chartTheme.axisColor }}
              tickMargin={10}
            />
            <YAxis
              stroke={chartTheme.axisColor}
              style={{ fontSize: '11px' }}
              tick={{ fill: chartTheme.axisColor }}
              tickFormatter={(value) => value.toLocaleString('es-AR')}
              tickCount={8}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="px-4 py-3 bg-background-dark border border-brand/30 rounded-lg shadow-2xl shadow-brand/20">
                    <div className="space-y-2">
                      <div className="text-xs text-secondary font-semibold">
                        {data.fechaCompleta}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-secondary font-semibold">Riesgo País:</span>
                        <span className="text-sm text-foreground font-bold">
                          {data.valor.toLocaleString('es-AR')} pts
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRiesgoSimple)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
