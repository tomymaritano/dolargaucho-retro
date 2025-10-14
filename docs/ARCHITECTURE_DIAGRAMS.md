# 🏗️ DolarGaucho - Diagramas de Arquitectura

## 📊 Flujo Completo de Datos

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USUARIO                                      │
│                     (Abre /dashboard)                                 │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                                     │
│  1. Server-Side Rendering (SSR)                                      │
│  2. Genera HTML inicial                                              │
│  3. Envía al browser                                                 │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    REACT (Client Side)                                │
│  1. Hidrata el HTML                                                  │
│  2. Monta componentes                                                │
│  3. Ejecuta useEffect y hooks                                        │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    TANSTACK QUERY (React Query)                       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  useDolarQuery() se ejecuta                         │            │
│  │  queryKey: ['dolar']                                │            │
│  │  queryFn: fetchDolar                                │            │
│  └─────────────────────┬───────────────────────────────┘            │
│                        │                                             │
│                        ▼                                             │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  ¿Hay datos en cache?                               │            │
│  │                                                      │            │
│  │  SÍ → ¿Son frescos (< 30s)?                         │            │
│  │       ├─ SÍ → Devolver del cache                    │            │
│  │       └─ NO → Fetch en background + devolver cache  │            │
│  │                                                      │            │
│  │  NO → Fetch inmediato                               │            │
│  └─────────────────────┬───────────────────────────────┘            │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL APIs                                      │
│                                                                       │
│  ┌──────────────────────────────────────────────────┐               │
│  │  fetch('https://dolarapi.com/v1/dolares')        │               │
│  │  ↓                                                │               │
│  │  Response: [                                      │               │
│  │    { casa: "blue", venta: 1170, ... },           │               │
│  │    { casa: "oficial", venta: 900, ... },         │               │
│  │    ...                                            │               │
│  │  ]                                                │               │
│  └─────────────────────┬────────────────────────────┘               │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    TANSTACK QUERY (Cache)                             │
│                                                                       │
│  ┌──────────────────────────────────────────────────┐               │
│  │  Guarda en cache con:                            │               │
│  │  - queryKey: ['dolar']                           │               │
│  │  - data: [...]                                   │               │
│  │  - timestamp: Date.now()                         │               │
│  │  - staleTime: 30000ms                            │               │
│  └─────────────────────┬────────────────────────────┘               │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENT RE-RENDER                          │
│                                                                       │
│  const { data: dolares } = useDolarQuery();                          │
│  // dolares ahora tiene los datos                                   │
│                                                                       │
│  return (                                                            │
│    <div>                                                             │
│      {dolares.map(dolar => (                                         │
│        <DolarCard key={dolar.casa} dolar={dolar} />                 │
│      ))}                                                             │
│    </div>                                                            │
│  )                                                                   │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORES (Estado Global)                     │
│                                                                       │
│  ┌──────────────────────────────────────────────────┐               │
│  │  useFavoritesStore()                             │               │
│  │  ↓                                                │               │
│  │  ¿Este dólar está en favoritos?                  │               │
│  │  ├─ SÍ → Mostrar con estrella amarilla           │               │
│  │  └─ NO → Mostrar con estrella gris               │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                       │
│  ┌──────────────────────────────────────────────────┐               │
│  │  useAlertasStore()                               │               │
│  │  ↓                                                │               │
│  │  ¿Hay alerta para este dólar?                    │               │
│  │  ├─ SÍ → Chequear si se cumple condición         │               │
│  │  │        ├─ SÍ → Disparar notificación          │               │
│  │  │        └─ NO → No hacer nada                  │               │
│  │  └─ NO → No hacer nada                           │               │
│  └──────────────────────────────────────────────────┘               │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BROWSER (Final Render)                             │
│                                                                       │
│  Usuario ve:                                                         │
│  ┌────────────────────────────────────────────────────────┐         │
│  │  💵 Dólar Blue        ⭐ (favorito)                     │         │
│  │  Venta: $1.170,00    ▲ +2,5%                          │         │
│  │  🔔 Alerta: Activa                                     │         │
│  └────────────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ (Cada 30 segundos)
                                 │
                                 ▼
                    [Refetch automático en background]
                                 │
                                 └─────────┐
                                           │
                           (Volver a fetch desde APIs)
```

---

## 🔄 Ciclo de Vida de React Query

```
INICIO
  │
  ▼
