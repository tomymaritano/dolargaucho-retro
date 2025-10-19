/**
 * PlazoFijoInputs Component
 *
 * Single Responsibility: Render plazo fijo input fields
 * Extracted from CalculadoraPlazoFijo.tsx
 *
 * Professional hover improvements:
 * - Button scale animations (1.05x)
 * - Focus ring transitions on inputs
 * - Icon color transitions
 */

import React from 'react';
import { FaPercent, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

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
  { dias: 30, label: '30 días' },
  { dias: 60, label: '60 días' },
  { dias: 90, label: '90 días' },
  { dias: 180, label: '180 días' },
  { dias: 360, label: '360 días' },
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
    <>
      {/* Capital y Plazo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Capital */}
        <div className="group">
          <label className="block text-sm font-medium text-foreground mb-2">Capital Inicial</label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
            <input
              type="text"
              value={formatNumber(capital)}
              onChange={(e) => onCapitalChange(e.target.value)}
              placeholder="100.000"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>

        {/* Plazo */}
        <div className="group">
          <label className="block text-sm font-medium text-foreground mb-2">Plazo en Días</label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {PLAZOS_COMUNES.map((plazo) => (
              <button
                key={plazo.dias}
                onClick={() => onDiasChange(plazo.dias)}
                className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all duration-300 border hover:scale-105 active:scale-95 ${
                  dias === plazo.dias
                    ? 'bg-brand text-background-dark border-brand scale-105'
                    : 'glass border-border text-foreground hover:border-brand/30'
                }`}
              >
                {plazo.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
            <input
              type="number"
              value={dias}
              onChange={(e) => onDiasChange(parseInt(e.target.value) || 30)}
              min="1"
              max="730"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>
      </div>

      {/* TNA Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">
          Tasa de Interés (TNA)
        </label>
        <div className="flex gap-4 mb-3">
          <button
            onClick={() => onUsarTasaActualChange(true)}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border hover:scale-[1.02] active:scale-95 ${
              usarTasaActual
                ? 'bg-brand text-background-dark border-brand scale-[1.02]'
                : 'glass border-border text-secondary hover:text-foreground hover:border-brand/30'
            }`}
          >
            Tasa de Mercado
          </button>
          <button
            onClick={() => onUsarTasaActualChange(false)}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border hover:scale-[1.02] active:scale-95 ${
              !usarTasaActual
                ? 'bg-brand text-background-dark border-brand scale-[1.02]'
                : 'glass border-border text-secondary hover:text-foreground hover:border-brand/30'
            }`}
          >
            Tasa Personalizada
          </button>
        </div>

        {!usarTasaActual && (
          <div className="relative group">
            <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
            <input
              type="number"
              value={tasaPersonalizada}
              onChange={(e) => onTasaPersonalizadaChange(e.target.value)}
              placeholder="Ej: 65"
              step="0.1"
              min="0"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        )}
      </div>
    </>
  );
}
