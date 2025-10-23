# 🏗️ Architecture Guide - Dólar Gaucho

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [HTTP Clients](#http-clients)
5. [Services](#services)
6. [Guías de Uso](#guías-de-uso)
7. [Best Practices](#best-practices)

---

## Visión General

Dólar Gaucho utiliza una **arquitectura pragmática** que balancea simplicidad con escalabilidad. No seguimos Clean Architecture estricta, pero adoptamos sus mejores principios para mantener el código organizado y mantenible.

### Filosofía de Arquitectura

✅ **Lo que tenemos:**

- Separación clara de responsabilidades
- HTTP Clients con interceptors (Axios)
- Services para lógica de negocio
- Hooks para estado y data fetching
- Componentes React puros

❌ **Lo que NO tenemos (by design):**

- Capas estrictas (Domain/Application/Infrastructure)
- Interfaces para todo (IRepository, IService)
- DTOs complejos para conversión
- Dependency Injection containers

**Razón:** Preferimos pragmatismo sobre purismo. El código debe ser simple, directo y fácil de mantener.

---

## Estructura del Proyecto

```
dolargaucho-retro/
├── lib/                      # Core business logic
│   ├── api/                  # HTTP clients (NEW ✨)
│   │   ├── client.ts        # Axios base client with interceptors
│   │   ├── dolarapi.ts      # DolarAPI client
│   │   └── argentinaData.ts # Argentina Data API client
│   │
│   ├── services/             # Business logic (NEW ✨)
│   │   ├── DolarService.ts
│   │   └── CalculatorService.ts
│   │
│   ├── config/               # Configuration
│   │   ├── api.ts           # API endpoints & cache config
│   │   └── search.ts
│   │
│   ├── db/                   # Database queries
│   │   └── queries.ts
│   │
│   ├── auth/                 # Authentication
│   │   ├── jwt.ts
│   │   ├── cookies.ts
│   │   └── validation.ts
│   │
│   ├── utils/                # Pure utilities
│   │   ├── formatters.ts
│   │   ├── logger.ts
│   │   └── validators.ts
│   │
│   └── store/                # Zustand stores
│       ├── favorites.ts
│       └── alertas.ts
│
├── hooks/                    # Custom React hooks
│   ├── useDolarQuery.ts     # Data fetching hooks
│   ├── useAuth.ts
│   └── usePolitica.ts
│
├── components/               # React components
│   ├── ui/                  # Base UI components
│   ├── charts/              # Chart components
│   └── calculadoras/        # Calculator components
│
├── types/                    # TypeScript types
│   ├── api/                 # API response types
│   ├── database.ts
│   └── user.ts
│
└── pages/                    # Next.js pages & API routes
    ├── api/                 # API routes
    └── dashboard/           # Dashboard pages
```

---

## Patrones de Diseño

### 1. **Data Flow Pattern**

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  components/ + pages/                   │
│  - Pure React components                │
│  - Use hooks for data                   │
└─────────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────────┐
│      APPLICATION LAYER                  │
│  hooks/ (Custom React Hooks)            │
│  - useDolarQuery()                      │
│  - useAuth()                            │
│  - Data fetching + state                │
└─────────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────────┐
│    INFRASTRUCTURE LAYER                 │
│  lib/api/ (HTTP Clients)                │
│  - DolarAPIService                      │
│  - ArgentinaDataService                 │
│  - Axios + Interceptors                 │
└─────────────────────────────────────────┘
              ↓ calls
┌─────────────────────────────────────────┐
│       EXTERNAL APIs                     │
│  - DolarAPI.com                         │
│  - api.argentinadatos.com               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       BUSINESS LOGIC                    │
│  lib/services/ (Pure Functions)        │
│  - DolarService                         │
│  - CalculatorService                    │
│  - Used by hooks & components           │
└─────────────────────────────────────────┘
```

---

## HTTP Clients

### Base Client: `lib/api/client.ts`

Cliente Axios base con interceptors para:

- **Request Interceptor**: Auth headers, logging
- **Response Interceptor**: Error handling, token refresh, rate limiting

```typescript
import { apiClient } from '@/lib/api/client';

// Example usage
const response = await apiClient.get('/endpoint');
```

### DolarAPI Client: `lib/api/dolarapi.ts`

Cliente específico para DolarAPI.com

```typescript
import { DolarAPIService } from '@/lib/api/dolarapi';

// Get all dollar quotations
const dolares = await DolarAPIService.getAllDolares();

// Get specific dollar type
const blue = await DolarAPIService.getDolarByType('blue');

// Get historical data
const historical = await DolarAPIService.getDolarHistorico('2025-01-01');
```

### Argentina Data Client: `lib/api/argentinaData.ts`

Cliente específico para api.argentinadatos.com

```typescript
import { ArgentinaDataService } from '@/lib/api/argentinaData';

// Political data
const senadores = await ArgentinaDataService.getSenadores();
const actas = await ArgentinaDataService.getActasSenado();

// Economic indices
const inflacion = await ArgentinaDataService.getInflacion();
const riesgoPais = await ArgentinaDataService.getRiesgoPais();

// Financial rates
const tasaPF = await ArgentinaDataService.getTasaPlazoFijo();
```

---

## Services

Services contienen **lógica de negocio pura**. No hacen llamadas HTTP, no tienen side effects.

### DolarService: `lib/services/DolarService.ts`

```typescript
import { DolarService } from '@/lib/services/DolarService';

// Calculate spread
const spread = DolarService.calculateSpread(1000, 1050); // 50

// Check if stale
const isStale = DolarService.isStale('2025-01-01T10:00:00Z', 30); // true/false

// Format price
const formatted = DolarService.formatPrice(1234.56); // "$1.234,56"

// Get best rate
const best = DolarService.getBestBuyRate(dolares);

// Calculate variation
const variation = DolarService.calculateVariation(1000, 1050);
// { absolute: 50, percentage: 5, isPositive: true }
```

### CalculatorService: `lib/services/CalculatorService.ts`

```typescript
import { CalculatorService } from '@/lib/services/CalculatorService';

// Inflation calculator
const inflacionResult = CalculatorService.calculateInflacion(
  100000, // capital inicial
  5, // inflación mensual %
  12 // meses
);

// Fixed term deposit calculator
const plazoFijoResult = CalculatorService.calculatePlazoFijo(
  100000, // capital
  90, // tasa anual %
  30, // días
  true // aplica impuesto
);

// UVA calculator
const uvaResult = CalculatorService.calculateUVA(
  100000, // capital inicial
  500, // valor UVA inicial
  600, // valor UVA final
  10, // tasa interés anual %
  12 // meses
);

// Arbitrage calculator
const arbitrage = CalculatorService.calculateArbitrage(
  100000, // capital ARS
  1000, // dólar compra
  1100 // dólar venta
);
```

---

## Guías de Uso

### ¿Cuándo crear un Service?

✅ **Crear un Service cuando:**

- Tienes lógica de negocio repetida en >2 lugares
- Cálculos complejos (spreads, conversiones, proyecciones)
- Validaciones de negocio
- Transformaciones de datos

❌ **NO crear un Service para:**

- Simple fetching de datos (usa hooks)
- Formateo simple (usa utils)
- Configuración estática (usa config)

### Ejemplo: Hook usando Service

```typescript
// hooks/useDolarVariations.ts
import { useDolarQuery } from './useDolarQuery';
import { DolarService } from '@/lib/services/DolarService';

export function useDolarVariations() {
  const { data: dolares, isLoading } = useDolarQuery();

  const variations = useMemo(() => {
    if (!dolares || dolares.length === 0) return [];

    return dolares.map((dolar) => ({
      ...dolar,
      spread: DolarService.calculateSpread(dolar.compra, dolar.venta),
      spreadPct: DolarService.calculateSpreadPercentage(dolar.compra, dolar.venta),
      isStale: DolarService.isStale(dolar.fechaActualizacion),
      formatted: DolarService.formatPrice(dolar.venta),
    }));
  }, [dolares]);

  return { variations, isLoading };
}
```

### Ejemplo: Componente usando Service

```typescript
// components/DolarCard.tsx
import { DolarService } from '@/lib/services/DolarService';

export function DolarCard({ dolar }: { dolar: DolarQuotation }) {
  const spread = DolarService.calculateSpread(dolar.compra, dolar.venta);
  const isStale = DolarService.isStale(dolar.fechaActualizacion);

  return (
    <Card>
      <h3>{dolar.nombre}</h3>
      <p>Compra: {DolarService.formatPrice(dolar.compra)}</p>
      <p>Venta: {DolarService.formatPrice(dolar.venta)}</p>
      <p>Spread: {DolarService.formatNumber(spread)}</p>
      {isStale && <Badge>Desactualizado</Badge>}
    </Card>
  );
}
```

---

## Best Practices

### 1. **Imports Organization**

```typescript
// Order: External → Internal → Types
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DolarService } from '@/lib/services/DolarService';
import { DolarAPIService } from '@/lib/api/dolarapi';

import type { DolarQuotation } from '@/types/api/dolar';
```

### 2. **Error Handling**

```typescript
// In hooks
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async () => {
      try {
        return await DolarAPIService.getAllDolares();
      } catch (error) {
        logger.error('Failed to fetch dolares', error);
        throw error; // Let React Query handle retry
      }
    },
  });
}

