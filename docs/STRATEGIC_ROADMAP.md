# 🚀 DolarGaucho - Strategic Roadmap & Architecture Guide

## 📋 Tabla de Contenidos

1. [Estado Actual - ¿Qué Tenemos?](#estado-actual)
2. [Arquitectura Técnica - ¿Cómo Funciona?](#arquitectura-técnica)
3. [Ventajas Competitivas](#ventajas-competitivas)
4. [Roadmap Estratégico](#roadmap-estratégico)
5. [Monetización & Crecimiento](#monetización-y-crecimiento)
6. [Métricas de Éxito](#métricas-de-éxito)

---

## 🎯 Estado Actual - ¿Qué Tenemos?

### Productos Core (Implementados ✅)

#### 1. **Dashboard de Cotizaciones en Tiempo Real**

- **Qué es**: Panel principal con todas las cotizaciones del dólar, monedas internacionales y criptomonedas
- **Cómo funciona**:
  - Usa `@tanstack/react-query` para fetching automático cada 30 segundos
  - Cachea datos para reducir llamadas a APIs
  - Muestra cambios visuales en tiempo real con animaciones
- **APIs utilizadas**:
  - `dolarapi.com` - Cotizaciones del dólar argentino
  - `api.bluelytics.com.ar` - Datos históricos y adicionales
  - CoinGecko API - Criptomonedas (Bitcoin, Ethereum, USDT, etc.)

#### 2. **Sistema de Favoritos Inteligente**

- **Qué es**: Sistema que permite guardar cotizaciones favoritas
- **Cómo funciona**:
  - Usa Zustand con persistencia en localStorage
  - Estado global accesible desde cualquier componente
  - Sincronización automática entre tabs del navegador
- **Tipos soportados**: Dólares, monedas internacionales, criptomonedas
- **Ubicación**: `lib/store/favorites.ts`

#### 3. **Sistema de Alertas Personalizadas**

- **Qué es**: Notificaciones cuando una cotización alcanza un valor objetivo
- **Cómo funciona**:
  - Chequeo en tiempo real contra valores guardados
  - Notificaciones visuales + browser notifications (si están habilitadas)
  - Historial de alertas disparadas
- **Ubicación**: `lib/store/alertas.ts`

#### 4. **Calculadoras Financieras (10+ calculadoras)**

- **Inflación**: Calcula poder adquisitivo entre fechas
- **Plazo Fijo**: Rendimiento con tasa + inflación
- **UVA**: Simulaciones de créditos UVA
- **Conversores**: Moneda, crypto, inflación US
- **IPC/IPM**: Cálculos con índices oficiales
- **Mega Calculadora**: Hub unificado con todas las calculadoras

#### 5. **Datos Económicos USA (FRED API)**

- **Qué es**: Integración con la Reserva Federal de USA
- **Indicadores incluidos**:
  - Tasa de interés FED
  - Inflación USA (CPI Year-over-Year)
  - PIB Real (crecimiento trimestral)
  - Tasa de desempleo
  - Bonos del Tesoro 10 años
  - Oferta monetaria M2
  - Índice del dólar (DXY)
- **Cómo funciona**:
  - Fetch cada 6 horas (datos no cambian frecuentemente)
  - Fallback data si no hay API key
  - Charts interactivos con Chart.js
- **Comparación Argentina vs USA**: Ratios automáticos de inflación

#### 6. **Sección Política (Gobierno Abierto)**

- **Qué es**: Datos del Congreso Argentino
- **Incluye**:
  - Lista de senadores y diputados
  - Actas del Senado con votaciones
  - Estadísticas por bloque político
  - Buscador de legisladores
- **API**: `datos.gob.ar` - Gobierno Abierto Argentina

#### 7. **Calendario Económico**

- **Qué es**: Calendario con eventos económicos y feriados
- **Incluye**:
  - Feriados nacionales
  - Vencimientos de impuestos
  - Publicación de índices (IPC, IPM, etc.)
  - Reuniones del BCRA

#### 8. **Finanzas - Índices Bursátiles**

- **Qué es**: Seguimiento de mercados
- **Incluye**:
  - S&P 500, Dow Jones, NASDAQ
  - Riesgo país Argentina
  - Bonos argentinos
  - FCIs (Fondos Comunes de Inversión)

---

## 🏗️ Arquitectura Técnica - ¿Cómo Funciona?

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  • Next.js 15.1.6 (App Router + Pages Router híbrido)  │
│  • React 19 (Server Components + Client Components)     │
│  • TypeScript (Type safety en toda la app)             │
│  • Tailwind CSS (Diseño responsive + dark mode)        │
│  • Framer Motion (Animaciones fluidas)                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT & DATA FETCHING            │
├─────────────────────────────────────────────────────────┤
│  • TanStack Query (React Query v5)                      │
│    - Fetching automático                                │
│    - Caching inteligente                                │
│    - Refetch en background                              │
│    - Optimistic updates                                 │
│                                                          │
│  • Zustand (Estado global)                              │
│    - Favoritos (persiste en localStorage)               │
│    - Alertas (persiste en localStorage)                 │
│    - UI state (modales, sidebar, theme)                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   APIs EXTERNAS                          │
├─────────────────────────────────────────────────────────┤
│  • dolarapi.com           → Cotizaciones dólar          │
│  • bluelytics.com.ar      → Históricos + riesgo país    │
│  • api.stlouisfed.org     → FRED (datos USA)            │
│  • api.coingecko.com      → Criptomonedas               │
│  • datos.gob.ar           → Datos públicos Argentina    │
│  • api.argentinadatos.com → Inflación, índices          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Supabase)                      │
├─────────────────────────────────────────────────────────┤
│  • Autenticación (Email/Password + OAuth)               │
│  • Base de datos PostgreSQL                             │
│    - Usuarios                                           │
│    - Preferencias guardadas                             │
│    - Historial de alertas                               │
│  • Row Level Security (seguridad por usuario)           │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos (Ejemplo: Cotización del Dólar)

```
1. USUARIO abre /dashboard
   ↓
2. COMPONENTE Dashboard.tsx se monta
   ↓
3. HOOK useDolarQuery() se ejecuta
   └→ useQuery({ queryKey: ['dolar'], queryFn: fetchDolar })
   ↓
4. REACT QUERY chequea su cache
   ├→ Si tiene datos frescos (< 30s) → devuelve del cache
   └→ Si no → hace fetch a dolarapi.com
   ↓
5. FETCH devuelve JSON con cotizaciones
   ↓
6. REACT QUERY guarda en cache + actualiza componente
   ↓
7. COMPONENTE renderiza con nuevos datos
   ↓
8. ZUSTAND chequea si hay favoritos guardados
   └→ Filtra y muestra solo favoritos en sección destacada
   ↓
9. ALERTAS STORE chequea si se cumple alguna condición
   └→ Si se cumple → dispara notificación
   ↓
10. Cada 30s → React Query hace refetch automático en background
```

### Arquitectura de Carpetas

```
/dolargaucho-retro
├── /app                          # App Router (Next.js 13+)
├── /pages                        # Pages Router (legacy + dashboard)
│   ├── /dashboard
│   │   ├── index.tsx            # Dashboard principal
│   │   ├── calculadoras.tsx     # Hub de calculadoras
│   │   ├── analisis.tsx         # Análisis de mercado
│   │   ├── politica.tsx         # Congreso
│   │   └── ...
│   └── _app.tsx                 # App wrapper con providers
├── /components
│   ├── /ui                      # Componentes UI reutilizables
│   │   ├── /Button
│   │   ├── /Card
│   │   ├── /ThemeToggle
│   │   ├── /GlobalSearch
│   │   └── ...
│   ├── /layouts                 # Layouts
│   │   ├── DashboardLayout.tsx
│   │   └── UnifiedNavbar.tsx
│   ├── /calculadoras            # Calculadoras específicas
│   ├── /charts                  # Charts (Chart.js)
│   └── ...
├── /hooks                        # Custom hooks
│   ├── useDolarQuery.ts         # Fetch cotizaciones dólar
│   ├── useFredData.ts           # Fetch datos FRED
│   ├── useCryptoQuery.ts        # Fetch cryptos
│   ├── useInflacion.ts          # Fetch inflación Argentina
│   └── ...
├── /lib
│   ├── /store                   # Zustand stores
│   │   ├── favorites.ts
│   │   └── alertas.ts
│   ├── /contexts                # React Contexts
│   │   ├── AuthContext.tsx     # Autenticación
│   │   └── ThemeContext.tsx    # Dark mode
│   ├── /utils                   # Utilidades
│   │   ├── formatters.ts       # Formato argentino (1.234,56)
│   │   └── logger.ts           # Logging
│   └── /config
│       └── api.ts               # URLs de APIs
├── /styles
│   └── globals.css              # Estilos globales + Tailwind
└── /docs                         # Documentación
    ├── STRATEGIC_ROADMAP.md     # Este archivo
    ├── FRED_API_SETUP.md
    └── ...
```

### Decisiones Arquitectónicas Clave

#### 1. **¿Por qué React Query?**

- **Problema**: Fetching manual es tedioso (loading states, error handling, caching)
- **Solución**: React Query automatiza todo
- **Beneficio**:
  - Código más limpio
  - Menos bugs
  - Mejor UX (datos frescos sin recargar)
  - Refetch automático en background

**Ejemplo**:

```typescript
// Sin React Query (manual)
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('...')
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
    });
}, []);

// Con React Query (automático)
const { data, isLoading, error } = useQuery({
  queryKey: ['dolar'],
  queryFn: fetchDolar,
  refetchInterval: 30000,
  staleTime: 30000,
});
```

#### 2. **¿Por qué Zustand para estado global?**

- **Problema**: Redux es complejo (actions, reducers, boilerplate)
- **Solución**: Zustand es simple y directo
- **Beneficio**:
  - Menos código
  - Más fácil de entender
  - Mejor developer experience
  - Persistencia automática en localStorage

**Ejemplo**:

```typescript
// Store completo en ~30 líneas
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      dolares: [],
      currencies: [],
      cryptos: [],
      toggleDolar: (id) =>
        set((state) => ({
          dolares: state.dolares.includes(id)
            ? state.dolares.filter((d) => d !== id)
            : [...state.dolares, id],
        })),
      getTotalCount: () => {
        const { dolares, currencies, cryptos } = get();
        return dolares.length + currencies.length + cryptos.length;
      },
    }),
    { name: 'favorites' }
  )
);
```

#### 3. **¿Por qué Next.js?**

- **SEO**: Server-side rendering para páginas públicas
- **Performance**: Optimización automática de imágenes, code splitting
- **Developer Experience**: Hot reload, TypeScript out-of-the-box
- **Deployment**: Vercel deploy con un click

#### 4. **¿Por qué Tailwind CSS?**

- **Velocidad**: Estilado rápido sin salir del HTML
- **Consistencia**: Colores y espaciados predefinidos
- **Dark mode**: Soportado nativamente
- **Performance**: Solo incluye clases usadas (tree-shaking)

---

## 🎯 Ventajas Competitivas

### 1. **Todo en Un Solo Lugar**

- **Competencia**: Usuarios tienen que visitar 5+ sitios (dolarito, ambito, investing, etc.)
- **Nosotros**: Dashboard único con TODO (dólar, monedas, crypto, USA, política)

### 2. **Datos en Tiempo Real**

- **Competencia**: Muchos sitios no actualizan automáticamente
- **Nosotros**: Refetch cada 30s automático, sin recargar página

### 3. **Calculadoras Avanzadas**

- **Competencia**: Calculadoras básicas o no existen
- **Nosotros**: 10+ calculadoras con datos reales integrados
  - Ejemplo: Calculadora de inflación usa datos reales de INDEC (no estimaciones)

### 4. **Comparación Argentina vs USA**

- **Competencia**: Nadie lo hace
- **Nosotros**: Comparación directa con datos FRED (Reserva Federal)
- **Valor**: Contexto para entender economía argentina en perspectiva global

### 5. **Sistema de Alertas**

- **Competencia**: Solo notificaciones push genéricas
- **Nosotros**: Alertas personalizadas por usuario con historial

### 6. **Enfoque Argentino**

- **Competencia**: Sitios internacionales no entienden el contexto argentino
- **Nosotros**:
  - Formato de números argentino (1.234,56)
  - Cotizaciones relevantes (blue, MEP, CCL)
  - Datos políticos de Argentina
  - Calendario con feriados y vencimientos locales

### 7. **Open Source & Transparencia**

- **Competencia**: APIs privadas, datos opacos
- **Nosotros**: Código abierto, fuentes verificables

---

## 🗺️ Roadmap Estratégico

### FASE 1: Consolidación (1-2 meses) 🟢 EN PROGRESO

**Objetivo**: Estabilizar lo existente y mejorar UX

#### Tareas Prioritarias:

1. **Testing & QA**
   - [ ] Tests unitarios para hooks críticos
   - [ ] Tests de integración para flujo completo
   - [ ] Test de performance (Lighthouse)
   - [ ] Cross-browser testing

2. **Mejoras de UX**
   - [ ] Onboarding para nuevos usuarios (tour guiado)
   - [ ] Tutorial de calculadoras
   - [ ] Tooltips explicativos
   - [ ] Mensajes de error más claros

3. **Landing Page de Conversión** 🆕
   - [ ] Diseñar landing page profesional antes del dashboard
   - [ ] Secciones clave:
     - Hero section con propuesta de valor clara
     - Features principales con screenshots
     - Testimonios y casos de uso
     - FAQ section
     - CTA prominent para registro
   - [ ] A/B testing de diferentes mensajes
   - [ ] Optimización para conversión (CRO)
   - [ ] Mobile-first design

4. **Performance**
   - [ ] Lazy loading de componentes pesados
   - [ ] Optimización de imágenes
   - [ ] Code splitting más agresivo
   - [ ] Reducir bundle size (analizar con `next/bundle-analyzer`)

5. **Analytics**
   - [ ] Integrar Google Analytics o Plausible
   - [ ] Track eventos clave:
     - Cotizaciones más vistas
     - Calculadoras más usadas
     - Tiempo en sitio
     - Tasa de retorno
   - [ ] Heatmaps (Hotjar o similar)

6. **SEO**
   - [ ] Meta tags optimizados
   - [ ] Open Graph para compartir en redes
   - [ ] Sitemap.xml
   - [ ] robots.txt
   - [ ] Schema.org markup para cotizaciones

**KPIs para esta fase**:

- Performance score >90 en Lighthouse
- 100 usuarios activos por semana
- Tiempo promedio en sitio >3 minutos
- Tasa de rebote <60%
- Tasa de conversión landing → registro >5%

---

### FASE 2: Diferenciación (2-4 meses) 🟡 PRÓXIMO

**Objetivo**: Agregar features únicas que la competencia no tiene

#### 2.1 **Integración con Billeteras Virtuales** 🆕 💎 FEATURE ÚNICA

**Por qué**: Esta es una feature que **NINGUNA app de cotizaciones tiene**. Diferenciador total del mercado.

**Problema que resuelve**:

- Los usuarios tienen que calcular manualmente cuánto pueden comprar con su saldo
- No hay forma de ver el impacto real de las cotizaciones en su dinero
- Las calculadoras no usan datos reales del usuario

**Billeteras Fiat soportadas** (en orden de prioridad):

1. **Mercado Pago** (API disponible)
2. **Ualá** (Web scraping o API si está disponible)
3. **Brubank** (API bancaria)
4. **Personal Pay**
5. **Naranja X**

**Billeteras Crypto soportadas** 🆕:

1. **MetaMask** (Browser extension + WalletConnect)
2. **Trust Wallet** (WalletConnect)
3. **Ledger** (Hardware wallet via Web3)
4. **Coinbase Wallet**
5. **Binance Chain Wallet**
6. **Rainbow Wallet**

**Integraciones blockchain**:

- Ethereum (ETH + tokens ERC-20)
- Binance Smart Chain (BNB + tokens BEP-20)
- Polygon (MATIC)
- Bitcoin (BTC) - via APIs como BlockCypher

**Features principales**:

**A. Ver saldos en tiempo real**

**Billeteras Fiat**:

```typescript
interface FiatWalletBalance {
  provider: 'mercadopago' | 'uala' | 'brubank';
  balanceARS: number;
  lastUpdate: Date;
}

// Dashboard muestra:
// "Tu saldo en Mercado Pago: $50,000 ARS"
// "Con el dólar blue actual, podés comprar: USD $41.67"
```

**Billeteras Crypto** 🆕:

```typescript
interface CryptoWalletBalance {
  provider: 'metamask' | 'trust' | 'ledger';
  address: string;
  balances: {
    ETH: number;
    USDT: number;
    USDC: number;
    BTC: number;
    // ... otros tokens
  };
  totalValueUSD: number;
  totalValueARS: number;
  lastUpdate: Date;
}

// Dashboard muestra:
// "🦊 MetaMask conectada"
// "ETH: 0.5 ($1,200 USD / $1,440,000 ARS)"
// "USDT: 1,000 ($1,000 USD / $1,200,000 ARS)"
// "Total: $2,200 USD / $2,640,000 ARS"

// Calculadora automática:
// "Con tus 1,000 USDT podrías:"
// "- Pasar a pesos al blue ($1,200): $1,200,000 ARS"
// "- Pasar a pesos al oficial ($1,000): $1,000,000 ARS"
// "Diferencia: $200,000 ARS (20% más con blue)"
```

**Conexión con MetaMask (ejemplo)**:

```typescript
// lib/integrations/metamask.ts
export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask no está instalada');
  }

  // Solicitar conexión
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const address = accounts[0];

  // Obtener balances
  const ethBalance = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  });

  // Obtener tokens ERC-20 (USDT, USDC, etc.)
  const usdtBalance = await getERC20Balance(address, USDT_CONTRACT);
  const usdcBalance = await getERC20Balance(address, USDC_CONTRACT);

  return {
    address,
    balances: {
      ETH: parseFloat(ethBalance) / 1e18,
      USDT: usdtBalance,
      USDC: usdcBalance,
    },
  };
}
```

**B. Calculadoras con datos reales**

```typescript
// Ejemplo: Calculadora de conversión
function CalculadoraConWallet() {
  const { saldoMercadoPago } = useWalletBalance();
  const { dolarBlue } = useDolar('blue');

  // Auto-completa con saldo real
  const [pesos, setPesos] = useState(saldoMercadoPago);

  return (
    <div>
      <p>Tu saldo disponible: ${saldoMercadoPago.toLocaleString()}</p>
      <button onClick={() => setPesos(saldoMercadoPago)}>
        Usar saldo completo
      </button>
      <p>Podrías comprar: USD ${(pesos / dolarBlue.venta).toFixed(2)}</p>
    </div>
  );
}
```

**C. Notificaciones contextuales**

```typescript
// "🔔 Con tu saldo actual de $50,000 podrías comprar USD $42
//  (antes eran USD $45). El dólar subió 7% esta semana."

// "💡 Si comprás hoy USD $40 con dólar blue a $1,200,
//  te quedarían $2,000 en tu cuenta de Mercado Pago."
```

**D. Simulaciones de escenarios**

```typescript
interface Scenario {
  action: 'buy_usd' | 'invest_plazo_fijo' | 'buy_crypto';
  amount: number;
  impact: {
    newBalance: number;
    expectedReturn: number;
    vsInflation: number;
  };
}

// "Si comprás USD $100 hoy y el dólar sube 10% en 3 meses:"
// "Tendrías: USD $100 (= $13,200 ARS)"
// "vs si dejabas en pesos: $11,500 (perdiste por inflación)"
// "Ganancia real: +$1,700 ARS (+14.7%)"
```

**E. Tracking de movimientos**

```typescript
// Historial de decisiones financieras
interface Transaction {
  date: Date;
  type: 'dolar_purchase' | 'crypto_purchase' | 'plazo_fijo';
  amountARS: number;
  rateAtTime: number;
  currentValue: number;
  profitLoss: number;
}

// Dashboard muestra:
// "Tus decisiones financieras"
// "15/01/2025: Compraste USD $100 a $1,150 → Hoy valen $1,210 (+5.2%)"
// "10/01/2025: Plazo fijo $10,000 al 133% TNA → Rendiste $450 vs inflación: -$200"
```

**Implementación técnica**:

```typescript
// lib/integrations/mercadopago.ts
export async function connectMercadoPago(accessToken: string) {
  const response = await fetch('https://api.mercadopago.com/v1/users/me/balance', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  return {
    balance: data.available_balance,
    currency: data.currency_id, // ARS
  };
}

// pages/dashboard/wallet-connect.tsx
export default function WalletConnectPage() {
  const [provider, setProvider] = useState<'mercadopago' | 'uala' | null>(null);

  const handleConnect = async (provider: string) => {
    if (provider === 'mercadopago') {
      // OAuth flow de Mercado Pago
      const authUrl = `https://auth.mercadopago.com/authorization?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
      window.location.href = authUrl;
    }
  };

  return (
    <div>
      <h1>Conectá tu billetera virtual</h1>
      <WalletProviderCard
        provider="mercadopago"
        onClick={() => handleConnect('mercadopago')}
      />
      <WalletProviderCard
        provider="uala"
        onClick={() => handleConnect('uala')}
      />
    </div>
  );
}
```

**Seguridad & Privacidad**:

- **OAuth 2.0** para autenticación (no guardamos contraseñas)
- **Read-only access** (solo lectura de saldos, nunca transferencias)
- **Encryption at rest** para tokens
- **Opt-in**: Usuario debe autorizar explícitamente
- **Disconnect fácil**: Un click para desconectar

**Monetización**:

- **Free tier**: Conectar 1 billetera
- **Premium**: Conectar múltiples billeteras + alertas de saldo + tracking histórico

**Ventaja competitiva**:
✅ **NINGUNA app de cotizaciones hace esto**
✅ Valor agregado enorme para el usuario
✅ Stickiness altísimo (una vez conectado, difícil cambiar de app)
✅ Datos para personalización y recomendaciones
✅ Diferenciador claro en marketing

**Riesgos**:

- **Complejidad técnica**: APIs de bancos pueden ser inestables
- **Mantenimiento**: Cambios en APIs requieren updates
- **Seguridad**: Manejar tokens sensibles
- **Regulación**: Posibles restricciones legales

**Mitigación**:

- Empezar solo con Mercado Pago (API más estable)
- Logging y monitoring exhaustivo
- Auditoría de seguridad antes de launch
- Consulta legal preventiva

---

#### 2.2 **Sistema de Notificaciones Push**

**Por qué**: Retención de usuarios + valor agregado

**Implementación**:

```typescript
// Usar OneSignal o Firebase Cloud Messaging
// hooks/useNotifications.ts
export function useNotifications() {
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Subscribe to push notifications
      const subscription = await registerServiceWorker();
      // Enviar subscription al backend
      await saveSubscription(subscription);
    }
  };

  return { requestPermission };
}
```

**Features**:

- Notificación cuando se dispara una alerta
- Notificación diaria con resumen de mercado (8am)
- Notificación de eventos importantes (ej: sube riesgo país >100 puntos)

#### 2.2 **Análisis Predictivo con IA**

**Por qué**: Valor agregado único

**Features**:

- Predicción de tendencia del dólar (ML model simple)
- Análisis de sentimiento de noticias
- Recomendaciones personalizadas

**Implementación**:

```typescript
// Usar OpenAI API o modelo local con TensorFlow.js
// api/predict/route.ts
export async function POST(req: Request) {
  const { cotizaciones } = await req.json();

  // Simple moving average + trend analysis
  const prediction = await predictTrend(cotizaciones);

  return Response.json({
    trend: 'upward' | 'downward' | 'stable',
    confidence: 0.75,
    reasoning: '...',
  });
}
```

#### 2.3 **Comparador de Precios Internacionales**

**Por qué**: Útil para entender poder adquisitivo

**Features**:

- Comparar precio de productos entre Argentina y USA
- Ejemplo: "iPhone 15 en Argentina vs USA (ajustado por salario promedio)"
- Integrar con APIs de e-commerce (MercadoLibre, Amazon)

#### 2.4 **Portfolio Tracker**

**Por qué**: Herramienta esencial para inversores

**Features**:

- Agregar inversiones (dólares, crypto, bonos, acciones)
- Calcular rendimiento total
- Gráfico de evolución del portfolio
- Comparar con inflación

**Implementación**:

```typescript
// lib/store/portfolio.ts
interface Portfolio {
  holdings: {
    type: 'crypto' | 'dolar' | 'stock' | 'bond';
    symbol: string;
    amount: number;
    buyPrice: number;
    buyDate: string;
  }[];
  totalValue: () => number;
  totalReturn: () => number;
  returnVsInflation: () => number;
}
```

#### 2.5 **Simulador de Escenarios**

**Por qué**: Herramienta educativa + engagement

**Features**:

- "¿Qué pasa si el dólar sube 20% en 3 meses?"
- "¿Qué pasa si la inflación baja a 50% anual?"
- Calcular impacto en ahorros, deudas, inversiones

#### 2.6 **Planificación de App Móvil** 🆕

**Por qué**: Mejor UX en mobile + notificaciones push nativas + presencia en stores

**Estrategia**:

**A. Investigación y planificación** (Mes 1-2 de Fase 2)

- [ ] Análisis de tráfico actual (% de usuarios mobile vs desktop)
- [ ] Estudio de competencia en App Store / Play Store
- [ ] Definir MVP de app móvil
- [ ] Research de tecnologías:
  - React Native con Expo (recomendado - reusar código web)
  - Flutter (si queremos mejor performance)
  - PWA mejorada (opción más rápida pero limitada)

**B. Stack técnico propuesto**

```typescript
// React Native + Expo
// Ventajas:
// - Reusar hooks y lógica de negocio de web
// - Hot reload / Fast refresh
// - Deploy over-the-air (updates sin App Store review)
// - Compartir API clients y utilities