┌─────────────────────────────────────────────┐
│  useQuery se ejecuta por primera vez        │
│  queryKey: ['dolar']                        │
│  status: 'pending'                          │
│  isLoading: true                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  queryFn se ejecuta (fetchDolar)            │
│  fetch a API...                             │
└────────────────┬────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    ✅ SUCCESS      ❌ ERROR
         │               │
         │               ▼
         │      ┌─────────────────────────┐
         │      │  status: 'error'        │
         │      │  error: Error object    │
         │      │  retry: true            │
         │      │  retryCount: 1          │
         │      └────────┬────────────────┘
         │               │
         │               ▼
         │      (Retry 2 veces más)
         │               │
         │               ▼
         │      (Si falla 3 veces → mostrar error)
         │
         ▼
┌─────────────────────────────────────────────┐
│  status: 'success'                          │
│  data: [...]                                │
│  isLoading: false                           │
│  isSuccess: true                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Guardar en cache                           │
│  - Key: ['dolar']                           │
│  - Data: [...]                              │
│  - Timestamp: now                           │
│  - staleTime: 30000ms                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Component re-render                        │
│  Mostrar datos al usuario                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
      ⏰ Esperar 30 segundos
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  refetchInterval triggered                  │
│  status: 'success' (mantiene datos viejos)  │
│  isFetching: true (fetch en background)     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
         Fetch en background
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Nuevos datos llegan                        │
│  Compare con cache anterior                 │
│  ¿Son diferentes?                           │
│    SÍ → Re-render component                 │
│    NO → No hacer nada (optimización)        │
└────────────────┬────────────────────────────┘
                 │
                 └───────────┐
                             │
                    (Loop infinito)
                             │
                             ▼
              ⏰ Esperar 30 segundos
                             │
                             └──────> (Repetir refetch)
```

---

## 🗄️ Arquitectura de Zustand Store

```
┌────────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORE                                │
│                   (Estado Global)                               │
└────────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ ESTADO   │    │ ACTIONS  │    │ PERSIST  │
    │ (state)  │    │ (setters)│    │ (storage)│
    └──────────┘    └──────────┘    └──────────┘
           │               │               │
           │               │               │
           ▼               ▼               ▼

┌──────────────────────────────────────────────────────────────────┐
│  FAVORITES STORE (lib/store/favorites.ts)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ESTADO:                                                         │
│  ├─ dolares: string[]      → ['blue', 'oficial']                │
│  ├─ currencies: string[]   → ['USD', 'EUR']                     │
│  └─ cryptos: string[]      → ['bitcoin', 'ethereum']            │
│                                                                   │
│  ACTIONS:                                                        │
│  ├─ toggleDolar(id)                                             │
│  │  └─> Si existe → remover                                     │
│  │      Si no existe → agregar                                  │
│  │                                                               │
│  ├─ toggleCurrency(id)                                          │
│  │  └─> (mismo logic)                                           │
│  │                                                               │
│  ├─ toggleCrypto(id)                                            │
│  │  └─> (mismo logic)                                           │
│  │                                                               │
│  └─ getTotalCount()                                             │
│     └─> return dolares.length + currencies.length + cryptos.length
│                                                                   │
│  PERSIST:                                                        │
│  └─ localStorage key: 'favorites'                               │
│     └─> Guarda automáticamente en cada cambio                   │
│         Lee automáticamente al cargar                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

EJEMPLO DE USO:

// En cualquier componente:
const { dolares, toggleDolar } = useFavoritesStore();

// Chequear si está en favoritos:
const isFavorite = dolares.includes('blue');

// Toggle favorito:
<button onClick={() => toggleDolar('blue')}>
  {isFavorite ? '⭐' : '☆'}
</button>

┌────────────────────────────────────────────────────────────────────┐
│  FLUJO COMPLETO:                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Usuario clickea estrella                                       │
│     ↓                                                              │
│  2. toggleDolar('blue') se ejecuta                                 │
│     ↓                                                              │
│  3. Zustand actualiza state:                                       │
│     dolares: [] → ['blue']                                         │
│     ↓                                                              │
│  4. Persist middleware guarda en localStorage:                     │
│     localStorage.setItem('favorites', JSON.stringify({ dolares: ['blue'] }))
│     ↓                                                              │
│  5. Todos los componentes que usan useFavoritesStore() se re-renderizan
│     ↓                                                              │
│  6. Estrella cambia de ☆ a ⭐                                      │
│                                                                     │
│  [Usuario cierra tab]                                              │
│                                                                     │
│  [Usuario reabre tab]                                              │
│     ↓                                                              │
│  7. Zustand lee localStorage automáticamente                       │
│     ↓                                                              │
│  8. Favoritos restaurados: dolares = ['blue']                     │
│     ↓                                                              │
│  9. UI muestra estrella llena ⭐ desde el inicio                   │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
pages/_app.tsx
│
├─ QueryClientProvider (TanStack Query)
│  │
│  ├─ AuthProvider (Supabase Auth)
│  │  │
│  │  └─ ThemeProvider (Dark Mode)
│  │     │
│  │     └─ [Current Page]
│  │
│  └─ ReactQueryDevtools (solo dev)
│