// In components
function DolarPage() {
  const { data, isLoading, error } = useDolarQuery();

  if (error) {
    return <ErrorMessage message="Error al cargar cotizaciones" />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return <DolarList dolares={data} />;
}
```

### 3. **Type Safety**

```typescript
// Always use TypeScript types
import type { DolarQuotation } from '@/types/api/dolar';

// Avoid 'any'
❌ function processDolar(data: any) { }

✅ function processDolar(data: DolarQuotation) { }
```

### 4. **Performance Optimization**

```typescript
// Use React.memo for expensive components
export const DolarChart = React.memo(function DolarChart({ data }) {
  // ...
});

// Use useMemo for expensive calculations
const statistics = useMemo(() => {
  return DolarService.getStatistics(dolares);
}, [dolares]);

// Use useCallback for event handlers
const handleClick = useCallback(
  (id: string) => {
    // ...
  },
  [dependencies]
);
```

### 5. **Naming Conventions**

```typescript
// Services: PascalCase, singular
DolarService.ts;
CalculatorService.ts;

// API Clients: PascalCase, descriptive
DolarAPIService;
ArgentinaDataService;

// Hooks: camelCase, "use" prefix
useDolarQuery();
useAuth();

// Components: PascalCase
DolarCard.tsx;
InflacionChart.tsx;

// Types: PascalCase
DolarQuotation;
UserPreferences;
```

---

## Migration Guide

### Migrating from fetch to Services

#### Before:

```typescript
// components/DolarCard.tsx
function DolarCard({ dolar }) {
  const spread = dolar.venta - dolar.compra;
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(dolar.venta);

  return <Card>{formatted}</Card>;
}
```

#### After:

```typescript
// components/DolarCard.tsx
import { DolarService } from '@/lib/services/DolarService';

function DolarCard({ dolar }) {
  const spread = DolarService.calculateSpread(dolar.compra, dolar.venta);
  const formatted = DolarService.formatPrice(dolar.venta);

  return <Card>{formatted}</Card>;
}
```

### Migrating hooks to use API clients

#### Before:

```typescript
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async () => {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      return response.json();
    },
  });
}
```

#### After:

```typescript
import { DolarAPIService } from '@/lib/api/dolarapi';

