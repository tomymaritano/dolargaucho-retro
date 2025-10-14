'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FormularioActivo } from './FormularioActivo';
import { ResultadosActivo } from './ResultadosActivo';
import { useComparativas } from './hooks/useComparativas';
import { Activo } from './types';
import { FaSpinner } from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';

const FAQ_ACTIVOS = [
  {
    question: '¿Qué es rentabilidad nominal vs real?',
    answer:
      '<strong>Nominal:</strong> Es la ganancia sin considerar la inflación. Por ejemplo, si compraste un auto en $1M y hoy vale $5M, ganaste 400% nominal.<br><br><strong>Real:</strong> Es la ganancia ajustada por inflación, el <em>valor verdadero</em>. Si la inflación fue 500%, en realidad perdiste dinero en términos reales.',
  },
  {
    question: '¿Por qué mi inversión en USD muestra inflación?',
    answer:
      'El dólar también pierde poder adquisitivo. La inflación estadounidense (2020-2024) fue ~22%. Tu inversión en USD debe superar ese porcentaje para realmente ganar valor. Estás protegido de la inflación <strong>argentina</strong>, pero no de la <strong>estadounidense</strong>.',
  },
  {
    question: '¿De dónde vienen los datos?',
    answer:
      '<strong>Inflación Argentina:</strong> INDEC vía ArgentinaData API (datos oficiales mensuales)<br><strong>Inflación USD:</strong> FRED - Federal Reserve (CPI estadounidense)<br><strong>Cotización Dólar:</strong> DolarAPI (actualización diaria)<br><br>Nota: Las comparativas con dólar histórico usan aproximaciones.',
  },
  {
    question: '¿Qué tan preciso es el resultado?',
    answer:
      '<strong>Inflación:</strong> Muy precisa (datos oficiales mensuales)<br><strong>Dólar histórico:</strong> Aproximada (sin API histórica disponible)<br><br><strong>Recomendación:</strong> Usar para análisis generales. Para decisiones financieras importantes, consultar con un asesor profesional.',
  },
  {
    question: '¿Qué significa "Costo de Oportunidad"?',
    answer:
      'Es lo que <strong>dejaste de ganar</strong> al elegir esta inversión en lugar de alternativas. Por ejemplo, si tu auto ganó 400% pero el dólar blue ganó 600%, tu costo de oportunidad fue 200% (lo que hubieras ganado invirtiendo en dólares).',
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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        {/* Header with Help Button */}
        {showHeader && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Calculadora de Rentabilidad</h2>
              <p className="text-sm text-secondary">
                Analizá si tu inversión le ganó a la inflación
              </p>
            </div>
            <HelpButton title="Ayuda - Rentabilidad de Activos" faqs={FAQ_ACTIVOS} />
          </div>
        )}

      {/* Formulario */}
      <Card variant="elevated" padding="lg">
        <FormularioActivo onCalcular={handleCalcular} />
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card variant="elevated" padding="lg">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <FaSpinner className="animate-spin text-4xl text-accent-emerald" />
            <p className="text-secondary">Calculando rentabilidad...</p>
          </div>
        </Card>
      )}

      {/* Resultados */}
      {!isLoading && resultado && activo && (
        <ResultadosActivo
          resultado={resultado}
          precioCompra={activo.precioCompra}
          precioVenta={activo.precioVenta}
          moneda={activo.monedaCompra}
        />
      )}
      </div>
    </div>
  );
}
