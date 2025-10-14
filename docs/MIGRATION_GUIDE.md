# Migration Guide - Dólar Gaucho

## Overview

This guide documents the architectural improvements and migrations performed on the Dólar Gaucho project to modernize the codebase and improve maintainability.

---

## Table of Contents
1. [Zustand State Management Migration](#zustand-state-management-migration)
2. [TanStack Query Migration](#tanstack-query-migration)
3. [Theme System Migration](#theme-system-migration)
4. [Deprecated Code](#deprecated-code)
5. [Breaking Changes](#breaking-changes)

---

## Zustand State Management Migration

### Objective
Centralize all client-side state management (favorites, alerts) using Zustand with localStorage persistence.

### Before

**Old Pattern** (Local State + localStorage):
```typescript
// pages/dashboard/index.tsx (OLD)
const [favorites, setFavorites] = useState<Favorites>({
  dolares: [],
  currencies: [],
});

useEffect(() => {
  const stored = localStorage.getItem('dolargaucho_favorites');
  if (stored) {
    setFavorites(JSON.parse(stored));
  }
}, []);

const toggleFavorite = (casa: string) => {
  const newFavorites = {
    ...favorites,
    dolares: favorites.dolares.includes(casa)
      ? favorites.dolares.filter((f) => f !== casa)
      : [...favorites.dolares, casa],
  };
  setFavorites(newFavorites);
  localStorage.setItem('dolargaucho_favorites', JSON.stringify(newFavorites));
};
```

### After

**New Pattern** (Zustand Store):
```typescript
// lib/store/favorites.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      dolares: [],
      currencies: [],

      toggleDolar: (casa: string) =>
        set((state) => ({
          dolares: state.dolares.includes(casa)
            ? state.dolares.filter((d) => d !== casa)
            : [...state.dolares, casa],
        })),

      toggleCurrency: (moneda: string) =>
        set((state) => ({
          currencies: state.currencies.includes(moneda)
            ? state.currencies.filter((c) => c !== moneda)
            : [...state.currencies, moneda],
        })),

      getTotalCount: () => {
        const { dolares, currencies } = get();
        return dolares.length + currencies.length;
      },
    }),
    {
      name: 'dolargaucho_favorites', // localStorage key
    }
  )
);
```

**Usage in Components**:
```typescript
// pages/dashboard/index.tsx (NEW)
import { useFavoritesStore } from '@/lib/store/favorites';

export default function DashboardPage() {
  const {
    dolares: favoriteDolarIds,
    currencies: favoriteCurrencyIds,
    toggleDolar,
    toggleCurrency
  } = useFavoritesStore();

  const isFavorite = favoriteDolarIds.includes(dolar.casa);

  return (
    <button onClick={() => toggleDolar(dolar.casa)}>
      {isFavorite ? <FaStar /> : <FaRegStar />}
    </button>
  );
}
```

### Benefits
✅ **Centralized state** - Single source of truth across all components
✅ **Automatic persistence** - No manual localStorage management
✅ **Type safety** - Full TypeScript support
✅ **Better performance** - Optimized re-renders
✅ **DevTools support** - Zustand DevTools for debugging

### Migration Checklist
- [x] Create Zustand stores (`favorites.ts`, `alertas.ts`)
- [x] Remove duplicate store at `/store/useFavoritesStore.ts`
- [x] Update all components to use `useFavoritesStore` from `/lib/store/favorites`
- [x] Remove manual localStorage calls for favorites
- [x] Test state persistence across page reloads
- [x] Verify favorites work in all pages (dashboard, favoritos, etc.)

---

## TanStack Query Migration

### Objective
Replace traditional data fetching (useState + useEffect) with TanStack Query for better caching, error handling, and automatic refetching.

### Before

**Old Pattern** (useState + useEffect):
```typescript
// hooks/useArgentinaData.ts (OLD - NEEDS MIGRATION)
export function useArgentinaData() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch ALL 28 endpoints at once (inefficient!)
        const [senadores, diputados, inflacion, ...] = await Promise.all([
          fetch('https://api.argentinadatos.com/v1/politica/senadores'),
          fetch('https://api.argentinadatos.com/v1/politica/diputados'),
          fetch('https://api.argentinadatos.com/v1/finanzas/inflacion'),
          // ... 25 more endpoints
        ]);

        setData({
          senadores: await senadores.json(),
          diputados: await diputados.json(),
          inflacion: await inflacion.json(),
          // ... more data
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
```

**Issues**:
❌ Loads ALL data even if only one piece is needed
❌ No caching - refetches on every component mount
❌ No automatic refetching
❌ Manual error handling
❌ No retry logic

### After

**New Pattern** (TanStack Query - Modular Hooks):

```typescript
// hooks/usePolitica.ts (NEW)
import { useQuery } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/config/api';

export function useSenadores() {
  return useQuery({
    queryKey: ['senadores'],
    queryFn: async () => {
      const response = await fetch('https://api.argentinadatos.com/v1/politica/senadores');
      if (!response.ok) throw new Error('Failed to fetch senadores');
      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,   // 24 hours
    retry: 3,
  });
}

export function useDiputados() {
  return useQuery({
    queryKey: ['diputados'],
    queryFn: async () => {
      const response = await fetch('https://api.argentinadatos.com/v1/politica/diputados');
      if (!response.ok) throw new Error('Failed to fetch diputados');
      return response.json();
    },
    staleTime: CACHE_CONFIG.politica.staleTime,
    retry: 3,
  });
}
```

```typescript
// hooks/useInflacion.ts (NEW)
export function useInflacion() {
  return useQuery({
    queryKey: ['inflacion'],
    queryFn: async () => {
      const response = await fetch('https://api.argentinadatos.com/v1/finanzas/inflacion');
      if (!response.ok) throw new Error('Failed to fetch inflacion');
      return response.json();
    },
    staleTime: CACHE_CONFIG.finanzas.staleTime,   // 1 hour
    retry: 3,
  });
}
```

**Usage in Components**:
```typescript
// pages/dashboard/politica.tsx (NEW)
import { useSenadores, useDiputados } from '@/hooks/usePolitica';

export default function PoliticaPage() {
  const { data: senadores, isLoading: loadingSenadores } = useSenadores();
  const { data: diputados, isLoading: loadingDiputados } = useDiputados();

  // Only fetches the data actually needed!
  // Cached intelligently based on staleTime
}
```

### Benefits
✅ **Smart caching** - Data persists across components
✅ **Automatic refetching** - Keeps data fresh
✅ **Optimized loading** - Only fetch what's needed
✅ **Error recovery** - Built-in retry logic
✅ **Loading states** - Automatic loading/error states
✅ **Background refetching** - Updates data in background

### Cache Configuration

**Location**: `/lib/config/api.ts`

```typescript
export const CACHE_CONFIG = {
  // Real-time data - short cache
  dolares: {
    staleTime: 30 * 1000,        // 30 seconds
    refetchInterval: 30 * 1000,  // Auto-refetch every 30s
  },

  // Financial data - moderate cache
  finanzas: {
    staleTime: 60 * 60 * 1000,   // 1 hour
    refetchInterval: 60 * 60 * 1000,
  },

  // Political data - long cache (rarely changes)
  politica: {
    staleTime: 24 * 60 * 60 * 1000,  // 24 hours
    refetchInterval: false,           // No auto-refetch
  },

  // Historical data - very long cache (immutable)
  historical: {
    staleTime: Infinity,
    refetchInterval: false,
  },
};
```

### Migration Status

#### ✅ Migrated Hooks
- [x] `useDolarQuery.ts` - Dollar quotations
- [x] `useDolarVariations.ts` - Dollar variations with historical data
- [x] `useCotizaciones.ts` - International currencies
- [x] `useInflacion.ts` - Inflation data
- [x] `usePolitica.ts` - Political data (Senadores, Diputados, Actas)
- [x] `useFinanzas.ts` - Financial indices (Riesgo País, UVA, Tasas, FCI)
- [x] `useEventos.ts` - Events and holidays

#### ⚠️ Needs Migration
- [ ] `useArgentinaData.ts` - **TO BE DEPRECATED**
  - **Action**: Update components to use modular hooks instead
  - **Timeline**: Next version
  - **Status**: Mark as deprecated, plan removal

### Migration Checklist for New Data Sources

When adding new data fetching:

1. **Create TanStack Query hook**:
```typescript
// hooks/useNewData.ts
export function useNewData() {
  return useQuery({
    queryKey: ['new-data'],
    queryFn: async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Fetch failed');
      return response.json();
    },
    staleTime: 60000,  // Adjust based on data freshness needs
    retry: 3,
  });
}
```

2. **Define TypeScript types** in `/types/api/`:
```typescript
// types/api/newdata.ts
export interface NewDataItem {
  id: string;
  name: string;
  value: number;
}

export type NewDataResponse = NewDataItem[];
```

3. **Add cache config** to `/lib/config/api.ts`

4. **Use in components**:
```typescript
const { data, isLoading, error } = useNewData();
```

---

## Theme System Migration

### Objective
Migrate from hardcoded colors to CSS variables for consistent theming.

### Before

**Old Pattern** (Hardcoded Colors):
```tsx
// components/sidebar.tsx (OLD - REMOVED)
<aside className="bg-[#181B2B] border-gray-700">
  <Link href="/" className="text-gray-300 hover:text-teal-300">
    Inicio
  </Link>
</aside>
```

### After

**New Pattern** (CSS Variables):
```tsx
// components/layouts/UnifiedNavbar.tsx (NEW)
<aside className="bg-panel border-border">
  <Link href="/" className="text-secondary hover:text-accent-emerald">
    Inicio
  </Link>
</aside>
```

### CSS Variables System

**Location**: `/styles/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --panel: #f5f5f5;
  --border: rgba(0, 0, 0, 0.1);
  --secondary: #666666;
  --accent-emerald: #10b981;
  --accent-teal: #14b8a6;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --panel: #1a1a1a;
  --border: rgba(255, 255, 255, 0.2);
  --secondary: #a3a3a3;
}
```

**Tailwind Integration**:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      panel: 'var(--panel)',
      border: 'var(--border)',
      secondary: 'var(--secondary)',
      'accent-emerald': 'var(--accent-emerald)',
      'accent-teal': 'var(--accent-teal)',
    },
  },
}
```

### Color Reference Table

| Old Hardcoded | New CSS Variable | Tailwind Class |
|--------------|------------------|----------------|
| `#181B2B` | `var(--background)` / `var(--panel)` | `bg-background` / `bg-panel` |
| `#ffffff` | `var(--foreground)` (in dark mode) | `text-foreground` |
| `#0a0a0a` | `var(--foreground)` (in light mode) | `text-foreground` |
| `gray-700` | `var(--border)` | `border-border` |
| `gray-300` | `var(--secondary)` | `text-secondary` |
| `teal-300` | `var(--accent-emerald)` | `text-accent-emerald` |

### Migration Checklist
- [x] Define CSS variables in `globals.css`
- [x] Update Tailwind config to use CSS variables
- [x] Remove hardcoded colors from components
- [x] Delete deprecated components with hardcoded colors (`sidebar.tsx`)
- [x] Test theme switching in all components
- [x] Verify accessibility in both light and dark modes

---

## Deprecated Code

### Files Marked for Deprecation

#### 1. `hooks/useDolar.ts` - ⚠️ DEPRECATED

**Status**: Deprecated but functional
**Reason**: Superseded by `useDolarQuery.ts`
**Timeline**: Remove in v2.0.0

**Current Code**:
```typescript
/**
 * @deprecated Use useDolarQuery instead
 * This hook is maintained for backward compatibility only
 */
export function useDolar() {
  console.warn('useDolar is deprecated. Use useDolarQuery instead.');
  return useDolarQuery();
}
```

**Migration Path**:
```typescript
// OLD
import { useDolar } from '@/hooks/useDolar';
const { data, loading, error } = useDolar();

// NEW
import { useDolarQuery } from '@/hooks/useDolarQuery';
const { data, isLoading, error } = useDolarQuery();
```

#### 2. `hooks/useArgentinaData.ts` - ⚠️ NEEDS DEPRECATION

**Status**: Active but should be deprecated
**Reason**: Inefficient monolithic data fetcher
**Timeline**: Deprecate in v1.1.0, remove in v2.0.0

**Migration Path**:
Replace with modular hooks:
- `useSenadores()` instead of `data.senadores`
- `useDiputados()` instead of `data.diputados`
- `useInflacion()` instead of `data.inflacion`
- etc.

#### 3. `components/sidebar.tsx` - ✅ REMOVED

**Status**: Removed
**Reason**: Hardcoded colors, superseded by `UnifiedNavbar`
**Replacement**: Use `UnifiedNavbar` component

### Files Removed

#### Duplicate Store
- ❌ `/store/useFavoritesStore.ts` - REMOVED
  - **Reason**: Duplicate of `/lib/store/favorites.ts`
  - **Action**: Deleted, updated all imports

---

## Breaking Changes

### Version 1.1.0 (Current)

#### Favorites Store Import Path

**Before**:
```typescript
import { useFavoritesStore } from '@/store/useFavoritesStore';
```

**After**:
```typescript
import { useFavoritesStore } from '@/lib/store/favorites';
```

**Migration**: Update import paths in all files

#### Favorites Store API

**Before**:
```typescript
const { favorites, toggleDolarFavorite, toggleCurrencyFavorite } = useFavoritesStore();
const isFavorite = favorites.dolares.includes(casa);
```

**After**:
```typescript
const { dolares, currencies, toggleDolar, toggleCurrency } = useFavoritesStore();
const isFavorite = dolares.includes(casa);
```

**Changes**:
- `favorites.dolares` → `dolares`
- `favorites.currencies` → `currencies`
- `toggleDolarFavorite()` → `toggleDolar()`
- `toggleCurrencyFavorite()` → `toggleCurrency()`

#### TanStack Query Response Shape

**Before** (Manual useState):
```typescript
const { data, loading, error } = useCustomHook();
```

**After** (TanStack Query):
```typescript
const { data, isLoading, error } = useQueryHook();
```

**Changes**:
- `loading` → `isLoading`
- Additional properties available: `isFetching`, `isError`, `refetch()`, etc.

---

## Future Migrations

### Planned for v2.0.0

1. **Complete useArgentinaData removal**
   - Remove `hooks/useArgentinaData.ts`
   - Ensure all components use modular hooks

2. **Remove deprecated useDolar hook**
   - Delete `hooks/useDolar.ts`
   - Update any remaining references

3. **Authentication migration**
   - Potential migration to NextAuth.js
   - Evaluate Supabase Auth alternatives

4. **App Router migration**
   - Migrate remaining Pages Router pages to App Router
   - Unified routing approach

---

## Migration Best Practices

### When Migrating Components

1. **Check Dependencies**
   - Identify all state dependencies
   - Map data sources to appropriate hooks

2. **Update Imports**
   - Use new Zustand store paths
   - Import TanStack Query hooks

3. **Update Component Logic**
   - Replace local state with global state
   - Replace useEffect data fetching with useQuery

4. **Test Thoroughly**
   - Verify data loads correctly
   - Check error states
   - Test loading states
   - Verify state persistence

5. **Update Types**
   - Ensure TypeScript types are correct
   - Use proper type definitions from `/types`

### Common Migration Patterns

#### Pattern 1: Local State → Zustand

```typescript
// BEFORE
const [value, setValue] = useState();
useEffect(() => {
  const stored = localStorage.getItem('key');
  setValue(stored);
}, []);

// AFTER
const value = useStore((state) => state.value);
```

#### Pattern 2: useEffect Fetch → TanStack Query

```typescript
// BEFORE
useEffect(() => {
  fetch(url).then(res => res.json()).then(setData);
}, []);

// AFTER
const { data } = useQuery({ queryKey: ['key'], queryFn: () => fetch(url).then(r => r.json()) });
```

#### Pattern 3: Hardcoded Colors → CSS Variables

```typescript
// BEFORE
<div className="bg-[#181B2B] text-gray-300">

// AFTER
<div className="bg-panel text-secondary">
```

---

## Rollback Procedures

### If Migration Issues Occur

1. **Zustand Migration Issues**
   - Check localStorage key matches: `dolargaucho_favorites`
   - Verify Zustand persist middleware is configured
   - Clear localStorage and test fresh state

2. **TanStack Query Issues**
   - Check QueryClient is properly configured in `providers.tsx`
   - Verify query keys are unique
   - Check network requests in DevTools

3. **Theme System Issues**
   - Verify CSS variables are defined in `globals.css`
   - Check Tailwind config extends colors properly
   - Test with browser DevTools dark mode toggle

---

## Support

For migration questions or issues:
- Check documentation in `/docs`
- Review code examples in migrated files
- Create an issue on GitHub

---

**Last Updated**: 2025-01-15
**Version**: 1.1.0
