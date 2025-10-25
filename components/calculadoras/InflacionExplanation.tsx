/**
 * InflacionExplanation Component
 *
 * Single Responsibility: Render collapsible explanation section
 * Extracted from CalculadoraInflacion.tsx
 */

import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

interface InflacionExplanationProps {
  useCustomDate: boolean;
}

export function InflacionExplanation({ useCustomDate }: InflacionExplanationProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="w-full flex justify-between items-center text-sm font-medium text-secondary hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <FaCalendarAlt className="text-xs" />
          ¿Cómo se calcula esto?
        </span>
        <FaChevronDown
          className={`transition-transform text-brand text-xs ${showExplanation ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {showExplanation && (
        <div className="mt-4 text-secondary text-sm leading-relaxed space-y-2">
          {useCustomDate ? (
            <>
              <p>
                <strong className="text-foreground">Modo Histórico:</strong> Calcula cuánto perdió
                tu dinero desde una fecha pasada hasta hoy.
              </p>
              <p>
                Ideal para saber: &quot;Compré algo por $1000 el año pasado, ¿cuánto vale hoy con la
                inflación?&quot;
              </p>
              <p className="text-xs italic">
                Usa la tasa de inflación interanual del momento de compra para calcular la
                devaluación hasta hoy.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong className="text-foreground">Modo Proyección:</strong> Estima cómo se
                devaluará tu dinero hacia el futuro.
              </p>
              <p>
                Utiliza la tasa de inflación interanual actual para proyectar el poder adquisitivo
                futuro.
              </p>
              <p className="text-xs italic">
                Las proyecciones asumen que la tasa de inflación se mantiene constante, lo cual
                puede no reflejar la realidad económica.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
