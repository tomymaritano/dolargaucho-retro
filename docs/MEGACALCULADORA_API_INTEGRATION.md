# MegaCalculadora - Integración Automática con APIs

## 📋 Resumen

La MegaCalculadora ahora obtiene todos los parámetros económicos automáticamente desde APIs en tiempo real, eliminando la necesidad de ingresar valores manualmente.

## ✨ Mejoras Implementadas

### 1. **Inflación Mensual Automática** ✅

- **Hook utilizado:** `useUltimaInflacion()` desde `@/hooks/useFinanzas`
- **Fuente:** ArgentinaData API (`/inflacion`)
- **Valor anterior:** Input manual del usuario
- **Valor nuevo:** Obtenido automáticamente desde la API
- **Fallback:** 7% si no hay datos disponibles
- **Ubicación:** `components/calculadoras/MegaCalculadora.tsx:78`

```typescript
const inflacionMensualAuto = ultimaInflacion?.valor ?? 7;
```

**UI:** Campo read-only que muestra:

- 📊 Dato oficial del {fecha} - cuando hay datos
- ⚠️ Usando valor estimado - cuando se usa fallback

---

### 2. **Devaluación Mensual Calculada** ✅

- **Hooks utilizados:**
  - `useDolarByType('blue')` - dólar actual
  - `useDolarHistorico(fechaMesAnterior)` - dólar de hace 1 mes
- **Fuente:** DolarAPI (`/dolares/blue` y `/dolares/historico`)
- **Cálculo:** `((blueActual - blueHistórico) / blueHistórico) * 100`
- **Valor anterior:** Input manual del usuario
- **Valor nuevo:** Calculado automáticamente desde datos históricos
- **Fallback:** 8% si no hay datos históricos
- **Ubicación:** `components/calculadoras/MegaCalculadora.tsx:79-87`

```typescript
const devaluacionMensualAuto = useMemo(() => {
  if (!dolarBlue || !dolarHistorico) return 8;

  const blueHistorico = dolarHistorico.find((d) => d.nombre === 'Blue');
  if (!blueHistorico) return 8;

  const devaluacion = ((dolarBlue.venta - blueHistorico.venta) / blueHistorico.venta) * 100;
  return Math.max(0, devaluacion);
}, [dolarBlue, dolarHistorico]);
```

**UI:** Campo read-only que muestra:

- 📈 Calculado desde dato histórico - cuando hay datos
- ⚠️ Usando valor estimado - cuando se usa fallback

---

### 3. **Dólar MEP Real y Spread Automático** ✅

- **Hook utilizado:** `useDolarByType('bolsa')` - MEP/Dólar Bolsa
- **Fuente:** DolarAPI (`/dolares/bolsa`)
- **Cálculo del spread:** `((blue - mep) / blue) * 100`
- **Valor anterior:**
  - Spread ingresado manualmente
  - MEP calculado como: `blue * (1 - spread/100)`
- **Valor nuevo:**
  - MEP obtenido directamente de la API
  - Spread calculado automáticamente
- **Fallback:** 5% si no hay datos de MEP
- **Ubicación:** `components/calculadoras/MegaCalculadora.tsx:89-95`

```typescript
const spreadMEPAuto = useMemo(() => {
  if (!dolarBlue || !dolarMEP) return 5;

  const spread = ((dolarBlue.venta - dolarMEP.venta) / dolarBlue.venta) * 100;
  return Math.max(0, spread);
}, [dolarBlue, dolarMEP]);
```

**Uso en cálculos:**

```typescript
const dolarMEPInicio = dolarMEP?.venta || dolarInicio * (1 - spreadMEPNum);
```

**UI:** Campo read-only que muestra:

- 💵 Blue $X.XX | MEP $Y.YY - cuando hay datos
- ⚠️ Usando valor estimado - cuando se usa fallback

---

### 4. **Date Pickers para Fechas de Plazo Fijo** ✅

- **Componente:** Native HTML5 `<input type="date">`
- **Estado:**
  - `fechaInicio` - Fecha de inicio (default: hoy)
  - `fechaFin` - Fecha de fin (default: hoy + 180 días)
