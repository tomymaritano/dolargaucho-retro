# Calculadora de Rentabilidad de Activos

## 🎯 Concepto General

Una herramienta que permite calcular la **rentabilidad real** de activos considerando:

- Inflación acumulada
- Variación del dólar (oficial, blue, MEP, CCL)
- Comparación con inversiones alternativas
- Costo de oportunidad

---

## 💡 Casos de Uso

### Ejemplo 1: Compra de Auto

```
Usuario compró un auto en enero 2020 por $1.500.000
Hoy lo vende en $8.000.000

¿Ganó o perdió plata en términos reales?

La calculadora muestra:
- Valor ajustado por inflación: $12.500.000
- Resultado: PERDIÓ $4.500.000 (-36%)
- Si hubiera comprado dólares: $15.000 → $20.000 USD (ganancia del 33%)
```

### Ejemplo 2: Inversión en Plazo Fijo

```
Usuario invirtió $100.000 en plazo fijo UVA en junio 2023
Hoy tiene $180.000

¿Le ganó a la inflación?

La calculadora muestra:
- Inflación acumulada: 85%
- Rendimiento real: -2.7%
- Comparación vs dólar blue: -15%
```

### Ejemplo 3: Compra de Inmueble

```
Compró depto en 2018 por USD 120.000
Hoy vale USD 95.000

¿Cuánto perdió en términos reales?

La calculadora muestra:
- Pérdida nominal: -20.8%
- Inflación USA acumulada: +18%
- Pérdida real ajustada: -33%
- Si hubiera invertido en S&P500: +75%
```

---

## 🔧 Funcionalidades

### 1. **Entrada de Datos**

**Datos del Activo:**

- Tipo de activo (dropdown):
  - 🚗 Vehículo
  - 🏠 Inmueble
  - 💰 Efectivo/Ahorro
  - 📈 Inversión financiera
  - 🛍️ Otro (personalizado)

**Transacción Inicial:**

- Fecha de compra (date picker)
- Precio de compra
- Moneda (ARS/USD)

**Transacción Final:**

- Fecha de venta/valuación (date picker, default: hoy)
- Precio de venta/valor actual
- Moneda (ARS/USD)

**Costos Asociados (opcional):**

- Gastos de compra (escribanía, comisiones)
- Mantenimiento/costos recurrentes
- Gastos de venta

---

### 2. **Cálculos Automáticos**

#### A) **Rentabilidad Nominal**

```
Rentabilidad = ((Precio Venta - Precio Compra - Costos) / Precio Compra) * 100
```

#### B) **Rentabilidad Real (ajustada por inflación)**

```
Inflación Acumulada = IPC desde fecha compra hasta fecha venta
Valor Real Final = Precio Venta / (1 + Inflación Acumulada)
Rentabilidad Real = ((Valor Real Final - Precio Compra) / Precio Compra) * 100
```

#### C) **Conversión a Dólares**

Si la compra fue en ARS:

```
Dólares en Compra = Precio Compra / Cotización Dólar (fecha compra)
Dólares en Venta = Precio Venta / Cotización Dólar (fecha venta)
Ganancia/Pérdida en USD = Dólares Venta - Dólares Compra
```

#### D) **Costo de Oportunidad**

Comparar contra alternativas:

1. **Si hubiera comprado dólares:**

   ```
   USD Inicial = Precio Compra / Dólar (fecha compra)
   Valor Hoy = USD Inicial * Dólar (hoy)
   Diferencia vs Activo = Valor Hoy - Precio Venta
   ```

2. **Si hubiera hecho plazo fijo:**

   ```
   Usar tasas históricas promedio (TNA)
   Calcular capital final con interés compuesto
   Ajustar por inflación
   ```

3. **Si hubiera invertido en UVA:**
   ```
   Usar evolución UVA desde fecha compra
   Calcular valor final
   ```

---

### 3. **Visualización de Resultados**

#### Panel de Resumen (Cards principales)

```
┌─────────────────────────────────────────────────────────┐
│  Rentabilidad Nominal          Rentabilidad Real        │
│  +433%                         -12%                     │
│  ✅ Ganancia                    ❌ Pérdida               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Valor Invertido               Valor Actual             │
│  $1.500.000 ARS                $8.000.000 ARS           │
│  (USD 15.000)                  (USD 8.000)              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Inflación Acumulada           Ajuste Inflacionario     │
│  625%                          Valor debería ser         │
│                                $10.875.000 ARS          │
└─────────────────────────────────────────────────────────┘
```

#### Tabla Comparativa

| Escenario              | Inversión Inicial | Valor Hoy   | Ganancia/Pérdida | Rentabilidad |
| ---------------------- | ----------------- | ----------- | ---------------- | ------------ |
| **Tu activo (Auto)**   | $1.500.000        | $8.000.000  | -$2.875.000      | -12% real    |
| Dólar Blue             | $1.500.000        | $12.500.000 | +$4.500.000      | +36% real    |
| Plazo Fijo UVA         | $1.500.000        | $11.200.000 | +$2.325.000      | +3% real     |
| Plazo Fijo Tradicional | $1.500.000        | $9.800.000  | +$925.000        | -10% real    |

