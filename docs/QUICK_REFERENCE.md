# 🚀 DolarGaucho - Referencia Rápida

## ⚡ Comandos Más Usados

```bash
# Desarrollo
npm run dev                 # Iniciar servidor desarrollo (localhost:3000)
npm run build              # Build para producción
npm run start              # Correr build de producción
npm run type-check         # Verificar errores TypeScript
npm run lint               # Verificar errores ESLint

# Testing
npm test                   # Correr tests
npm run test:watch         # Tests en modo watch

# Deployment
vercel                     # Deploy a Vercel
vercel --prod              # Deploy a producción
```

---

## 📁 Archivos Clave

### Hooks (Custom Hooks para Data Fetching)
```
hooks/
├── useDolarQuery.ts          # Cotizaciones dólar argentino
├── useCryptoQuery.ts         # Criptomonedas (CoinGecko)
├── useFredData.ts            # Datos económicos USA (FRED)
├── useInflacion.ts           # Inflación Argentina (INDEC)
├── useInflacionUS.ts         # Inflación USA
└── useFinanzas.ts            # Índices bursátiles
```

### Stores (Estado Global con Zustand)
```
lib/store/
├── favorites.ts              # Sistema de favoritos
└── alertas.ts                # Sistema de alertas
```

### Components
```
components/
├── /layouts
│   ├── DashboardLayout.tsx       # Layout principal
│   └── UnifiedNavbar.tsx         # Navbar + menú lateral
├── /ui
│   ├── /ThemeToggle              # Dark mode toggle
│   ├── /GlobalSearch             # Buscador global
│   └── /RiesgoPaisBadge          # Badge riesgo país
├── /calculadoras                 # Todas las calculadoras
├── /charts                       # Charts (Chart.js)
│   ├── FredChart.tsx             # Charts FRED
│   └── InflacionChart.tsx        # Chart inflación
└── /crypto
    └── CryptoCard.tsx            # Card de crypto
```

### Pages (Rutas)
```
pages/
├── index.tsx                     # Landing page
├── /dashboard
│   ├── index.tsx                 # Dashboard principal
│   ├── calculadoras.tsx          # Hub calculadoras
│   ├── crypto.tsx                # Criptomonedas
│   ├── analisis.tsx              # Análisis mercado
│   ├── politica.tsx              # Congreso
│   ├── finanzas.tsx              # Índices
│   ├── alertas.tsx               # Alertas
│   └── calendario.tsx            # Calendario económico
└── _app.tsx                      # App wrapper con providers
```

---

## 🔧 Cómo Agregar...

### Una Nueva Cotización

**1. Agregar al tipo (si no existe)**
```typescript
// types/index.ts
export interface Cotizacion {
  nombre: string;
  compra: number;
  venta: number;
  variacion: number;
  // ...
}
```

**2. Agregar al hook**
```typescript
// hooks/useDolarQuery.ts
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolar'],
    queryFn: async () => {
      const res = await fetch('https://dolarapi.com/v1/dolares');
      const data = await res.json();
      return data; // Ya incluye nueva cotización si la API la provee
    },
    refetchInterval: 30000,
  });
}
```

**3. Renderizar en el componente**
```typescript
// pages/dashboard/index.tsx
const { data: dolares } = useDolarQuery();

<Card>
  <h3>{dolar.nombre}</h3>
  <p>${dolar.venta}</p>
</Card>
```

### Una Nueva Calculadora

**1. Crear componente**
```typescript
// components/calculadoras/CalculadoraNueva.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function CalculadoraNueva() {
  const [valor, setValor] = useState(0);

  const calcular = () => {
    // Tu lógica aquí
  };

  return (
    <Card>
      <h2>Mi Calculadora</h2>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
      />
      <button onClick={calcular}>Calcular</button>
    </Card>
  );
}
```

**2. Agregar a la página de calculadoras**
```typescript
// pages/dashboard/calculadoras.tsx
import { CalculadoraNueva } from '@/components/calculadoras/CalculadoraNueva';

// En el array de calculadoras:
const calculadoras = [
  // ... otras calculadoras
  {
    id: 'nueva',
    icon: FaCalculator,
    title: 'Mi Calculadora',
    description: 'Descripción',
    href: '/dashboard/calculadoras?calc=nueva',
  },
];
```

