/**
 * ComparativaDolarCard Component
 *
 * Single Responsibility: Display dollar comparison card
 */

import React from 'react';
import { formatearMoneda, formatearPorcentaje } from './utils';

interface ComparativaDolarCardProps {
  tipo: 'blue' | 'oficial';
  valorFinal: number;
  diferenciaPorcentual: number;
  precioVenta: number;
}

export function ComparativaDolarCard({
  tipo,
  valorFinal,
  diferenciaPorcentual,
  precioVenta,
}: ComparativaDolarCardProps) {
  const ganaste = diferenciaPorcentual < 0;
  const colorTexto = ganaste ? 'text-success' : 'text-error';
  const emoji = ganaste ? '📈' : '📉';
  const texto = ganaste ? 'Ganaste' : 'Perdiste';

  return (
    <div className="p-4 bg-panel rounded-lg border border-border/5 hover:border-brand/30 hover:scale-[1.01] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors duration-300">
          Dólar {tipo === 'blue' ? 'Blue' : 'Oficial'}
        </span>
        <span
          className={`text-sm font-semibold ${colorTexto} group-hover:scale-105 transition-transform duration-300`}
        >
          {emoji} {texto} {formatearPorcentaje(Math.abs(diferenciaPorcentual))}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-secondary">Si hubieras comprado USD:</p>
          <p className="text-foreground font-semibold">{formatearMoneda(valorFinal)}</p>
        </div>
        <div>
          <p className="text-secondary">Diferencia vs tu activo:</p>
          <p className={`font-semibold ${colorTexto}`}>
            {formatearMoneda(valorFinal - precioVenta)}
          </p>
        </div>
      </div>
    </div>
  );
}
