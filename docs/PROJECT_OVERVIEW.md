# Dólar Gaucho - Project Overview

## 📋 Table of Contents
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [API Integrations](#api-integrations)
- [State Management](#state-management)
- [Theme System](#theme-system)
- [Getting Started](#getting-started)

---

## 🎯 Project Description

**Dólar Gaucho** is a comprehensive financial dashboard for tracking Argentine economic indicators in real-time. The application provides:

- Real-time dollar exchange rates (all types: official, blue, MEP, CCL, etc.)
- International currency quotations (EUR, BRL, CLP, UYU)
- Inflation data and calculators
- Political data (Senators, Deputies, Senate proceedings)
- Financial indices (Riesgo País, UVA, interest rates, mutual funds)
- Event calendar (holidays and presidential events)
- Alert system for price thresholds
- Customizable favorites system

**Target Audience**: Financial professionals, traders, economists, and anyone interested in Argentine economic data.

---

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### State & Data Management
- **TanStack Query v5** - Server state management, caching, and data fetching
- **Zustand** - Client state management (favorites, alerts)
- **Zustand Persist** - State persistence to localStorage

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **CVA (Class Variance Authority)** - Component variant management
- **Framer Motion** - Animations and transitions
- **React Icons** - Icon library
- **OGL** - WebGL library for Aurora effect

### Charts & Visualization
- **Recharts** - Chart library for financial data visualization

### Authentication
- **Supabase** - Backend as a Service (auth, database)

### Developer Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

---

## 📁 Project Structure

```
dolargaucho-retro/
├── app/                        # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── documents/        # Document management endpoints
│   │   └── news/             # News aggregation endpoints
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── providers.tsx         # Global providers (QueryClient, Theme)
│
├── pages/                      # Pages Router (legacy/hybrid)
│   ├── dashboard/            # Dashboard pages
│   │   ├── index.tsx         # Main dashboard
│   │   ├── favoritos.tsx     # Favorites page
│   │   ├── analisis.tsx      # Market analysis
│   │   ├── politica.tsx      # Political data
│   │   ├── finanzas.tsx      # Financial indices
│   │   ├── calculadoras.tsx  # Financial calculators
│   │   ├── alertas.tsx       # Alert management
│   │   └── calendario.tsx    # Events calendar
│   ├── api/                  # API endpoints
│   ├── auth/                 # Authentication pages
│   ├── _app.tsx              # App wrapper
│   └── _document.tsx         # Document wrapper
│
├── components/                 # React components
│   ├── ui/                   # Reusable UI components
│   │   ├── Button/           # Button component
│   │   ├── Card/             # Card component
│   │   ├── Input/            # Input component
│   │   ├── Aurora/           # WebGL Aurora background
│   │   ├── DolarMarquee/     # Scrolling ticker
│   │   ├── NavbarPro/        # Navigation bar
│   │   ├── RiesgoPaisBadge/  # Country risk badge
│   │   ├── ThemeToggle/      # Dark/light mode toggle
│   │   └── GlobalSearch/     # Search component
│   ├── calculadoras/         # Financial calculators
│   │   ├── CalculadoraInflacion.tsx
│   │   ├── CalculadoraPlazoFijo.tsx
│   │   └── CalculadoraDolar.tsx
│   ├── charts/               # Chart components
│   │   ├── inflationchart.tsx
│   │   └── InflacionChart.tsx
│   ├── alertas/              # Alert components
│   ├── calendario/           # Calendar components
│   ├── politica/             # Political data components
│   ├── finanzas/             # Financial components
│   ├── layouts/              # Layout components
│   │   ├── DashboardLayout.tsx
│   │   └── UnifiedNavbar.tsx
│   ├── hero.tsx              # Landing page hero
│   ├── footer.tsx            # Footer
│   ├── dolartable.tsx        # Dollar rates table
│   ├── contactform.tsx       # Contact form
│   └── faqs.tsx              # FAQ section
│
├── hooks/                      # Custom React hooks
│   ├── useDolarQuery.ts      # Dollar quotations (TanStack Query)
│   ├── useDolarVariations.ts # Dollar variations with historical data
│   ├── useCotizaciones.ts    # International currencies
│   ├── useInflacion.ts       # Inflation data
│   ├── usePolitica.ts        # Political data
│   ├── useFinanzas.ts        # Financial indices
│   ├── useEventos.ts         # Events and holidays
│   ├── useDolar.ts          # [DEPRECATED] Legacy hook
│   └── useArgentinaData.ts   # [NEEDS MIGRATION] Monolithic data fetcher
│
├── lib/                        # Utilities and configuration
│   ├── api/                  # API integration utilities
│   ├── config/               # Configuration files
│   │   └── api.ts           # API endpoints and cache config
│   ├── contexts/             # React contexts
│   │   └── ThemeContext.tsx # Theme provider
│   ├── store/                # Zustand stores
│   │   ├── favorites.ts     # Favorites store (ACTIVE)
│   │   └── alertas.ts       # Alerts store
│   ├── auth/                 # Authentication helpers
│   └── utils/                # Utility functions
│       └── storage.ts        # localStorage utilities
│
├── types/                      # TypeScript type definitions
│   ├── api/                  # API response types
│   │   ├── dolar.ts         # DolarAPI types
│   │   └── argentina.ts     # ArgentinaData API types
│   ├── database.ts           # Supabase database types
│   ├── user.ts               # User types
│   └── alertas.ts            # Alert types
│
├── styles/                     # Global styles
│   └── globals.css           # Global CSS with theme variables
│
├── public/                     # Static assets
│   ├── logo.svg
│   └── images/
│
└── __tests__/                  # Test files
```

---

## ✨ Key Features

### 1. Real-Time Financial Data
- **Auto-refresh**: Data updates every 30 seconds
- **Live Ticker**: Scrolling marquee with key rates
- **Variation Indicators**: Real-time percentage changes with historical comparison

### 2. Favorites System
- **Centralized State**: Zustand store with localStorage persistence
- **Multi-type Support**: Save both dollar rates and international currencies
- **Quick Access**: Favorites appear prominently on dashboard

### 3. Alert System
- **Price Thresholds**: Set alerts for specific price levels
- **Multiple Types**: Support for all dollar types and currencies
- **Persistent Storage**: Alerts saved to localStorage

### 4. Theme System
- **Dark/Light Modes**: Full theme support
- **CSS Variables**: Centralized color system
- **Smooth Transitions**: Animated theme changes

### 5. Interactive Calculators
- **Inflation Calculator**: Calculate inflation impact over time
- **Fixed-Term Calculator**: Calculate returns on fixed-term deposits
- **Dollar Converter**: Convert between different dollar types

### 6. Political Data
- **Senators & Deputies**: Complete database with filtering
- **Senate Proceedings**: Historical record of sessions
- **Statistical Analysis**: Party blocks and province statistics

### 7. Financial Indices
- **Riesgo País**: Country risk indicator with trend analysis
- **Mutual Funds (FCI)**: Complete list with performance metrics
- **Interest Rates**: UVA, TNA, TEA tracking

---

## 🏗 Architecture

### Data Fetching Pattern

```typescript
// TanStack Query hook pattern
export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async () => {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 30000,           // 30 seconds
    refetchInterval: 30000,     // Auto-refetch every 30s
    retry: 3,                   // Retry 3 times on failure
  });
}
```

### State Management Pattern

```typescript
// Zustand store with persistence
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
      // ... more actions
    }),
    {
      name: 'dolargaucho_favorites', // localStorage key
    }
  )
);
```

### Component Pattern

```typescript
// Modular component with hooks
export default function DashboardPage() {
  const { data: dolares, isLoading } = useDolarVariations();
  const { dolares: favoriteIds, toggleDolar } = useFavoritesStore();

  const favorites = dolares?.filter((d) => favoriteIds.includes(d.casa));

  return (
    <DashboardLayout>
      {favorites.map((dolar) => (
        <Card key={dolar.casa}>
          <DolarDisplay data={dolar} onToggleFavorite={toggleDolar} />
        </Card>
      ))}
    </DashboardLayout>
  );
}
```

---

## 🔌 API Integrations

### DolarAPI (Primary)
**Base URL**: `https://dolarapi.com/v1`

**Endpoints**:
- `GET /dolares` - All dollar quotations
- `GET /dolares/{type}` - Specific dollar type (oficial, blue, bolsa, etc.)
- `GET /cotizaciones` - International currencies
- `GET /cotizaciones/{currency}` - Specific currency (eur, brl, clp, uyu)

**Response Format**:
```json
{
  "casa": "oficial",
  "nombre": "Oficial",
  "compra": 1050.00,
  "venta": 1090.00,
  "fechaActualizacion": "2025-01-15T10:30:00.000Z",
  "moneda": "USD"
}
```

**Cache Strategy**: 30 seconds stale time, 30 seconds refetch interval

### ArgentinaData API (Secondary)
**Base URL**: `https://api.argentinadatos.com/v1`

**Categories**:

1. **Finanzas** (`/finanzas/*`)
   - `/finanzas/indices` - Financial indices
   - `/finanzas/tasas` - Interest rates
   - `/finanzas/riesgo-pais` - Country risk
   - `/finanzas/indices/uva/{date}` - Historical UVA

2. **Política** (`/politica/*`)
   - `/politica/senadores` - Senators database
   - `/politica/diputados` - Deputies database
   - `/politica/actas-senado` - Senate proceedings

3. **Eventos** (`/eventos/*`)
   - `/eventos/feriados/{year}` - Holidays
   - `/eventos/presidenciales` - Presidential events

4. **Cotizaciones** (`/cotizaciones/*`)
   - `/cotizaciones/dolares/{type}/{date}` - Historical dollar rates
   - `/cotizaciones/{currency}/{date}` - Historical currency rates

**Cache Strategy**: Varies by data type
- Political data: 24 hours (changes infrequently)
- Financial indices: 15 minutes to 1 hour
- Historical data: 1 hour (immutable)

---

## 🗄 State Management

### Global State (Zustand)

#### Favorites Store
**Location**: `/lib/store/favorites.ts`

**State**:
```typescript
{
  dolares: string[],      // Array of casa IDs
  currencies: string[],   // Array of currency codes
}
```

**Actions**:
- `addDolar(casa)` - Add dollar to favorites
- `removeDolar(casa)` - Remove dollar from favorites
- `toggleDolar(casa)` - Toggle dollar favorite status
- `addCurrency(moneda)` - Add currency to favorites
- `removeCurrency(moneda)` - Remove currency from favorites
- `toggleCurrency(moneda)` - Toggle currency favorite status
- `getTotalCount()` - Get total number of favorites
- `clearAll()` - Clear all favorites

**Persistence**: Saved to `localStorage` under key `dolargaucho_favorites`

#### Alerts Store
**Location**: `/lib/store/alertas.ts`

**State**:
```typescript
{
  alertas: Alerta[],  // Array of alert objects
}
```

**Alert Object**:
```typescript
{
  id: string,
  type: 'dolar' | 'currency',
  casa: string,
  threshold: number,
  condition: 'above' | 'below',
  active: boolean,
  createdAt: Date,
}
```

**Persistence**: Saved to `localStorage` under key `dolargaucho_alertas`

### Server State (TanStack Query)

**Global Configuration**: `/app/providers.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute default
      gcTime: 5 * 60 * 1000,       // 5 minutes garbage collection
      retry: 3,                     // Retry failed requests 3 times
      refetchOnWindowFocus: true,   // Refetch when window regains focus
      refetchOnReconnect: true,     // Refetch when reconnecting
    },
  },
});
```

**Query Keys Pattern**:
- `['dolares']` - All dollar quotations
- `['dolares', type]` - Specific dollar type
- `['dolares-historical', date]` - Historical dollar rates
- `['cotizaciones']` - All international currencies
- `['cotizaciones-historical', date]` - Historical currency rates
- `['inflacion']` - Inflation data
- `['senadores']` - Senators
- `['diputados']` - Deputies
- `['riesgo-pais']` - Country risk
- `['feriados', year]` - Holidays for specific year

---

## 🎨 Theme System

### CSS Variables

**Location**: `/styles/globals.css`

#### Light Theme (`:root`)
```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --panel: #f5f5f5;
  --border: rgba(0, 0, 0, 0.1);

  /* Text colors */
  --text-primary: #0a0a0a;
  --text-secondary: #666666;

  /* Accent colors */
  --accent-emerald: #10b981;
  --accent-teal: #14b8a6;

  /* Semantic colors */
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
}
```

#### Dark Theme (`.dark`)
```css
.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --panel: #1a1a1a;
  --border: rgba(255, 255, 255, 0.2);

  --text-primary: #ededed;
  --text-secondary: #a3a3a3;

  /* Accent colors remain the same */
}
```

### Tailwind Integration

**Location**: `/tailwind.config.ts`

```typescript
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      panel: 'var(--panel)',
      border: 'var(--border)',
      // ... more colors
    },
  },
}
```

### Utility Classes

**Glass Effects**:
```css
.glass {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
}

.glass-strong {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border);
}
```

**Gradient Text**:
```css
.gradient-text {
  background: linear-gradient(135deg, var(--accent-emerald), var(--accent-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Theme Context

**Location**: `/lib/contexts/ThemeContext.tsx`

```typescript
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dolargaucho-retro.git
cd dolargaucho-retro
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

---

## 📊 Performance Optimizations

### Code Splitting
- Lazy loading of dashboard components
- Dynamic imports for heavy libraries (charts, calculators)

### Caching Strategy
- Aggressive caching for political data (24 hours)
- Moderate caching for financial data (15-60 minutes)
- Short caching for real-time quotes (30 seconds)

### Image Optimization
- Next.js Image component for optimized images
- SVG icons for better performance

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression in production

---

## 🔒 Security

### API Security
- No API keys exposed (public APIs only)
- CORS properly configured
- Rate limiting considerations

### Authentication
- Supabase RLS (Row Level Security)
- JWT token-based authentication
- Secure session management

### Data Validation
- TypeScript for type safety
- Input validation on all forms
- Sanitization of user inputs

---

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/
├── hooks/
└── utils/
```

### Testing Tools
- Jest (planned)
- React Testing Library (planned)
- Cypress for E2E (planned)

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for guidelines.

---

## 📧 Contact

For questions or support, please contact: [your-email@example.com]