**3. Agregar al switch de renderizado**
```typescript
// pages/dashboard/calculadoras.tsx
{activeCalc === 'nueva' && <CalculadoraNueva />}
```

### Un Nuevo Indicador FRED

**1. Agregar serie a la lista**
```typescript
// hooks/useFredData.ts
export const FRED_SERIES = {
  // ... series existentes
  MI_NUEVO_INDICADOR: 'FRED_SERIES_ID', // Buscar ID en https://fred.stlouisfed.org/
} as const;
```

**2. Agregar al fetch**
```typescript
// hooks/useFredData.ts
export function useFredData() {
  return useQuery({
    queryKey: ['fred', 'indicators'],
    queryFn: async () => {
      const [
        // ... otras series
        miNuevoIndicadorData,
      ] = await Promise.all([
        // ... otros fetches
        fetchFredSeries(FRED_SERIES.MI_NUEVO_INDICADOR, 24),
      ]);

      return {
        // ... otros indicadores
        miNuevoIndicador: calculateIndicator(miNuevoIndicadorData),
      };
    },
  });
}
```

**3. Renderizar en calculadoras**
```typescript
// pages/dashboard/calculadoras.tsx
const { data: fredData } = useFredData();

<Card>
  <h3>Mi Nuevo Indicador</h3>
  <p>{fredData?.miNuevoIndicador?.latest.toFixed(2)}</p>
</Card>
```

### Una Nueva API

**1. Crear hook**
```typescript
// hooks/useMiNuevaAPI.ts
import { useQuery } from '@tanstack/react-query';

export function useMiNuevaAPI() {
  return useQuery({
    queryKey: ['mi-nueva-api'],
    queryFn: async () => {
      const res = await fetch('https://api.ejemplo.com/data');
      if (!res.ok) throw new Error('Error fetching data');
      return res.json();
    },
    staleTime: 60000, // 1 minuto
    refetchInterval: 60000, // Refetch cada 1 minuto
    retry: 2, // Reintentar 2 veces si falla
  });
}
```

**2. Usar en componente**
```typescript
// pages/dashboard/mi-pagina.tsx
import { useMiNuevaAPI } from '@/hooks/useMiNuevaAPI';

export default function MiPagina() {
  const { data, isLoading, error } = useMiNuevaAPI();

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{/* Renderizar data */}</div>;
}
```

---

## 🐛 Troubleshooting Común

### Error: "Cannot find module..."
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: TypeScript errors
```bash
# Verificar errores específicos
npm run type-check

# Si persisten, restart VS Code:
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Error: "Hydration failed"
**Causa**: Diferencia entre HTML renderizado en server y client

**Solución**: Usar `'use client'` al inicio del componente
```typescript
'use client';

export function MiComponente() {
  // ...
}
```

### Error: "navigator is not defined"
**Causa**: Código del browser corriendo en server (SSR)

**Solución**: Chequear `typeof` antes de usar
```typescript
if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
  await navigator.share({ ... });
}
```

### Build falla en Vercel
1. Verificar que `npm run build` funcione localmente
2. Verificar variables de entorno en Vercel dashboard
3. Revisar logs de build en Vercel

---

## 🔑 Variables de Entorno

Crear archivo `.env.local` (NO committear):

```bash
# Supabase (Autenticación)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# FRED API (Datos USA)
NEXT_PUBLIC_FRED_API_KEY=tu_api_key_aqui

# CoinGecko API (Crypto)
NEXT_PUBLIC_COINGECKO_API_KEY=tu_api_key_aqui  # Opcional

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Obtener API keys**:
- FRED: https://fred.stlouisfed.org/docs/api/api_key.html (gratis)
- CoinGecko: https://www.coingecko.com/en/api (free tier disponible)
- Supabase: https://supabase.com/ (crear proyecto gratis)

---

## 📊 Estructura de Datos

