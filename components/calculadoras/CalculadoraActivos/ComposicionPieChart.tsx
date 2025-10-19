/**
 * ComposicionPieChart Component
 *
 * Single Responsibility: Display investment composition pie chart
 */

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartPie } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';
import { formatearMoneda } from './utils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ResultadoAnalisis } from './types';

interface ComposicionPieChartProps {
  precioCompra: number;
  gananciaReal: number;
}

export function ComposicionPieChart({ precioCompra, gananciaReal }: ComposicionPieChartProps) {
  const chartTheme = useChartTheme();

  const dataPie = useMemo(() => {
    const datos = [
      {
        name: 'Inversión Inicial',
        value: precioCompra,
        fill: '#3B82F6',
      },
      {
        name: 'Ganancia/Pérdida',
        value: Math.abs(gananciaReal),
        fill: gananciaReal >= 0 ? '#10B981' : '#EF4444',
      },
    ];
    return datos;
  }, [precioCompra, gananciaReal]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand/30 transition-all duration-300"
    >
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-brand transition-colors duration-300">
        <FaChartPie className="text-brand" />
        Composición de la Inversión
      </h4>
      <div className="group-hover:scale-[1.01] transition-transform duration-300">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                color: chartTheme.tooltipColor,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatearMoneda(value), 'Valor']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
