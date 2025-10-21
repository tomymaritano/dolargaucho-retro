# 🎨 DESIGN SYSTEM 2025 - DÓLAR GAUCHO

**Fecha**: Enero 2025
**Versión**: 2.0
**Autor**: Claude Code + Tomas Maritano

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Fundamentos Visuales](#fundamentos-visuales)
3. [Sistema de Color](#sistema-de-color)
4. [Tipografía](#tipografía)
5. [Espaciado y Layout](#espaciado-y-layout)
6. [Componentes Base](#componentes-base)
7. [Componentes Compuestos](#componentes-compuestos)
8. [Patrones de Interacción](#patrones-de-interacción)
9. [Animaciones y Transiciones](#animaciones-y-transiciones)
10. [Accesibilidad](#accesibilidad)
11. [Responsive Design](#responsive-design)
12. [Guías de Uso](#guías-de-uso)

---

## 1. RESUMEN EJECUTIVO

### 🎯 Objetivo del Design System

Establecer un sistema de diseño coherente, escalable y mantenible que:

- Garantice consistencia visual en todas las páginas
- Acelere el desarrollo con componentes reutilizables
- Facilite la colaboración entre diseño y desarrollo
- Asegure accesibilidad (WCAG 2.1 AA)
- Mantenga la identidad fintech premium de Dólar Gaucho

### 📊 Estado Actual

**Componentes**: 174 componentes totales

- UI Base: 40+ componentes (Button, Card, Input, etc.)
- Features: 60+ componentes específicos
- Layouts: 10+ componentes de estructura
- Marketing: 20+ componentes de landing

**Hooks Personalizados**: 40 hooks

- Data fetching con TanStack Query
- State management con Zustand
- Utilities y helpers

**Cobertura**: 100% TypeScript
**Testing**: 0% (pendiente implementación)

### 🎨 Filosofía de Diseño

1. **Fintech Premium**: Diseño profesional, confiable y moderno
2. **Data-First**: Información clara y priorizada
3. **Performance**: Optimización en cada decisión
4. **Accesibilidad**: Inclusivo por defecto
5. **Mobile-First**: Diseñado para todos los dispositivos

---

## 2. FUNDAMENTOS VISUALES

### 🌈 Identidad de Marca

**Brand Colors**:

- **Primary**: BingX Blue `#0047FF` - Confianza, tecnología, finanzas
- **Secondary**: Purple `#8B5CF6` - Innovación, premium
- **Accent**: Indigo `#6366F1` - Complemento visual

**Inspiración**: BingX Exchange

- Paleta profesional fintech
- Alto contraste para legibilidad
- Colores vibrantes pero serios

### 🎭 Principios Visuales

1. **Claridad sobre decoración**
   - Información primero
   - Efectos visuales secundarios
   - No sacrificar legibilidad

2. **Consistencia**
   - Mismos patrones en todas las páginas
   - Componentes predecibles
   - Terminología uniforme

3. **Jerarquía clara**
   - Títulos diferenciados
   - Información estructurada
   - Call-to-actions evidentes

4. **Espacios respirables**
   - Padding generoso
   - Separación entre secciones
   - No sobrecargar vistas

---

## 3. SISTEMA DE COLOR

### 🎨 Paleta Completa

**Archivo**: `styles/bingx-colors.css`

#### Brand Colors

```css
--brand: #0047ff; /* BingX Blue - Primary */
--brand-light: #3d7aff; /* Hover states */
--brand-dark: #0038cc; /* Active states */
```

#### Semantic Colors

```css
--success: #10b981; /* Green - Positivo */
--error: #ef4444; /* Red - Negativo/Errores */
--warning: #f59e0b; /* Amber - Advertencias */
--info: #3b82f6; /* Blue - Información */
```

#### Neutrals (Light Mode)

```css
--background: #ffffff; /* Fondo principal */
--panel: #f8fafc; /* Tarjetas, paneles */
--foreground: #0f172a; /* Texto principal */
--secondary: #64748b; /* Texto secundario */
--muted: #94a3b8; /* Texto deshabilitado */
--border: #e2e8f0; /* Bordes */
```

#### Neutrals (Dark Mode)

```css
--background: #0f172a; /* Fondo principal */
--panel: #1e293b; /* Tarjetas, paneles */
--foreground: #f1f5f9; /* Texto principal */
--secondary: #94a3b8; /* Texto secundario */
--muted: #64748b; /* Texto deshabilitado */
--border: #334155; /* Bordes */
```

### 📏 Uso de Colores

#### Backgrounds

- `bg-background`: Fondo de página
- `bg-panel`: Cards, tablas, formularios
- `bg-white/5`: Overlays sutiles (dark mode)
- `bg-brand/10`: Highlights de marca

#### Borders

- `border-white/10`: Bordes sutiles (dark mode)
- `border-brand/20`: Bordes con acento de marca
- `border-success/30`: Estados positivos
- `border-error/30`: Estados de error

#### Text

- `text-foreground`: Títulos, textos principales
- `text-secondary`: Descripciones, metadatos
- `text-muted`: Texto deshabilitado
- `text-brand`: Enlaces, CTAs

### 🎯 Estados de Color

| Estado   | Background          | Border                  | Text               |
| -------- | ------------------- | ----------------------- | ------------------ |
| Default  | `bg-panel`          | `border-white/10`       | `text-foreground`  |
| Hover    | `hover:bg-white/10` | `hover:border-brand/50` | `hover:text-brand` |
| Active   | `bg-brand/10`       | `border-brand/30`       | `text-brand`       |
| Disabled | `bg-white/5`        | `border-white/5`        | `text-muted`       |
| Success  | `bg-success/10`     | `border-success/30`     | `text-success`     |
| Error    | `bg-error/10`       | `border-error/30`       | `text-error`       |

---

## 4. TIPOGRAFÍA

### 🔤 Font Families

**Archivo**: `pages/_document.tsx`

```typescript
// Display Font (Títulos grandes, Hero sections)
font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
font-weight: 900 (black), 800 (extrabold), 700 (bold)

// Sans Font (UI general, body text)
font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
font-weight: 600 (semibold), 500 (medium), 400 (regular)

// Mono Font (Código, números, cotizaciones)
font-mono: 'JetBrains Mono', 'Fira Code', monospace
font-weight: 700 (bold), 500 (medium), 400 (regular)
```

### 📏 Escala Tipográfica

#### Display (Headings)

```css
.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
} /* 60px - Hero titles */
.text-5xl {
  font-size: 3rem;
  line-height: 1;
} /* 48px - Page titles */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} /* 36px - Section titles */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} /* 30px - Subsections */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} /* 24px - Cards titles */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} /* 20px - Small headings */
```

#### Body Text

```css
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
} /* 18px - Large body */
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
} /* 16px - Default body */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} /* 14px - Small text */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} /* 12px - Captions */
```

### 🎯 Pesos de Fuente

| Peso            | Uso                     | Clase            |
| --------------- | ----------------------- | ---------------- |
| 900 (Black)     | Hero titles, logos      | `font-black`     |
| 800 (ExtraBold) | Main page titles        | `font-extrabold` |
| 700 (Bold)      | Section titles, botones | `font-bold`      |
| 600 (SemiBold)  | Headings, labels        | `font-semibold`  |
| 500 (Medium)    | Body emphasis           | `font-medium`    |
| 400 (Regular)   | Body text               | `font-normal`    |

### 📐 Ejemplos de Uso

```tsx
// Hero Title
<h1 className="text-5xl md:text-6xl font-display font-black text-foreground">
  Título Principal
</h1>

// Page Title
<h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
  Título de Página
</h2>

// Section Title
<h3 className="text-xl md:text-2xl font-display font-semibold text-foreground">
  Sección
</h3>

// Body Text
<p className="text-base text-secondary leading-relaxed">
  Texto de párrafo con buena legibilidad
</p>

// Small Text
<span className="text-sm text-muted">
  Metadata o información secundaria
</span>
```

---

## 5. ESPACIADO Y LAYOUT

### 📏 Spacing Scale

**Sistema**: Tailwind CSS default (base 0.25rem = 4px)

```css
/* Spacing values */
0.5  → 2px   (space-0.5)
1    → 4px   (space-1)
2    → 8px   (space-2)
3    → 12px  (space-3)
4    → 16px  (space-4)
6    → 24px  (space-6)
8    → 32px  (space-8)
12   → 48px  (space-12)
16   → 64px  (space-16)
20   → 80px  (space-20)
```

### 🎯 Guías de Espaciado

#### Padding Interno (Componentes)

```tsx
// Cards pequeñas
<div className="p-4 md:p-6">

// Cards medianas
<div className="p-6 md:p-8">

// Cards grandes, secciones
<div className="p-8 md:p-12">

// Página completa
<div className="px-6 py-12 md:px-8 md:py-20">
```

#### Margins (Separación)

```tsx
// Entre elementos pequeños
<div className="mb-2">

// Entre párrafos, labels
<div className="mb-4">

// Entre secciones
<div className="mb-8 md:mb-12">

// Entre secciones grandes
<div className="mb-12 md:mb-20">
```

#### Gaps (Flexbox/Grid)

```tsx
// Botones agrupados
<div className="flex gap-2">

// Cards en grid
<div className="grid gap-4 md:gap-6">

// Secciones en flex
<div className="flex flex-col gap-8 md:gap-12">
```

### 📐 Layout Grid

**Max Width Container**: `max-w-7xl` (1280px)

```tsx
// Container estándar
<div className="max-w-7xl mx-auto px-6">
  {content}
</div>

// Container con padding vertical
<section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
  {content}
</section>
```

**Responsive Grid**:

```tsx
// 1 columna → 2 columnas → 3 columnas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 1 columna → 3 columnas
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// Auto-fit (flexible)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
```

### 🎯 Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 6. COMPONENTES BASE

### 🔘 Button

**Archivo**: `components/ui/Button.tsx`
**Variantes**: CVA (class-variance-authority)

#### Variants

```tsx
variant:
  - primary: Gradiente brand (CTA principal)
  - secondary: Outline con hover (acciones secundarias)
  - ghost: Transparente con hover (navegación)
  - outline: Borde sólido (formularios)
  - danger: Rojo para acciones destructivas
```

#### Sizes

```tsx
size:
  - sm: px-3 py-1.5 text-sm (12px padding vertical)
  - md: px-4 py-2 text-base (16px padding vertical)
  - lg: px-6 py-3 text-lg (24px padding vertical)
```

#### Ejemplo de Uso

```tsx
import { Button, LinkButton } from '@/components/ui/Button';

// Primary CTA
<Button variant="primary" size="lg">
  Crear Alerta
</Button>

// Secondary action
<Button variant="secondary" size="md">
  Cancelar
</Button>

// Link button
<LinkButton variant="primary" href="/dashboard">
  Ir al Dashboard
</LinkButton>

// Loading state
<Button variant="primary" disabled>
  <FaSpinner className="animate-spin mr-2" />
  Cargando...
</Button>
```

### 🎴 Card

**Archivo**: `components/ui/Card.tsx`
**Patrón**: Compound Components

#### Estructura

```tsx
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
    <Card.Actions>
      <Button variant="ghost">...</Button>
    </Card.Actions>
  </Card.Header>

  <Card.Content>{/* Main content */}</Card.Content>

  <Card.Footer>
    <p className="text-sm text-secondary">Footer info</p>
  </Card.Footer>
</Card>
```

#### Variants

```tsx
variant:
  - default: bg-panel border border-white/10
  - highlighted: border-brand/30 con glow
  - success: border-success/30
  - error: border-error/30
```

### 📝 Input

**Archivo**: `components/ui/Input.tsx`

#### Estructura

```tsx
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error={errors.email}
  helper="Te enviaremos un código de verificación"
  required
/>
```

#### Estados

- Default: `border-white/10`
- Focus: `focus:border-brand/50 focus:ring-2 focus:ring-brand/20`
- Error: `border-error/50`
- Disabled: `bg-white/5 cursor-not-allowed`

#### Icons

```tsx
<Input label="Buscar" icon={<FaSearch />} placeholder="Buscar cotización..." />
```

### 🎯 Badge

**Archivo**: `components/ui/Badge.tsx`

#### Variants

```tsx
variant:
  - default: bg-white/10 text-foreground
  - brand: bg-brand/20 text-brand
  - success: bg-success/20 text-success
  - error: bg-error/20 text-error
  - warning: bg-warning/20 text-warning
```

#### Ejemplo

```tsx
<Badge variant="success">Completado</Badge>
<Badge variant="brand">En Progreso</Badge>
<Badge variant="error">Pendiente</Badge>
```

### 💬 Toast

**Archivo**: `components/ui/Toast.tsx`
**Sistema**: Custom con Framer Motion

#### Tipos

```tsx
type:
  - success: Verde con ícono checkmark
  - error: Rojo con ícono de error
  - warning: Amarillo con ícono de advertencia
  - info: Azul con ícono de información
```

#### Uso

```tsx
import { showToast } from '@/lib/toast';

showToast({
  type: 'success',
  message: 'Alerta creada correctamente',
  duration: 3000,
});

showToast({
  type: 'error',
  message: 'Error al guardar los cambios',
});
```

---

## 7. COMPONENTES COMPUESTOS

### 📊 StatsCard (Componente a Crear)

**Propósito**: Unificar visualización de KPIs

#### Diseño Propuesto

```tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: IconType;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'error' | 'brand';
}

<StatsCard
  title="Total Alertas"
  value={42}
  change={{ value: 12, period: 'vs mes anterior' }}
  icon={FaBell}
  trend="up"
  variant="brand"
/>;
```

#### Anatomía

```tsx
<Card variant={variant}>
  <div className="flex items-start justify-between">
    {/* Left: Icon + Title */}
    <div>
      <Icon className={iconColor} />
      <h3 className="text-sm font-semibold text-secondary">{title}</h3>
    </div>

    {/* Right: Value */}
    <span className="text-3xl font-black text-foreground">{value}</span>
  </div>

  {/* Footer: Change indicator */}
  {change && (
    <div className="flex items-center gap-1 text-sm">
      <TrendIcon />
      <span className={trendColor}>+{change.value}%</span>
      <span className="text-secondary">{change.period}</span>
    </div>
  )}
</Card>
```

### 🎨 SpotlightCard

**Archivo**: `components/ui/SpotlightCard.tsx`

#### Características

- Efecto spotlight en hover
- Glow gradient dinámico
- Smooth transitions

#### Uso

```tsx
<SpotlightCard
  className="bg-panel border border-white/10 rounded-xl p-6"
  spotlightColor="rgba(0, 71, 255, 0.25)"
  spotlightOpacity={0.15}
>
  {content}
</SpotlightCard>
```

### 🎭 EmptyState (Componente a Crear)

**Propósito**: Unificar estados vacíos

#### Diseño Propuesto

```tsx
interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

<EmptyState
  icon={FaBell}
  title="No tienes alertas"
  description="Crea tu primera alerta para recibir notificaciones personalizadas"
  action={{
    label: 'Crear Alerta',
    onClick: () => router.push('/dashboard/alerts/new'),
  }}
/>;
```

#### Anatomía

```tsx
<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
  {/* Icon */}
  <div className="p-6 bg-brand/10 rounded-2xl mb-4">
    <Icon className="text-brand text-4xl" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

  {/* Description */}
  <p className="text-secondary max-w-md mb-6">{description}</p>

  {/* Action */}
  {action && (
    <Button variant="primary" onClick={action.onClick}>
      {action.label}
    </Button>
  )}
</div>
```

### 🔔 ConfirmDialog (Componente a Crear)

**Propósito**: Confirmación de acciones destructivas

#### Diseño Propuesto

```tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

<ConfirmDialog
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDelete}
  title="¿Eliminar alerta?"
  description="Esta acción no se puede deshacer. La alerta se eliminará permanentemente."
  confirmText="Sí, eliminar"
  cancelText="Cancelar"
  variant="danger"
/>;
```

#### Anatomía

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Card className="max-w-md w-full">
          <Card.Header>
            <Card.Title>{title}</Card.Title>
          </Card.Header>

          <Card.Content>
            <p className="text-secondary">{description}</p>
          </Card.Content>

          <Card.Footer className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmText}
            </Button>
          </Card.Footer>
        </Card>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## 8. PATRONES DE INTERACCIÓN

### 🖱️ Hover States

**Principio**: Feedback inmediato y sutil

#### Cards

```tsx
// Default hover
className = 'hover:bg-white/5 transition-all';

// Con border highlight
className = 'hover:border-brand/50 transition-all';

// Con scale
className = 'hover:scale-105 active:scale-95 transition-transform';
```

#### Buttons

```tsx
// Primary
className = 'hover:shadow-lg hover:shadow-brand/30 transition-all';

// Secondary
className = 'hover:bg-white/10 hover:border-brand/50 transition-all';

// Ghost
className = 'hover:bg-white/5 transition-all';
```

#### Links

```tsx
className = 'hover:text-brand transition-colors';
```

### 👆 Active States

```tsx
// Buttons
className = 'active:scale-95 transition-transform';

// Cards seleccionadas
className = 'bg-brand/10 border-brand/30';

// Tabs activos
className = 'border-b-2 border-brand text-brand';
```

### ⏳ Loading States

#### Skeleton Loader

```tsx
<div className="animate-pulse">
  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-white/10 rounded w-1/2"></div>
</div>
```

#### Spinner

```tsx
<FaSpinner className="animate-spin text-brand" />
```

#### Button Loading

```tsx
<Button disabled>
  <FaSpinner className="animate-spin mr-2" />
  Cargando...
</Button>
```

### ✅ Success States

```tsx
// Con animación
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className="flex items-center gap-2 text-success"
>
  <FaCheckCircle />
  <span>¡Guardado correctamente!</span>
</motion.div>
```

### ❌ Error States

```tsx
// Input error
<Input
  error="El email es requerido"
  className="border-error/50"
/>

// Alert error
<div className="bg-error/10 border border-error/30 rounded-lg p-4">
  <div className="flex items-center gap-2 text-error">
    <FaExclamationCircle />
    <span className="font-semibold">Error al guardar</span>
  </div>
  <p className="text-sm text-secondary mt-1">
    Por favor intenta nuevamente
  </p>
</div>
```

---

## 9. ANIMACIONES Y TRANSICIONES

### ⚡ Principios de Animación

1. **Performance First**: Usar `transform` y `opacity` (GPU-accelerated)
2. **Sutileza**: Animaciones rápidas (150-300ms)
3. **Propósito**: Cada animación debe tener un objetivo
4. **Reducir en mobile**: `prefers-reduced-motion`

### 🎬 Framer Motion Patterns

#### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

#### Stagger Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

#### Modal Animations

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {modal}
    </motion.div>
  )}
</AnimatePresence>
```

### 🎨 CSS Transitions

#### Default

```css
transition-all duration-300 ease-in-out
```

#### Colors

```css
transition-colors duration-200
```

#### Transform

```css
transition-transform duration-150
```

#### Opacity

```css
transition-opacity duration-300
```

---

## 10. ACCESIBILIDAD

### ♿ Principios WCAG 2.1 AA

#### 1. Contraste de Color

**Requisito**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande

✅ **Cumple**:

- `text-foreground` sobre `bg-background`: 12.63:1
- `text-brand` sobre `bg-white`: 8.2:1
- `text-success` sobre `bg-white`: 4.8:1

❌ **No cumple** (a revisar):

- `text-secondary` sobre `bg-panel`: 3.2:1 (mejorar a #52677A)

#### 2. Navegación por Teclado

**Tab Order**: Lógico y secuencial

```tsx
// Focus visible
className="focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2"

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Saltar al contenido principal
</a>
```

#### 3. ARIA Labels

```tsx
// Buttons sin texto
<button aria-label="Cerrar modal">
  <FaTimes />
</button>

// Inputs
<Input
  label="Email"
  id="email"
  aria-describedby="email-helper"
  aria-invalid={!!errors.email}
  aria-required="true"
/>

// Live regions
<div aria-live="polite" aria-atomic="true">
  {toast.message}
</div>
```

#### 4. Screen Reader Support

```tsx
// Ocultar decorativo
<FaIcon aria-hidden="true" />

// Texto solo para SR
<span className="sr-only">Texto descriptivo</span>

// Estados
<button aria-pressed={isActive}>
  Toggle
</button>
```

### 🎯 Checklist de Accesibilidad

- [ ] Todos los botones tienen labels claros
- [ ] Todos los inputs tienen labels asociados
- [ ] Contraste de colores cumple AA
- [ ] Navegación por teclado funcional
- [ ] Focus visible en todos los elementos interactivos
- [ ] Imágenes tienen alt text descriptivo
- [ ] Formularios tienen validación accesible
- [ ] Modales manejan focus correctamente
- [ ] Errores se anuncian a screen readers

---

## 11. RESPONSIVE DESIGN

### 📱 Mobile-First Approach

**Principio**: Diseñar primero para mobile, expandir a desktop

#### Breakpoint Strategy

```tsx
// Base: Mobile (< 640px)
<div className="px-4 py-8">

// Tablet (≥ 768px)
<div className="px-4 py-8 md:px-6 md:py-12">

// Desktop (≥ 1024px)
<div className="px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-20">
```

### 🎯 Patrones Responsive

#### Typography

```tsx
// Hero
className = 'text-4xl md:text-5xl lg:text-6xl';

// Page title
className = 'text-3xl md:text-4xl';

// Section title
className = 'text-2xl md:text-3xl';

// Body
className = 'text-base md:text-lg';
```

#### Grid Layouts

```tsx
// Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Stats
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

// Sidebar layout
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
```

#### Flex Layouts

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">

// Reverse on mobile
<div className="flex flex-col-reverse md:flex-row gap-4">

// Center on mobile, space-between on desktop
<div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
```

### 📐 Tamaños Específicos

#### Containers

```tsx
// Mobile: full width con padding
// Desktop: max-width centrado
<div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
```

#### Cards

```tsx
// Mobile: full width
// Tablet: 2 columnas
// Desktop: 3 columnas
<Card className="w-full">
```

#### Modals

```tsx
// Mobile: full screen
// Desktop: centered con max-width
<div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full">
```

---

## 12. GUÍAS DE USO

### ✅ Do's (Hacer)

1. **Usar componentes del design system**

   ```tsx
   // ✅ Correcto
   <Button variant="primary">Guardar</Button>

   // ❌ Incorrecto
   <button className="bg-blue-500 px-4 py-2">Guardar</button>
   ```

2. **Seguir la escala de espaciado**

   ```tsx
   // ✅ Correcto
   <div className="mb-4 md:mb-6">

   // ❌ Incorrecto
   <div className="mb-[17px]">
   ```

3. **Usar variables de color**

   ```tsx
   // ✅ Correcto
   <div className="bg-panel text-foreground">

   // ❌ Incorrecto
   <div className="bg-gray-100 text-gray-900">
   ```

4. **Aplicar responsive design**

   ```tsx
   // ✅ Correcto
   <h1 className="text-3xl md:text-4xl lg:text-5xl">

   // ❌ Incorrecto
   <h1 className="text-5xl">
   ```

5. **Incluir estados de accesibilidad**

   ```tsx
   // ✅ Correcto
   <button className="focus:ring-2 focus:ring-brand/50" aria-label="Cerrar">

   // ❌ Incorrecto
   <button><FaTimes /></button>
   ```

### ❌ Don'ts (No Hacer)

1. **No usar colores hardcoded**

   ```tsx
   // ❌ Nunca
   <div className="bg-[#0047FF]">

   // ✅ Usar
   <div className="bg-brand">
   ```

2. **No crear variantes ad-hoc de componentes**

   ```tsx
   // ❌ No duplicar
   function MyCustomButton() { ... }

   // ✅ Extender existente
   <Button variant="primary" className="custom-class">
   ```

3. **No ignorar dark mode**

   ```tsx
   // ❌ Solo light
   <div className="bg-white">

   // ✅ Con dark mode
   <div className="bg-background">
   ```

4. **No usar magic numbers**

   ```tsx
   // ❌ Valores arbitrarios
   <div className="w-[347px] h-[219px]">

   // ✅ Usar escala
   <div className="w-full max-w-sm">
   ```

### 🎯 Proceso de Creación de Componentes

#### 1. Verificar si ya existe

```bash
# Buscar componentes similares
npm run grep "ComponentName"
```

#### 2. Crear con TypeScript

```tsx
// components/ui/NewComponent.tsx
interface NewComponentProps {
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function NewComponent({ variant = 'default', size = 'md', children }: NewComponentProps) {
  // Implementation
}
```

#### 3. Agregar variantes con CVA

```tsx
import { cva } from 'class-variance-authority';

const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'variant-classes',
      primary: 'variant-classes',
    },
    size: {
      sm: 'size-classes',
      md: 'size-classes',
      lg: 'size-classes',
    },
  },
});
```

#### 4. Documentar uso

```tsx
/**
 * NewComponent - Descripción breve
 *
 * @param variant - Variante visual
 * @param size - Tamaño del componente
 * @param children - Contenido
 *
 * @example
 * <NewComponent variant="primary" size="lg">
 *   Contenido
 * </NewComponent>
 */
```

#### 5. Exportar desde index

```tsx
// components/ui/index.ts
export { NewComponent } from './NewComponent';
```

---

## 📚 RECURSOS

### 📖 Referencias

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [CVA Docs](https://cva.style/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 🎨 Herramientas

- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Palette**: https://coolors.co/
- **Typography Scale**: https://typescale.com/
- **Spacing Calculator**: https://tailwindcss.com/docs/customizing-spacing

### 🔗 Links Internos

- [DASHBOARD_ANALYSIS_2025.md](./DASHBOARD_ANALYSIS_2025.md) - Análisis de inconsistencias
- [UX_PATTERNS_2025.md](./UX_PATTERNS_2025.md) - Patrones de UX
- [ROADMAP_Q1_Q2_2025.md](./ROADMAP_Q1_Q2_2025.md) - Roadmap de producto

---

**Última actualización**: Enero 2025
**Mantenedores**: Tomas Maritano, Claude Code
**Versión**: 2.0