pages/dashboard/index.tsx
│
├─ DashboardLayout
│  │
│  ├─ UnifiedNavbar
│  │  │
│  │  ├─ Logo + Link to home
│  │  │
│  │  ├─ Right Actions
│  │  │  ├─ RiesgoPaisBadge
│  │  │  ├─ ThemeToggle
│  │  │  ├─ Search Button
│  │  │  └─ Menu Toggle
│  │  │
│  │  ├─ Search Bar (expandible)
│  │  │
│  │  └─ Mobile Menu (sidebar)
│  │     ├─ Logo Header
│  │     ├─ Menu Items
│  │     │  ├─ Dashboard
│  │     │  ├─ Criptomonedas (NUEVO)
│  │     │  ├─ Análisis
│  │     │  ├─ Política
│  │     │  ├─ Finanzas
│  │     │  ├─ Calculadoras
│  │     │  ├─ Alertas
│  │     │  └─ Calendario
│  │     │
│  │     └─ Footer
│  │        ├─ Quick Stats
│  │        │  ├─ Favoritos (clickeable → /dashboard/favoritos)
│  │        │  └─ Alertas (clickeable → /dashboard/alertas)
│  │        │
│  │        └─ User Info
│  │           ├─ Avatar
│  │           ├─ Name + Email
│  │           └─ Logout Button
│  │
│  └─ DolarMarquee (ticker horizontal)
│
├─ Hero Section (Multimedia Placeholder)
│  ├─ Icon/Image
│  ├─ Title
│  └─ Description
│
├─ Favorites Section
│  ├─ Grid de favoritos
│  │  ├─ DolarCard (si hay dólares favoritos)
│  │  ├─ CurrencyCard (si hay monedas favoritas)
│  │  └─ CryptoCard (si hay cryptos favoritas)
│  │
│  └─ EmptyState (si no hay favoritos)
│
├─ Quick Access Cards
│  ├─ Link to Calculadoras
│  ├─ Link to Crypto
│  ├─ Link to Análisis
│  └─ Link to Política
│
├─ Cotizaciones Destacadas
│  ├─ Dólar Blue
│  ├─ Dólar Oficial
│  └─ Dólar MEP
│
└─ Recent Activity
   └─ Últimas alertas disparadas
```

---

## 🌐 API Call Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTIPLE CONCURRENT FETCHES                   │
│           (Todo en paralelo para máxima velocidad)               │
└─────────────────────────────────────────────────────────────────┘

DASHBOARD PRINCIPAL carga TODO en paralelo:

┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   useDolarQuery()                                                  │
│   ├─ fetch('https://dolarapi.com/v1/dolares')                     │
│   └─ Time: ~500ms                                                 │
│                                                                     │
│   useCryptoQuery()                                                 │
│   ├─ fetch('https://api.coingecko.com/api/v3/coins/markets')      │
│   └─ Time: ~700ms                                                 │
│                                                                     │
│   useCotizaciones() [monedas internacionales]                     │
│   ├─ fetch('https://api.bluelytics.com.ar/v2/latest')             │
│   └─ Time: ~600ms                                                 │
│                                                                     │
│   useRiesgoPais()                                                  │
│   ├─ fetch('https://api.argentinadatos.com/v1/finanzas/indices')  │
│   └─ Time: ~400ms                                                 │
│                                                                     │
│   useAlertasStore() [desde localStorage]                          │
│   └─ Time: ~1ms (instantáneo)                                     │
│                                                                     │
│   useFavoritesStore() [desde localStorage]                        │
│   └─ Time: ~1ms (instantáneo)                                     │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

RESULTADO: ~700ms total (no 500+700+600+400 = 2200ms)
           ↓
    TODO carga EN PARALELO
           ↓
    Tiempo total = fetch más lento (700ms crypto)

PÁGINA DE CALCULADORAS carga datos adicionales:

┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   (Hereda dólar y crypto del cache de React Query)                │
│   └─ Time: ~0ms (instantáneo desde cache)                         │
│                                                                     │
│   useFredData() [primera vez]                                      │
│   ├─ fetch 7 series en paralelo                                   │
│   │  ├─ FEDFUNDS                                                  │
│   │  ├─ CPIAUCSL                                                  │
│   │  ├─ GDPC1                                                     │
│   │  ├─ UNRATE                                                    │
│   │  ├─ DGS10                                                     │
│   │  ├─ M2SL                                                      │
│   │  └─ DTWEXBGS                                                  │
│   └─ Time: ~1500ms (FRED es más lento)                            │
│                                                                     │
│   useInflacion() [inflación Argentina]                            │
│   ├─ fetch('https://api.argentinadatos.com/v1/inflacion')         │
│   └─ Time: ~500ms                                                 │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

RESULTADO: ~1500ms solo para datos nuevos
           Datos ya existentes: 0ms (desde cache)
```

