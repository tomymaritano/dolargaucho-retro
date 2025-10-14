# React Best Practices & Architecture Principles

**⚠️ MANDATORY RULES - MUST FOLLOW ALWAYS ⚠️**

## 🚨 CRITICAL FILE SIZE LIMITS

### Hard Limits (NEVER EXCEED)

- **React Components**: MAX 150 lines
- **Pages**: MAX 200 lines (composition only)
- **Hooks**: MAX 100 lines
- **Utilities**: MAX 80 lines

### Warning Limits (Refactor if exceeded)

- **React Components**: 100+ lines → Start refactoring
- **Pages**: 150+ lines → Extract sections
- **Any file**: 200+ lines → IMMEDIATE REFACTOR REQUIRED

### Current Violations

- ❌ `pages/dashboard/index.tsx`: **1710 lines** → REFACTOR URGENTLY
- ✅ Target: ~15 components × 100 lines each

---

## 15 Principios React (OBLIGATORIOS)

### 1️⃣ Single Responsibility Principle (SRP)

- Cada componente tiene UNA responsabilidad
- Si hace más de una cosa → split it

### 2️⃣ Composition over Inheritance

- Componer componentes pequeños
- NO monolitos gigantes

### 3️⃣ Declarative, Not Imperative

- Declarar QUÉ mostrar
- NO manipular DOM directamente

### 4️⃣ Controlled Data Flow (Unidirectional)

- Props down, events up
- NO modificar props directamente

### 5️⃣ State Minimalism

- Solo el estado esencial
- Derivar todo lo demás

### 6️⃣ Hooks Correctamente Estructurados

- Un hook = una responsabilidad
- Custom hooks para lógica reutilizable

### 7️⃣ Prop Interfaces Claras

- TypeScript interfaces SIEMPRE
- JSDoc para props complejas

### 8️⃣ Styling Consistente

- Tailwind design system
- NO inline styles

### 9️⃣ Performance y Memoization

- useMemo para cálculos caros
- useCallback para funciones
- React.memo para componentes

### 🔟 Accesibilidad (A11y)

- Semantic HTML
- ARIA labels
- Keyboard navigation

### 1️⃣1️⃣ Testing y Documentación

- JSDoc en componentes
- Unit tests obligatorios
- Ejemplos de uso

### 1️⃣2️⃣ Error Boundaries & Fallbacks

- ErrorBoundary en secciones críticas
- Loading states
- Error states

### 1️⃣3️⃣ Predictable Naming & Folder Structure

- Nombres descriptivos
- Estructura consistente
- Fácil de navegar

### 1️⃣4️⃣ Design-System Thinking

- Tokens de diseño
- Componentes reutilizables
- Consistencia visual

### 1️⃣5️⃣ Clean Imports y Dependencias

- Imports organizados
- Dependencias mínimas
- No circular dependencies

---

## 🚨 EJEMPLOS - LO QUE NO HACER

### ❌ ANTI-PATTERN: Archivo Monolítico

```tsx
// ❌ pages/dashboard/index.tsx - 1710 LÍNEAS
export default function DashboardPage() {
  // 50+ líneas de state
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ... 48 more states

  // 100+ líneas de handlers
  const handleThis = () => {
    /* ... */
  };
  const handleThat = () => {
    /* ... */
  };
  // ... 98 more handlers

  // 1500+ líneas de JSX
  return (
    <div>
      {/* Hero banner - 50 lines */}
      {/* Favorites - 200 lines */}
      {/* Charts - 300 lines */}
      {/* Crypto - 400 lines */}
      {/* FRED - 300 lines */}
      {/* ECB - 250 lines */}
      {/* Dolar - 200 lines */}
    </div>
  );
}
```

**Problemas:**

1. ❌ Imposible de mantener
2. ❌ Imposible de testear
3. ❌ No reutilizable
4. ❌ Difícil de entender
5. ❌ Merge conflicts constantes
6. ❌ Viola TODOS los principios

---

## ✅ PATTERN CORRECTO: Composición

