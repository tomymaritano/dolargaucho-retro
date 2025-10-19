# Fintech UI Components Guide

## Overview

This guide documents the new fintech-grade UI components created to transform Dólar Gaucho into a professional fintech application matching the quality of Mercado Pago, Ualá, Nubank, and Brubank.

## 📦 New Components

### 1. IconBadge

**Purpose:** Colored icon backgrounds common in fintech apps

**Usage:**

```tsx
import { IconBadge } from '@/components/ui/IconBadge';
import { FaDollarSign } from 'react-icons/fa';

<IconBadge icon={<FaDollarSign />} color="emerald" size="lg" shape="circle" hover="scale" />;
```

**Props:**

- `icon` - React node (icon component)
- `color` - 'emerald' | 'teal' | 'blue' | 'indigo' | 'purple' | 'orange' | 'red' | 'gray'
- `size` - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `shape` - 'circle' | 'rounded' | 'square'
- `hover` - 'none' | 'scale' | 'glow' | 'lift'
- `onClick` - Optional click handler (becomes button if provided)

**Use Cases:**

- Feature cards with colored icons
- Navigation menu items
- Quick stats displays
- Profile badges

---

### 2. StatusBadge

**Purpose:** Pill-style status indicators (NEW, POPULAR, TRENDING, HOT)

**Usage:**

```tsx
import { StatusBadge, NewBadge, PopularBadge } from '@/components/ui/StatusBadge';

<StatusBadge variant="emerald" size="sm" pulse>
  NUEVO
</StatusBadge>

// Pre-configured badges
<NewBadge size="md" />
<PopularBadge />
<TrendingBadge />
<HotBadge />
```

**Props:**

- `variant` - 'success' | 'info' | 'warning' | 'error' | 'emerald' | 'purple' | 'gold' | 'default' | 'outlined'
- `size` - 'xs' | 'sm' | 'md' | 'lg'
- `pulse` - boolean (adds pulse animation)
- `icon` - Optional icon

**Use Cases:**

- Feature labels
- Status indicators
- Promotional tags
- Category badges

---

### 3. SegmentedControl

**Purpose:** iOS-style segmented control for filtering/tabs (like Ualá)

**Usage:**

```tsx
import { SegmentedControl } from '@/components/ui/SegmentedControl';

const [filter, setFilter] = useState('all');

<SegmentedControl
  options={[
    { value: 'all', label: 'Todos' },
    { value: 'crypto', label: 'Crypto', icon: <FaBitcoin /> },
    { value: 'dolares', label: 'Dólares' },
  ]}
  value={filter}
  onChange={setFilter}
  size="md"
  fullWidth
/>;
```

**Props:**

- `options` - Array of `{ value, label, icon?, disabled? }`
- `value` - Current selected value
- `onChange` - Callback when selection changes
- `size` - 'sm' | 'md' | 'lg'
- `fullWidth` - boolean

**Features:**

- Smooth sliding indicator animation
- Keyboard navigation (arrow keys)
- Accessibility support

**Use Cases:**

- Dashboard filters
- View switchers
- Category selectors
- Time period selectors (24h, 7d, 30d)

---

### 4. BottomSheet

**Purpose:** Mobile-first modal that slides up from bottom (like Mercado Pago)

**Usage:**

```tsx
import { BottomSheet } from '@/components/ui/BottomSheet';

const [isOpen, setIsOpen] = useState(false);

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Detalles del Dólar"
  showHandle
  maxHeight="lg"
>
  <div>{/* Content here */}</div>
</BottomSheet>;
```

**Props:**

- `isOpen` - boolean
- `onClose` - Callback to close
- `title` - Optional title
- `showHandle` - Show drag handle (default: true)
- `showCloseButton` - Show X button (default: true)
- `maxHeight` - 'sm' | 'md' | 'lg' | 'xl' | 'full'

**Features:**

- Swipe down to close gesture
- Backdrop click to close
- Escape key support
- Desktop: centered modal, Mobile: bottom sheet
- Scrollable content

**Use Cases:**

- Transaction details
- Quick actions
- Forms
- Filters
- Confirmations

---

### 5. CircularProgress

**Purpose:** Circular progress indicator for metrics, goals, completion

**Usage:**

```tsx
import { CircularProgress, ProgressGoal } from '@/components/ui/CircularProgress';

// Basic usage
<CircularProgress
  value={75}
  size="lg"
  color="emerald"
  showPercentage
  gradient
/>

// Pre-configured goal tracker
<ProgressGoal
  current={7500}
  target={10000}
  size="xl"
  color="blue"
/>
```

**Props:**