export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: () => DolarAPIService.getAllDolares(),
  });
}
```

---

## FAQ

### ¿Por qué no Clean Architecture completa?

**Respuesta:** Clean Architecture es excelente para aplicaciones enterprise grandes con múltiples equipos. Dólar Gaucho es un dashboard financiero que prioriza velocidad de desarrollo y simplicidad. Adoptamos los principios útiles (separación de responsabilidades, business logic aislada) sin el overhead de capas estrictas.

### ¿Cuándo agregar un nuevo Service?

**Regla de los 3:**

1. Si tienes la misma lógica en >2 lugares
2. Si el cálculo tiene >5 líneas de lógica
3. Si necesitas testearlo de forma aislada

### ¿Todos los hooks deben usar los API clients?

**Sí**, para calls a APIs externas. Usa `DolarAPIService` o `ArgentinaDataService` para beneficiarte de:

- Interceptors (logging, error handling)
- Type safety
- Retry logic
- Token refresh automático

### ¿Debo crear DTOs?

**No**, a menos que necesites transformaciones complejas. TypeScript interfaces son suficientes para la mayoría de casos.

---

## Recursos

### Documentación

- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [Next.js](https://nextjs.org/docs)

### Archivos clave

- `lib/api/client.ts` - Base HTTP client
- `lib/api/dolarapi.ts` - DolarAPI client
- `lib/services/DolarService.ts` - Dollar business logic
- `lib/services/CalculatorService.ts` - Calculator business logic

---

**Última actualización:** Enero 2025
**Versión:** 2.0
**Autor:** Claude + Equipo Dólar Gaucho
