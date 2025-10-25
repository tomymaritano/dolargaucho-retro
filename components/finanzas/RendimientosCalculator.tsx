/**
 * RendimientosCalculator Component
 *
 * Calculadora de rendimientos para diferentes instrumentos financieros
 * Permite calcular el rendimiento de plazo fijo, UVA, y otros instrumentos
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

type InstrumentoType = 'plazo-fijo' | 'uva' | 'fci';

interface RendimientosCalculatorProps {
  tasaPF?: number; // TNA en decimal (ej: 0.75 para 75%)
  valorUVA?: number;
}

export const RendimientosCalculator = React.memo(function RendimientosCalculator({
  tasaPF = 0.75,
  valorUVA = 1000,
}: RendimientosCalculatorProps) {
  const [instrumento, setInstrumento] = useState<InstrumentoType>('plazo-fijo');
  const [monto, setMonto] = useState<string>('100000');
  const [plazo, setPlazo] = useState<string>('30');
  const [tasaCustom, setTasaCustom] = useState<string>((tasaPF * 100).toFixed(2));

  // Calcular rendimiento
  const resultado = useMemo(() => {
    const montoNum = parseFloat(monto) || 0;
    const plazoNum = parseInt(plazo) || 0;
    const tasaNum = parseFloat(tasaCustom) / 100 || 0;

    if (montoNum <= 0 || plazoNum <= 0) {
      return { ganancia: 0, total: 0, tasaDiaria: 0 };
    }

    let ganancia = 0;

    if (instrumento === 'plazo-fijo') {
      // TNA = Tasa Nominal Anual
      // Ganancia = Capital × (TNA / 365) × días
      const tasaDiaria = tasaNum / 365;
      ganancia = montoNum * tasaDiaria * plazoNum;
    } else if (instrumento === 'uva') {
      // Estimación simple: asumimos que UVA sigue inflación aprox 5% mensual
      const tasaMensual = 0.05;
      const meses = plazoNum / 30;
      ganancia = montoNum * tasaMensual * meses;
    } else if (instrumento === 'fci') {
      // Estimación conservadora: 3% mensual promedio
      const tasaMensual = 0.03;
      const meses = plazoNum / 30;
      ganancia = montoNum * tasaMensual * meses;
    }

    return {
      ganancia: ganancia,
      total: montoNum + ganancia,
      tasaDiaria: (tasaNum / 365) * 100,
    };
  }, [monto, plazo, tasaCustom, instrumento]);

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand/10">
            <FaCalculator className="text-brand text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Calculadora de Rendimientos</h3>
            <p className="text-sm text-secondary">Estimá cuánto ganás con tu inversión</p>
          </div>
        </div>

        {/* Selector de Instrumento */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Instrumento</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setInstrumento('plazo-fijo')}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                instrumento === 'plazo-fijo'
                  ? 'bg-brand text-white'
                  : 'bg-panel/10 text-secondary hover:bg-panel/20 hover:text-foreground'
              }`}
            >
              Plazo Fijo
            </button>
            <button
              onClick={() => setInstrumento('uva')}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                instrumento === 'uva'
                  ? 'bg-brand text-white'
                  : 'bg-panel/10 text-secondary hover:bg-panel/20 hover:text-foreground'
              }`}
            >
              UVA
            </button>
            <button
              onClick={() => setInstrumento('fci')}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                instrumento === 'fci'
                  ? 'bg-brand text-white'
                  : 'bg-panel/10 text-secondary hover:bg-panel/20 hover:text-foreground'
              }`}
            >
              FCI
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monto */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Monto a Invertir</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">$</span>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-lg bg-panel/10 border border-border/5 text-foreground focus:border-brand focus:outline-none transition-all"
                placeholder="100000"
              />
            </div>
          </div>

          {/* Plazo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Plazo (días)</label>
            <input
              type="number"
              value={plazo}
              onChange={(e) => setPlazo(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-panel/10 border border-border/5 text-foreground focus:border-brand focus:outline-none transition-all"
              placeholder="30"
            />
          </div>

          {/* Tasa (solo para plazo fijo) */}
          {instrumento === 'plazo-fijo' && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground">TNA (% anual)</label>
              <input
                type="number"
                step="0.01"
                value={tasaCustom}
                onChange={(e) => setTasaCustom(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-panel/10 border border-border/5 text-foreground focus:border-brand focus:outline-none transition-all"
                placeholder="75.00"
              />
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Ganancia */}
            <div>
              <p className="text-xs text-secondary mb-1">Ganancia Estimada</p>
              <p className="text-2xl font-black text-success">
                $
                {resultado.ganancia.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Total */}
            <div>
              <p className="text-xs text-secondary mb-1">Total al Vencimiento</p>
              <p className="text-2xl font-black text-brand">
                $
                {resultado.total.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {instrumento === 'plazo-fijo' && (
            <div className="pt-3 border-t border-border/10">
              <p className="text-xs text-secondary">
                Tasa diaria:{' '}
                <span className="font-semibold text-foreground">
                  {resultado.tasaDiaria.toFixed(4)}%
                </span>{' '}
                | Rendimiento:{' '}
                <span className="font-semibold text-foreground">
                  {((resultado.ganancia / parseFloat(monto)) * 100).toFixed(2)}%
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white/[0.02] rounded-lg p-4 border border-border/5">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-brand text-sm mt-0.5 flex-shrink-0" />
            <div className="text-xs text-secondary space-y-1">
              {instrumento === 'plazo-fijo' && (
                <>
                  <p>
                    <strong className="text-foreground">Plazo Fijo:</strong> Calculado con TNA (Tasa
                    Nominal Anual). La ganancia real puede variar según el banco y tipo de plazo
                    fijo.
                  </p>
                  <p>
                    <strong className="text-foreground">Nota:</strong> No incluye retención de
                    ganancias ni impuestos.
                  </p>
                </>
              )}
              {instrumento === 'uva' && (
                <p>
                  <strong className="text-foreground">UVA:</strong> Estimación basada en inflación
                  promedio de ~5% mensual. El valor real depende del índice UVA oficial.
                </p>
              )}
              {instrumento === 'fci' && (
                <p>
                  <strong className="text-foreground">FCI:</strong> Estimación conservadora de 3%
                  mensual. El rendimiento real varía según el fondo y mercado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
