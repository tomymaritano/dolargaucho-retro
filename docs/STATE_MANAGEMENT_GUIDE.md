# State Management Guide - TanStack Query vs Zustand

## 📖 Resumen Ejecutivo

Dólar Gaucho usa **dos sistemas de state management** diferentes, cada uno con un propósito específico:

| Sistema            | Propósito                | Archivos    | Ejemplo                         |
| ------------------ | ------------------------ | ----------- | ------------------------------- |
| **TanStack Query** | Datos remotos (APIs)     | 42 archivos | Cotizaciones, crypto, inflación |
| **Zustand**        | Estado local del cliente | 2 stores    | Favoritos, alertas              |

**Regla de oro**: Si viene de una API, usa TanStack Query. Si es preferencia del usuario, usa Zustand.

---

## 🎯 ¿Cuándo usar cada uno?

### Use TanStack Query cuando:

- ✅ Los datos vienen de una API externa
- ✅ Necesitas cache automático
- ✅ Quieres auto-refetch (polling)
- ✅ Necesitas manejar loading/error states
- ✅ Los datos pueden quedar "stale" (desactualizados)

**Ejemplos:**

- Cotizaciones del dólar
- Criptomonedas
- Inflación
- Riesgo país
- Datos políticos (diputados, senadores)

### Use Zustand cuando:

- ✅ El estado es local (no viene de API)
- ✅ Necesitas compartir estado entre componentes
- ✅ Quieres persistencia en localStorage
- ✅ El estado lo controla el usuario
- ✅ No necesitas sincronización con servidor

**Ejemplos:**

- Favoritos del usuario
- Alertas configuradas
- Tema (dark/light)
- Configuración de usuario
- Estado de UI (modals abiertos, etc.)

---

## 🚀 TanStack Query (React Query)

### ¿Qué es?

TanStack Query es una librería para **fetching, caching, y sincronización de datos remotos**. Piensa en él como un "super fetch" con cache inteligente.

### Configuración Actual

**Archivo:** `app/providers.tsx`

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Datos frescos por 1 minuto
      gcTime: 5 * 60 * 1000, // Garbage collection a los 5 min
      retry: 3, // 3 reintentos en caso de error
      refetchOnWindowFocus: true, // Re-fetch al volver a la tab
      refetchOnReconnect: true, // Re-fetch al reconectar internet
    },
  },
});
```

### Anatomía de un Hook con TanStack Query

```typescript
export function useDolares() {
  return useQuery({
    // 1. Query Key (identificador único para cache)
    queryKey: ['dolares'],

    // 2. Query Function (cómo obtener los datos)
    queryFn: async () => {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) throw new Error('Error fetching dolares');
      return response.json();
    },

    // 3. Opciones de cache
    staleTime: 30 * 1000, // Datos frescos por 30 segundos
    refetchInterval: 30 * 1000, // Auto-refetch cada 30 segundos
  });
}
```

### Estados Disponibles

```typescript
const {
  data, // Los datos (undefined mientras carga)
  isLoading, // true en la primera carga
  isFetching, // true cada vez que hace fetch (incluye refetch)
  isError, // true si hay error
  error, // El objeto error
  isSuccess, // true si tiene datos
  refetch, // Función para refetch manual
} = useDolares();
```

### Patrones Comunes

#### 1. Query con parámetro

```typescript
export function useDolarByType(type: string) {
  return useQuery({
    queryKey: ['dolar', type], // ← Key incluye parámetro
    queryFn: () => fetchDolar(type),
    enabled: !!type, // Solo ejecutar si type existe
  });
}
```

#### 2. Query con transformación de datos

```typescript
export function useInflacion() {
  return useQuery({
    queryKey: ['inflacion'],
    queryFn: fetchInflacion,
    select: (data) => {
      // Transformar: ordenar y tomar últimos 12 meses
      return data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 12)
        .reverse();
    },
  });
}
```

#### 3. Múltiples queries en paralelo

```typescript
export function useDashboardData() {
  const dolares = useDolares();
  const inflacion = useInflacion();
  const riesgoPais = useRiesgoPais();

  return {
    dolares,
    inflacion,
    riesgoPais,
    // Estado combinado
    isLoading: dolares.isLoading || inflacion.isLoading || riesgoPais.isLoading,
    isError: dolares.isError || inflacion.isError || riesgoPais.isError,
  };
}
```

### Hooks Actuales en el Proyecto

| Hook                    | Archivo              | Propósito                    | Stale Time |
| ----------------------- | -------------------- | ---------------------------- | ---------- |
| `useDolares()`          | `useDolarQuery.ts`   | Todas las cotizaciones       | 30s        |
| `useDolarByType()`      | `useDolarQuery.ts`   | Un tipo específico           | 30s        |
| `useCryptoQuery()`      | `useCryptoQuery.ts`  | Criptomonedas                | 30s        |
| `useCotizaciones()`     | `useCotizaciones.ts` | Cotizaciones internacionales | 30s        |
| `useInflacionMensual()` | `useFinanzas.ts`     | Inflación mensual            | 1h         |
| `useRiesgoPais()`       | `useFinanzas.ts`     | Riesgo país                  | 1h         |
| `useFredData()`         | `useFredData.ts`     | Datos FRED (USA)             | 1h         |
| `useECBRates()`         | `useECBRates.ts`     | Tasas BCE (EUR)              | 1h         |
| `usePolitica()`         | `usePolitica.ts`     | Datos políticos              | 1h         |

---

## 🎨 Zustand

### ¿Qué es?

Zustand es una **librería de state management minimalista** para React. Es como Redux pero más simple y sin boilerplate.

### Stores Actuales

#### 1. Favorites Store

**Archivo:** `lib/store/favorites.ts`

```typescript
interface FavoritesState {
  dolares: string[]; // IDs de dólares favoritos
  currencies: string[]; // IDs de monedas favoritas
  cryptos: string[]; // IDs de cryptos favoritas
  charts: string[]; // Gráficos favoritos (máx 3)

