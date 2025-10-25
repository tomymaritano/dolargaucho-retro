'use client';

import React from 'react';
import { Activo, TipoActivo } from './types';
import { FaCar, FaHome, FaChartLine } from 'react-icons/fa';
import { Button } from '@/components/ui/Button/Button';

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
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-brand bg-brand/10 text-brand scale-[1.02]'
                        : 'border-white/10 hover:border-brand/40 text-secondary hover:text-foreground hover:scale-[1.02] active:scale-95'
                    }
                  `}
                >
                  <Icon
                    className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                  />
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
                flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-300
                ${
                  moneda === 'ARS'
                    ? 'border-brand bg-brand/10 text-brand scale-[1.02]'
                    : 'border-white/10 hover:border-brand/40 text-secondary hover:text-foreground hover:scale-[1.02] active:scale-95'
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
                flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-300
                ${
                  moneda === 'USD'
                    ? 'border-brand bg-brand/10 text-brand scale-[1.02]'
                    : 'border-white/10 hover:border-brand/40 text-secondary hover:text-foreground hover:scale-[1.02] active:scale-95'
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
            className="w-full px-4 py-3 bg-panel border border-white/5 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
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
            className="w-full px-4 py-3 bg-panel border border-white/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-brand/50"
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
            className="w-full px-4 py-3 bg-panel border border-white/5 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
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
            className="w-full px-4 py-3 bg-panel border border-white/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
      </div>

      {/* Botón */}
      <Button type="submit" variant="primary" size="lg" fullWidth leftIcon={<FaChartLine />}>
        Calcular Rentabilidad
      </Button>

      {/* Info */}
      <div className="p-4 bg-brand/10 border border-brand/30 rounded-lg">
        <p className="text-sm text-secondary leading-relaxed">
          <span className="text-brand font-semibold">💡 Tip:</span> Esta calculadora te mostrará si
          tu inversión le ganó a la inflación y cuánto hubieras ganado con alternativas como el
          dólar.
        </p>
      </div>
    </form>
  );
}