// Compartir entre web y mobile:
/monorepo
├── /packages
│   ├── /shared              # Código compartido
│   │   ├── /hooks          # useDolar, useCrypto, etc.
│   │   ├── /utils          # formatters, logger
│   │   ├── /api            # API clients
│   │   └── /types          # TypeScript types
│   ├── /web                # Next.js app (actual)
│   └── /mobile             # React Native app
```

**C. Features prioritarias para MVP mobile**:

1. Dashboard de cotizaciones (dólar, crypto)
2. Favoritos
3. Alertas con notificaciones push nativas
4. 2-3 calculadoras más usadas
5. Gráficos básicos

**D. Features NO incluidas en MVP** (pueden esperar):

- Todas las 10+ calculadoras (solo las top 3)
- Sección política completa
- Datos FRED / ECB
- Portfolio tracker avanzado

**E. Timeline estimado**:

- **Mes 1**: Setup + arquitectura + pantallas principales
- **Mes 2**: Integrar APIs + funcionalidades core
- **Mes 3**: Testing + beta con usuarios
- **Mes 4**: Submit a stores + launch

**F. Monetización en mobile**:

- Modelo freemium igual que web
- In-app purchases para Premium
- No ads intrusivos (mejor UX)

**KPIs específicos de mobile**:

- 50% de usuarios web instalan app en 3 meses post-launch
- Rating >4.5 en stores
- 30% retención D7 (mejor que web típicamente)

---

**KPIs para esta fase completa**:

- 500 usuarios activos por semana
- 20% de usuarios retornan semanalmente
- 50+ notificaciones enviadas por día
- 10% de usuarios usan portfolio tracker
- 5+ billeteras conectadas (prueba de concepto)
- Plan de app móvil completado y aprobado

---

### FASE 3: Monetización (4-8 meses) 🔴 FUTURO

**Objetivo**: Generar ingresos sostenibles

#### 3.1 **Plan Premium (Freemium Model)**

**Free Tier** (actual):

- Cotizaciones en tiempo real
- Hasta 5 alertas
- Calculadoras básicas
- Datos históricos (30 días)

**Premium Tier** ($5-10 USD/mes):

- Alertas ilimitadas
- Datos históricos completos (5+ años)
- Exportar datos a Excel/CSV
- API access (rate limited)
- Análisis predictivo con IA
- Portfolio tracker avanzado
- Alertas por Telegram/WhatsApp
- Sin publicidad
- Soporte prioritario

**Implementación**:

```typescript
// Usar Stripe para pagos
// pages/api/stripe/create-checkout.ts
import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_PREMIUM_PLAN_ID',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/pricing`,
  });

  res.json({ url: session.url });
}
```

#### 3.2 **API Pública (B2B)**

**Modelo**:

- Free tier: 100 requests/día
- Basic: 10,000 requests/día - $50/mes
- Pro: 100,000 requests/día - $200/mes
- Enterprise: Ilimitado - Custom pricing

**Endpoints**:

```
GET /api/v1/cotizaciones/dolar
GET /api/v1/cotizaciones/crypto
GET /api/v1/inflacion/argentina
GET /api/v1/fred/indicators
GET /api/v1/politica/legisladores
```

**Clientes potenciales**:

- Fintechs argentinas
- Apps de inversión
- Medios de comunicación
- Investigadores / académicos

#### 3.3 **Afiliados & Comisiones**

**Partnerships**:

- Exchanges de crypto (Binance, Bitso) → Comisión por registro
- Brokers (PPI, IOL, Balanz) → Comisión por cuenta abierta
- Bancos (Cuenta digital Brubank, Ualá) → Comisión

**Implementación**:

- Agregar banners/cards con "Recomendado"
- Links con UTM tracking
- Dashboard de afiliados

#### 3.4 **Publicidad (Low Priority)**

**Por qué low priority**: Puede degradar UX

**Si se implementa**:

- Solo en free tier
- Ads relevantes (fintech, inversiones)
- Máximo 1 ad por página
- No ads intrusivos (pop-ups, videos con audio)

**KPIs para esta fase**:

- $1,000 USD/mes en ingresos recurrentes
- 100+ suscriptores premium
- 10+ clientes API
- Churn rate <10%

---

### FASE 4: Expansión Internacional (8-12 meses) 🟣 VISIÓN

**Objetivo**: Escalar a toda Latinoamérica + Launch de app móvil

#### 4.1 **Launch de App Móvil**

**Objetivo**: Lanzar app en App Store y Play Store

**Milestones**:

- [ ] Beta testing con 50+ usuarios
- [ ] Submit a App Store (iOS)
- [ ] Submit a Play Store (Android)
- [ ] Marketing campaign para launch
- [ ] Monitor métricas post-launch
- [ ] Iterar basado en feedback

**KPIs de launch**:

- 1,000 descargas primer mes
- Rating >4.5 estrellas
- 50% de usuarios web instalan app
- 30% retención D30

#### 4.2 **Expansión Multi-país**

**Países objetivo** (en orden de prioridad):

1. **Uruguay** (dólar + crypto)
   - Mercado similar a Argentina
   - Mismo idioma
   - APIs disponibles
2. **Chile** (UF + peso)
   - Economía más estable
   - Interés en crypto alto
3. **Brasil** (dólar + real)
   - Mercado enorme
   - Requiere traducción al portugués
4. **México** (dólar + peso)
   - Mercado grande
   - APIs de gobierno disponibles
5. **Colombia** (dólar + TRM)
   - Mercado emergente

**Implementación**:

```typescript
// lib/contexts/CountryContext.tsx
export const CountryContext = createContext<{
  country: 'AR' | 'UY' | 'CL' | 'BR' | 'MX' | 'CO';
  currency: string;
  locale: string;
  setCountry: (country: string) => void;
}>();

