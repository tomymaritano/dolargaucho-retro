import React from 'react';
import { useUVACalculation } from '@/hooks/useUVACalculation';
import { FaCalculator } from 'react-icons/fa';
import { CalculatorLayout } from './CalculatorLayout';
import { UVAInputs } from './UVAInputs';
import { UVAResults } from './UVAResults';

interface CalculadoraUVAProps {
  showHeader?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function CalculadoraUVA({ showHeader = true }: CalculadoraUVAProps) {
  const {
    montoCredito,
    plazoMeses,
    tasaAnual,
    variacionUVAAnual,
    ultimoUVA,
    setMontoCredito,
    setPlazoMeses,
    setTasaAnual,
    setVariacionUVAAnual,
    resultado,
  } = useUVACalculation();

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Crédito UVA</span>
        </>
      }
      description="Simulá tu crédito hipotecario en UVAs"
      showHeader={showHeader}
      variant="sidebar"
      sidebar={
        <UVAInputs
          montoCredito={montoCredito}
          plazoMeses={plazoMeses}
          tasaAnual={tasaAnual}
          variacionUVAAnual={variacionUVAAnual}
          onMontoChange={setMontoCredito}
          onPlazoChange={setPlazoMeses}
          onTasaChange={setTasaAnual}
          onVariacionChange={setVariacionUVAAnual}
        />
      }
    >
      {/* UVA Value Banner - Compact */}
      {ultimoUVA && (
        <div className="mb-3 p-2 bg-brand/5 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">UVA Actual</span>
            <span className="text-sm font-mono font-bold text-brand">
              {formatCurrency(ultimoUVA.valor)}
            </span>
          </div>
          <p className="text-[10px] text-secondary mt-0.5">
            {new Date(ultimoUVA.fecha).toLocaleDateString('es-AR')}
          </p>
        </div>
      )}

      {resultado ? (
        <UVAResults resultado={resultado} />
      ) : (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <FaCalculator className="text-3xl mx-auto mb-2 opacity-30 text-secondary" />
            <p className="text-sm text-secondary">Ingresá los valores en el sidebar</p>
          </div>
        </div>
      )}

      {/* Compact Info Footer */}
      <div className="mt-3 p-2 bg-panel/30 rounded-lg border border-slate-700">
        <p className="text-xs text-secondary">
          <strong className="text-foreground">UVA:</strong> Unidad que se ajusta con el CER
          (inflación). Las cuotas aumentan con la inflación manteniendo el valor real de la deuda.
        </p>
      </div>
    </CalculatorLayout>
  );
}