  // Actions
  toggleDolar: (casa: string) => ChartActionResult;
  toggleCurrency: (moneda: string) => ChartActionResult;
  toggleCrypto: (cryptoId: string) => ChartActionResult;
  toggleChart: (chartId: string) => ChartActionResult;
  getTotalCount: () => number;
  clearAll: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      dolares: [],
      currencies: [],
      cryptos: [],
      charts: [],

      toggleDolar: (casa: string) => {
        const state = get();
        if (state.dolares.includes(casa)) {
          set({ dolares: state.dolares.filter((d) => d !== casa) });
          return { success: true, message: 'Dólar quitado de favoritos' };
        }
        set({ dolares: [...state.dolares, casa] });
        return { success: true, message: 'Dólar agregado a favoritos' };
      },

      // ... más actions
    }),
    {
      name: 'dolargaucho_favorites', // localStorage key
    }
  )
);
```

**Características:**

- ✅ Persiste en localStorage automáticamente
- ✅ Límite de 3 gráficos favoritos
- ✅ Retorna mensajes de éxito/error
- ✅ Método `getTotalCount()` para contar total

#### 2. Alertas Store

**Archivo:** `lib/store/alertas.ts`

```typescript
interface AlertasState {
  alertas: Alerta[];
  addAlerta: (alerta: Omit<Alerta, 'id' | 'createdAt'>) => void;
  removeAlerta: (id: string) => void;
  updateAlerta: (id: string, alerta: Partial<Alerta>) => void;
  getTotalCount: () => number;
  clearAll: () => void;
}
```

**Características:**

- ✅ CRUD completo de alertas
- ✅ Persiste en localStorage
- ✅ IDs generados automáticamente (UUID)

### Cómo usar Zustand

#### 1. Leer estado

```typescript
import { useFavoritesStore } from '@/lib/store/favorites';

