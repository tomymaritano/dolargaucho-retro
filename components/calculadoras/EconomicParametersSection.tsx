/**
 * Economic Parameters Section
 * Displays automatic economic parameters from API data
 */

import React from 'react';
import { FaChartLine, FaPercent } from 'react-icons/fa';
import type { InflacionData } from '@/types/api/finanzas';
import type { DolarData, DolarHistorico } from '@/types/api/dolar';

interface EconomicParametersSectionProps {
  inflacionMensualAuto: number;
  devaluacionMensualAuto: number;
  spreadMEPAuto: number;
  ultimaInflacion: InflacionData | null | undefined;
  dolarHistorico: DolarHistorico[] | null | undefined;
  dolarBlue: DolarData | null | undefined;
  dolarMEP: DolarData | null | undefined;
}

export function EconomicParametersSection({
  inflacionMensualAuto,
  devaluacionMensualAuto,
  spreadMEPAuto,
  ultimaInflacion,
  dolarHistorico,
  dolarBlue,
  dolarMEP,
}: EconomicParametersSectionProps) {
  return (
    <div className="mb-8 p-6 rounded-xl bg-panel/50 border border-white/5">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
        <FaChartLine className="text-brand" />
        Parámetros Económicos (Automáticos desde API)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inflación Mensual */}
        <div>
          <label className="block text-xs font-medium text-secondary uppercase mb-2">
            Inflación Mensual
          </label>
          <div className="relative">
            <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={`${inflacionMensualAuto.toFixed(2)}%`}
              readOnly
              className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-white/5 rounded-xl text-foreground cursor-not-allowed"
              title={ultimaInflacion ? `Dato del ${ultimaInflacion.fecha}` : 'Valor estimado'}
            />
          </div>
          <p className="text-xs text-secondary mt-1">
            {ultimaInflacion
              ? `📊 Dato oficial del ${ultimaInflacion.fecha}`
              : '⚠️ Usando valor estimado'}
          </p>
        </div>

        {/* Devaluación Mensual */}
        <div>
          <label className="block text-xs font-medium text-secondary uppercase mb-2">
            Devaluación Mensual
          </label>
          <div className="relative">
            <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={`${devaluacionMensualAuto.toFixed(2)}%`}
              readOnly
              className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-white/5 rounded-xl text-foreground cursor-not-allowed"
              title="Calculado desde dólar blue del último mes"
            />
          </div>
          <p className="text-xs text-secondary mt-1">
            {dolarHistorico && dolarBlue
              ? '📈 Calculado desde dato histórico'
              : '⚠️ Usando valor estimado'}
          </p>
        </div>

        {/* Spread MEP vs Blue */}
        <div>
          <label className="block text-xs font-medium text-secondary uppercase mb-2">
            Spread MEP vs Blue
          </label>
          <div className="relative">
            <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={`${spreadMEPAuto.toFixed(2)}%`}
              readOnly
              className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-white/5 rounded-xl text-foreground cursor-not-allowed"
              title={
                dolarMEP
                  ? `Blue: $${dolarBlue?.venta.toFixed(2)} | MEP: $${dolarMEP.venta.toFixed(2)}`
                  : 'Calculado estimado'
              }
            />
          </div>
          <p className="text-xs text-secondary mt-1">
            {dolarMEP
              ? `💵 Blue $${dolarBlue?.venta.toFixed(2)} | MEP $${dolarMEP.venta.toFixed(2)}`
              : '⚠️ Usando valor estimado'}
          </p>
        </div>
      </div>
    </div>
  );
}
