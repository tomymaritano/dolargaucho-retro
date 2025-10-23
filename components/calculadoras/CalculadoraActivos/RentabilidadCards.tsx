import { Card } from '@/components/ui/Card/Card';
import { Tooltip as InfoTooltip } from '@/components/ui/Tooltip/Tooltip';
import { FaChartLine, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { formatearPorcentaje, determinarResultado } from './utils';

interface RentabilidadCardsProps {
  rentabilidadNominal: number;
  rentabilidadReal: number;
}

export function RentabilidadCards({
  rentabilidadNominal,
  rentabilidadReal,
}: RentabilidadCardsProps) {
  const resultadoReal = determinarResultado(rentabilidadReal);
  const resultadoNominal = determinarResultado(rentabilidadNominal);

  const IconoResultado =
    resultadoReal === 'ganancia'
      ? FaCheckCircle
      : resultadoReal === 'perdida'
        ? FaTimesCircle
        : FaExclamationTriangle;

  const colorResultado =
    resultadoReal === 'ganancia'
      ? 'text-success'
      : resultadoReal === 'perdida'
        ? 'text-error'
        : 'text-warning';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Rentabilidad Nominal */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <InfoTooltip content="Ganancia sin considerar la inflación. Es el crecimiento nominal de tu inversión.">
              <p className="text-sm text-secondary mb-1">Rentabilidad Nominal</p>
            </InfoTooltip>
            <div className="text-3xl font-bold text-foreground">
              {formatearPorcentaje(rentabilidadNominal)}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${resultadoNominal === 'ganancia' ? 'bg-success/20' : 'bg-error/20'}`}
          >
            <FaChartLine
              className={`text-2xl ${resultadoNominal === 'ganancia' ? 'text-success' : 'text-error'}`}
            />
          </div>
        </div>
      </Card>

      {/* Rentabilidad Real */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <InfoTooltip content="Ganancia ajustada por inflación. Este es el valor verdadero de tu inversión en términos de poder adquisitivo.">
              <p className="text-sm text-secondary mb-1">Rentabilidad Real</p>
            </InfoTooltip>
            <div className={`text-3xl font-bold ${colorResultado}`}>
              {formatearPorcentaje(rentabilidadReal)}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${resultadoReal === 'ganancia' ? 'bg-success/20' : resultadoReal === 'perdida' ? 'bg-error/20' : 'bg-warning/20'}`}
          >
            <IconoResultado className={`text-2xl ${colorResultado}`} />
          </div>
        </div>
      </Card>
    </div>
  );
}