#### Gráfico de Evolución

- **Eje X:** Tiempo (desde fecha compra hasta hoy)
- **Eje Y:** Valor en pesos ajustados
- **Líneas:**
  - Valor del activo (interpolado si no hay datos intermedios)
  - Inflación acumulada (línea de referencia)
  - Dólar blue equivalente
  - UVA equivalente

---

### 4. **Datos de la API a Utilizar**

#### De ArgentinaData API:

**Inflación:**

```
GET /api/inflacion
Campos: fecha, valor (IPC mensual e interanual)
```

**Cotizaciones:**

```
GET /api/cotizaciones
Campos: casa, nombre, compra, venta, fecha
```

**UVA:**

```
GET /api/uvas
Campos: fecha, valor
```

#### Cálculos propios:

**Tasas de Plazo Fijo:**

- Usar promedio histórico de TNA (podemos estimarlo o buscar API del BCRA)
- Alternativamente, asumir TNA promedio por período (ej: 2020-2023: 45% anual)

---

## 🎨 Diseño de UI/UX

### Layout Propuesto

```
┌──────────────────────────────────────────────────────────────┐
│  📊 Calculadora de Rentabilidad de Activos                   │
│  Analiza si tu inversión le ganó a la inflación              │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────┬────────────────────────────────┐
│  DATOS DEL ACTIVO           │  CONFIGURACIÓN                 │
│                             │                                │
│  Tipo: [Dropdown ▼]         │  Comparar con:                 │
│  🚗 Vehículo                │  ☑️ Dólar Blue                  │
│                             │  ☑️ Dólar MEP                   │
│  Fecha Compra: [Date]       │  ☑️ Plazo Fijo UVA             │
│  01/2020                    │  ☐ Plazo Fijo Tradicional      │
│                             │                                │
│  Precio Compra: [$]         │  Inflación Base:               │
│  1.500.000 ARS              │  ⚫ IPC INDEC                   │
│                             │  ⚪ Inflación Congreso          │
│  Fecha Venta: [Date]        │                                │
│  12/2024 (Hoy)              │                                │
│                             │                                │
│  Precio Venta: [$]          │                                │
│  8.000.000 ARS              │                                │
│                             │                                │
│  [➕ Agregar Costos]         │                                │
│                             │                                │
│          [🔍 CALCULAR]       │                                │
└─────────────────────────────┴────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  RESULTADOS                                                  │
│                                                              │
│  [Cards con métricas principales]                           │
│  [Tabla comparativa]                                        │
│  [Gráfico de evolución]                                     │
└──────────────────────────────────────────────────────────────┘
```

### Estados Visuales

**Ganancia Real (verde):**

```
┌────────────────────────┐
│  Rentabilidad Real     │
│  ✅ +25%               │
│  Ganaste en términos  │
│  reales               │
└────────────────────────┘
```

**Pérdida Real (rojo):**

```
┌────────────────────────┐
│  Rentabilidad Real     │
│  ❌ -15%               │
│  Perdiste contra la   │
│  inflación            │
└────────────────────────┘
```

**Neutro (amarillo):**

```
┌────────────────────────┐
│  Rentabilidad Real     │
│  ⚠️ -2%                │
│  Casi empate técnico  │
└────────────────────────┘
```

---

## 📋 Roadmap de Desarrollo

### FASE 1: MVP (1-2 días)

- [ ] Componente básico con inputs
- [ ] Cálculo de rentabilidad nominal
- [ ] Cálculo de inflación acumulada (consumir API)
- [ ] Cálculo de rentabilidad real
- [ ] Display de resultados en cards

### FASE 2: Comparativas (1 día)

- [ ] Comparación con dólar blue
- [ ] Comparación con dólar oficial
- [ ] Tabla comparativa
- [ ] Indicadores visuales (✅❌⚠️)

### FASE 3: Visualización Avanzada (1 día)

- [ ] Gráfico de evolución (Recharts)
- [ ] Selector de moneda base (ARS/USD)
- [ ] Costos adicionales (gastos de compra/venta)
- [ ] Comparación con UVA
- [ ] Comparación con plazo fijo

### FASE 4: Features Avanzadas (2-3 días)

- [ ] Guardar cálculos (localStorage)
- [ ] Exportar resultados (PDF/imagen)
- [ ] Múltiples activos simultáneos
- [ ] Proyección futura
- [ ] Alertas personalizadas

---

## 🧮 Fórmulas Detalladas

### 1. Inflación Acumulada