- `value` - 0-100 percentage
- `size` - 'sm' | 'md' | 'lg' | 'xl'
- `color` - 'emerald' | 'blue' | 'purple' | 'gold' | 'error'
- `showPercentage` - boolean
- `label` - Optional label below percentage
- `gradient` - Enable gradient effect
- `children` - Custom center content

**Use Cases:**

- Savings goals
- Budget usage
- Profile completion
- Achievement progress

---

### 6. LinearProgress

**Purpose:** Linear progress bar for loading states and completion tracking

**Usage:**

```tsx
import { LinearProgress, LoadingProgress, StepProgress } from '@/components/ui/LinearProgress';

// Determinate progress
<LinearProgress
  value={60}
  size="md"
  color="emerald"
  gradient
  showPercentage
  label="Cargando datos"
/>

// Indeterminate (loading)
<LoadingProgress size="sm" />

// Step indicator
<StepProgress currentStep={2} totalSteps={4} />
```

**Props:**

- `value` - 0-100 (undefined for indeterminate)
- `size` - 'xs' | 'sm' | 'md' | 'lg'
- `color` - 'emerald' | 'blue' | 'purple' | 'gold' | 'error'
- `gradient` - boolean
- `showPercentage` - boolean
- `label` - Optional label

**Use Cases:**

- Page loading
- File uploads
- Multi-step forms
- Data processing

---

### 7. Skeleton Components

**Purpose:** Skeleton screens for better loading UX

**Usage:**

```tsx
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonStat,
  SkeletonDashboard
} from '@/components/ui/SkeletonCard';

// Basic skeleton
<Skeleton variant="rounded" width="200px" height="40px" />

// Pre-built skeletons
<SkeletonCard />
<SkeletonList count={5} />
<SkeletonTable rows={8} cols={5} />
<SkeletonStat />
<SkeletonDashboard /> {/* Full dashboard skeleton */}
```

**Use Cases:**

- Loading states
- Data fetching placeholders
- Better perceived performance

---

### 8. QuickActionButton

**Purpose:** Large, prominent action buttons with icons (fintech-style)

**Usage:**

```tsx
import { QuickActionButton, QuickActionsGrid } from '@/components/ui/QuickActionButton';
import { FaDollarSign, FaBitcoin, FaChartLine } from 'react-icons/fa';

<QuickActionsGrid columns={3}>
  <QuickActionButton
    icon={<FaDollarSign />}
    label="Dólares"
    description="Ver cotizaciones"
    variant="emerald"
    size="md"
    onClick={() => router.push('/dashboard')}
  />

  <QuickActionButton
    icon={<FaBitcoin />}
    label="Crypto"
    description="Bitcoin, USDT"
    variant="blue"
    badge={3}
    onClick={() => router.push('/dashboard/crypto')}
  />

  <QuickActionButton
    icon={<FaChartLine />}
    label="Análisis"
    variant="purple"
    onClick={() => router.push('/dashboard/analisis')}
  />
</QuickActionsGrid>;
```

**Props:**

- `icon` - React node
- `label` - Button label
- `description` - Optional description text
- `badge` - Optional notification badge number
- `variant` - 'emerald' | 'blue' | 'purple' | 'gold' | 'gray' | 'solid'
- `size` - 'sm' | 'md' | 'lg'
- `disabled` - boolean
- `onClick` - Click handler

**Use Cases:**

- Dashboard quick actions
- Feature navigation
- Primary CTAs
- Category selectors

---

### 9. Enhanced Card Component

**Update:** Card component now has elevation variants

**New Props:**

- `elevation` - 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `hover` - 'none' | 'scale' | 'glow' | 'lift'

**Usage:**

```tsx
<Card variant="elevated" elevation="lg" hover="lift" padding="lg">
  {/* Content */}
</Card>
```

---

## 🎨 Fintech Design Patterns

### Pattern 1: Dashboard Quick Actions

```tsx
import { QuickActionsGrid, QuickActionButton } from '@/components/ui/QuickActionButton';
import { IconBadge } from '@/components/ui/IconBadge';

<Card elevation="md" padding="lg">
  <div className="flex items-center gap-3 mb-6">
    <IconBadge icon={<FaHome />} color="emerald" size="lg" />
    <div>
      <h2 className="text-xl font-bold">Acciones Rápidas</h2>
      <p className="text-sm text-secondary">Accede a tus funciones favoritas</p>
    </div>
  </div>

  <QuickActionsGrid columns={4}>
    <QuickActionButton icon={<FaDollarSign />} label="Dólares" variant="emerald" />
    <QuickActionButton icon={<FaBitcoin />} label="Crypto" variant="blue" badge={2} />
    <QuickActionButton icon={<FaCalculator />} label="Calcular" variant="purple" />
    <QuickActionButton icon={<FaChartLine />} label="Análisis" variant="gold" />
  </QuickActionsGrid>
</Card>;
```

