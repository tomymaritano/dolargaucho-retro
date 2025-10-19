/**
 * RentabilidadBarChart Component
 *
 * Single Responsibility: Display rentability comparison bar chart
 */

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartBar } from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ResultadoAnalisis } from './types';

interface RentabilidadBarChartProps {
  resultado: ResultadoAnalisis;
}

export function RentabilidadBarChart({ resultado }: RentabilidadBarChartProps) {
  const chartTheme = useChartTheme();

  const dataBarras = useMemo(
    () => [
      {
        name: 'Nominal',
        valor: resultado.rentabilidadNominal,
        fill: resultado.rentabilidadNominal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Real',
        valor: resultado.rentabilidadReal,
        fill: resultado.rentabilidadReal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Inflación',
        valor: resultado.inflacionAcumulada,
        fill: '#F59E0B',
      },
    ],
    [resultado]
  );

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand/30 transition-all duration-300"
    >
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-brand transition-colors duration-300">
        <FaChartBar className="text-brand" />
        Comparativa de Rentabilidades
      </h4>
      <div className="group-hover:scale-[1.01] transition-transform duration-300">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataBarras}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
            <XAxis dataKey="name" stroke={chartTheme.axisColor} />
            <YAxis stroke={chartTheme.axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                color: chartTheme.tooltipColor,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rentabilidad']}
            />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
              {dataBarras.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