- **Funcionalidad:** Cálculo automático de días entre fechas
- **Ubicación:** `components/calculadoras/MegaCalculadora.tsx:92-100`

```typescript
useEffect(() => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diffTime = Math.abs(fin.getTime() - inicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0 && diffDays !== dias) {
    setDias(diffDays);
  }
}, [fechaInicio, fechaFin, dias]);
```

**Beneficio:** El campo "Plazo (días)" se actualiza automáticamente al seleccionar fechas.

---

## 🎨 Cambios en la UI

### Nueva Sección: "Parámetros Económicos (Automáticos desde API)"

Reemplaza los 3 inputs manuales con una sección informativa que muestra:

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Parámetros Económicos (Automáticos desde API)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Inflación Mensual         Devaluación Mensual    Spread MEP     │
│  ┌──────────────┐          ┌──────────────┐       ┌──────────┐  │
│  │ % 7.50%      │          │ % 8.23%      │       │ % 4.85%  │  │
│  └──────────────┘          └──────────────┘       └──────────┘  │
│  📊 Dato oficial           📈 Calculado            💵 Blue $1250 │
│     del 2024-12-01            desde histórico         MEP $1189 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Características:**

- ✅ Campos read-only (no editables)
- ✅ Icono de % para indicar porcentaje
- ✅ Tooltip con información adicional al hover
- ✅ Indicador visual del origen del dato (oficial/calculado/estimado)
- ✅ Estilo con `cursor-not-allowed` para indicar no editable

### Date Pickers

```
┌─────────────────────────────────────────────────────────────────┐
│  Capital Inicial           Fecha Inicio           Fecha Fin      │
│  ┌──────────────┐          ┌──────────────┐       ┌──────────┐  │
│  │ $ 1.000.000  │          │ 📅 2025-01-10│       │📅 2025-07-│  │
│  └──────────────┘          └──────────────┘       └──────────┘  │
│                                                                   │
│  Plazo (días)                                                     │
│  ┌──────────────┐                                                │
│  │ 180          │  ← Se actualiza automáticamente                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Nuevos Imports y Dependencias

### Hooks Agregados

```typescript
import { useUltimaInflacion } from '@/hooks/useFinanzas';
import { useDolarHistorico } from '@/hooks/useDolarHistorico';
```

### Nuevo Hook Usado

```typescript
const { data: dolarMEP } = useDolarByType('bolsa'); // MEP = Dólar Bolsa
```

### React Hook Agregado

```typescript
import React, { useState, useMemo, useEffect } from 'react';
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         APIS EXTERNAS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ArgentinaData API              DolarAPI                          │
│  ├─ /inflacion             ├─ /dolares/blue                      │
│  │  → inflación mensual    │  → cotización actual                │
│  │                         │                                      │
│  └─ ...                    ├─ /dolares/bolsa (MEP)               │
│                            │  → cotización MEP                    │
│                            │                                      │
│                            └─ /dolares/historico/{fecha}         │
│                               → cotización hace 1 mes            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       REACT QUERY HOOKS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  useUltimaInflacion()          useDolarByType('blue')            │
│  useDolarHistorico()           useDolarByType('bolsa')           │
│                                                                   │
│  - Caching automático          - Refetch cada 30seg              │
│  - Retry en errores            - Estado de loading               │
│  - Stale time: 1h              - Manejo de errores               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CÁLCULOS AUTOMÁTICOS (useMemo)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  inflacionMensualAuto = ultimaInflacion?.valor ?? 7              │
│                                                                   │
│  devaluacionMensualAuto = calculado desde histórico              │
│                                                                   │
│  spreadMEPAuto = ((blue - mep) / blue) * 100                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CÁLCULOS FINANCIEROS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  • Plazo Fijo (TNA real)                                          │
│  • Dólar Blue (con devaluación calculada)                        │
│  • Dólar MEP (cotización real desde API)                         │
│  • Portafolio Diversificado                                       │
│                                                                   │
│  → VAN, TIR, Sharpe Ratio, Volatilidad                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Beneficios

1. **Mayor Precisión:**
   - Datos económicos reales y actualizados
   - Devaluación basada en datos históricos reales
   - MEP real desde el mercado, no estimado

