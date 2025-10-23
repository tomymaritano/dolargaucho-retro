import React from 'react';
import { useInflacionCalculation } from '@/hooks/useInflacionCalculation';
import { CalculatorLayout } from './CalculatorLayout';
import { InflacionInputs } from './InflacionInputs';
import { InflacionResults } from './InflacionResults';
import { InflacionChart } from './InflacionChart';

interface CalculadoraInflacionProps {
  showHeader?: boolean;
}

export default function CalculadoraInflacion({ showHeader = true }: CalculadoraInflacionProps) {
  const {
    initialAmount,
    years,
    futureValues,
    loading,
    useCustomDate,
    startDate,
    historicalRate,
    activeRate,
    setInitialAmount,
    setYears,
    setUseCustomDate,
    setStartDate,
  } = useInflacionCalculation();

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Inflación</span>
        </>
      }
      description="Proyecta el impacto de la inflación en tu dinero"
      showHeader={showHeader}
      variant="sidebar"
      sidebar={
        <InflacionInputs
          initialAmount={initialAmount}
          years={years}
          useCustomDate={useCustomDate}
          startDate={startDate}
          onInitialAmountChange={setInitialAmount}
          onYearsChange={setYears}
          onStartDateChange={setStartDate}
          onUseCustomDateChange={setUseCustomDate}
        />
      }
    >
      {/* Rate Banner - Compact */}
      {!loading && (
        <div className="mb-3 p-2 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">
              {useCustomDate && historicalRate !== null ? 'Tasa Histórica' : 'Tasa Actual'}
            </span>
            <span className="text-sm font-mono font-bold text-warning">
              {activeRate.toFixed(2)}%
            </span>
          </div>
          {useCustomDate && startDate && (
            <p className="text-[10px] text-secondary mt-0.5">
              Desde {new Date(startDate).toLocaleDateString('es-AR')}
            </p>
          )}
        </div>
      )}

      {!loading ? (
        <>
          <InflacionResults
            initialAmount={initialAmount}
            years={years}
            futureValues={futureValues}
          />
          <div className="mt-3">
            <InflacionChart futureValues={futureValues} years={years} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-secondary">Cargando datos de inflación...</p>
        </div>
      )}

      {/* Compact Info */}
      <div className="mt-3 p-2 bg-panel/30 rounded-lg border border-slate-700">
        <p className="text-xs text-secondary">
          {useCustomDate
            ? 'Cálculo basado en inflación histórica real desde la fecha seleccionada'
            : 'Proyección usando tasa interanual actual. Los valores reales pueden variar'}
        </p>
      </div>
    </CalculatorLayout>
  );
}
