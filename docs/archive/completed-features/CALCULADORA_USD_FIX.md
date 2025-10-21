# 🔧 Plan de Corrección: Calculadora de Rentabilidad USD

## Problema Actual

La calculadora **NO maneja correctamente inversiones en dólares**:

1. ❌ Aplica inflación argentina a inversiones en USD
2. ❌ Usa aproximaciones incorrectas para cotización histórica del dólar
3. ❌ No convierte USD a ARS para comparaciones reales
4. ❌ No muestra el impacto de la devaluación

## Solución Propuesta

### Opción A: Conversión Automática (Recomendada)

Cuando el usuario selecciona USD, convertir automáticamente a ARS usando cotizaciones históricas:

```typescript
// Nuevo hook: useHistoricalDolar.ts
export function useHistoricalDolar(fecha: Date, tipo: 'blue' | 'oficial') {
  // Usar API histórica o fallback a aproximación mejorada
  return useQuery({
    queryKey: ['dolar-historico', fecha, tipo],
    queryFn: async () => {
      // Intentar API histórica primero
      // Si falla, usar aproximación basada en dataset conocido
      return estimateDolarHistorico(fecha, tipo);
    },
  });
}

// utils/dolarHistorico.ts
export function estimateDolarHistorico(fecha: Date, tipo: 'blue' | 'oficial'): number {
  // Dataset conocido de cotizaciones clave
  const historicalData = [
    { fecha: '2020-01-01', blue: 80, oficial: 60 },
    { fecha: '2021-01-01', blue: 150, oficial: 90 },
    { fecha: '2022-01-01', blue: 200, oficial: 110 },
    { fecha: '2023-01-01', blue: 350, oficial: 180 },
    { fecha: '2024-01-01', blue: 1000, oficial: 800 },
    { fecha: '2024-12-01', blue: 1250, oficial: 1050 },
  ];

  // Interpolación lineal entre puntos conocidos
  return interpolate(fecha, historicalData, tipo);
}
```

### Opción B: Modo Puro USD (Más Simple)

Si el usuario selecciona USD, NO aplicar inflación argentina:

```typescript
// useComparativas.ts - MODIFICADO
function calcularAnalisis(activo: Activo, ...) {
  // Solo calcular inflación si moneda es ARS
  const inflacionAcumulada = activo.monedaCompra === 'ARS'
    ? calcularInflacionAcumulada(activo.fechaCompra, activo.fechaVenta, datosIPC)
    : 0; // En USD, ignorar inflación argentina

  // Calcular rentabilidad (igual para ambas monedas)
  const rentabilidadNominal = calcularRentabilidadNominal(
    activo.precioCompra,
    activo.precioVenta
  );

  // Rentabilidad real
  const rentabilidadReal = activo.monedaCompra === 'ARS'
    ? calcularRentabilidadReal(activo.precioCompra, activo.precioVenta, inflacionAcumulada)
    : rentabilidadNominal; // En USD, nominal = real (sin inflación local)

  return {
    rentabilidadNominal,
    rentabilidadReal,
    inflacionAcumulada, // 0 para USD
    // ...
  };
}
```

### Opción C: Híbrido (Más Completo)

Permitir ambos modos + conversión:

```typescript
interface CalculadoraOptions {
  modo: 'puro' | 'convertido';
  tipoDolar?: 'blue' | 'oficial'; // Solo si convertido
}

// Resultados expandidos
interface ResultadoAnalisisUSD extends ResultadoAnalisis {
  // Valores originales en USD
  valoresUSD: {
    precioCompra: number;
    precioVenta: number;
    ganancia: number;
  };

  // Valores convertidos a ARS (solo si modo = convertido)
  valoresARS?: {
    precioCompraARS: number;
    precioVentaARS: number;
    gananciaARS: number;
    tasaDolarCompra: number;
    tasaDolarVenta: number;
  };

  // Análisis de devaluación
  devaluacion?: {
    porcentaje: number;
    impactoEnInversion: number;
  };
}
```

## Implementación Recomendada (Opción B - Simple)

**Prioridad**: 🔴 ALTA
**Tiempo**: 3 horas
**Riesgo**: Bajo

### Paso 1: Modificar `calcularAnalisis`

