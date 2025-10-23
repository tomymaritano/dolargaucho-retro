/**
 * FormularioActivoCompact - COMPACT SIDEBAR VERSION
 *
 * Single Responsibility: Render compact asset form in sidebar
 * Maximum density design for sidebar layout
 */

'use client';

import React from 'react';
import { Activo, TipoActivo } from './types';
import { FaCar, FaHome, FaChartLine } from 'react-icons/fa';
import { CalculatorSidebar, CompactInput } from '../shared';

interface FormularioActivoCompactProps {
  onCalcular: (activo: Activo) => void;
}

const TIPOS_ACTIVO = [
  { value: 'vehiculo' as TipoActivo, label: 'Auto', icon: FaCar },
  { value: 'inmueble' as TipoActivo, label: 'Casa', icon: FaHome },
  { value: 'inversion' as TipoActivo, label: 'Inv.', icon: FaChartLine },
];

export function FormularioActivoCompact({ onCalcular }: FormularioActivoCompactProps) {
  const [tipo, setTipo] = React.useState<TipoActivo>('vehiculo');
  const [moneda, setMoneda] = React.useState<'ARS' | 'USD'>('ARS');
  const [fechaCompra, setFechaCompra] = React.useState('');
  const [precioCompra, setPrecioCompra] = React.useState('');
  const [fechaVenta, setFechaVenta] = React.useState(new Date().toISOString().split('T')[0]);
  const [precioVenta, setPrecioVenta] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activo: Activo = {
      tipo,
      fechaCompra: new Date(fechaCompra),
      precioCompra: parseFloat(precioCompra),
      monedaCompra: moneda,
      fechaVenta: new Date(fechaVenta),
      precioVenta: parseFloat(precioVenta),
      monedaVenta: moneda,
    };

    onCalcular(activo);
  };

  return (
    <CalculatorSidebar title="Rentabilidad" subtitle="Analizá tu inversión">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Activo - Compacto */}
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Tipo</label>
          <div className="grid grid-cols-3 gap-1">
            {TIPOS_ACTIVO.map((tipoActivo) => {
              const Icon = tipoActivo.icon;
              const isSelected = tipo === tipoActivo.value;

              return (
                <button
                  key={tipoActivo.value}
                  type="button"
                  onClick={() => setTipo(tipoActivo.value)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded transition-all ${
                    isSelected
                      ? 'bg-brand text-background-dark'
                      : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="text-[10px] font-medium">{tipoActivo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moneda - Compacto */}
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Moneda</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setMoneda('ARS')}
              className={`flex items-center justify-center gap-1 p-1.5 rounded text-xs font-medium transition-all ${
                moneda === 'ARS'
                  ? 'bg-brand text-background-dark'
                  : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
              }`}
            >
              <span>🇦🇷</span>
              <span>ARS</span>
            </button>
            <button
              type="button"
              onClick={() => setMoneda('USD')}
              className={`flex items-center justify-center gap-1 p-1.5 rounded text-xs font-medium transition-all ${
                moneda === 'USD'
                  ? 'bg-brand text-background-dark'
                  : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50'
              }`}
            >
              <span>🇺🇸</span>
              <span>USD</span>
            </button>
          </div>
        </div>

        {/* Compra */}
        <CompactInput
          label="Fecha Compra"
          value={fechaCompra}
          onChange={setFechaCompra}
          type="date"
          max={new Date().toISOString().split('T')[0]}
        />

        <CompactInput
          label={`Precio Compra (${moneda})`}
          value={precioCompra}
          onChange={setPrecioCompra}
          type="number"
          placeholder={moneda === 'ARS' ? '1500000' : '15000'}
        />

        {/* Venta */}
        <CompactInput
          label="Fecha Venta"
          value={fechaVenta}
          onChange={setFechaVenta}
          type="date"
          max={new Date().toISOString().split('T')[0]}
        />

        <CompactInput
          label={`Precio Venta (${moneda})`}
          value={precioVenta}
          onChange={setPrecioVenta}
          type="number"
          placeholder={moneda === 'ARS' ? '8000000' : '25000'}
        />

        {/* Botón Compacto */}
        <button
          type="submit"
          className="w-full bg-brand hover:bg-brand-light text-background-dark py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Calcular
        </button>
      </form>
    </CalculatorSidebar>
  );
}