### Pattern 2: Stat Card with Progress

```tsx
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { CircularProgress } from '@/components/ui/CircularProgress';

<Card elevation="lg" hover="lift" padding="lg">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <IconBadge icon={<FaDollarSign />} color="emerald" size="md" />
      <div>
        <p className="text-sm text-secondary">Dólar Blue</p>
        <h3 className="text-2xl font-bold text-accent-emerald">$1,234.50</h3>
      </div>
    </div>
    <CircularProgress value={75} size="md" color="emerald" showPercentage />
  </div>

  <LinearProgress value={75} color="emerald" gradient />
</Card>;
```

### Pattern 3: Feature Card with Badge

```tsx
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { NewBadge } from '@/components/ui/StatusBadge';

<Card elevation="md" hover="scale" padding="lg">
  <div className="flex items-start gap-4">
    <IconBadge icon={<FaBitcoin />} color="blue" size="xl" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-bold">Criptomonedas</h3>
        <NewBadge />
      </div>
      <p className="text-sm text-secondary mb-4">
        Seguí las cotizaciones de Bitcoin, Ethereum, USDT y más
      </p>
      <button className="text-sm text-accent-emerald hover:text-accent-teal font-semibold">
        Ver cotizaciones →
      </button>
    </div>
  </div>
</Card>;
```

### Pattern 4: Segmented Filter

```tsx
import { SegmentedControl } from '@/components/ui/SegmentedControl';

const [period, setPeriod] = useState('24h');

<SegmentedControl
  options={[
    { value: '24h', label: '24h' },
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
  ]}
  value={period}
  onChange={setPeriod}
  size="md"
  fullWidth
/>;
```

### Pattern 5: Bottom Sheet Action

```tsx
import { BottomSheet } from '@/components/ui/BottomSheet';
import { QuickActionButton } from '@/components/ui/QuickActionButton';

const [showActions, setShowActions] = useState(false);

<BottomSheet isOpen={showActions} onClose={() => setShowActions(false)} title="Acciones">
  <QuickActionsGrid columns={2}>
    <QuickActionButton icon={<FaStar />} label="Agregar a Favoritos" variant="emerald" />
    <QuickActionButton icon={<FaBell />} label="Crear Alerta" variant="blue" />
    <QuickActionButton icon={<FaShare />} label="Compartir" variant="purple" />
    <QuickActionButton icon={<FaCalculator />} label="Calcular" variant="gold" />
  </QuickActionsGrid>
</BottomSheet>;
```

---

## 🚀 Migration Guide

### Converting Tables to Card-Based Layouts

**Before (Table):**

```tsx
<DolaresTable />
```