function MyComponent() {
  const dolares = useFavoritesStore((state) => state.dolares);
  const totalCount = useFavoritesStore((state) => state.getTotalCount());

  return (
    <div>
      <p>Favoritos: {totalCount}</p>
      <p>Dólares: {dolares.length}</p>
    </div>
  );
}
```

#### 2. Modificar estado

```typescript
function FavoriteButton({ casa }: { casa: string }) {
  const toggleDolar = useFavoritesStore((state) => state.toggleDolar);
  const isFavorite = useFavoritesStore((state) => state.dolares.includes(casa));

  const handleClick = () => {
    const result = toggleDolar(casa);
    if (result.success) {
      console.log(result.message); // "Dólar agregado a favoritos"
    }
  };

  return (
    <button onClick={handleClick}>
      {isFavorite ? '★' : '☆'}
    </button>
  );
}
```

#### 3. Selectors eficientes

**❌ MAL - Re-renderiza siempre:**

```typescript
const store = useFavoritesStore(); // Toda la store
```

**✅ BIEN - Solo re-renderiza si cambia el valor:**

```typescript
const dolares = useFavoritesStore((state) => state.dolares);
```

---

## 🔄 Comparación Lado a Lado

### Ejemplo: Agregar un Favorito

#### Con TanStack Query (si fuera API):

```typescript
const mutation = useMutation({
  mutationFn: (dolarId: string) =>
    fetch('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ dolarId }),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  },
});

// Usar
mutation.mutate('blue');
```

#### Con Zustand (estado local actual):

```typescript
const toggleDolar = useFavoritesStore((state) => state.toggleDolar);

// Usar
toggleDolar('blue');
```

**Conclusión**: Para favoritos, Zustand es más simple porque no necesitamos sincronizar con servidor (todo es local).

---

## 📊 Arquitectura Actual

```
┌─────────────────────────────────────────┐
│         DÓLAR GAUCHO APP                │
└─────────────────────────────────────────┘
            │
            ├─── TanStack Query (42 hooks)
            │    │
            │    ├─ useDolares()           → Cache: 30s
            │    ├─ useCryptoQuery()       → Cache: 30s
            │    ├─ useInflacionMensual()  → Cache: 1h
            │    ├─ useRiesgoPais()        → Cache: 1h
            │    ├─ useFredData()          → Cache: 1h
            │    └─ ... (37 más)
            │
            └─── Zustand (2 stores)
                 │
                 ├─ useFavoritesStore      → localStorage
                 └─ useAlertasStore        → localStorage
```

---

## ✅ Best Practices

### 1. Naming Conventions

- **TanStack Query hooks**: `use[Recurso]Query` o `use[Recurso]`
  - ✅ `useDolarQuery`, `useCryptoQuery`, `useInflacionMensual`
  - ❌ `getDolares`, `fetchCrypto`

- **Zustand stores**: `use[Recurso]Store`
  - ✅ `useFavoritesStore`, `useAlertasStore`
  - ❌ `favoritesState`, `alertasContext`

### 2. Query Keys

Siempre usa arrays:

```typescript
// ✅ BIEN
queryKey: ['dolares'];
queryKey: ['dolar', 'blue'];
queryKey: ['inflacion', { year: 2024 }];

// ❌ MAL
queryKey: 'dolares';
queryKey: `dolar-${type}`;
```

### 3. Evitar useState para datos remotos

**❌ MAL:**

```typescript
const [dolares, setDolares] = useState([]);

useEffect(() => {
  fetch('...')
    .then((res) => res.json())
    .then(setDolares);
}, []);
```

**✅ BIEN:**

```typescript
const { data: dolares } = useDolares();
```

### 4. Combinar ambos cuando sea necesario

```typescript
function DolarCard({ casa }: { casa: string }) {
  // TanStack Query: datos del dólar
  const { data: dolar } = useDolarByType(casa);

  // Zustand: si está en favoritos
  const isFavorite = useFavoritesStore((state) =>
    state.dolares.includes(casa)
  );
  const toggleFavorite = useFavoritesStore((state) =>
    state.toggleDolar
  );

  if (!dolar) return <Skeleton />;

  return (
    <Card>
      <h3>{dolar.nombre}</h3>
      <p>${dolar.venta}</p>
      <button onClick={() => toggleFavorite(casa)}>
        {isFavorite ? '★' : '☆'}
      </button>
    </Card>
  );
}
```

---

## 🚨 Errores Comunes

### 1. Usar useState para datos de API

**Problema:**

```typescript
const [dolares, setDolares] = useState([]);
```

**Solución:**

```typescript
const { data: dolares } = useDolares();
```

### 2. No usar query keys correctamente

**Problema:**

```typescript
queryKey: ['dolar']; // ← Siempre el mismo key, aunque cambie el tipo
```

**Solución:**

```typescript
queryKey: ['dolar', type]; // ← Key único por tipo
```

### 3. Leer toda la store innecesariamente

**Problema:**

```typescript
const store = useFavoritesStore(); // ← Re-renderiza con cualquier cambio
```

**Solución:**

```typescript
const dolares = useFavoritesStore((state) => state.dolares); // ← Solo re-renderiza si cambia dolares
```

---

## 📚 Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Ejemplo completo en el proyecto](../docs/examples/02-tanstack-query.tsx)

---

## 🎓 TL;DR

- **TanStack Query**: Para datos de APIs (dólares, crypto, inflación)
- **Zustand**: Para estado local (favoritos, alertas, config)
- **42 hooks** usan TanStack Query
- **2 stores** usan Zustand
- **Regla**: Si viene de API → TanStack Query. Si es local → Zustand.

¿Tienes dudas? Lee `docs/examples/02-tanstack-query.tsx` para ejemplos completos.
