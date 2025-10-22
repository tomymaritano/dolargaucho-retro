# 📊 Sistema de Diseño de Gráficos

## Filosofía

Todos los gráficos del dashboard deben ser **consistentes, predecibles y profesionales**. Este documento define los estándares para garantizar una experiencia visual uniforme.

---

## 🎨 Componente Base: `FredChart`

**Ubicación**: `components/charts/FredChart.tsx`

### Props Configurables

```typescript
interface FredChartProps {
  data: FredDataPoint[]; // Datos en formato { date: string, value: number }
  title: string; // Título del gráfico
  color?: string; // Color principal (default: '#3b82f6')
  yAxisLabel?: string; // Label del eje Y (default: 'Value')
  formatValue?: (v: number) => string; // Formato de valores
  showPoints?: boolean; // Mostrar puntos siempre (default: true)
  monthsToShow?: number; // Meses a mostrar (default: 12)
}
```

### Valores por Defecto Estándar

```typescript
{
  color: '#3b82f6',
  yAxisLabel: 'Value',
  formatValue: (v) => v.toFixed(2),
  showPoints: true,      // ✅ Mostrar puntos siempre
  monthsToShow: 12       // ✅ Siempre 12 meses
}
```

---

## 📏 Estándares Visuales

### 1. Periodo de Tiempo

- **SIEMPRE 12 meses** de datos históricos
- Formato de fecha: `'mes año'` (ej: "ene 25")
- Todas las secciones deben decir: **"Evolución Histórica (últimos 12 meses)"**

### 2. Puntos de Datos

- **Puntos SIEMPRE visibles** (`pointRadius: 3`)
- Hover aumenta el tamaño (`pointHoverRadius: 6`)
- Color del punto igual al color de la línea
- Borde blanco en los puntos (`pointBorderColor: '#fff'`)

### 3. Líneas y Rellenos

- Grosor de línea: `borderWidth: 2`
- Tensión de curva: `tension: 0.4`
- Relleno bajo la línea: `fill: true`
- Opacidad del relleno: `20%` del color principal (`${color}20`)

### 4. Tooltips

- Fondo oscuro: `rgba(0, 0, 0, 0.8)`
- Sin colores de dataset: `displayColors: false`
- Padding: `12px`
- Formato consistente: `yAxisLabel: formatValue`

### 5. Ejes

- **Eje X**: sin grid, color `#94a3b8`, tamaño `11px`
- **Eje Y**: grid con opacidad `0.1`, mismo color y tamaño

---

## 🎯 Uso Correcto

### ✅ CORRECTO

```typescript
<FredChart
  data={inflacionData.map(d => ({ date: d.fecha, value: d.valor }))}
  title="Inflación Argentina"
  color="#f87171"
  yAxisLabel="Inflación"
  formatValue={(v) => `${v.toFixed(1)}%`}
  showPoints={true}
  monthsToShow={12}
/>
```

### ❌ INCORRECTO

```typescript
// ❌ No usar Chart.js inline
<Line data={{...}} options={{...}} />

// ❌ No cambiar el periodo
monthsToShow={24}  // Debe ser 12

// ❌ No ocultar puntos
showPoints={false}  // Debe ser true

// ❌ Formato de fecha inconsistente
labels: data.map(d => new Date(d.date).toLocaleDateString('en-US'))
```

---

## 🌈 Paleta de Colores Estándar

### Datos Económicos Argentina

- **Inflación**: `#f87171` (rojo/coral)
- **Dólar**: `#10b981` (verde)
- **Riesgo País**: `#f59e0b` (naranja/ámbar)

### Datos USA (FRED)

- **Tasa FED**: `#3b82f6` (azul)
- **CPI (Inflación)**: `#8b5cf6` (púrpura)
- **Desempleo**: `#10b981` (verde)
- **Treasury 10Y**: `#f59e0b` (ámbar)

### Datos Europa (ECB)

- **EUR/USD**: `#6366f1` (índigo)
- **EUR/ARS**: `#8b5cf6` (púrpura)
- **EUR/GBP**: `#10b981` (verde)
- **EUR/BRL**: `#f59e0b` (ámbar)

