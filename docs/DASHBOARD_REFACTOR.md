# Dashboard Refactorization Plan

## Problem Statement

`/pages/dashboard/index.tsx` tiene **1710 líneas** y viola múltiples principios de React:

- ❌ Viola Single Responsibility Principle (múltiples responsabilidades en un archivo)
- ❌ No usa composition (todo en un archivo monolítico)
- ❌ Lógica de negocio mezclada con presentación
- ❌ Componentes no reutilizables
- ❌ Difícil de testear y mantener

## Solution: Component Architecture

### Principios Aplicados

#### 1. **Single Responsibility Principle (SRP)**

Cada componente tiene UNA responsabilidad clara:

- `HeroBanner` → Solo muestra el banner promocional
- `FavoritesSection` → Solo maneja la sección de favoritos
- `CryptoSection` → Solo maneja la tabla de criptomonedas
- `FredSection` → Solo maneja datos de FRED

#### 2. **Composition over Inheritance**

```tsx
<DashboardLayout>
  <HeroBanner />
  <FavoritesSection />
  <FavoriteChartsSection />
  <InflationSection />
  <InternationalRatesSection />
  <CryptoSection />
  <FredSection />
  <ECBSection />
  <DolarSection />
</DashboardLayout>
```

#### 3. **Separation of Concerns**

- **Hooks** → Lógica de negocio y data fetching
- **Components** → Presentación y UI
- **Types** → Interfaces y tipos

#### 4. **Controlled Data Flow (Props Down, Events Up)**

```tsx
// Props down
<CryptoSection cryptos={cryptos} loading={loadingCryptos} selectedDolar={selectedDolar} />;

// Events up
onToggleFavorite = { handleToggleFavorite };
```

#### 5. **State Minimalism**

- Estado global → Zustand (favorites)
- Estado de servidor → React Query (data fetching)
- Estado local → Solo UI state (expanded, page, etc.)

## New File Structure

```
components/
├── dashboard/
│   ├── HeroBanner.tsx                 # Hero promotional banner
│   ├── FavoritesSection.tsx           # Favorites overview
│   ├── FavoritesList.tsx              # Favorites table renderer
│   ├── FavoriteChartsSection.tsx      # Favorite charts grid
│   ├── InflationSection.tsx           # Argentina inflation card
│   ├── InternationalRatesSection.tsx  # ECB rates card
│   ├── CryptoSection.tsx              # All cryptocurrencies table
│   ├── CryptoTable.tsx                # Crypto table renderer
│   ├── FredSection.tsx                # FRED USA economic data
│   ├── FredCharts.tsx                 # FRED charts grid
│   ├── ECBSection.tsx                 # ECB European data
│   ├── ECBCharts.tsx                  # ECB charts grid
│   └── DolarSection.tsx               # All dollar rates table

hooks/
├── useDashboardData.ts                # Centralized data fetching
└── useFavorites.ts                    # Favorites management logic

pages/
└── dashboard/
    └── index.tsx                      # ~100 lines: composition only
```

## Component Breakdown

### Before (1710 lines)

```tsx
export default function DashboardPage() {
  // 50+ lines of state
  // 100+ lines of handlers
  // 1500+ lines of JSX
  // Everything mixed together
}
```

### After (~100 lines per file)

```tsx
// pages/dashboard/index.tsx (~100 lines)
export default function DashboardPage() {
  const data = useDashboardData();
  const favorites = useFavorites();

  return (
    <DashboardLayout>
      <HeroBanner />
      {favorites.hasAny && <FavoritesSection {...favorites} />}
      {favorites.hasCharts && <FavoriteChartsSection {...favorites} />}
      <InflationSection {...data.inflation} />
      <InternationalRatesSection {...data.rates} />
      <CryptoSection {...data.crypto} />
      <FredSection {...data.fred} />
      <ECBSection {...data.ecb} />
      <DolarSection {...data.dolar} />
      <Toast {...toast} />
    </DashboardLayout>
  );
}
```

