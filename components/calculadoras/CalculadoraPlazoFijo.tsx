import React from 'react';
import { usePlazoFijoCalculation } from '@/hooks/usePlazoFijoCalculation';
import { CalculatorLayout } from './CalculatorLayout';
import { PlazoFijoInputs } from './PlazoFijoInputs';
import { PlazoFijoResults } from './PlazoFijoResults';
import { PlazoFijoChart } from './PlazoFijoChart';

interface CalculadoraPlazoFijoProps {
  showHeader?: boolean;
}

export function CalculadoraPlazoFijo({ showHeader = true }: CalculadoraPlazoFijoProps) {
  const {
    capital,
    dias,
    tasaPersonalizada,
    usarTasaActual,
    tasas,
    loadingTasas,
    setCapital,
    setDias,
    setTasaPersonalizada,
    setUsarTasaActual,
    resultado,
  } = usePlazoFijoCalculation();

  // Market rate info banner (compact)
  const marketRate =
    tasas && tasas.length > 0 ? ((tasas[0]?.tnaClientes || 0) * 100).toFixed(2) : null;

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Plazo Fijo</span>
        </>
      }
      description="Simulá el rendimiento de tu plazo fijo con tasas del mercado"
      showHeader={showHeader}
      variant="sidebar"
      sidebar={
        <PlazoFijoInputs
          capital={capital}
          dias={dias}
          tasaPersonalizada={tasaPersonalizada}
          usarTasaActual={usarTasaActual}
          onCapitalChange={setCapital}
          onDiasChange={setDias}
          onTasaPersonalizadaChange={setTasaPersonalizada}
          onUsarTasaActualChange={setUsarTasaActual}
        />
      }
    >
      {/* Market Rate Banner - Compact */}
      {marketRate && !loadingTasas && (
        <div className="mb-3 p-2 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">TNA Mercado</span>
            <span className="text-sm font-mono font-bold text-brand">{marketRate}%</span>
          </div>
        </div>
      )}

      {resultado ? (
        <>
          <PlazoFijoResults resultado={resultado} />
          <div className="mt-3">
            <PlazoFijoChart resultado={resultado} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-sm text-secondary mb-2">Ingresá los valores en el sidebar</p>
            <p className="text-xs text-secondary">El cálculo se actualiza automáticamente</p>
          </div>
        </div>
      )}

      {/* Compact Info Footer */}
      <div className="mt-4 pt-3 border-t border-white/10/30">
        <p className="text-xs text-secondary">
          <strong className="text-foreground">Fórmula:</strong>{' '}
          <code className="text-brand text-[10px]">
            Interés = Capital × TNA × (Días / 365) / 100
          </code>
        </p>
      </div>
    </CalculatorLayout>
  );
}
