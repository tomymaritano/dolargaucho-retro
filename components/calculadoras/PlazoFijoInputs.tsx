/**
 * PlazoFijoInputs Component - COMPACT SIDEBAR VERSION
 *
 * Single Responsibility: Render compact plazo fijo input fields in sidebar
 * Maximum density design for sidebar layout
 */

import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { CalculatorSidebar, CompactInput, QuickPreset } from './shared';

interface PlazoFijoInputsProps {
  capital: string;
  dias: number;
  tasaPersonalizada: string;
  usarTasaActual: boolean;
  onCapitalChange: (value: string) => void;
  onDiasChange: (dias: number) => void;
  onTasaPersonalizadaChange: (value: string) => void;
  onUsarTasaActualChange: (usar: boolean) => void;
}

const PLAZOS_COMUNES = [
  { dias: 30, label: '30d' },
  { dias: 60, label: '60d' },
  { dias: 90, label: '90d' },
  { dias: 180, label: '180d' },
  { dias: 360, label: '360d' },
];

const formatNumber = (value: string) => {
  const num = value.replace(/\D/g, '');
  return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
};

export function PlazoFijoInputs({
  capital,
  dias,
  tasaPersonalizada,
  usarTasaActual,
  onCapitalChange,
  onDiasChange,
  onTasaPersonalizadaChange,
  onUsarTasaActualChange,
}: PlazoFijoInputsProps) {
  return (
    <CalculatorSidebar title="Plazo Fijo" subtitle="Simulá tu inversión">
      {/* Capital */}
      <div className="group">
        <label className="block text-xs font-medium text-secondary mb-1">Capital Inicial</label>
        <div className="relative">
          <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
          <input
            type="text"
            value={formatNumber(capital)}
            onChange={(e) => onCapitalChange(e.target.value)}
            placeholder="100.000"
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
              key={plazo.dias}
              label={plazo.label}
              isActive={dias === plazo.dias}
              onClick={() => onDiasChange(plazo.dias)}
            />
          ))}
        </div>
        <input
          type="number"
          value={dias}
          onChange={(e) => onDiasChange(parseInt(e.target.value) || 30)}
          min="1"
          max="730"
          className="w-full px-3 py-2 h-9 text-sm font-mono font-semibold bg-background-dark border border-slate-700 rounded-lg focus:ring-1 focus:ring-brand/30 focus:border-brand/50 focus:outline-none transition-all text-foreground"
        />
      </div>

      {/* TNA Toggle */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1">Tasa (TNA)</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <button
            onClick={() => onUsarTasaActualChange(true)}
            className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
              usarTasaActual
                ? 'bg-brand text-background-dark'
                : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
            }`}
          >
            Mercado
          </button>
          <button
            onClick={() => onUsarTasaActualChange(false)}
            className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
              !usarTasaActual
                ? 'bg-brand text-background-dark'
                : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
            }`}
          >
            Custom
          </button>
        </div>

        {!usarTasaActual && (
          <CompactInput
            label=""
            value={tasaPersonalizada}
            onChange={onTasaPersonalizadaChange}
            type="number"
            suffix="%"
            placeholder="65"
          />
        )}
      </div>
    </CalculatorSidebar>
  );
}