```typescript
function calcularInflacionAcumulada(
  fechaInicio: Date,
  fechaFin: Date,
  datosIPC: { fecha: string; valor: number }[]
): number {
  // Filtrar datos entre fechas
  const datosEnRango = datosIPC.filter(
    (d) => new Date(d.fecha) >= fechaInicio && new Date(d.fecha) <= fechaFin
  );

  // Calcular inflación compuesta
  const inflacionTotal =
    datosEnRango.reduce((acum, dato) => {
      return acum * (1 + dato.valor / 100);
    }, 1) - 1;

  return inflacionTotal * 100; // Retornar en porcentaje
}
```

### 2. Valor Ajustado por Inflación

```typescript
function ajustarPorInflacion(valorInicial: number, inflacionAcumulada: number): number {
  return valorInicial * (1 + inflacionAcumulada / 100);
}
```

### 3. Rentabilidad Real

```typescript
function calcularRentabilidadReal(
  precioCompra: number,
  precioVenta: number,
  inflacionAcumulada: number
): number {
  const valorAjustado = ajustarPorInflacion(precioCompra, inflacionAcumulada);
  return ((precioVenta - valorAjustado) / valorAjustado) * 100;
}
```

### 4. Comparación con Dólar

```typescript
function compararConDolar(
  precioCompra: number,
  dolarCompra: number,
  dolarVenta: number
): {
  usdInicial: number;
  valorHoyARS: number;
  diferencia: number;
} {
  const usdInicial = precioCompra / dolarCompra;
  const valorHoyARS = usdInicial * dolarVenta;
  const diferencia = valorHoyARS - precioCompra;

  return { usdInicial, valorHoyARS, diferencia };
}
```

---

## 🎯 Métricas de Éxito

**Para el usuario:**

- Comprende claramente si ganó o perdió dinero
- Puede comparar su decisión con alternativas
- Toma mejores decisiones de inversión futuras

**Para el producto:**

- Engagement: > 3 min de uso promedio
- Tasa de retorno: > 40% de usuarios vuelven
- Compartidos en redes: métrica de viralidad
- Conversión a funciones premium (si aplica)

---

## 🚀 Diferenciadores

1. **Ajuste por inflación real:** No solo muestra ganancia nominal
2. **Múltiples comparativas:** Dólar, UVA, plazo fijo
3. **Visualización clara:** Gráficos + indicadores visuales
4. **Datos reales:** API oficial de Argentina
5. **Contexto educativo:** Explica conceptos financieros

---

## 📝 Notas de Implementación

### Estructura de Archivos

```
components/calculadoras/
  CalculadoraActivos/
    CalculadoraActivos.tsx       # Componente principal
    FormularioActivo.tsx          # Form de entrada
    ResultadosActivo.tsx          # Display de resultados
    TablaComparativa.tsx          # Tabla de comparación
    GraficoEvolucion.tsx          # Gráfico temporal
    hooks/
      useInflacion.ts             # Hook para inflación
      useComparativas.ts          # Hook para cálculos
    types.ts                      # Types TypeScript
    utils.ts                      # Funciones de cálculo
```

### Tipos TypeScript

```typescript
interface Activo {
  tipo: 'vehiculo' | 'inmueble' | 'efectivo' | 'inversion' | 'otro';
  nombre?: string;
  fechaCompra: Date;
  precioCompra: number;
  monedaCompra: 'ARS' | 'USD';
  fechaVenta: Date;
  precioVenta: number;
  monedaVenta: 'ARS' | 'USD';
  costosAdicionales?: number;
}

interface ResultadoAnalisis {
  rentabilidadNominal: number;
  rentabilidadReal: number;
  inflacionAcumulada: number;
  valorAjustadoInflacion: number;
  comparativas: {
    dolarBlue: ComparativaResultado;
    dolarOficial: ComparativaResultado;
    uva: ComparativaResultado;
    plazoFijo: ComparativaResultado;
  };
}

interface ComparativaResultado {
  valorFinal: number;
  ganancia: number;
  rentabilidad: number;
  diferenciaPorcentual: number;
}
```

---

## 💬 Mensajes Educativos

Incluir tooltips y mensajes que eduquen al usuario:

- **"Rentabilidad Nominal"**: "Es la ganancia sin considerar la inflación. Puede ser engañosa en países con alta inflación."

- **"Rentabilidad Real"**: "Es la ganancia ajustada por inflación. Te dice si realmente ganaste o perdiste poder adquisitivo."

- **"Costo de Oportunidad"**: "Lo que dejaste de ganar al no elegir otra inversión. Te ayuda a evaluar si tomaste la mejor decisión."

---

## 🎉 Conclusión

Esta calculadora será una herramienta **única en el mercado argentino** que ayudará a las personas a:

- Entender el valor real de sus activos
- Tomar mejores decisiones de inversión
- Comparar opciones de manera objetiva
- Educarse financieramente

¿Empezamos con el MVP? 🚀