### Formato de Cotización Dólar
```typescript
{
  casa: "blue",           // Identificador único
  nombre: "Blue",         // Nombre para mostrar
  compra: 1150.00,       // Precio de compra
  venta: 1170.00,        // Precio de venta
  fechaActualizacion: "2025-01-13T10:30:00.000Z"
}
```

### Formato de Crypto
```typescript
{
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://...",
  current_price: 43567.89,
  market_cap: 851234567890,
  price_change_percentage_24h: 2.45,
  price_change_percentage_7d: 5.67,
  price_change_percentage_30d: 12.34
}
```

### Formato de FRED Data
```typescript
{
  latest: 5.33,              // Valor más reciente
  previousMonth: 5.25,       // Valor del mes anterior
  change: 0.08,              // Cambio absoluto
  changePercent: 1.52,       // Cambio porcentual
  data: [                    // Datos históricos
    { date: "2024-01-01", value: 5.25 },
    { date: "2024-02-01", value: 5.33 },
    // ...
  ],
  lastUpdate: "2024-02-01"
}
```

---

## 🎨 Clases Tailwind Útiles

### Colores del Tema
```css
/* Backgrounds */
bg-background         /* Fondo principal */
bg-panel             /* Fondo de cards/panels */
bg-accent-emerald    /* Verde principal */
bg-accent-teal       /* Verde secundario */

/* Text */
text-foreground      /* Texto principal */
text-secondary       /* Texto secundario (gris) */
text-muted          /* Texto muy tenue */

/* Borders */
border-border        /* Border color estándar */

/* Glass effect */
glass               /* Glassmorphism */
glass-strong        /* Glassmorphism más opaco */
```

### Gradientes
```css
gradient-text        /* Gradiente en texto (emerald → teal) */
bg-gradient-to-br    /* Gradiente de fondo (top-left → bottom-right) */
from-accent-emerald/20  /* Start color con opacity */
to-accent-teal/10       /* End color con opacity */
```

### Responsive
```css
sm:text-lg          /* Small screens (640px+) */
md:grid-cols-2      /* Medium screens (768px+) */
lg:grid-cols-4      /* Large screens (1024px+) */
xl:px-8             /* Extra large (1280px+) */
```

---

## 🧪 Testing Tips

### Test de un Hook
```typescript
// hooks/__tests__/useDolarQuery.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDolarQuery } from '../useDolarQuery';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('fetches dolar data', async () => {
  const { result } = renderHook(() => useDolarQuery(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

### Test de Componente
```typescript
// components/__tests__/DolarCard.test.tsx
import { render, screen } from '@testing-library/react';
import { DolarCard } from '../DolarCard';

test('renders dolar card', () => {
  const dolar = {
    nombre: 'Blue',
    venta: 1170,
    variacion: 2.5,
  };

  render(<DolarCard dolar={dolar} />);

  expect(screen.getByText('Blue')).toBeInTheDocument();
  expect(screen.getByText('$1.170,00')).toBeInTheDocument();
});
```

---

## 📱 Mobile Testing

### Probar en dispositivo físico
1. Obtener IP local: `ifconfig | grep inet`
2. Correr dev server: `npm run dev`
3. En el teléfono: abrir `http://TU_IP:3000`

### Probar responsive en Chrome DevTools
1. F12 → Toggle device toolbar (Cmd+Shift+M)
2. Seleccionar dispositivo o custom size
3. Probar rotación (portrait/landscape)

---

## 🚀 Deploy Checklist

Antes de hacer deploy a producción:

- [ ] `npm run build` sin errores
- [ ] `npm run type-check` sin errores
- [ ] `npm run lint` sin errores críticos
- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Lighthouse score >80 en performance
- [ ] Probar en mobile (responsive)
- [ ] Probar dark mode
- [ ] Verificar que todas las APIs funcionan
- [ ] Meta tags y Open Graph configurados

---

## 📚 Links Útiles

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### APIs Usadas
- [DolarAPI](https://dolarapi.com/)
- [Bluelytics API](https://api.bluelytics.com.ar/)
- [FRED API](https://fred.stlouisfed.org/docs/api/)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [Argentina Datos API](https://argentinadatos.com/)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Lighthouse](https://pagespeed.web.dev/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Última actualización**: 2025-01-13
**Versión**: 1.0