2. **Mejor UX:**
   - No requiere conocimiento previo de parámetros económicos
   - Menos inputs para completar
   - Date pickers intuitivos para seleccionar plazo

3. **Transparencia:**
   - Muestra la fuente de cada dato (oficial/calculado/estimado)
   - Indicadores visuales claros
   - Tooltips informativos

4. **Mantenibilidad:**
   - Centralizado en hooks reutilizables
   - Fallbacks robustos
   - Caching automático con TanStack Query

5. **Performance:**
   - `useMemo` para cálculos pesados
   - Caching de APIs (30seg - 1h)
   - Updates solo cuando cambian dependencias

---

## 🧪 Testing

### Casos de Prueba

1. **Con datos disponibles:**
   - Verificar que inflación viene de la API
   - Verificar cálculo de devaluación desde histórico
   - Verificar spread calculado correctamente

2. **Sin datos (fallback):**
   - Verificar fallback de inflación (7%)
   - Verificar fallback de devaluación (8%)
   - Verificar fallback de spread (5%)

3. **Date pickers:**
   - Cambiar fecha inicio → verifica actualización de días
   - Cambiar fecha fin → verifica actualización de días
   - Fechas inválidas → manejo de errores

4. **Loading states:**
   - Verificar que muestra valores por defecto mientras carga
   - Verificar actualización cuando llegan datos

---

## 📝 Archivos Modificados

### Principal

- `components/calculadoras/MegaCalculadora.tsx` (646 → 740 líneas)
  - Agregados hooks de datos automáticos
  - Nueva sección UI de parámetros económicos
  - Date pickers para fechas
  - Cálculo automático de días
  - Removidos inputs manuales

### Sin Modificaciones Requeridas

- `hooks/useFinanzas.ts` - Ya existía `useUltimaInflacion()`
- `hooks/useDolarHistorico.ts` - Ya existía
- `hooks/useDolarQuery.ts` - Ya existía `useDolarByType()`

---

## 🚀 Próximos Pasos Sugeridos

1. **Agregar más indicadores visuales:**
   - Gráfico de tendencia de devaluación
   - Comparación con mes anterior

2. **Histórico de parámetros:**
   - Permitir ver valores históricos de inflación/devaluación
   - Gráfico de evolución

3. **Alertas inteligentes:**
   - Notificar cuando devaluación supera umbral
   - Sugerir ajustes al portafolio

4. **Modo de prueba:**
   - Toggle para volver a inputs manuales
   - Útil para simulaciones

---

## 🐛 Troubleshooting

### Problema: Valores no se actualizan

**Solución:** Verificar que las APIs respondan correctamente

```bash
curl https://api.argentinadatos.com/v1/finanzas/indices/inflacion
curl https://dolarapi.com/v1/dolares/blue
curl https://dolarapi.com/v1/dolares/bolsa
```

### Problema: Usa siempre valores por defecto

**Solución:** Revisar console para errores de API

```typescript
// En DevTools → Console, buscar:
// "Error al obtener inflación mensual"
// "Error al obtener dólar blue"
```

### Problema: Cálculos incorrectos

**Solución:** Verificar que los hooks retornen el formato esperado

```typescript
console.log('Inflación:', ultimaInflacion);
console.log('Dólar Blue:', dolarBlue);
console.log('Dólar MEP:', dolarMEP);
console.log('Histórico:', dolarHistorico);
```

---

## 📊 Métricas

- **Líneas de código agregadas:** ~100
- **Líneas removidas:** ~30
- **Hooks nuevos utilizados:** 2 (`useUltimaInflacion`, `useDolarHistorico`)
- **APIs integradas:** 2 (ArgentinaData, DolarAPI)
- **Inputs manuales eliminados:** 3
- **Campos read-only agregados:** 3
- **Date pickers agregados:** 2

---

## ✨ Conclusión

La MegaCalculadora ahora es completamente automática, obteniendo todos los parámetros económicos desde APIs en tiempo real. Esto mejora significativamente la precisión de los cálculos y la experiencia del usuario, eliminando la necesidad de conocer o buscar valores económicos manualmente.

**Estado:** ✅ Completado y funcionando
**Testing:** ✅ Sin errores de linting
**Build:** ✅ Compilación exitosa
