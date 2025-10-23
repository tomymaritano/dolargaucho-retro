import { Card } from '@/components/ui/Card/Card';
import { Tooltip as InfoTooltip } from '@/components/ui/Tooltip/Tooltip';
import { formatearMoneda, formatearPorcentaje } from './utils';

interface InflacionCardProps {
  inflacionAcumulada: number;
  valorAjustadoInflacion: number;
  rentabilidadReal: number;
  moneda: 'ARS' | 'USD';
}

export function InflacionCard({
  inflacionAcumulada,
  valorAjustadoInflacion,
  rentabilidadReal,
  moneda,
}: InflacionCardProps) {
  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center justify-between">
        <div>
          <InfoTooltip
            content={
              moneda === 'USD'
                ? 'Inflación estadounidense (CPI) en el período de tu inversión'
                : 'Inflación argentina (IPC) en el período de tu inversión'
            }
          >
            <p className="text-sm text-secondary mb-2">
              Inflación Acumulada {moneda === 'USD' ? '(USD)' : '(ARS)'}
            </p>
          </InfoTooltip>
          <div className="text-2xl font-bold text-foreground">
            {formatearPorcentaje(inflacionAcumulada, 1)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary mb-1">Valor ajustado</p>
          <p className="text-lg font-semibold text-warning">
            {moneda === 'USD'
              ? `$${valorAjustadoInflacion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : formatearMoneda(valorAjustadoInflacion)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-secondary text-center">
          {rentabilidadReal >= 0 ? (
            <>
              ✅ <span className="text-success font-semibold">Ganaste</span>{' '}
              <strong className="text-success">{formatearPorcentaje(rentabilidadReal)}</strong> por
              encima de la inflación
            </>
          ) : (
            <>
              ❌ <span className="text-error font-semibold">Perdiste</span>{' '}
              <strong className="text-error">
                {formatearPorcentaje(Math.abs(rentabilidadReal))}
              </strong>{' '}
              en términos reales
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
