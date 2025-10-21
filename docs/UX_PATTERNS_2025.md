# 🎯 UX PATTERNS 2025 - DÓLAR GAUCHO

**Fecha**: Enero 2025
**Versión**: 2.0
**Autor**: Claude Code + Tomas Maritano

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Navigation Patterns](#navigation-patterns)
3. [Data Display Patterns](#data-display-patterns)
4. [Form Patterns](#form-patterns)
5. [Feedback Patterns](#feedback-patterns)
6. [Loading Patterns](#loading-patterns)
7. [Empty States](#empty-states)
8. [Error Handling](#error-handling)
9. [Onboarding & First-Use](#onboarding--first-use)
10. [Data Visualization](#data-visualization)
11. [Search & Filtering](#search--filtering)
12. [Mobile UX Patterns](#mobile-ux-patterns)

---

## 1. RESUMEN EJECUTIVO

### 🎯 Objetivo

Documentar patrones de UX consistentes para:

- **Reducir decisiones de diseño**: Patrones predefinidos
- **Acelerar desarrollo**: Copiar-pegar soluciones probadas
- **Mejorar consistencia**: Misma experiencia en todas las páginas
- **Facilitar onboarding**: Nuevos desarrolladores aprenden rápido

### 📊 Estado Actual (Enero 2025)

**Fortalezas**:

- ✅ TanStack Query con optimistic updates
- ✅ Dark mode implementado
- ✅ Responsive design en todas las páginas
- ✅ Animaciones con Framer Motion
- ✅ Sistema de favoritos con localStorage

**Debilidades**:

- ❌ 7 inconsistencias visuales identificadas
- ❌ Sin onboarding para nuevos usuarios
- ❌ Errores genéricos sin guidance
- ❌ 2 rutas duplicadas de autenticación
- ❌ Paginación inconsistente (2 estilos)
- ❌ Breadcrumbs solo en 3/14 páginas

### 🎨 Filosofía UX

1. **Claridad sobre creatividad**: Información primero, efectos después
2. **Feedback inmediato**: Usuario siempre sabe qué está pasando
3. **Errores útiles**: Guiar hacia la solución
4. **Progressive disclosure**: Información en capas
5. **Mobile-first**: Diseñar para el caso más restrictivo

---

## 2. NAVIGATION PATTERNS

### 🧭 Top-Level Navigation

#### NavbarFloating (Marketing)

**Archivo**: `components/NavbarFloating.tsx`

**Estructura**:

```
[Logo] ───────────────────── [Changelog] [Roadmap] [Theme] [Login]
```

**Características**:

- Fixed top con padding (top-4 left-4 right-4)
- Glass morphism (backdrop-blur-xl)
- Max-width: 7xl (1280px)
- Auto-hide en scroll? NO (siempre visible)

**Uso**:

```tsx
import { NavbarFloating } from '@/components/NavbarFloating';

// En páginas de marketing
export default function MarketingPage() {
  return (
    <>
      <NavbarFloating />
      {/* content */}
    </>
  );
}
```

#### DashboardSidebar (App)

**Archivo**: `components/DashboardSidebar.tsx`

**Estructura**:

```
┌─────────────┐
│ Logo        │
│             │
│ Dashboard   │
│ Alertas     │
│ Favoritos   │
│ Calculadoras│
│ Calendario  │
│ ...         │
│             │
│ [User]      │
│ Logout      │
└─────────────┘
```

**Estados**:

- Desktop: Sidebar fijo (280px width)
- Mobile: Drawer con overlay
- Active link: `bg-brand/10 border-l-2 border-brand`

### 🍞 Breadcrumbs

**Estado Actual**: Solo 3/14 páginas tienen breadcrumbs

**Patrón Estándar**:

```tsx
<nav className="flex items-center gap-2 text-sm mb-6">
  <Link href="/dashboard" className="text-secondary hover:text-brand transition-colors">
    Dashboard
  </Link>
  <FaChevronRight className="text-secondary text-xs" />
  <Link href="/dashboard/alerts" className="text-secondary hover:text-brand transition-colors">
    Alertas
  </Link>
  <FaChevronRight className="text-secondary text-xs" />
  <span className="text-foreground font-semibold">Nueva Alerta</span>
</nav>
```

**Páginas que necesitan breadcrumbs**:

1. `/dashboard/alerts` → Dashboard / Alertas
2. `/dashboard/alerts/new` → Dashboard / Alertas / Nueva
3. `/dashboard/favorites` → Dashboard / Favoritos
4. `/dashboard/calculators` → Dashboard / Calculadoras
5. `/dashboard/calculators/plazo-fijo` → Dashboard / Calculadoras / Plazo Fijo
6. `/dashboard/profile` → Dashboard / Perfil
7. Todas las demás páginas de dashboard

### 📑 Tabs Navigation

**Problema Actual**: 2 implementaciones diferentes

#### Patrón Estándar (Recomendado)

```tsx
<div className="border-b border-white/10 mb-8">
  <nav className="flex gap-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          pb-3 px-1 border-b-2 transition-colors font-semibold text-sm
          ${
            activeTab === tab.id
              ? 'border-brand text-brand'
              : 'border-transparent text-secondary hover:text-foreground'
          }
        `}
      >
        {tab.label}
      </button>
    ))}
  </nav>
</div>
```

**Ejemplos de Uso**:

- Calculadoras (cambiar entre plazo fijo, UVA, etc.)
- Dashboard (cambiar entre dólares, crypto, etc.)
- Perfil (datos personales, seguridad, etc.)

---

## 3. DATA DISPLAY PATTERNS

### 📊 Stats Cards

**Problema Actual**: Tamaños y estilos variables

#### Patrón Estándar - KPI Card

```tsx
<Card className="bg-gradient-to-br from-brand/10 to-brand/5 border-brand/20">
  <div className="flex items-center justify-between mb-2">
    <Icon className="text-brand text-2xl" />
    <span className="text-3xl font-black text-foreground">{value}</span>
  </div>

  <p className="text-sm font-semibold text-foreground mb-1">{title}</p>

  {/* Change indicator */}
  <div className="flex items-center gap-1 text-sm">
    <TrendIcon className="text-success" />
    <span className="text-success font-semibold">+{change}%</span>
    <span className="text-secondary">{period}</span>
  </div>
</Card>
```

**Componente Propuesto**: `<StatsCard>`

```tsx
<StatsCard
  title="Total Alertas"
  value={42}
  icon={FaBell}
  change={{ value: 12, period: 'vs mes anterior' }}
  trend="up"
  variant="brand"
/>
```

### 💰 Cotizaciones Display

**Patrón de Cards**:

```tsx
<Card>
  <Card.Header>
    <div className="flex items-center gap-3">
      <div className="p-3 bg-brand/10 rounded-lg">
        <FaDollarSign className="text-brand text-xl" />
      </div>
      <div>
        <Card.Title>Dólar Blue</Card.Title>
        <p className="text-xs text-secondary">Actualizado hace 2 min</p>
      </div>
    </div>
  </Card.Header>

  <Card.Content>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black font-mono">$1.250</span>
      <span className="text-success text-sm font-semibold">+2.5%</span>
    </div>

    {/* Sparkline chart */}
    <div className="mt-4 h-20">
      <CryptoSparkline data={historico} />
    </div>
  </Card.Content>

  <Card.Footer>
    <div className="flex items-center justify-between text-sm">
      <span className="text-secondary">Compra: $1.240</span>
      <span className="text-secondary">Venta: $1.260</span>
    </div>
  </Card.Footer>
</Card>
```

### 📈 Tables

**Patrón Estándar**:

```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-white/10">
        <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
          Nombre
        </th>
        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
          Precio
        </th>
        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
          Variación
        </th>
      </tr>
    </thead>

    <tbody>
      {data.map((row, i) => (
        <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <Icon className="text-brand" />
              <span className="font-semibold text-foreground">{row.name}</span>
            </div>
          </td>

          <td className="py-3 px-4 text-right">
            <span className="font-mono font-semibold text-foreground">${row.price}</span>
          </td>

          <td className="py-3 px-4 text-right">
            <span className={`font-semibold ${row.change >= 0 ? 'text-success' : 'text-error'}`}>
              {row.change >= 0 ? '+' : ''}
              {row.change}%
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 🔢 Pagination

**Problema Actual**: 2 estilos diferentes

#### Patrón Estándar

```tsx
<div className="flex items-center justify-between mt-6">
  {/* Info */}
  <p className="text-sm text-secondary">
    Mostrando{' '}
    <span className="font-semibold text-foreground">
      {start}-{end}
    </span>{' '}
    de <span className="font-semibold text-foreground">{total}</span>
  </p>

  {/* Controls */}
  <div className="flex items-center gap-2">
    <Button variant="secondary" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
      <FaChevronLeft />
    </Button>

    {/* Page numbers */}
    <div className="flex items-center gap-1">
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => setPage(num)}
          className={`
            w-8 h-8 rounded-lg text-sm font-semibold transition-all
            ${
              page === num
                ? 'bg-brand text-white'
                : 'text-secondary hover:bg-white/5 hover:text-foreground'
            }
          `}
        >
          {num}
        </button>
      ))}
    </div>

    <Button
      variant="secondary"
      size="sm"
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
    >
      <FaChevronRight />
    </Button>
  </div>
</div>
```

---

## 4. FORM PATTERNS

### 📝 Form Layout

**Patrón Estándar**:

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Form header */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-foreground mb-2">{formTitle}</h2>
    <p className="text-secondary">{formDescription}</p>
  </div>

  {/* Form fields */}
  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
    helper="Te enviaremos un código de verificación"
    required
  />

  {/* Actions */}
  <div className="flex gap-3 pt-4">
    <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
      Cancelar
    </Button>
    <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
      {isSubmitting ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Guardando...
        </>
      ) : (
        'Guardar'
      )}
    </Button>
  </div>
</form>
```

### ✅ Input Validation

**Patrón de Validación en Tiempo Real**:

```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value: string) => {
  if (!value) {
    return 'El email es requerido';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Email inválido';
  }
  return '';
};

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEmail(value);
  setEmailError(validateEmail(value));
};

<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleEmailChange}
  error={emailError}
  aria-invalid={!!emailError}
/>;
```

### 🎯 Form Sections

**Pattern para forms largos**:

```tsx
<form className="space-y-8">
  {/* Section 1 */}
  <div>
    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-white/10">
      Información Personal
    </h3>
    <div className="space-y-4">
      <Input label="Nombre" {...} />
      <Input label="Email" {...} />
    </div>
  </div>

  {/* Section 2 */}
  <div>
    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-white/10">
      Seguridad
    </h3>
    <div className="space-y-4">
      <Input label="Contraseña actual" type="password" {...} />
      <Input label="Nueva contraseña" type="password" {...} />
    </div>
  </div>
</form>
```

### 🔒 Password Input

**Pattern con visibility toggle**:

```tsx
const [showPassword, setShowPassword] = useState(false);

<div className="relative">
  <Input
    label="Contraseña"
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-9 text-secondary hover:text-foreground transition-colors"
    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>;
```

---

## 5. FEEDBACK PATTERNS

### 🎉 Success Feedback

#### Toast (Preferred)

```tsx
import { showToast } from '@/lib/toast';

showToast({
  type: 'success',
  message: 'Alerta creada correctamente',
  duration: 3000,
});
```

#### Inline Success

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex items-center gap-2 p-4 bg-success/10 border border-success/30 rounded-lg"
>
  <FaCheckCircle className="text-success text-lg" />
  <div>
    <p className="font-semibold text-success">¡Guardado correctamente!</p>
    <p className="text-sm text-secondary mt-0.5">Tus cambios han sido aplicados</p>
  </div>
</motion.div>
```

#### Optimistic Updates

```tsx
const { mutate } = useMutation({
  mutationFn: createAlert,
  onMutate: async (newAlert) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['alerts'] });

    // Snapshot previous value
    const previousAlerts = queryClient.getQueryData(['alerts']);

    // Optimistically update
    queryClient.setQueryData(['alerts'], (old) => [...old, newAlert]);

    return { previousAlerts };
  },
  onError: (err, newAlert, context) => {
    // Rollback on error
    queryClient.setQueryData(['alerts'], context.previousAlerts);
  },
  onSuccess: () => {
    showToast({ type: 'success', message: 'Alerta creada' });
  },
});
```

### ❌ Error Feedback

#### Error Toast

```tsx
showToast({
  type: 'error',
  message: 'Error al guardar los cambios',
  duration: 5000,
});
```

#### Inline Error

```tsx
<div className="flex items-start gap-3 p-4 bg-error/10 border border-error/30 rounded-lg">
  <FaExclamationCircle className="text-error text-lg mt-0.5" />
  <div className="flex-1">
    <p className="font-semibold text-error mb-1">Error al procesar la solicitud</p>
    <p className="text-sm text-secondary">{errorMessage}</p>
    {canRetry && (
      <Button variant="outline" size="sm" onClick={handleRetry} className="mt-3">
        Reintentar
      </Button>
    )}
  </div>
</div>
```

#### Form Field Error

```tsx
<Input
  label="Email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
```

### ⚠️ Warning Feedback

```tsx
<div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
  <FaExclamationTriangle className="text-warning text-lg mt-0.5" />
  <div>
    <p className="font-semibold text-warning mb-1">Atención</p>
    <p className="text-sm text-secondary">Esta acción no se puede deshacer</p>
  </div>
</div>
```

### ℹ️ Info Feedback

```tsx
<div className="flex items-start gap-3 p-4 bg-info/10 border border-info/30 rounded-lg">
  <FaInfoCircle className="text-info text-lg mt-0.5" />
  <div>
    <p className="font-semibold text-info mb-1">Información</p>
    <p className="text-sm text-secondary">Los datos se actualizan cada 5 minutos</p>
  </div>
</div>
```

---

## 6. LOADING PATTERNS

### ⏳ Initial Page Load

**Full-page Skeleton**:

```tsx
export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="h-12 bg-white/10 rounded-lg w-1/3" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/10 rounded-xl" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        <div className="h-12 bg-white/10 rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-white/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

### 🔄 Data Refetch

**Subtle indicator**:

```tsx
const { data, isRefetching } = useQuery({
  queryKey: ['cotizaciones'],
  queryFn: fetchCotizaciones,
  refetchInterval: 60000, // 1 min
});

<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Cotizaciones</h2>

  {isRefetching && (
    <div className="flex items-center gap-2 text-sm text-secondary">
      <FaSpinner className="animate-spin" />
      <span>Actualizando...</span>
    </div>
  )}
</div>;
```

### 📊 Lazy Loading (Infinite Scroll)

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['alerts'],
  queryFn: ({ pageParam = 0 }) => fetchAlerts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Intersection Observer para trigger
const observerTarget = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 1 }
  );

  if (observerTarget.current) {
    observer.observe(observerTarget.current);
  }

  return () => observer.disconnect();
}, [fetchNextPage, hasNextPage]);

return (
  <>
    {data.pages.map((page) => (
      <div key={page.id}>
        {page.items.map((item) => (
          <AlertCard key={item.id} {...item} />
        ))}
      </div>
    ))}

    {/* Observer target */}
    <div ref={observerTarget} className="h-10" />

    {isFetchingNextPage && (
      <div className="flex justify-center py-8">
        <FaSpinner className="animate-spin text-brand text-2xl" />
      </div>
    )}
  </>
);
```

### 🎯 Button Loading States

```tsx
<Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? (
    <>
      <FaSpinner className="animate-spin mr-2" />
      Guardando...
    </>
  ) : (
    <>
      <FaSave className="mr-2" />
      Guardar
    </>
  )}
</Button>
```

---

## 7. EMPTY STATES

### 📭 No Data

**Problema Actual**: Tamaños de iconos variables

#### Patrón Estándar

```tsx
<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
  {/* Icon */}
  <div className="p-8 bg-brand/10 rounded-2xl mb-6">
    <Icon className="text-brand text-5xl" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

  {/* Description */}
  <p className="text-secondary max-w-md mb-8 leading-relaxed">{description}</p>

  {/* Action */}
  <Button variant="primary" size="lg" onClick={onAction}>
    <FaPlus className="mr-2" />
    {actionLabel}
  </Button>
</div>
```

#### Ejemplos por Contexto

**No Alerts**:

```tsx
<EmptyState
  icon={FaBell}
  title="No tienes alertas"
  description="Crea tu primera alerta para recibir notificaciones cuando las cotizaciones alcancen tu objetivo"
  actionLabel="Crear Primera Alerta"
  onAction={() => router.push('/dashboard/alerts/new')}
/>
```

**No Favorites**:

```tsx
<EmptyState
  icon={FaStar}
  title="No tienes favoritos"
  description="Guarda tus cotizaciones favoritas para acceder rápidamente desde el dashboard"
  actionLabel="Explorar Cotizaciones"
  onAction={() => router.push('/dashboard')}
/>
```

**Search No Results**:

```tsx
<EmptyState
  icon={FaSearch}
  title="Sin resultados"
  description={`No encontramos resultados para "${searchQuery}". Intenta con otros términos.`}
  actionLabel="Limpiar búsqueda"
  onAction={() => setSearchQuery('')}
/>
```

### 🚀 First Use Experience

**Onboarding Cards**:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  {ONBOARDING_STEPS.map((step, i) => (
    <Card key={i} className="text-center">
      <Card.Content className="pt-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/10 rounded-full mb-4">
          <span className="text-brand font-black text-lg">{i + 1}</span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>

        <p className="text-sm text-secondary leading-relaxed">{step.description}</p>
      </Card.Content>
    </Card>
  ))}
</div>
```

---

## 8. ERROR HANDLING

### 🚨 Error Boundaries

**Global Error Boundary**:

```tsx
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to Sentry in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="text-center max-w-md">
            <div className="p-8 bg-error/10 rounded-2xl mb-6 inline-block">
              <FaExclamationCircle className="text-error text-6xl" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">Algo salió mal</h1>

            <p className="text-secondary mb-8">
              Ocurrió un error inesperado. Por favor recarga la página o contacta a soporte.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Recargar Página
              </Button>
              <LinkButton variant="primary" href="/dashboard">
                Ir al Dashboard
              </LinkButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 🔌 Network Errors

**Offline Detection**:

```tsx
const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  setIsOnline(navigator.onLine);

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

{
  !isOnline && (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-warning/10 border border-warning/30 rounded-lg p-4 shadow-xl z-50">
      <div className="flex items-center gap-3">
        <FaWifi className="text-warning text-xl" />
        <div>
          <p className="font-semibold text-warning">Sin conexión</p>
          <p className="text-sm text-secondary">Verifica tu conexión a internet</p>
        </div>
      </div>
    </div>
  );
}
```

### 🔄 Retry Pattern

```tsx
const { data, error, refetch, isError } = useQuery({
  queryKey: ['cotizaciones'],
  queryFn: fetchCotizaciones,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

{
  isError && (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="p-6 bg-error/10 rounded-2xl mb-4">
        <FaExclamationCircle className="text-error text-4xl" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">Error al cargar datos</h3>

      <p className="text-secondary mb-6 text-center max-w-md">
        {error.message || 'No pudimos cargar la información. Por favor intenta nuevamente.'}
      </p>

      <Button variant="primary" onClick={() => refetch()}>
        <FaRedo className="mr-2" />
        Reintentar
      </Button>
    </div>
  );
}
```

### ⚠️ Validation Errors

**Server-side validation errors**:

```tsx
const handleSubmit = async (data) => {
  try {
    await createAlert(data);
  } catch (error) {
    if (error.response?.data?.errors) {
      // Server returned field-specific errors
      Object.entries(error.response.data.errors).forEach(([field, message]) => {
        setError(field, { message });
      });
    } else {
      // Generic error
      showToast({
        type: 'error',
        message: error.message || 'Error al guardar',
      });
    }
  }
};
```

---

## 9. ONBOARDING & FIRST-USE

### 🎯 Current State: NO ONBOARDING

**Problema**: Usuario nuevo llega al dashboard vacío sin guidance

### 🚀 Propuesta: Onboarding Flow

#### Step 1: Welcome Modal

```tsx
<Modal isOpen={isFirstVisit} onClose={handleSkip}>
  <div className="text-center py-8 px-6">
    <div className="mb-6">
      <AnimatedLogo size={64} />
    </div>

    <h2 className="text-3xl font-bold text-foreground mb-4">¡Bienvenido a Dólar Gaucho! 🚀</h2>

    <p className="text-secondary max-w-md mx-auto mb-8">
      Tu plataforma completa para seguir cotizaciones, crear alertas y tomar decisiones financieras
      inteligentes
    </p>

    <div className="space-y-4 mb-8">
      {FEATURES.map((feature, i) => (
        <div key={i} className="flex items-center gap-3 text-left">
          <div className="p-2 bg-brand/10 rounded-lg shrink-0">
            <feature.icon className="text-brand" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{feature.title}</p>
            <p className="text-sm text-secondary">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>

    <Button variant="primary" size="lg" onClick={handleStart}>
      Comenzar Tour
    </Button>
  </div>
</Modal>
```

#### Step 2: Interactive Tour (Joyride)

```tsx
import Joyride from 'react-joyride';

const TOUR_STEPS = [
  {
    target: '[data-tour="dashboard"]',
    content: 'Aquí ves todas las cotizaciones en tiempo real',
  },
  {
    target: '[data-tour="favorites"]',
    content: 'Marca tus cotizaciones favoritas para acceso rápido',
  },
  {
    target: '[data-tour="alerts"]',
    content: 'Crea alertas personalizadas para recibir notificaciones',
  },
  {
    target: '[data-tour="calculators"]',
    content: 'Usa nuestras calculadoras financieras',
  },
];

<Joyride
  steps={TOUR_STEPS}
  run={showTour}
  continuous
  showProgress
  showSkipButton
  styles={{
    options: {
      primaryColor: '#0047FF',
      zIndex: 1000,
    },
  }}
/>;
```

#### Step 3: Empty State Prompts

```tsx
{
  alerts.length === 0 && !hasCompletedOnboarding && (
    <Card className="bg-gradient-to-br from-brand/10 to-brand/5 border-brand/20">
      <Card.Content className="py-8 text-center">
        <div className="p-6 bg-brand/10 rounded-2xl inline-block mb-4">
          <FaBell className="text-brand text-4xl" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          ¿Sabías que puedes crear alertas?
        </h3>

        <p className="text-secondary max-w-md mx-auto mb-6">
          Recibe notificaciones cuando el dólar llegue al precio que definiste
        </p>

        <Button variant="primary" onClick={() => router.push('/dashboard/alerts/new')}>
          Crear mi primera alerta
        </Button>
      </Card.Content>
    </Card>
  );
}
```

### 📝 Onboarding Checklist

**Track user progress**:

```tsx
interface OnboardingProgress {
  welcomeModalSeen: boolean;
  tourCompleted: boolean;
  firstAlertCreated: boolean;
  firstFavoriteAdded: boolean;
  calculatorUsed: boolean;
}

// Store in localStorage or database
const [progress, setProgress] = useLocalStorage<OnboardingProgress>('onboarding', {
  welcomeModalSeen: false,
  tourCompleted: false,
  firstAlertCreated: false,
  firstFavoriteAdded: false,
  calculatorUsed: false,
});

// Progress bar
<div className="mb-8">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-semibold text-foreground">Configuración de tu cuenta</span>
    <span className="text-sm text-secondary">{completedSteps}/5</span>
  </div>

  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500"
      style={{ width: `${(completedSteps / 5) * 100}%` }}
    />
  </div>
</div>;
```

---

## 10. DATA VISUALIZATION

### 📈 Charts

**Sparklines** (Inline charts):

```tsx
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';

<div className="h-16">
  <CryptoSparkline data={historico} color="#0047FF" showTooltip={false} />
</div>;
```

**Full Charts**:

```tsx
import { Line } from 'react-chartjs-2';

<Card>
  <Card.Header>
    <Card.Title>Evolución - Últimos 30 días</Card.Title>
  </Card.Header>

  <Card.Content>
    <div className="h-64">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleColor: '#F1F5F9',
              bodyColor: '#94A3B8',
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94A3B8' },
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94A3B8' },
            },
          },
        }}
      />
    </div>
  </Card.Content>
</Card>;
```

### 📊 Trend Indicators

```tsx
interface TrendIndicatorProps {
  value: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
}

function TrendIndicator({ value, period, size = 'md' }: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const Icon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <div
      className={`flex items-center gap-1 ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}
    >
      <Icon className={isPositive ? 'text-success' : 'text-error'} />
      <span className={`font-semibold ${isPositive ? 'text-success' : 'text-error'}`}>
        {isPositive ? '+' : ''}
        {value.toFixed(2)}%
      </span>
      {period && <span className="text-secondary">{period}</span>}
    </div>
  );
}

// Uso
<TrendIndicator value={2.5} period="vs ayer" size="sm" />;
```

### 🎨 Color Coding

**Positive/Negative valores**:

```tsx
const getValueColor = (value: number) => {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-error';
  return 'text-secondary';
};

<span className={`font-semibold ${getValueColor(change)}`}>
  {change >= 0 ? '+' : ''}
  {change}%
</span>;
```

---

## 11. SEARCH & FILTERING

### 🔍 Search Pattern

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery] = useDebounce(searchQuery, 300);

const { data: results } = useQuery({
  queryKey: ['search', debouncedQuery],
  queryFn: () => searchCotizaciones(debouncedQuery),
  enabled: debouncedQuery.length >= 2,
});

<div className="relative">
  <Input
    placeholder="Buscar cotización..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    icon={<FaSearch />}
  />

  {/* Search results dropdown */}
  {searchQuery.length >= 2 && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-panel border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
      {results?.length > 0 ? (
        results.map((result) => (
          <button
            key={result.id}
            onClick={() => handleSelect(result)}
            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
          >
            <p className="font-semibold text-foreground">{result.name}</p>
            <p className="text-sm text-secondary">{result.description}</p>
          </button>
        ))
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-secondary">Sin resultados</p>
        </div>
      )}
    </div>
  )}
</div>;
```

### 🎛️ Filters Pattern

```tsx
const [filters, setFilters] = useState({
  category: 'all',
  sortBy: 'name',
  order: 'asc',
});

<div className="flex flex-col md:flex-row gap-4 mb-6">
  {/* Category Filter */}
  <select
    value={filters.category}
    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
    className="px-4 py-2 bg-panel border border-white/10 rounded-lg text-foreground focus:border-brand/50 focus:outline-none"
  >
    <option value="all">Todas las categorías</option>
    <option value="dolares">Dólares</option>
    <option value="crypto">Crypto</option>
    <option value="bonos">Bonos</option>
  </select>

  {/* Sort */}
  <select
    value={filters.sortBy}
    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
    className="px-4 py-2 bg-panel border border-white/10 rounded-lg text-foreground focus:border-brand/50 focus:outline-none"
  >
    <option value="name">Nombre</option>
    <option value="price">Precio</option>
    <option value="change">Variación</option>
  </select>

  {/* Order */}
  <button
    onClick={() => setFilters({ ...filters, order: filters.order === 'asc' ? 'desc' : 'asc' })}
    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
  >
    {filters.order === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
  </button>
</div>;
```

---

## 12. MOBILE UX PATTERNS

### 📱 Bottom Sheet (Mobile Modals)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-panel rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3 border-b border-white/10">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </motion.div>
    </>
  )}
</AnimatePresence>;
```

### 👆 Touch-Friendly Targets

**Minimum touch target: 44x44px**

```tsx
// ❌ Too small
<button className="p-1">
  <FaIcon />
</button>

// ✅ Touch-friendly
<button className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
  <FaIcon />
</button>
```

### 🍔 Mobile Navigation

**Hamburger Menu**:

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

{
  /* Mobile menu button */
}
<button
  onClick={() => setIsMobileMenuOpen(true)}
  className="md:hidden p-3 hover:bg-white/5 rounded-lg transition-all"
  aria-label="Abrir menú"
>
  <FaBars className="text-foreground text-xl" />
</button>;

{
  /* Mobile drawer */
}
<AnimatePresence>
  {isMobileMenuOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-panel shadow-2xl z-50 md:hidden overflow-y-auto"
      >
        <DashboardSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </motion.div>
    </>
  )}
</AnimatePresence>;
```

### 📲 Pull-to-Refresh

```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

const y = useMotionValue(0);
const pullProgress = useTransform(y, [0, 100], [0, 1]);

const handleDragEnd = (_, info) => {
  if (info.offset.y > 100) {
    refetch();
  }
  y.set(0);
};

<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 100 }}
  dragElastic={0.5}
  onDragEnd={handleDragEnd}
  style={{ y }}
>
  {/* Content */}
</motion.div>;
```

---

## 📚 QUICK REFERENCE

### ✅ Checklist de Implementación

Cuando crees un nuevo feature o página, verifica:

- [ ] **Navigation**: Breadcrumbs agregados
- [ ] **Loading**: Skeleton o spinner implementado
- [ ] **Empty State**: Mensaje y acción clara
- [ ] **Error Handling**: Manejo de errores con retry
- [ ] **Success Feedback**: Toast o mensaje de confirmación
- [ ] **Mobile**: Responsive design verificado
- [ ] **Accessibility**: ARIA labels, keyboard navigation
- [ ] **Dark Mode**: Colores usando variables CSS
- [ ] **Animations**: Framer Motion para transiciones
- [ ] **TypeScript**: Tipos completos sin `any`

---

**Última actualización**: Enero 2025
**Versión**: 2.0