---

## 🔐 Authentication Flow (Supabase)

```
REGISTRO:

Usuario → Form de registro
   ↓
   email: "user@example.com"
   password: "********"
   name: "Juan Pérez"
   ↓
supabase.auth.signUp({ email, password })
   ↓
Supabase crea usuario
   ↓
Supabase envía email de confirmación
   ↓
Usuario clickea link en email
   ↓
Supabase confirma email
   ↓
Usuario puede hacer login

─────────────────────────────────────────────────────────

LOGIN:

Usuario → Form de login
   ↓
   email: "user@example.com"
   password: "********"
   ↓
supabase.auth.signInWithPassword({ email, password })
   ↓
Supabase valida credenciales
   │
   ├─ ✅ Válidas
   │  ↓
   │  Supabase devuelve:
   │  {
   │    user: { id, email, ... },
   │    session: { access_token, refresh_token, ... }
   │  }
   │  ↓
   │  AuthContext guarda user en state
   │  ↓
   │  Browser guarda tokens en localStorage (automático)
   │  ↓
   │  Redirect a /dashboard
   │
   └─ ❌ Inválidas
      ↓
      Error: "Invalid credentials"
      ↓
      Mostrar mensaje al usuario

─────────────────────────────────────────────────────────

SESSION PERSISTENCE:

Usuario cierra tab
   ↓
[Tokens guardados en localStorage]
   ↓
Usuario reabre tab
   ↓
AuthContext se monta
   ↓
supabase.auth.getSession()
   ↓
Lee tokens de localStorage
   │
   ├─ ✅ Tokens válidos
   │  ↓
   │  Restaurar sesión automáticamente
   │  ↓
   │  Usuario sigue logueado
   │
   └─ ❌ Tokens expirados
      ↓
      Intentar refresh con refresh_token
      │
      ├─ ✅ Refresh exitoso
      │  ↓
      │  Nuevos tokens
      │  ↓
      │  Usuario sigue logueado
      │
      └─ ❌ Refresh falló
         ↓
         Logout automático
         ↓
         Redirect a /login

─────────────────────────────────────────────────────────

PROTECTED ROUTES:

Usuario intenta acceder a /dashboard
   ↓
ProtectedRoute component chequea:
   ↓
¿Hay usuario en AuthContext?
   │
   ├─ SÍ
   │  ↓
   │  Permitir acceso
   │  ↓
   │  Renderizar /dashboard
   │
   └─ NO
      ↓
      Redirect a /login
      ↓
      Guardar URL original: /dashboard
      ↓
      [Usuario hace login]
      ↓
      Redirect de vuelta a /dashboard
```

---

## 📦 Bundle Structure (Next.js Build Output)

