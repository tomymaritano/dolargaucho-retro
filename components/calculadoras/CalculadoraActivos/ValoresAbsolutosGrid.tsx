import { Card } from '@/components/ui/Card/Card';
import { formatearMoneda } from './utils';

interface ValoresAbsolutosGridProps {
  precioCompra: number;
  precioVenta: number;
  gananciaAbsoluta: number;
}

export function ValoresAbsolutosGrid({
  precioCompra,
  precioVenta,
  gananciaAbsoluta,
}: ValoresAbsolutosGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="solid" padding="md">
        <p className="text-xs text-secondary mb-1">Inversión Inicial</p>
        <p className="text-xl font-bold text-foreground">{formatearMoneda(precioCompra)}</p>
      </Card>

      <Card variant="solid" padding="md">
        <p className="text-xs text-secondary mb-1">Valor Actual</p>
        <p className="text-xl font-bold text-foreground">{formatearMoneda(precioVenta)}</p>
      </Card>

      <Card variant="solid" padding="md">
        <p className="text-xs text-secondary mb-1">Ganancia Nominal</p>
        <p className={`text-xl font-bold ${gananciaAbsoluta >= 0 ? 'text-success' : 'text-error'}`}>
          {formatearMoneda(gananciaAbsoluta)}
        </p>
      </Card>
    </div>
  );
}