## Benefits

### 1. **Maintainability** ✅

- Cada archivo tiene ~100-150 líneas
- Fácil de navegar y entender
- Cambios localizados

### 2. **Testability** ✅

```tsx
describe('CryptoSection', () => {
  it('renders crypto table with data', () => {
    render(<CryptoSection cryptos={mockCryptos} />);
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });
});
```

### 3. **Reusability** ✅

- `FredCharts` puede usarse en otras páginas
- `CryptoTable` puede reutilizarse
- Componentes desacoplados

### 4. **Performance** ✅

```tsx
// Memoization fácil con componentes pequeños
export const CryptoSection = React.memo(({ cryptos, loading }) => {
  // Solo re-render si cryptos o loading cambian
});
```

### 5. **Code Splitting** ✅

```tsx
// Lazy loading de secciones pesadas
const FredSection = lazy(() => import('@/components/dashboard/FredSection'));
const ECBSection = lazy(() => import('@/components/dashboard/ECBSection'));
```

## Migration Strategy

### Phase 1: Extract Components (Current)

1. ✅ `HeroBanner.tsx`
2. ✅ `useDashboardData.ts` hook
3. 🔄 `FavoritesSection.tsx`
4. 🔄 `FavoritesList.tsx`
5. ⏳ `CryptoSection.tsx`
6. ⏳ `FredSection.tsx`
7. ⏳ `ECBSection.tsx`
8. ⏳ Other sections...

### Phase 2: Refactor Main File

1. Import extracted components
2. Remove extracted code
3. Keep only composition logic
4. Verify functionality

### Phase 3: Testing & Optimization

1. Add unit tests
2. Add integration tests
3. Performance optimization
4. Documentation

## Design System Principles Applied

### 1. **Consistent Naming**

```tsx
// Pattern: [Section]Section.tsx
FavoritesSection.tsx;
CryptoSection.tsx;
FredSection.tsx;
```

### 2. **Clear Prop Interfaces**

```tsx
interface CryptoSectionProps {
  cryptos: Crypto[];
  loading: boolean;
  selectedDolar: Dolar;
  onToggleFavorite: (id: string) => void;
}
```

### 3. **Composition Patterns**

```tsx
<Card>
  <Card.Header>
    <CardTitle icon={<FaBitcoin />}>Criptomonedas</CardTitle>
  </Card.Header>
  <Card.Content>
    <CryptoTable data={cryptos} />
  </Card.Content>
</Card>
```

## Next Steps

1. **Complete component extraction**
   - Extract all sections to individual components
   - Extract sub-components (tables, charts, etc.)

2. **Refactor main dashboard file**
   - Remove extracted code
   - Import and compose components
   - Target: ~100-150 lines

3. **Add tests**
   - Unit tests for each component
   - Integration tests for dashboard
   - E2E tests for critical flows

4. **Documentation**
   - JSDoc comments
   - Storybook stories
   - Usage examples

5. **Performance optimization**
   - React.memo for expensive components
   - useMemo/useCallback for heavy computations
   - Code splitting with lazy loading

## Estimated Results

| Metric          | Before  | After        | Improvement       |
| --------------- | ------- | ------------ | ----------------- |
| Lines per file  | 1710    | ~100-150     | **90% reduction** |
| Testability     | ❌ Hard | ✅ Easy      | **Testable**      |
| Maintainability | ❌ Low  | ✅ High      | **Improved**      |
| Reusability     | ❌ None | ✅ High      | **Reusable**      |
| Performance     | ⚠️ OK   | ✅ Optimized | **Better**        |

## Conclusion

Esta refactorización transforma un archivo monolítico de 1710 líneas en una arquitectura modular, testeable y mantenible que sigue las mejores prácticas de React y los principios SOLID.

**Resultado final**: ~15 componentes de ~100-150 líneas cada uno, fáciles de entender, testear y mantener.
