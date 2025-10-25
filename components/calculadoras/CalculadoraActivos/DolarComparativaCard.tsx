import { Card } from '@/components/ui/Card/Card';
import { FaDollarSign } from 'react-icons/fa';
import { formatearMoneda, formatearPorcentaje } from './utils';
import { ResultadoAnalisis } from './types';

interface DolarComparativaCardProps {
  comparativas: ResultadoAnalisis['comparativas'];
  precioVenta: number;
}

export function DolarComparativaCard({ comparativas, precioVenta }: DolarComparativaCardProps) {
  if (!comparativas.dolarBlue && !comparativas.dolarOficial) {
    return null;
  }

  return (
    <Card variant="elevated" padding="lg">
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <FaDollarSign className="text-brand" />
        Comparativa con Dólar
      </h4>

      <div className="space-y-3">
        {comparativas.dolarBlue && (
          <div className="p-4 bg-panel rounded-lg border border-border/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Dólar Blue</span>
              <span
                className={`text-sm font-semibold ${comparativas.dolarBlue.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
              >
                {comparativas.dolarBlue.diferenciaPorcentual >= 0 ? '📉 Perdiste' : '📈 Ganaste'}{' '}
                {formatearPorcentaje(Math.abs(comparativas.dolarBlue.diferenciaPorcentual))}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-secondary">Si hubieras comprado USD:</p>
                <p className="text-foreground font-semibold">
                  {formatearMoneda(comparativas.dolarBlue.valorFinal)}
                </p>
              </div>
              <div>
                <p className="text-secondary">Diferencia vs tu activo:</p>
                <p
                  className={`font-semibold ${comparativas.dolarBlue.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                >
                  {formatearMoneda(comparativas.dolarBlue.valorFinal - precioVenta)}
                </p>
              </div>
            </div>
          </div>
        )}

        {comparativas.dolarOficial && (
          <div className="p-4 bg-panel rounded-lg border border-border/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Dólar Oficial</span>
              <span
                className={`text-sm font-semibold ${comparativas.dolarOficial.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
              >
                {comparativas.dolarOficial.diferenciaPorcentual >= 0 ? '📉 Perdiste' : '📈 Ganaste'}{' '}
                {formatearPorcentaje(Math.abs(comparativas.dolarOficial.diferenciaPorcentual))}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-secondary">Si hubieras comprado USD:</p>
                <p className="text-foreground font-semibold">
                  {formatearMoneda(comparativas.dolarOficial.valorFinal)}
                </p>
              </div>
              <div>
                <p className="text-secondary">Diferencia vs tu activo:</p>
                <p
                  className={`font-semibold ${comparativas.dolarOficial.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                >
                  {formatearMoneda(comparativas.dolarOficial.valorFinal - precioVenta)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
