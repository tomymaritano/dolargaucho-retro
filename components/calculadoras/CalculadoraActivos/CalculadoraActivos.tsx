'use client';

import React, { useState } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { FormularioActivoCompact } from './FormularioActivoCompact';
import { useComparativas } from './hooks/useComparativas';
import { Activo } from './types';
import { FaSpinner } from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';
import { MetricCard, CollapsibleSection } from '../shared';
import { RentabilidadCharts } from './RentabilidadCharts';

const FAQ_ACTIVOS = [
  {
    question: '¿Qué es rentabilidad nominal vs real?',
    answer:
      '<strong>Nominal:</strong> Ganancia sin inflación. Ej: $1M → $5M = 400% nominal.<br><strong>Real:</strong> Ganancia ajustada por inflación.',
  },
  {
    question: '¿Por qué USD muestra inflación?',
    answer:
      'El dólar también pierde poder adquisitivo (~22% en 2020-2024). Tu inversión USD debe superar la inflación estadounidense.',
  },
];

interface CalculadoraActivosProps {
  showHeader?: boolean;
}

export function CalculadoraActivos({ showHeader = true }: CalculadoraActivosProps) {
  const [activo, setActivo] = useState<Activo | null>(null);
  const { data: resultado, isLoading } = useComparativas(activo);

  const handleCalcular = (nuevoActivo: Activo) => {
    setActivo(nuevoActivo);
  };

  const formatValue = (val: number) => {
    return activo?.monedaCompra === 'USD'
      ? `$${val.toFixed(0)}`
      : `$${Math.round(val).toLocaleString('es-AR')}`;
  };

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Rentabilidad</span>
        </>
      }
      description="Analizá si tu inversión le ganó a la inflación"
      showHeader={showHeader}
      variant="sidebar"
      sidebar={<FormularioActivoCompact onCalcular={handleCalcular} />}
    >
      {/* Help Button - Compact */}
      {showHeader && (
        <div className="absolute top-2 right-2">
          <HelpButton title="Ayuda" faqs={FAQ_ACTIVOS} />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="animate-spin text-3xl text-brand" />
            <p className="text-sm text-secondary">Calculando...</p>
          </div>
        </div>
      )}

      {/* Results - Compact */}
      {!isLoading && resultado && activo && (
        <div className="space-y-3">
          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Rent. Nominal"
              value={`${resultado.rentabilidadNominal.toFixed(1)}%`}
              sublabel={formatValue(resultado.gananciaAbsoluta)}
              variant={resultado.rentabilidadNominal >= 0 ? 'success' : 'error'}
            />

            <MetricCard
              label="Rent. Real"
              value={`${resultado.rentabilidadReal.toFixed(1)}%`}
              sublabel={`Infl: ${resultado.inflacionAcumulada.toFixed(0)}%`}
              variant={resultado.rentabilidadReal >= 0 ? 'success' : 'error'}
            />
          </div>

          {/* Charts - Compact */}
          <div className="mt-3">
            <RentabilidadCharts
              rentabilidadNominal={resultado.rentabilidadNominal}
              rentabilidadReal={resultado.rentabilidadReal}
              inflacionAcumulada={resultado.inflacionAcumulada}
              precioCompra={activo.precioCompra}
              gananciaReal={resultado.gananciaReal}
            />
          </div>

          {/* Comparativas - Collapsible */}
          {resultado.comparativas && (
            <CollapsibleSection title="Alternativas de Inversión">
              <div className="space-y-2">
                {Object.entries(resultado.comparativas).map(([key, comp]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center p-2 bg-background-dark/30 rounded"
                  >
                    <span className="text-xs text-secondary capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-foreground">
                        {comp.rentabilidad.toFixed(1)}%
                      </div>
                      <div
                        className={`text-xs ${(comp.diferencia || 0) >= 0 ? 'text-success' : 'text-error'}`}
                      >
                        {(comp.diferencia || 0) >= 0 ? '+' : ''}
                        {(comp.diferencia || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !resultado && (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-sm text-secondary mb-2">Completá los datos en el sidebar</p>
            <p className="text-xs text-secondary">Analizaremos la rentabilidad de tu inversión</p>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
