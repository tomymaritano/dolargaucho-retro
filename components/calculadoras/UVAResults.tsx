/**
 * UVAResults Component - COMPACT VERSION
 *
 * Single Responsibility: Render compact UVA calculation results
 * Maximum density with MetricCard and collapsible sections
 */

import React from 'react';
import { MetricCard, CollapsibleSection } from './shared';
import type { UVAResult } from '@/hooks/useUVACalculation';
import { FaTable, FaInfoCircle } from 'react-icons/fa';

interface UVAResultsProps {
  resultado: UVAResult;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function UVAResults({ resultado }: UVAResultsProps) {
  return (
    <div className="space-y-3">
      {/* Main Metrics - Compact */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Cuota Inicial"
          value={formatCurrency(resultado.cuotaInicialPesos)}
          sublabel="Mes 1"
          variant="success"
        />

        <MetricCard
          label="UVAs Crédito"
          value={`${(resultado.creditoEnUVAs / 1000).toFixed(0)}k`}
          sublabel={`${(resultado.plazoMeses / 12).toFixed(0)}a`}
          variant="info"
        />
      </div>

      {/* Projections Table - Collapsible */}
      <CollapsibleSection title="Proyección de Cuotas" icon={<FaTable />}>
        <div className="space-y-1.5">
          {resultado.proyecciones.map((proj, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-background-dark/30 rounded text-xs"
            >
              <span className="text-secondary">
                M{proj.mes} ({(proj.mes / 12).toFixed(1)}a)
              </span>
              <div className="text-right">
                <div className="font-mono font-bold text-foreground text-sm">
                  {formatCurrency(proj.cuota)}
                </div>
                <div className="text-secondary text-[10px]">UVA ${proj.uva.toFixed(0)}</div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Details - Collapsible */}
      <CollapsibleSection title="Detalles del Crédito" icon={<FaInfoCircle />}>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-background-dark/30 rounded">
            <p className="text-[10px] text-secondary mb-0.5">Tasa Mensual</p>
            <p className="text-sm font-mono font-bold text-brand">
              {resultado.tasaMensual.toFixed(3)}%
            </p>
          </div>
          <div className="p-2 bg-background-dark/30 rounded">
            <p className="text-[10px] text-secondary mb-0.5">UVA Actual</p>
            <p className="text-sm font-mono font-bold text-brand">
              ${resultado.valorUVAActual.toFixed(2)}
            </p>
          </div>
          <div className="p-2 bg-background-dark/30 rounded">
            <p className="text-[10px] text-secondary mb-0.5">Cuota en UVAs</p>
            <p className="text-sm font-mono font-bold text-foreground">
              {resultado.cuotaEnUVAs.toFixed(0)}
            </p>
          </div>
          <div className="p-2 bg-background-dark/30 rounded">
            <p className="text-[10px] text-secondary mb-0.5">Crédito en $</p>
            <p className="text-sm font-mono font-bold text-foreground">
              {formatCurrency(resultado.creditoEnPesos)}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Warning - Compact */}
      <div className="p-2 bg-warning/5 border border-warning/20 rounded-lg">
        <p className="text-xs text-secondary flex items-start gap-1">
          <span className="text-warning">⚠️</span>
          <span>
            Simulación aproximada. La cuota UVA aumenta con el CER (inflación). Valores reales
            pueden variar.
          </span>
        </p>
      </div>
    </div>
  );
}