```typescript
// useComparativas.ts
function calcularAnalisis(
  activo: Activo,
  inflacionData: { fecha: string; valor: number }[],
  dolarActualData: DolarActual[]
): ResultadoAnalisis {
  const esMonedaLocal = activo.monedaCompra === 'ARS';

  // 1. Calcular inflación SOLO si es ARS
  const inflacionAcumulada = esMonedaLocal
    ? calcularInflacionAcumulada(activo.fechaCompra, activo.fechaVenta, datosIPC)
    : 0;

  // 2. Rentabilidad nominal (igual para ambas monedas)
  const rentabilidadNominal = calcularRentabilidadNominal(activo.precioCompra, activo.precioVenta);

  // 3. Rentabilidad real
  const rentabilidadReal = esMonedaLocal
    ? calcularRentabilidadReal(activo.precioCompra, activo.precioVenta, inflacionAcumulada)
    : rentabilidadNominal; // En USD, no hay inflación local

  // 4. Valores ajustados
  const valorAjustadoInflacion = esMonedaLocal
    ? ajustarPorInflacion(activo.precioCompra, inflacionAcumulada)
    : activo.precioCompra; // En USD, el valor "ajustado" es el mismo

  // 5. Ganancias
  const gananciaAbsoluta = activo.precioVenta - activo.precioCompra;
  const gananciaReal = esMonedaLocal
    ? activo.precioVenta - valorAjustadoInflacion
    : gananciaAbsoluta; // En USD, nominal = real

  // 6. Comparativas
  const comparativas: ResultadoAnalisis['comparativas'] = {};

  // Para USD: NO comparar con dólar (no tiene sentido)
  // Para ARS: comparar con dólar
  if (esMonedaLocal) {
    const dolarBlue = dolarActualData.find((d) => d.casa === 'blue');
    const dolarOficial = dolarActualData.find((d) => d.casa === 'oficial');

    if (dolarBlue) {
      const comparativaBlue = compararConDolar(
        activo.precioCompra,
        activo.precioVenta,
        dolarBlue.venta * 0.5, // ⚠️ Todavía aproximado, pero al menos solo para ARS
        dolarBlue.venta
      );

      comparativas.dolarBlue = {
        valorFinal: comparativaBlue.valorHoyARS,
        ganancia: comparativaBlue.ganancia,
        rentabilidad: comparativaBlue.rentabilidad,
        diferenciaPorcentual: comparativaBlue.diferenciaPorcentual,
      };
    }

    // ... similar para dolarOficial
  }

  return {
    rentabilidadNominal,
    rentabilidadReal,
    inflacionAcumulada,
    valorAjustadoInflacion,
    gananciaAbsoluta,
    gananciaReal,
    comparativas,
  };
}
```

### Paso 2: Actualizar UI de Resultados

```typescript
// ResultadosActivo.tsx - AGREGAR
export function ResultadosActivo({ resultado, precioCompra, precioVenta, moneda }: Props) {
  // ...

  return (
    <div className="space-y-6">
      {/* Mostrar badge de moneda */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-secondary">Moneda:</span>
        <span className="px-3 py-1 bg-accent-emerald/20 text-accent-emerald rounded-full font-semibold">
          {moneda === 'USD' ? '🇺🇸 USD' : '🇦🇷 ARS'}
        </span>
      </div>

      {/* Cards de rentabilidad */}
      {/* ... existentes ... */}

      {/* Información contextual según moneda */}
      {moneda === 'USD' ? (
        <Card variant="outlined" padding="lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm text-secondary">
              <p className="mb-2">
                <strong className="text-foreground">Inversión en dólares:</strong>
              </p>
              <p>
                Al invertir en USD, tu inversión está protegida de la inflación argentina.
                La rentabilidad mostrada refleja el crecimiento real de tu capital en dólares.
              </p>
              <p className="mt-2">
                {resultado.rentabilidadReal >= 0 ? (
                  <>✅ Tu inversión creció <strong className="text-success">{formatearPorcentaje(resultado.rentabilidadReal)}</strong> en dólares.</>
                ) : (
                  <>❌ Tu inversión perdió <strong className="text-error">{formatearPorcentaje(Math.abs(resultado.rentabilidadReal))}</strong> en dólares.</>
                )}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card variant="outlined" padding="lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div className="text-sm text-secondary">
              <p>
                La inflación acumulada fue de <strong className="text-warning">{formatearPorcentaje(resultado.inflacionAcumulada)}</strong>.
                Tu inversión {resultado.rentabilidadReal >= 0 ? 'superó' : 'no superó'} este umbral.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ... resto de resultados ... */}
    </div>
  );
}
```

### Paso 3: Agregar Tests

```typescript
// __tests__/calculadoraActivos.test.ts
describe('Calculadora de Activos', () => {
  it('debe calcular correctamente inversión en USD sin inflación', () => {
    const activo: Activo = {
      tipo: 'inversion',
      fechaCompra: new Date('2020-01-01'),
      precioCompra: 10000,
      monedaCompra: 'USD',
      fechaVenta: new Date('2024-01-01'),
      precioVenta: 12000,
      monedaVenta: 'USD',
    };

    const resultado = calcularAnalisis(activo, inflacionData, dolarData);

    expect(resultado.inflacionAcumulada).toBe(0); // No inflación para USD
    expect(resultado.rentabilidadNominal).toBe(20); // (12k-10k)/10k = 20%
    expect(resultado.rentabilidadReal).toBe(20); // Igual a nominal en USD
  });

  it('debe calcular correctamente inversión en ARS con inflación', () => {
    const activo: Activo = {
      tipo: 'vehiculo',
      fechaCompra: new Date('2020-01-01'),
      precioCompra: 1500000,
      monedaCompra: 'ARS',
      fechaVenta: new Date('2024-01-01'),
      precioVenta: 8000000,
      monedaVenta: 'ARS',
    };

    const resultado = calcularAnalisis(activo, inflacionData, dolarData);

    expect(resultado.inflacionAcumulada).toBeGreaterThan(0); // Hay inflación
    expect(resultado.rentabilidadNominal).toBeGreaterThan(resultado.rentabilidadReal); // Real < Nominal
  });
});
```