---

## 📦 Estructura de Implementación

### 1. Inflación Argentina

```typescript
<FredChart
  data={inflacionData.map(d => ({ date: d.fecha, value: d.valor }))}
  title="Inflación Argentina"
  color="#f87171"
  yAxisLabel="Inflación"
  formatValue={(v) => `${v.toFixed(1)}%`}
  showPoints={true}
  monthsToShow={12}
/>
```

### 2. Indicadores FRED (4 gráficos)

```typescript
// Tasa FED
<FredChart
  data={fredData.federalFundsRate.data}
  title="Tasa FED"
  color="#3b82f6"
  yAxisLabel="Tasa"
  formatValue={(v) => `${v.toFixed(2)}%`}
  showPoints={true}
  monthsToShow={12}
/>

// CPI, Desempleo, Treasury - misma estructura
```

### 3. Tipos de Cambio ECB (4 gráficos)

```typescript
// EUR/USD (transformar datos ECB)
<FredChart
  data={ecbHistorical.USD.data.map(d => ({ date: d.date, value: d.rate }))}
  title="EUR/USD"
  color="#6366f1"
  yAxisLabel="Tipo de cambio"
  formatValue={(v) => `$${v.toFixed(4)}`}
  showPoints={true}
  monthsToShow={12}
/>

// EUR/ARS, EUR/GBP, EUR/BRL - misma estructura
```

---

## 🔄 Formato de Datos

### Inflación Argentina

```typescript
{ fecha: '2025-01-01', valor: 2.7 }
// Transformar a:
{ date: '2025-01-01', value: 2.7 }
```

### FRED

```typescript
// Ya viene en formato correcto
{ date: '2025-01-01', value: 5.33 }
```

### ECB

```typescript
{ date: '2025-01-01', rate: 1.0432 }
// Transformar a:
{ date: '2025-01-01', value: 1.0432 }
```

---

## ✅ Checklist de Implementación

Al agregar un nuevo gráfico, verificar:

- [ ] Usa el componente `FredChart`
- [ ] `showPoints={true}` explícito
- [ ] `monthsToShow={12}` explícito
- [ ] Color de la paleta estándar
- [ ] Formato de valores apropiado (`formatValue`)
- [ ] Datos transformados a `{ date, value }`
- [ ] Título descriptivo en el header
- [ ] Altura consistente (`h-48` o `h-64`)
- [ ] Texto dice "últimos 12 meses"

---

## 🚫 Anti-patrones

### NO hacer:

1. **NO usar `<Line>` directamente** → Usar `<FredChart>`
2. **NO cambiar `monthsToShow`** → Siempre 12 meses
3. **NO ocultar puntos** → `showPoints={true}` siempre
4. **NO usar colores custom** → Usar paleta definida
5. **NO formatear fechas diferente** → `'es-AR', { month: 'short', year: '2-digit' }`
6. **NO duplicar configuraciones** → Todo está en `FredChart`

---

## 📝 Ejemplo Completo

```typescript
// ✅ Implementación correcta y completa
import { FredChart } from '@/components/charts/FredChart';

// En el componente:
<Card>
  <Card.Header>
    <div className="flex items-center justify-between">
      <Card.Title>Mi Indicador</Card.Title>
      <button onClick={toggleChart}>Ver Gráfico</button>
    </div>
  </Card.Header>

  <Card.Content>
    {showChart && (
      <div className="h-48">
        <FredChart
          data={myData.map(d => ({ date: d.fecha, value: d.valor }))}
          title="Mi Indicador"
          color="#3b82f6"
          yAxisLabel="Valor"
          formatValue={(v) => `${v.toFixed(2)}`}
          showPoints={true}
          monthsToShow={12}
        />
      </div>
    )}
  </Card.Content>
</Card>
```

---

**Última actualización**: 2025-01-13
**Versión**: 1.0
**Responsable**: Sistema de Diseño DolarGaucho
