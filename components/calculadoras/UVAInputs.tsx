/**
 * UVAInputs Component - COMPACT SIDEBAR VERSION
 *
 * Single Responsibility: Render compact UVA credit inputs in sidebar
 * Maximum density design for sidebar layout
 */

import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { CalculatorSidebar, CompactInput, QuickPreset } from './shared';

interface UVAInputsProps {
  montoCredito: string;
  plazoMeses: number;
  tasaAnual: string;
  variacionUVAAnual: string;
  onMontoChange: (value: string) => void;
  onPlazoChange: (value: number) => void;
  onTasaChange: (value: string) => void;
  onVariacionChange: (value: string) => void;
}

const PLAZOS_COMUNES = [
  { meses: 120, label: '10a' },
  { meses: 180, label: '15a' },
  { meses: 240, label: '20a' },
  { meses: 300, label: '25a' },
  { meses: 360, label: '30a' },
];

const formatNumber = (value: string) => {
  const num = value.replace(/\D/g, '');
  return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
};

export function UVAInputs({
  montoCredito,
  plazoMeses,
  tasaAnual,
  variacionUVAAnual,
  onMontoChange,
  onPlazoChange,
  onTasaChange,
  onVariacionChange,
}: UVAInputsProps) {
  return (
    <CalculatorSidebar title="Crédito UVA" subtitle="Simulá tu hipotecario">
      {/* Monto */}
      <div className="group">
        <label className="block text-xs font-medium text-secondary mb-1">Monto del Crédito</label>
        <div className="relative">
          <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
          <input
            type="text"
            value={formatNumber(montoCredito)}
            onChange={(e) => onMontoChange(e.target.value)}
            placeholder="50.000.000"
            className="w-full pl-8 pr-3 py-2 h-9 text-sm font-mono font-semibold bg-background-dark border border-slate-700 rounded-lg focus:ring-1 focus:ring-brand/30 focus:border-brand/50 focus:outline-none transition-all text-foreground"
          />
        </div>
      </div>

      {/* Plazo con Presets */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1">Plazo</label>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {PLAZOS_COMUNES.map((plazo) => (
            <QuickPreset
              key={plazo.meses}
              label={plazo.label}
              isActive={plazoMeses === plazo.meses}
              onClick={() => onPlazoChange(plazo.meses)}
            />
          ))}
        </div>
        <input
          type="number"
          value={plazoMeses}
          onChange={(e) => onPlazoChange(parseInt(e.target.value) || 120)}
          min="12"
          max="480"
          placeholder="Meses"
          className="w-full px-3 py-2 h-9 text-sm font-mono font-semibold bg-background-dark border border-slate-700 rounded-lg focus:ring-1 focus:ring-brand/30 focus:border-brand/50 focus:outline-none transition-all text-foreground"
        />
      </div>

      {/* Tasa y Variación UVA */}
      <div className="grid grid-cols-2 gap-2">
        <CompactInput
          label="TNA"
          value={tasaAnual}
          onChange={onTasaChange}
          type="number"
          suffix="%"
          placeholder="8"
          tooltip="Tasa Nominal Anual del crédito"
        />

        <CompactInput
          label="Var. UVA"
          value={variacionUVAAnual}
          onChange={onVariacionChange}
          type="number"
          suffix="%"
          placeholder="90"
          tooltip="Variación UVA anual estimada"
        />
      </div>
    </CalculatorSidebar>
  );
}