// Auto-detectar país
useEffect(() => {
  const country = detectCountry(); // Por IP o browser locale
  setCountry(country);
}, []);

// Ejemplo de uso:
const { country } = useCountry();

if (country === 'AR') {
  return <DolarArgentinaWidget />;
} else if (country === 'UY') {
  return <DolarUruguayWidget />;
}
```

**Desafíos**:

- Cada país tiene APIs diferentes
- Regulaciones locales distintas
- Traducción de contenido
- Marketing localizado

**Estrategia de entrada**:

1. Soft launch con landing localizada
2. Partnerships con influencers locales
3. Ads en redes sociales (Facebook, Instagram)
4. PR en medios de fintech locales

#### 4.3 **Billeteras Virtuales Multi-país**

Expandir integración de billeteras a otros países:

- **Uruguay**: Prex, Midinero
- **Chile**: Mach, Tenpo
- **Brasil**: PicPay, Mercado Pago BR
- **México**: Clip, Mercado Pago MX

#### 4.4 **Comunidad & Social**

**Features**:

- Foro/comentarios por cotización
- Análisis colaborativo
- Sistema de reputación (karma)
- Perfil de usuario público

**Por qué**: Engagement + contenido generado por usuarios (SEO)

---

## 💰 Monetización & Crecimiento

### Estrategia de Adquisición

#### 1. **SEO (Prioridad Alta)**

**Costo**: $0 (tiempo)
**ROI**: Alto a largo plazo

**Táctica**:

- Artículos educativos:
  - "Diferencia entre dólar blue, MEP y CCL"
  - "Cómo calcular inflación real"
  - "Guía completa de inversión en Argentina 2025"
- Long-tail keywords:
  - "calculadora plazo fijo con inflación"
  - "cotización dólar hoy en tiempo real"
  - "comparar inflación argentina vs usa"

#### 2. **Content Marketing**

**Costo**: $0-$500/mes (freelancer)
**ROI**: Medio a largo plazo

**Canales**:

- Blog con análisis semanal
- Newsletter semanal (Substack o propio)
- Threads de Twitter/X explicando economía
- Videos cortos para TikTok/Reels

#### 3. **Social Media**

**Costo**: $0-$200/mes (ads)
**ROI**: Medio a corto plazo

**Estrategia**:

- Twitter/X: Updates en tiempo real ("🚨 Dólar blue superó los $1,200")
- Instagram: Infografías educativas
- Reddit: r/merval, r/argentina (sin spam)
- LinkedIn: Análisis técnico para profesionales

#### 4. **Partnerships**

**Costo**: $0
**ROI**: Varía

**Ejemplos**:

- Colaborar con influencers de finanzas
- Guest posts en blogs de economía
- Integración con otras herramientas (MercadoPago, MercadoLibre)

### Proyección de Crecimiento (Conservador)

**Mes 1-3 (Fase 1)**:

- Usuarios: 50-100/semana
- Ingresos: $0
- Foco: Producto + SEO

**Mes 4-6 (Fase 2)**:

- Usuarios: 500-1,000/semana
- Ingresos: $0-$100/mes (primeros usuarios premium)
- Foco: Features diferenciadas + marketing

**Mes 7-9 (Fase 3)**:

- Usuarios: 2,000-5,000/semana
- Ingresos: $500-$1,500/mes
- Foco: Monetización + optimización conversión

**Mes 10-12 (Fase 4)**:

- Usuarios: 10,000+/semana
- Ingresos: $3,000-$5,000/mes
- Foco: Escalar + expansión

---

## 📊 Métricas de Éxito

### Métricas Clave (North Star Metrics)

1. **Weekly Active Users (WAU)**
   - Target: 10,000 WAU en 12 meses
   - Tracking: Google Analytics + DB custom

2. **Retention Rate (D7 / D30)**
   - Target: 30% retornan en 7 días, 15% en 30 días
   - Tracking: Cohort analysis

3. **Time on Site**
   - Target: >3 minutos promedio
   - Indica: Engagement alto

4. **Conversion Rate (Free → Premium)**
   - Target: 2-5% de free users se convierten
   - Tracking: Stripe + analytics

5. **Net Promoter Score (NPS)**
   - Target: >40 (bueno), >70 (excelente)
   - Tracking: Encuesta mensual

### Métricas Técnicas

1. **Performance**
   - Lighthouse score >90
   - First Contentful Paint <1.5s
   - Time to Interactive <3.5s

2. **Uptime**
   - Target: 99.9% uptime
   - Monitoring: UptimeRobot o StatusCake

3. **Error Rate**
   - Target: <1% de requests con error
   - Tracking: Sentry

### Dashboard de Métricas

Crear página interna `/admin/metrics` con:

- Usuarios activos (gráfico)
- Top cotizaciones vistas
- Top calculadoras usadas
- Revenue (si aplica)
- Performance scores

---

## 🎓 Recursos de Aprendizaje

### Para Entender el Código

1. **React Query**
   - [Docs oficiales](https://tanstack.com/query/latest)
   - [Video: React Query in 100 seconds](https://www.youtube.com/watch?v=novnyCaa7To)

2. **Zustand**
   - [Docs oficiales](https://zustand-demo.pmnd.rs/)
   - Super simple, leer el código en `lib/store/` es suficiente

3. **Next.js**
   - [Tutorial oficial](https://nextjs.org/learn)
   - [Video: Next.js 15 in 100 seconds](https://www.youtube.com/watch?v=Sklc_fQBmcs)

4. **TypeScript**
   - [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
   - [Cheat sheet](https://www.typescriptlang.org/cheatsheets)

### Para Entender la Estrategia

1. **Product Market Fit**
   - Libro: "The Lean Startup" - Eric Ries
   - Artículo: [How to Find Product-Market Fit](https://www.ycombinator.com/library/5z-how-to-find-product-market-fit)

2. **Growth**
   - Libro: "Traction" - Gabriel Weinberg
   - Framework: [Bullseye Framework](https://www.tractionbook.com/)

3. **Monetización**
   - Artículo: [SaaS Pricing Strategies](https://www.priceintelligently.com/blog)
   - Libro: "Monetizing Innovation"

---

## 🚀 Próximos Pasos Inmediatos

### Esta Semana

1. [ ] Leer este documento completo
2. [ ] Agregar Google Analytics
3. [ ] Crear página `/roadmap` pública (transparencia)
4. [ ] Escribir primer artículo de blog SEO

### Próximas 2 Semanas

1. [ ] Implementar tests básicos
2. [ ] Optimizar performance (Lighthouse audit)
3. [ ] Lanzar newsletter signup
4. [ ] Primera campaña en redes sociales

### Próximo Mes

1. [ ] 100 usuarios activos/semana
2. [ ] 5 artículos de blog publicados
3. [ ] Comenzar Fase 2 (features diferenciadas)
4. [ ] Primeras conversaciones con potenciales partners

---

## 💡 Principios Guía

1. **Simplicidad primero**: No agregar features "porque sí"
2. **Datos sobre opiniones**: Medir todo, decidir con datos
3. **Usuario al centro**: Si no agrega valor al usuario, no va
4. **Velocidad de iteración**: Lanzar rápido, aprender, mejorar
5. **Sostenibilidad**: Buscar monetización temprano (no vivir de ahorros)
6. **Transparencia**: Código abierto, fuentes verificables
7. **Calidad > Cantidad**: Mejor 5 features excelentes que 20 mediocres

---

## 📞 Preguntas Frecuentes

### ¿Por dónde empiezo?

1. Terminar Fase 1 (consolidación)
2. Implementar analytics
3. Escribir contenido para SEO
4. Conseguir primeros 100 usuarios

### ¿Cuándo lanzo features premium?

Cuando tengas:

- 500+ usuarios activos semanales
- Claro entendimiento de qué features valoran más
- NPS >40

### ¿Necesito investors?

No inicialmente. Con:

- $0 en infraestructura (Vercel free tier, APIs gratuitas)
- $50/mes para APIs premium (FRED, etc.)
- $100/mes para marketing (opcional)

Puedes bootstrappear hasta $1,000-$2,000 MRR.

Recién buscar inversión cuando:

- Tengas tracción clara (10k+ usuarios)
- Quieras escalar rápido (contratar equipo)
- Necesites capital para expansión (otros países)

### ¿Qué hago si una feature no funciona?

**Método científico**:

1. Definir hipótesis ("Los usuarios quieren X")
2. Implementar MVP de X
3. Medir adopción (analytics)
4. Si <10% usa X en 2 semanas → remover o pivotar

**No te enamores de features**. El usuario decide qué vale y qué no.

---

## 🎯 TL;DR - Resumen Ejecutivo

**Estado actual**: Plataforma funcional con 8 productos core + datos en tiempo real

**Ventaja competitiva clave**:

- Todo-en-uno + enfoque argentino + datos USA (único)
- **🆕 FEATURE ÚNICA**: Integración con billeteras virtuales (Mercado Pago, Ualá, etc.)
  - Ninguna app de cotizaciones hace esto
  - Game changer para UX y retención

**Roadmap actualizado**:

1. **Fase 1 (1-2 meses)**: Consolidar + **Landing page** + SEO → 100 usuarios/semana
2. **Fase 2 (2-4 meses)**:
   - **💎 Integración billeteras virtuales** (diferenciador total)
   - **📱 Planificación app móvil** (React Native)
   - Features únicas (IA, portfolio, notificaciones push)
   - → 500 usuarios/semana
3. **Fase 3 (4-8 meses)**:
   - Monetización (premium $5-10/mes, API B2B)
   - Afiliados con exchanges y fintechs
   - → $1,000-$1,500/mes
4. **Fase 4 (8-12 meses)**:
   - **Launch app móvil** (iOS + Android)
   - Expansión LATAM (Uruguay, Chile, Brasil)
   - Billeteras virtuales multi-país
   - → $5,000-$10,000/mes

**Diferenciadores principales**:

1. **Billeteras virtuales integradas** ← ÚNICO EN EL MERCADO
2. Comparación Argentina vs USA (datos FRED)
3. Calculadoras con datos reales del usuario
4. Todo en un solo lugar (no 5+ apps)

**Próximos pasos inmediatos**:

1. Diseñar landing page de conversión
2. Implementar analytics
3. Contenido SEO
4. Investigar API de Mercado Pago para billeteras

**Meta 12 meses**:

- 10,000 usuarios activos semanales
- 100+ suscriptores premium
- $3,000-$5,000 MRR
- App móvil en beta
- 20+ billeteras conectadas (proof of concept)

---

**Última actualización**: 2025-01-14
**Versión**: 2.0 - ACTUALIZADO con features innovadoras
**Autor**: DolarGaucho Team

**🆕 Cambios v2.0**:

- ✅ Agregada feature de integración con billeteras virtuales (GAME CHANGER)
- ✅ Planificación de app móvil adelantada a Fase 2
- ✅ Landing page de conversión agregada a Fase 1
- ✅ KPIs actualizados para reflejar nuevas features

---

_"La mejor plataforma no es la que tiene más features, sino la que resuelve mejor los problemas del usuario."_ ✨
