/**
 * InflacionInputs Component - COMPACT SIDEBAR VERSION
 *
 * Single Responsibility: Render compact inflation calculator inputs in sidebar
 * Maximum density design for sidebar layout
 */

import React from 'react';
import { CalculatorSidebar, CompactInput } from './shared';

interface InflacionInputsProps {
  initialAmount: number;
  years: number;
  useCustomDate: boolean;
  startDate: string;
  onInitialAmountChange: (value: number) => void;
  onYearsChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  onUseCustomDateChange: (value: boolean) => void;
}

export function InflacionInputs({
  initialAmount,
  years,
  useCustomDate,
  startDate,
  onInitialAmountChange,
  onYearsChange,
  onStartDateChange,
  onUseCustomDateChange,
}: InflacionInputsProps) {
  return (
    <CalculatorSidebar title="Inflación" subtitle="Poder adquisitivo en el tiempo">
      {/* Monto Inicial */}
      <CompactInput
        label="Monto Inicial"
        value={initialAmount.toString()}
        onChange={(value) => onInitialAmountChange(Number(value) || 0)}
        type="number"
        prefix="$"
        placeholder="100000"
        tooltip="Valor en pesos argentinos a evaluar"
      />

      {/* Modo Toggle */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1">Modo de Cálculo</label>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => onUseCustomDateChange(false)}
            className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
              !useCustomDate
                ? 'bg-brand text-background-dark'
                : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
            }`}
          >
            Proyección
          </button>
          <button
            onClick={() => onUseCustomDateChange(true)}
            className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
              useCustomDate
                ? 'bg-brand text-background-dark'
                : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
            }`}
          >
            Histórico
          </button>
        </div>
      </div>

      {/* Fecha (condicional) */}
      {useCustomDate && (
        <CompactInput
          label="Fecha de Compra"
          value={startDate}
          onChange={onStartDateChange}
          type="date"
          max={new Date().toISOString().split('T')[0]}
          tooltip="Fecha desde la cual calcular la inflación real"
        />
      )}

      {/* Años con slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-secondary">
            {useCustomDate ? 'Años desde compra' : 'Años futuros'}
          </label>
          <span className="text-xs font-bold text-brand">{years}</span>
        </div>
        <input
          type="range"
          value={years}
          onChange={(e) => onYearsChange(Number(e.target.value))}
          min="1"
          max="30"
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
        />
        <div className="flex justify-between text-[10px] text-secondary mt-1">
          <span>1 año</span>
          <span>30 años</span>
        </div>
      </div>
    </CalculatorSidebar>
  );
}