```
.next/
├── static/
│   ├── chunks/
│   │   ├── app/                    # App router chunks
│   │   ├── pages/                  # Pages router chunks
│   │   │   ├── dashboard/
│   │   │   │   ├── index-[hash].js           # Dashboard page
│   │   │   │   ├── calculadoras-[hash].js    # Calculadoras page
│   │   │   │   ├── crypto-[hash].js          # Crypto page
│   │   │   │   └── ...
│   │   │   └── _app-[hash].js               # App wrapper
│   │   ├── main-[hash].js          # React + Next.js runtime
│   │   ├── webpack-[hash].js       # Webpack runtime
│   │   └── framework-[hash].js     # React framework
│   │
│   └── css/
│       └── [hash].css              # Tailwind + custom CSS
│
└── server/
    └── pages/                      # Server-rendered pages
        └── dashboard/
            └── index.html          # Pre-rendered HTML

OPTIMIZACIONES AUTOMÁTICAS DE NEXT.JS:

1. Code Splitting:
   - Cada página es un bundle separado
   - Solo se carga código de la página actual
   - Navegación a otra página → lazy load su bundle

2. Tree Shaking:
   - Elimina código no usado
   - Ejemplo: Si importas { Button } de ui/,
             solo Button se incluye (no todo ui/)

3. Image Optimization:
   - next/image optimiza automáticamente
   - Genera WebP + múltiples tamaños
   - Lazy loading por default

4. Font Optimization:
   - next/font/google optimiza Google Fonts
   - Self-host automático (mejor performance)
   - No hace request externo a Google

EJEMPLO PRÁCTICO:

Usuario visita /dashboard
   ↓
Se carga:
   ├─ main.js (220KB)         # React + Next.js
   ├─ framework.js (180KB)    # Framework
   ├─ app.js (50KB)           # _app wrapper
   ├─ index.js (80KB)         # Dashboard page
   └─ styles.css (120KB)      # Tailwind CSS
   ↓
TOTAL: ~650KB (con gzip: ~180KB)

Usuario navega a /dashboard/calculadoras
   ↓
NO se recarga:
   ├─ main.js
   ├─ framework.js
   ├─ app.js
   └─ styles.css
   ↓
SOLO se carga:
   └─ calculadoras.js (95KB con gzip: ~25KB)
   ↓
TOTAL adicional: 25KB
```

---

## 🚀 Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE STACK                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 1: NETWORK (Fastest)                                         │
│  ├─ React Query Cache (staleTime: 30s)                             │
│  │  └─ Si data es fresca → 0ms, no network request                 │
│  │                                                                   │
│  ├─ Browser Cache (API responses)                                   │
│  │  └─ Cache-Control headers                                        │
│  │                                                                   │
│  └─ CDN Edge Cache (Vercel Edge Network)                           │
│     └─ Static assets servidos desde edge más cercano               │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 2: RENDERING (Fast)                                          │
│  ├─ Static Generation (build time)                                  │
│  │  └─ Landing page pre-renderizada                                │
│  │                                                                   │
│  ├─ Incremental Static Regeneration                                │
│  │  └─ Re-generar static pages cada X tiempo                       │
│  │                                                                   │
│  └─ Server-Side Rendering (on-demand)                              │
│     └─ Dashboard pages renderizadas en server                       │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 3: BUNDLE SIZE (Medium)                                      │
│  ├─ Code Splitting (automático por Next.js)                        │
│  │  └─ Cada página es un chunk separado                            │
│  │                                                                   │
│  ├─ Dynamic Imports (lazy loading)                                  │
│  │  └─ Componentes pesados cargan on-demand                        │
│  │                                                                   │
│  ├─ Tree Shaking                                                    │
│  │  └─ Eliminar código no usado                                    │
│  │                                                                   │
│  └─ Minification + Compression                                      │
│     └─ Terser (JS) + cssnano (CSS) + gzip                          │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 4: RUNTIME (Slower)                                          │
│  ├─ React.memo() para componentes puros                            │
│  │  └─ No re-renderizar si props no cambiaron                      │
│  │                                                                   │
│  ├─ useMemo() para cálculos caros                                  │
│  │  └─> const sorted = useMemo(() => data.sort(), [data])          │
│  │                                                                   │
│  ├─ useCallback() para funciones estables                          │
│  │  └─> const onClick = useCallback(() => {...}, [deps])           │
│  │                                                                   │
│  └─ Virtualization para listas largas                              │
│     └─> react-window o react-virtualized                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

MEJORAS IMPLEMENTADAS:

✅ React Query cache con staleTime
✅ Code splitting por página
✅ Image optimization (next/image)
✅ Font optimization (next/font)
✅ Tailwind CSS purge (elimina clases no usadas)
✅ Refetch en background (no bloquea UI)

MEJORAS PENDIENTES:

⏳ Lazy load de Chart.js (solo cargar cuando se necesita)
⏳ Virtualization en tablas de senadores/diputados (si >100 rows)
⏳ Service Worker para offline support
⏳ Prefetch de páginas en hover (next/link hace esto automático)
```

---

**Última actualización**: 2025-01-13
**Versión**: 1.0

*Estos diagramas son living documents - actualizar cuando la arquitectura cambie*
