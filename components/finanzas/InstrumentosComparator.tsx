/**
 * InstrumentosComparator Component
 *
 * Comparador visual de diferentes instrumentos de inversión
 * Muestra una tabla comparativa con rendimientos, riesgos y características
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import {
  FaBalanceScale,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface InstrumentosComparatorProps {
  tasaPF?: number; // TNA en decimal
  valorUVA?: number;
}

interface Instrumento {
  nombre: string;
  tna?: string;
  rendimientoEstimado: string;
  riesgo: 'bajo' | 'medio' | 'alto';
  liquidez: 'inmediata' | 'media' | 'baja';
  montoMinimo: string;
  ventajas: string[];
  desventajas: string[];
  recomendadoPara: string;
}

export const InstrumentosComparator = React.memo(function InstrumentosComparator({
  tasaPF = 0.75,
}: InstrumentosComparatorProps) {
  const instrumentos: Instrumento[] = [
    {
      nombre: 'Plazo Fijo Tradicional',
      tna: `${(tasaPF * 100).toFixed(0)}%`,
      rendimientoEstimado: '6-7% mensual',
      riesgo: 'bajo',
      liquidez: 'baja',
      montoMinimo: '$1.000',
      ventajas: [
        'Rendimiento garantizado',
        'Protección del capital',
        'Disponible en todos los bancos',
      ],
      desventajas: [
        'Pierde contra inflación',
        'Dinero bloqueado hasta vencimiento',
        'Retención de ganancias',
      ],
      recomendadoPara: 'Ahorradores conservadores con horizonte corto (30-60 días)',
    },
    {
      nombre: 'Plazo Fijo UVA',
      tna: 'Variable',
      rendimientoEstimado: '4-5% + inflación',
      riesgo: 'bajo',
      liquidez: 'baja',
      montoMinimo: '$10.000',
      ventajas: ['Protección contra inflación', 'Capital ajustado por UVA', 'Bajo riesgo'],
      desventajas: [
        'Requiere plazo mínimo 90 días',
        'Monto mínimo más alto',
        'Rendimiento en pesos depende de inflación',
      ],
      recomendadoPara: 'Ahorro a mediano/largo plazo (90+ días) con cobertura inflacionaria',
    },
    {
      nombre: 'FCI Money Market',
      rendimientoEstimado: '5-6% mensual',
      riesgo: 'bajo',
      liquidez: 'inmediata',
      montoMinimo: '$1.000',
      ventajas: [
        'Liquidez inmediata (T+0 o T+1)',
        'Sin plazo mínimo',
        'Diversificación automática',
      ],
      desventajas: [
        'Rendimiento variable',
        'Comisiones de administración',
        'Puede perder contra inflación',
      ],
      recomendadoPara:
        'Ahorradores que necesitan liquidez con mejor rendimiento que caja de ahorro',
    },
    {
      nombre: 'FCI Renta Fija',
      rendimientoEstimado: '7-10% mensual',
      riesgo: 'medio',
      liquidez: 'media',
      montoMinimo: '$1.000',
      ventajas: ['Mayor rendimiento potencial', 'Gestión profesional', 'Liquidez en pocos días'],
      desventajas: ['Riesgo de mercado', 'Comisiones más altas', 'Rendimiento no garantizado'],
      recomendadoPara: 'Inversores con tolerancia a volatilidad moderada y horizonte 60+ días',
    },
    {
      nombre: 'Criptomonedas Estables',
      tna: 'N/A',
      rendimientoEstimado: '8-12% anual (USD)',
      riesgo: 'medio',
      liquidez: 'inmediata',
      montoMinimo: 'Sin mínimo',
      ventajas: ['Dolarización digital', 'Liquidez 24/7', 'Sin intermediarios bancarios'],
      desventajas: ['Riesgo tecnológico', 'Volatilidad en pesos', 'Requiere conocimiento técnico'],
      recomendadoPara: 'Ahorro en dólares digital con tolerancia a riesgo tecnológico',
    },
  ];

  const getRiesgoColor = (riesgo: string) => {
    if (riesgo === 'bajo') return 'text-success';
    if (riesgo === 'medio') return 'text-warning';
    return 'text-error';
  };

  const getRiesgoIcon = (riesgo: string) => {
    if (riesgo === 'bajo') return <FaCheckCircle className="text-success" />;
    if (riesgo === 'medio') return <FaExclamationTriangle className="text-warning" />;
    return <FaTimesCircle className="text-error" />;
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand/10">
            <FaBalanceScale className="text-brand text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Comparador de Instrumentos</h3>
            <p className="text-sm text-secondary">
              Compará opciones de inversión para tomar mejores decisiones
            </p>
          </div>
        </div>

        {/* Comparador */}
        <div className="space-y-4">
          {instrumentos.map((inst, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1">{inst.nombre}</h4>
                  <div className="flex items-center gap-3 text-xs">
                    {inst.tna && <span className="text-brand font-semibold">TNA: {inst.tna}</span>}
                    <span className="text-secondary">
                      Rendimiento:{' '}
                      <span className="text-foreground font-semibold">
                        {inst.rendimientoEstimado}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {getRiesgoIcon(inst.riesgo)}
                  <span className={`font-semibold ${getRiesgoColor(inst.riesgo)}`}>
                    {inst.riesgo.charAt(0).toUpperCase() + inst.riesgo.slice(1)} Riesgo
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-secondary mb-1">Liquidez</p>
                  <p className="text-sm font-semibold text-foreground capitalize">
                    {inst.liquidez}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary mb-1">Monto Mínimo</p>
                  <p className="text-sm font-semibold text-foreground">{inst.montoMinimo}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-secondary mb-1">Recomendado Para</p>
                  <p className="text-xs text-foreground">{inst.recomendadoPara}</p>
                </div>
              </div>

              {/* Ventajas y Desventajas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                {/* Ventajas */}
                <div>
                  <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1">
                    <FaCheckCircle className="text-[10px]" />
                    Ventajas
                  </p>
                  <ul className="space-y-1">
                    {inst.ventajas.map((v, i) => (
                      <li key={i} className="text-xs text-secondary flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desventajas */}
                <div>
                  <p className="text-xs font-semibold text-error mb-2 flex items-center gap-1">
                    <FaTimesCircle className="text-[10px]" />
                    Desventajas
                  </p>
                  <ul className="space-y-1">
                    {inst.desventajas.map((d, i) => (
                      <li key={i} className="text-xs text-secondary flex items-start gap-2">
                        <span className="text-error mt-1">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
          <p className="text-xs text-secondary">
            <strong className="text-foreground">Disclaimer:</strong> Esta información es educativa y
            no constituye asesoramiento financiero. Los rendimientos son estimaciones y pueden
            variar según el mercado, entidad, y condiciones específicas. Consultá con un asesor
            financiero antes de invertir.
          </p>
        </div>
      </div>
    </Card>
  );
});
