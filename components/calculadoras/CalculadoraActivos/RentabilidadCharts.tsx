/**
 * RentabilidadCharts Component
 *
 * Single Responsibility: Display both bar and pie charts for rentability analysis
 * Uses Lightweight Charts compatible components
 */

'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { formatearMoneda } from './utils';
import { RentabilidadBarChart } from './RentabilidadBarChart';
import { ComposicionPieChart } from './ComposicionPieChart';

interface RentabilidadChartsProps {
  rentabilidadNominal: number;
  rentabilidadReal: number;
  inflacionAcumulada: number;
  precioCompra: number;
  gananciaReal: number;
}

export function RentabilidadCharts({
  rentabilidadNominal,
  rentabilidadReal,
  inflacionAcumulada,
  precioCompra,
  gananciaReal,
}: RentabilidadChartsProps) {
  const resultado = useMemo(
    () => ({
      rentabilidadNominal,
      rentabilidadReal,
      inflacionAcumulada,
    }),
    [rentabilidadNominal, rentabilidadReal, inflacionAcumulada]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Rentabilidades */}
      <RentabilidadBarChart resultado={resultado} />

      {/* Gráfico Circular - Composición */}
      <ComposicionPieChart precioCompra={precioCompra} gananciaReal={gananciaReal} />
    </div>
  );
}