```tsx
// ✅ pages/dashboard/index.tsx - 100 LÍNEAS
export default function DashboardPage() {
  const data = useDashboardData();
  const favorites = useFavorites();

  return (
    <DashboardLayout>
      <HeroBanner />
      <FavoritesSection {...favorites} />
      <FavoriteChartsSection {...favorites.charts} />
      <InflationSection data={data.inflation} />
      <InternationalRatesSection data={data.rates} />
      <CryptoSection data={data.crypto} />
      <FredSection data={data.fred} />
      <ECBSection data={data.ecb} />
      <DolarSection data={data.dolar} />
      <Toast {...toast} />
    </DashboardLayout>
  );
}

// ✅ components/dashboard/CryptoSection.tsx - 120 LÍNEAS
export function CryptoSection({ data }: CryptoSectionProps) {
  const [page, setPage] = useState(1);

  if (data.isLoading) {
    return <CryptoSkeleton />;
  }

  if (data.error) {
    return <ErrorState error={data.error} />;
  }

  return (
    <Card>
      <Card.Header>
        <CryptoHeader />
      </Card.Header>
      <Card.Content>
        <CryptoTable cryptos={data.cryptos} />
        <CryptoPagination page={page} onPageChange={setPage} />
      </Card.Content>
    </Card>
  );
}

// ✅ hooks/useDashboardData.ts - 80 LÍNEAS
export function useDashboardData() {
  const dolares = useDolarVariations();
  const cotizaciones = useCotizaciones();
  const cryptos = useCryptoQuery();
  const fred = useFredData();
  const ecb = useECBData();
  const inflation = useInflacion();

  return {
    dolares,
    cotizaciones,
    cryptos,
    fred,
    ecb,
    inflation,
  };
}
```

**Ventajas:**

1. ✅ Fácil de mantener
2. ✅ Fácil de testear
3. ✅ Reutilizable
4. ✅ Fácil de entender
5. ✅ No merge conflicts
6. ✅ Sigue TODOS los principios

---

## 📋 CHECKLIST ANTES DE COMMIT

Antes de hacer commit, verificar:

- [ ] **Tamaño de archivo**: ¿Menos de 200 líneas?
- [ ] **Single Responsibility**: ¿Una sola responsabilidad?
- [ ] **TypeScript**: ¿Todas las props tienen types?
- [ ] **No duplicación**: ¿Código único?
- [ ] **Error handling**: ¿Maneja errores?
- [ ] **Loading states**: ¿Muestra loading?
- [ ] **Accesibilidad**: ¿Semantic HTML + ARIA?
- [ ] **Performance**: ¿Usa memo cuando necesario?
- [ ] **Imports limpios**: ¿Organizados?
- [ ] **Documentación**: ¿JSDoc en funciones complejas?

---

## 🎯 ACCIÓN INMEDIATA REQUERIDA

### Archivo a Refactorizar: `pages/dashboard/index.tsx`

**Estado Actual**: 1710 líneas 💩
**Estado Objetivo**: 100 líneas ✨

**Plan de Acción**:

1. Extraer HeroBanner → `components/dashboard/HeroBanner.tsx` (60 líneas)
2. Extraer FavoritesSection → `components/dashboard/FavoritesSection.tsx` (120 líneas)
3. Extraer FavoriteChartsSection → `components/dashboard/FavoriteChartsSection.tsx` (150 líneas)
4. Extraer InflationSection → `components/dashboard/InflationSection.tsx` (100 líneas)
5. Extraer CryptoSection → `components/dashboard/CryptoSection.tsx` (150 líneas)
6. Extraer FredSection → `components/dashboard/FredSection.tsx` (200 líneas)
7. Extraer ECBSection → `components/dashboard/ECBSection.tsx` (200 líneas)
8. Extraer DolarSection → `components/dashboard/DolarSection.tsx` (100 líneas)
9. Crear useDashboardData → `hooks/useDashboardData.ts` (80 líneas)
10. Crear useFavorites → `hooks/useFavorites.ts` (60 líneas)

**Resultado**: 15 archivos × 100 líneas promedio = Mantenible ✅

---

## ⚠️ REGLA DE ORO

> **Si el archivo tiene más de 200 líneas, PARALO y refactorizalo INMEDIATAMENTE.**
>
> **No hay excepciones. NUNCA.**

---

## 📚 Referencias

- [React Beta Docs - Thinking in React](https://react.dev/learn/thinking-in-react)
- [Kent C. Dodds - AHA Programming](https://kentcdodds.com/blog/aha-programming)
- [Dan Abramov - Writing Resilient Components](https://overreacted.io/writing-resilient-components/)
- [Patterns.dev - React Patterns](https://www.patterns.dev/)
