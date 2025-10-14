'use client';

import React from 'react';
import { Activo, TipoActivo } from './types';
import { FaCar, FaHome, FaChartLine } from 'react-icons/fa';

interface FormularioActivoProps {
  onCalcular: (activo: Activo) => void;
}

const TIPOS_ACTIVO = [
  { value: 'vehiculo' as TipoActivo, label: 'Auto/Moto', icon: FaCar },
  { value: 'inmueble' as TipoActivo, label: 'Propiedad', icon: FaHome },
  { value: 'inversion' as TipoActivo, label: 'Inversión', icon: FaChartLine },
];

export function FormularioActivo({ onCalcular }: FormularioActivoProps) {
  const [tipo, setTipo] = React.useState<TipoActivo>('vehiculo');
  const [moneda, setMoneda] = React.useState<'ARS' | 'USD'>('ARS');
  const [fechaCompra, setFechaCompra] = React.useState('');
  const [precioCompra, setPrecioCompra] = React.useState('');
  const [fechaVenta, setFechaVenta] = React.useState(
    new Date().toISOString().split('T')[0] // Hoy
  );
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Activo y Moneda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Activo */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-3">Tipo de Activo</label>
          <div className="grid grid-cols-3 gap-3">
            {TIPOS_ACTIVO.map((tipoActivo) => {
              const Icon = tipoActivo.icon;
              const isSelected = tipo === tipoActivo.value;

              return (
                <button
                  key={tipoActivo.value}
                  type="button"
                  onClick={() => setTipo(tipoActivo.value)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald'
                        : 'border-border hover:border-accent-emerald/50 text-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="text-2xl" />
                  <span className="text-xs font-medium text-center">{tipoActivo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moneda */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-3">Moneda</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMoneda('ARS')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                ${
                  moneda === 'ARS'
                    ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald'
                    : 'border-border hover:border-accent-emerald/50 text-secondary hover:text-foreground'
                }
              `}
            >
              <span className="text-xl">🇦🇷</span>
              <span className="font-medium">ARS</span>
            </button>
            <button
              type="button"
              onClick={() => setMoneda('USD')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                ${
                  moneda === 'USD'
                    ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald'
                    : 'border-border hover:border-accent-emerald/50 text-secondary hover:text-foreground'
                }
              `}
            >
              <span className="text-xl">🇺🇸</span>
              <span className="font-medium">USD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fechaCompra" className="block text-sm font-medium text-secondary mb-2">
            Fecha de Compra
          </label>
          <input
            type="date"
            id="fechaCompra"
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-emerald/50"
          />
        </div>

        <div>
          <label htmlFor="precioCompra" className="block text-sm font-medium text-secondary mb-2">
            Precio de Compra ({moneda})
          </label>
          <input
            type="number"
            id="precioCompra"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(e.target.value)}
            placeholder={moneda === 'ARS' ? '1.500.000' : '15.000'}
            min="0"
            step={moneda === 'ARS' ? '1000' : '100'}
            required
            className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-emerald/50"
          />
        </div>
      </div>

      {/* Venta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fechaVenta" className="block text-sm font-medium text-secondary mb-2">
            Fecha de Venta / Valuación
          </label>
          <input
            type="date"
            id="fechaVenta"
            value={fechaVenta}
            onChange={(e) => setFechaVenta(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-emerald/50"
          />
        </div>

        <div>
          <label htmlFor="precioVenta" className="block text-sm font-medium text-secondary mb-2">
            Precio de Venta / Valor Actual ({moneda})
          </label>
          <input
            type="number"
            id="precioVenta"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder={moneda === 'ARS' ? '8.000.000' : '25.000'}
            min="0"
            step={moneda === 'ARS' ? '1000' : '100'}
            required
            className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-emerald/50"
          />
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full py-4 bg-accent-emerald hover:bg-accent-teal text-background-dark font-semibold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <FaChartLine />
        Calcular Rentabilidad
      </button>

      {/* Info */}
      <div className="p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
        <p className="text-sm text-secondary leading-relaxed">
          <span className="text-accent-emerald font-semibold">💡 Tip:</span> Esta calculadora te
          mostrará si tu inversión le ganó a la inflación y cuánto hubieras ganado con alternativas
          como el dólar.
        </p>
      </div>
    </form>
  );
}