**After (Fintech Card Grid):**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {dolares.map((dolar) => (
    <Card key={dolar.casa} elevation="md" hover="lift" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <IconBadge icon={<FaDollarSign />} color="emerald" size="lg" />
          <div>
            <h3 className="text-lg font-bold">{dolar.nombre}</h3>
            <p className="text-sm text-secondary">{dolar.casa}</p>
          </div>
        </div>
        <NewBadge />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-secondary">Compra</span>
          <span className="font-semibold">${dolar.compra.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-secondary">Venta</span>
          <span className="text-lg font-bold text-accent-emerald">${dolar.venta.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <LinearProgress value={75} size="sm" color="emerald" gradient />
      </div>
    </Card>
  ))}
</div>
```

### Adding Loading States

**Before:**

```tsx
{
  loading && <div>Cargando...</div>;
}
```

**After:**

```tsx
{
  loading ? <SkeletonDashboard /> : <Dashboard data={data} />;
}
```

---

## 🎯 Best Practices

1. **Use Cards Over Tables** - For primary data, prefer card-based layouts for better mobile UX
2. **Add Elevation** - Use `elevation="md"` or `elevation="lg"` on important cards
3. **Use IconBadge** - Wrap icons in IconBadge for professional colored backgrounds
4. **Add Status Badges** - Use NewBadge, PopularBadge for feature discovery
5. **Implement Skeleton Screens** - Never show blank screens while loading
6. **Use BottomSheet on Mobile** - Replace desktop modals with BottomSheet for mobile
7. **Add Quick Actions** - Use QuickActionButton for primary CTAs
8. **Use SegmentedControl** - Replace dropdown filters with segmented controls when possible
9. **Show Progress** - Use CircularProgress or LinearProgress for goals and metrics
10. **Hover Effects** - Always use `hover="lift"` or `hover="scale"` on interactive cards

---

## 📱 Mobile-First Examples

### Dashboard Quick Stats (Mobile-Optimized)

```tsx
<div className="grid grid-cols-2 gap-4">
  <Card elevation="md" padding="md">
    <IconBadge icon={<FaStar />} color="gold" size="sm" className="mb-2" />
    <div className="text-2xl font-bold text-accent-gold">12</div>
    <div className="text-xs text-secondary">Favoritos</div>
  </Card>

  <Card elevation="md" padding="md">
    <IconBadge icon={<FaBell />} color="blue" size="sm" className="mb-2" />
    <div className="text-2xl font-bold text-accent-blue">5</div>
    <div className="text-xs text-secondary">Alertas</div>
  </Card>
</div>
```

---

## 🎨 Color Guidelines

Match fintech apps by using vibrant, purpose-driven colors:

- **Emerald** (`#10B981`) - Money, success, primary actions
- **Blue** (`#3B82F6`) - Information, crypto, secondary actions
- **Purple** (`#A855F7`) - Premium features, analytics
- **Gold** (`#F59E0B`) - Trending, popular, important
- **Red** (`#EF4444`) - Alerts, errors, critical actions

---

## ✅ Complete Example: Fintech Dashboard

```tsx
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { NewBadge, PopularBadge } from '@/components/ui/StatusBadge';
import { QuickActionsGrid, QuickActionButton } from '@/components/ui/QuickActionButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { LinearProgress } from '@/components/ui/LinearProgress';

export default function FintechDashboard() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBadge icon={<FaHome />} color="emerald" size="lg" />
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-secondary">Bienvenido de vuelta</p>
          </div>
        </div>
      </div>

      <SegmentedControl
        options={[
          { value: 'all', label: 'Todos' },
          { value: 'dolares', label: 'Dólares' },
          { value: 'crypto', label: 'Crypto', icon: <FaBitcoin /> },
        ]}
        value={filter}
        onChange={setFilter}
        fullWidth
      />

      {/* Quick Actions */}
      <Card elevation="md" padding="lg">
        <h2 className="text-lg font-bold mb-4">Acciones Rápidas</h2>
        <QuickActionsGrid columns={4}>
          <QuickActionButton icon={<FaDollarSign />} label="Dólares" variant="emerald" />
          <QuickActionButton icon={<FaBitcoin />} label="Crypto" variant="blue" badge={2} />
          <QuickActionButton icon={<FaCalculator />} label="Calcular" variant="purple" />
          <QuickActionButton icon={<FaChartLine />} label="Análisis" variant="gold" />
        </QuickActionsGrid>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card elevation="lg" hover="lift" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Dólar Blue</p>
              <h3 className="text-3xl font-bold text-accent-emerald">$1,234.50</h3>
              <p className="text-xs text-success mt-1">+2.5% hoy</p>
            </div>
            <CircularProgress value={75} size="lg" color="emerald" gradient />
          </div>
        </Card>

        <Card elevation="lg" hover="lift" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Bitcoin</p>
              <h3 className="text-3xl font-bold text-accent-blue">$67,890</h3>
              <p className="text-xs text-error mt-1">-1.2% hoy</p>
            </div>
            <CircularProgress value={45} size="lg" color="blue" gradient />
          </div>
        </Card>

        <Card elevation="lg" hover="lift" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Riesgo País</p>
              <h3 className="text-3xl font-bold text-accent-gold">1,456</h3>
              <p className="text-xs text-warning mt-1">Sin cambios</p>
            </div>
            <CircularProgress value={60} size="lg" color="gold" gradient />
          </div>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card elevation="md" hover="scale" padding="lg">
          <div className="flex items-start gap-4">
            <IconBadge icon={<FaBitcoin />} color="blue" size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">Criptomonedas</h3>
                <NewBadge />
              </div>
              <p className="text-sm text-secondary mb-4">Bitcoin, Ethereum, USDT y más</p>
              <LinearProgress value={85} size="sm" color="blue" gradient />
            </div>
          </div>
        </Card>

        <Card elevation="md" hover="scale" padding="lg">
          <div className="flex items-start gap-4">
            <IconBadge icon={<FaChartLine />} color="purple" size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">Análisis</h3>
                <PopularBadge />
              </div>
              <p className="text-sm text-secondary mb-4">Tendencias y análisis de mercado</p>
              <LinearProgress value={65} size="sm" color="purple" gradient />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

---

This guide provides all the tools needed to create a professional fintech-grade UI. Use these components consistently throughout the app for a cohesive, modern experience.
