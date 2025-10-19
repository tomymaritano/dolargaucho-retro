/**
 * RentabilidadCard Component
 *
 * Single Responsibility: Display rentability metric card with icon
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Tooltip as InfoTooltip } from '@/components/ui/Tooltip/Tooltip';
import { FaChartLine, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { formatearPorcentaje } from './utils';

interface RentabilidadCardProps {
  tipo: 'nominal' | 'real';
  valor: number;
  tooltipContent: string;
}

export function RentabilidadCard({ tipo, valor, tooltipContent }: RentabilidadCardProps) {
  const resultado = valor >= 0 ? 'ganancia' : 'perdida';
  const esNeutro = Math.abs(valor) < 0.01;

  const Icono =
    tipo === 'nominal'
      ? FaChartLine
      : resultado === 'ganancia'
        ? FaCheckCircle
        : esNeutro
          ? FaExclamationTriangle
          : FaTimesCircle;

  const colorTexto =
    resultado === 'ganancia' ? 'text-success' : esNeutro ? 'text-warning' : 'text-error';

  const colorBg =
    resultado === 'ganancia' ? 'bg-success/20' : esNeutro ? 'bg-warning/20' : 'bg-error/20';

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <InfoTooltip content={tooltipContent}>
            <p className="text-sm text-secondary mb-1 group-hover:text-brand/80 transition-colors duration-300">
              Rentabilidad {tipo === 'nominal' ? 'Nominal' : 'Real'}
            </p>
          </InfoTooltip>
          <div
            className={`text-3xl font-bold ${tipo === 'real' ? colorTexto : 'text-foreground'} group-hover:scale-105 transition-transform duration-300`}
          >
            {formatearPorcentaje(valor)}
          </div>
        </div>
        <div
          className={`p-3 rounded-lg ${colorBg} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icono
            className={`text-2xl ${tipo === 'real' ? colorTexto : resultado === 'ganancia' ? 'text-success' : 'text-error'}`}
          />
        </div>
      </div>
    </Card>
  );
}
