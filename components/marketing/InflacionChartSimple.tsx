'use client';

/**
 * InflacionChartSimple - Versión simplificada para landing page
 *
 * UI adaptado al estilo de la landing (bg-panel/50, borders sutiles)
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useInflacionMensual, useInflacionInteranual } from '@/hooks/useFinanzas';
import { FaSpinner } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';

interface InflacionChartSimpleProps {
  limit?: number;
  type: 'mensual' | 'interanual';
}

export function InflacionChartSimple({ limit = 10, type }: InflacionChartSimpleProps) {
  const { data: mensual, isLoading: loadingMensual } = useInflacionMensual();
  const { data: interanual, isLoading: loadingInteranual } = useInflacionInteranual();

  const chartTheme = useChartTheme();
  const isLoading = type === 'mensual' ? loadingMensual : loadingInteranual;
  const data = type === 'mensual' ? mensual : interanual;

  const chartData = React.useMemo(() => {
    if (!data) return [];

    return data.slice(-limit).map((item) => {
      const fecha = new Date(item.fecha);
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
        valor: item.valor,
      };
    });
  }, [data, limit]);

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
          <p className="text-sm text-secondary mb-1">
            {type === 'mensual' ? 'IPC' : 'IPC Interanual'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">{latestValue?.toFixed(1)}%</span>
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
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
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
              tickFormatter={(value) => `${value}%`}
              tickCount={8}
              domain={['dataMin - 1', 'dataMax + 1']}
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
                        <span className="text-xs text-secondary font-semibold">IPC:</span>
                        <span className="text-sm text-foreground font-bold">
                          {data.valor.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0047FF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