## Mejora Futura (Opción A)

Para una versión más precisa, implementar API de cotizaciones históricas:

### APIs Disponibles:

1. **ArgentinaDatos API** (ya se usa en el proyecto)
   - Endpoint: `/finanzas/cotizaciones/dolares/{fecha}`
   - Gratuita ✅
   - Histórico desde 2010 ✅

2. **DolarAPI** (ya se usa)
   - Endpoint: `/v1/dolares/{casa}/historico/{fecha}`
   - Gratuita ✅
   - Actualización diaria

### Implementación:

```typescript
// hooks/useDolarHistorico.ts
export function useDolarHistorico(fecha: Date, casa: string) {
  return useQuery({
    queryKey: ['dolar-historico', fecha.toISOString(), casa],
    queryFn: async () => {
      const fechaStr = fecha.toISOString().split('T')[0];
      const response = await fetch(
        `https://api.argentinadatos.com/v1/finanzas/cotizaciones/dolares?fecha=${fechaStr}`
      );

      if (!response.ok) {
        // Fallback a estimación
        return estimateDolarHistorico(fecha, casa);
      }

      const data = await response.json();
      const dolar = data.find((d: any) => d.casa === casa);
      return dolar?.venta || estimateDolarHistorico(fecha, casa);
    },
    staleTime: Infinity, // Datos históricos nunca cambian
  });
}
```

## Resumen de Cambios

| Archivo                | Cambio                             | Líneas |
| ---------------------- | ---------------------------------- | ------ |
| `useComparativas.ts`   | Agregar lógica condicional USD/ARS | ~30    |
| `ResultadosActivo.tsx` | Agregar UI contextual por moneda   | ~40    |
| `types.ts`             | Ya tiene Moneda ✅                 | 0      |
| `FormularioActivo.tsx` | Ya tiene selector ✅               | 0      |

**Total**: ~70 líneas de código
**Tiempo estimado**: 3 horas
**Testing**: +1 hora

## Estado Actual vs Corregido

### ❌ ANTES (Incorrecto):

```
Inversión: USD 10,000 → USD 12,000
Inflación argentina: 625% ❌ (no aplica a USD)
Rentabilidad real: -85% ❌ (incorrecto)
```

### ✅ DESPUÉS (Correcto - IMPLEMENTADO):

```
Inversión: USD 10,000 → USD 12,000 (2020-2024)
Inflación estadounidense: ~22% ✅ (correcto)
Rentabilidad nominal: +20%
Rentabilidad real: -1.64% ✅ (ajustado por inflación USD)
Mensaje: "Tu inversión perdió poder adquisitivo en dólares"
```

## Implementación Final

### Archivos Modificados:

1. **`/hooks/useInflacionUS.ts`** (NUEVO)
   - Hook para obtener inflación estadounidense desde FRED API
   - Fallback con datos históricos 2010-2025
   - Serie CPIAUCSL (Consumer Price Index)

2. **`/components/calculadoras/CalculadoraActivos/hooks/useComparativas.ts`**
   - Ahora usa `inflacionARSData` para ARS
   - Usa `inflacionUSDData` para USD
   - Ambas monedas tienen inflación real aplicada

3. **`/components/calculadoras/CalculadoraActivos/ResultadosActivo.tsx`**
   - UI diferenciada para USD (muestra inflación USD)
   - Mensaje educativo sobre inflación estadounidense

### Cómo Obtener API Key de FRED (Opcional):

1. Ir a https://fred.stlouisfed.org/
2. Crear cuenta gratuita
3. Ir a "API Keys" en el perfil
4. Generar nueva API key
5. Agregar a `.env.local`:
   ```
   NEXT_PUBLIC_FRED_API_KEY=tu_api_key_aqui
   ```

**Nota**: Si no hay API key, usa el fallback automático con datos históricos estimados.

### Resultados de Prueba:

✅ **Escenario 1**: USD 10,000 → USD 12,000 (2020-2024)

- Inflación USD: ~22%
- Nominal: +20%
- Real: -1.64% (perdió poder adquisitivo)

✅ **Escenario 2**: USD 10,000 → USD 15,000 (2020-2024)

- Inflación USD: ~22%
- Nominal: +50%
- Real: +22.95% (ganó por encima de inflación)

✅ **Escenario 3**: ARS 1,500,000 → ARS 8,000,000 (2020-2024)

- Inflación ARS: ~625%
- Nominal: +433%
- Real: -26.44% (perdió por inflación argentina)
