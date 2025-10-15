# Hook Usage Examples

## useDolarWith7DayTrend

Hook que combina datos actuales de dólares con tendencias de 24 horas y 7 días.

### Características

- ✅ Variación de 24 horas (comparado con ayer)
- ✅ Variación de 7 días (comparado con hace 1 semana)
- ✅ Optimizado con `useMultipleDolarHistoricoRange` para múltiples casas en paralelo
- ✅ Fallback a valores por defecto si no hay datos históricos

### Estructura de Datos

```typescript
interface DolarWithTrends {
  // Datos básicos del dólar
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  moneda: string;
  fechaActualizacion: string;

  // Variación de 24 horas
  variation24h: {
    percentage: number; // Porcentaje absoluto (sin signo)
    trend: 'up' | 'down' | 'neutral';
    previousValue?: number; // Valor de ayer
    currentValue: number; // Valor actual
    difference: number; // Diferencia absoluta
  };

  // Variación de 7 días
  variation7d: {
    percentage: number; // Porcentaje absoluto (sin signo)
    trend: 'up' | 'down' | 'neutral';
    change: number; // Cambio absoluto
    oldestValue?: number; // Valor hace 7 días
    latestValue: number; // Valor actual
  };
}
```

### Ejemplo de Uso Básico

```tsx
import { useDolarWith7DayTrend } from '@/hooks/useDolarWith7DayTrend';

function DolarDashboard() {
  const { data, isLoading, error } = useDolarWith7DayTrend();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((dolar) => (
        <div key={dolar.casa}>
          <h3>{dolar.nombre}</h3>
          <p>Precio: ${dolar.venta}</p>

          {/* Variación 24h */}
          <div>
            <span>24h: </span>
            <span className={dolar.variation24h.trend === 'up' ? 'text-red' : 'text-green'}>
              {dolar.variation24h.trend === 'up' ? '↑' : '↓'}
              {dolar.variation24h.percentage.toFixed(2)}%
            </span>
          </div>

          {/* Variación 7 días */}
          <div>
            <span>7d: </span>
            <span className={dolar.variation7d.trend === 'up' ? 'text-red' : 'text-green'}>
              {dolar.variation7d.trend === 'up' ? '↑' : '↓'}
              {dolar.variation7d.percentage.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo con Tabla

```tsx
import { useDolarWith7DayTrend } from '@/hooks/useDolarWith7DayTrend';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

function DolarTable() {
  const { data, isLoading } = useDolarWith7DayTrend();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Tipo</TableCell>
          <TableCell align="right">Venta</TableCell>
          <TableCell align="right">24h</TableCell>
          <TableCell align="right">7 días</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((dolar) => {
          const Icon24h =
            dolar.variation24h.trend === 'up'
              ? FaArrowUp
              : dolar.variation24h.trend === 'down'
                ? FaArrowDown
                : FaMinus;

          const Icon7d =
            dolar.variation7d.trend === 'up'
              ? FaArrowUp
              : dolar.variation7d.trend === 'down'
                ? FaArrowDown
                : FaMinus;

          const color24h =
            dolar.variation24h.trend === 'up'
              ? 'text-error'
              : dolar.variation24h.trend === 'down'
                ? 'text-success'
                : 'text-warning';

          const color7d =
            dolar.variation7d.trend === 'up'
              ? 'text-error'
              : dolar.variation7d.trend === 'down'
                ? 'text-success'
                : 'text-warning';

          return (
            <TableRow key={dolar.casa}>
              <TableCell>
                <div>
                  <p className="font-semibold">{dolar.nombre}</p>
                  <p className="text-xs text-secondary">{dolar.casa}</p>
                </div>
              </TableCell>

              <TableCell align="right">
                <span className="font-semibold text-accent-emerald">${dolar.venta.toFixed(2)}</span>
              </TableCell>

              <TableCell align="right">
                <div className={`flex items-center justify-end gap-1 ${color24h}`}>
                  <Icon24h className="text-xs" />
                  <span className="font-bold">{dolar.variation24h.percentage.toFixed(2)}%</span>
                </div>
              </TableCell>

              <TableCell align="right">
                <div className={`flex items-center justify-end gap-1 ${color7d}`}>
                  <Icon7d className="text-xs" />
                  <span className="font-bold">{dolar.variation7d.percentage.toFixed(2)}%</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
```

### Ejemplo con Cards

```tsx
import { useDolarWith7DayTrend } from '@/hooks/useDolarWith7DayTrend';
import { Card } from '@/components/ui/Card/Card';

function DolarCards() {
  const { data, isLoading } = useDolarWith7DayTrend();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} variant="elevated" padding="lg">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((dolar) => (
        <Card key={dolar.casa} variant="elevated" padding="lg">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <h3 className="text-lg font-bold text-foreground">{dolar.nombre}</h3>
              <p className="text-2xl font-bold text-accent-emerald mt-1">
                ${dolar.venta.toFixed(2)}
              </p>
            </div>

            {/* Trends */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-secondary text-xs">24 horas</p>
                <p
                  className={`font-bold ${dolar.variation24h.trend === 'up' ? 'text-error' : 'text-success'}`}
                >
                  {dolar.variation24h.trend === 'up' ? '+' : '-'}
                  {dolar.variation24h.percentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-secondary text-xs">7 días</p>
                <p
                  className={`font-bold ${dolar.variation7d.trend === 'up' ? 'text-error' : 'text-success'}`}
                >
                  {dolar.variation7d.trend === 'up' ? '+' : '-'}
                  {dolar.variation7d.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Notas de Rendimiento

- **Caché**: Los datos históricos se cachean por 1 hora
- **Paralelo**: Las peticiones de 7 días se hacen en paralelo para todas las casas
- **Fallback**: Si no hay datos de 7 días, se muestra `variation7d` con valores por defecto

### Comparación con otros hooks

| Hook                     | 24h | 7d  | Múltiples casas | Caché |
| ------------------------ | --- | --- | --------------- | ----- |
| `useDolarQuery`          | ❌  | ❌  | ✅              | 30s   |
| `useDolarVariations`     | ✅  | ❌  | ✅              | 1h    |
| `useDolarHistoricoRange` | ❌  | ✅  | ❌              | 1h    |
| `useDolarWith7DayTrend`  | ✅  | ✅  | ✅              | 1h    |
