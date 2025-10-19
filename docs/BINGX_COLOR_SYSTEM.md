# BingX Color System - Paleta Profesional y Ejecutiva

Sistema de colores profesional inspirado en BingX para Dólar Gaucho. Diseñado para ofrecer una experiencia ejecutiva y profesional en ambos modos (light/dark).

## 🎨 Colores Principales de BingX

### Brand Colors (Primarios)

- **Blue Ribbon**: `#0047FF` - Color principal de la marca BingX
- **Blue Violet**: `#5056A9` - Color secundario de la marca BingX
- **White**: `#FFFFFF` - Base para light mode

Estos colores provienen directamente de la identidad visual de BingX y representan:

- **Confianza** (Blue) - Estabilidad financiera
- **Profesionalismo** (Blue Violet) - Expertise en trading
- **Claridad** (White) - Transparencia y simplicidad

---

## 🌈 Paleta Completa del Sistema

### 1. Brand Colors (Color de Marca)

```typescript
brand: {
  DEFAULT: '#0047FF',  // BingX Blue Ribbon
  light: '#3366FF',    // Hover states
  dark: '#0036CC',     // Active states
  50: '#E6EEFF',
  100: '#CCE0FF',
  // ... (escala completa 50-900)
}
```

**Uso:**

- Botones primarios: `bg-brand hover:bg-brand-light`
- Links importantes: `text-brand`
- Bordes destacados: `border-brand`
- Iconos principales: `text-brand`

---

### 2. Background Colors

#### Light Mode

```css
--background: #ffffff /* Fondo principal blanco puro */ --background-secondary: #f8fafc
  /* Fondo secundario (muy sutil) */ --panel: #f8fafc /* Paneles/Cards */ --panel-elevated: #ffffff
  /* Cards elevadas */;
```

#### Dark Mode

```css
--background: #0b0e1a /* Azul-negro profundo (BingX inspired) */ --background-secondary: #14182b
  /* Azul-negro más claro */ --panel: #14182b /* Paneles oscuros */ --panel-elevated: #1e2337
  /* Cards elevadas oscuras */;
```

**Uso:**

- Fondo de página: `bg-background`
- Paneles: `bg-panel`
- Cards: `bg-panel-elevated`

---

### 3. Text Colors

#### Light Mode

```css
--foreground: #0f172a /* Texto principal (casi negro) */ --text-secondary: #475569
  /* Texto secundario (gris) */;
```

#### Dark Mode

```css
--foreground: #f8fafc /* Texto principal (casi blanco) */ --text-secondary: #94a3b8
  /* Texto secundario (gris claro) */;
```

**Uso:**

- Títulos: `text-foreground`
- Texto normal: `text-foreground`
- Subtítulos/metadata: `text-secondary`

---

### 4. Border Colors

#### Light Mode

```css
--border: #e2e8f0 /* Bordes normales */ --border-strong: #cbd5e1 /* Bordes más fuertes */;
```

#### Dark Mode

```css
--border: rgba(80, 86, 169, 0.15) /* Con tinte azul BingX */ --border-strong: rgba(80, 86, 169, 0.3);
```

**Uso:**

- Bordes de cards: `border border-border`
- Separadores: `border-t border-border`
- Bordes destacados: `border-border-strong`

---

### 5. Accent Colors (Colores de Acento)

```typescript
accent: {
  blue: '#0047FF',       // BingX Blue (principal)
  'blue-light': '#3366FF', // BingX Blue Light
  violet: '#5056A9',     // BingX Violet (secundario)
  emerald: '#10B981',    // Success green (finance)
  gold: '#F59E0B',       // Warning/highlight
  sky: '#0EA5E9',        // Info
  slate: '#64748B',      // Neutral
}
```

**Uso:**

- Botones secundarios: `bg-accent-violet`
- Badges: `bg-accent-blue text-white`
- Highlights: `text-accent-gold`

---

### 6. Semantic Colors (Estados)

#### Success (Verde profesional)

```typescript
success: {
  DEFAULT: '#10B981',
  light: '#059669',
  dark: '#34D399',
  bg: {
    light: '#ECFDF5',
    dark: 'rgba(16, 185, 129, 0.1)',
  }
}
```

#### Error (Rojo profesional)

```typescript
error: {
  DEFAULT: '#EF4444',
  light: '#DC2626',
  dark: '#F87171',
  bg: {
    light: '#FEF2F2',
    dark: 'rgba(239, 68, 68, 0.1)',
  }
}
```

#### Warning (Dorado)

```typescript
warning: {
  DEFAULT: '#F59E0B',
  light: '#D97706',
  dark: '#FBBF24',
  bg: {
    light: '#FFFBEB',
    dark: 'rgba(245, 158, 11, 0.1)',
  }
}
```

#### Info (Azul cielo)

```typescript
info: {
  DEFAULT: '#0EA5E9',
  light: '#0284C7',
  dark: '#38BDF8',
  bg: {
    light: '#F0F9FF',
    dark: 'rgba(14, 165, 233, 0.1)',
  }
}
```

**Uso:**

```tsx
// Success badge
<div className="bg-success-bg-light dark:bg-success-bg-dark text-success px-3 py-1 rounded">
  +12.5%
</div>

// Error alert
<div className="bg-error-bg-light dark:bg-error-bg-dark border border-error/30 p-4 rounded-lg">
  <p className="text-error">Error al cargar datos</p>
</div>
```

---

## 🎯 Utilidades CSS Personalizadas

### Glass Effect

```css
.glass {
  backdrop-blur-md;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}
```

**Light mode**: Tinte azul BingX sutil
**Dark mode**: Tinte azul violeta

### Gradient Text (BingX Blue)

```css
.gradient-text {
  background: linear-gradient(to right, #0047ff, #3366ff);
  background-clip: text;
  color: transparent;
}
```

### Border Accent

```css
.border-accent {
  border-color: rgba(0, 71, 255, 0.2); /* BingX Blue con transparencia */
}
```

---

## 📘 Guía de Uso por Componente

### Botones

#### Botón Primario (BingX Blue)

```tsx
<button className="bg-brand hover:bg-brand-light active:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors">
  Comprar
</button>
```

#### Botón Secundario (BingX Violet)

```tsx
<button className="bg-secondary-brand hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity">
  Ver Más
</button>
```

#### Botón Outline

```tsx
<button className="border-2 border-brand text-brand hover:bg-brand hover:text-white px-4 py-2 rounded-lg transition-all">
  Cancelar
</button>
```

---

### Cards

#### Card Básica (Light/Dark)

```tsx
<div className="bg-panel-elevated border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  <h3 className="text-foreground font-semibold">Dólar Blue</h3>
  <p className="text-secondary">Cotización actual</p>
  <p className="text-2xl font-bold text-brand">$1,250</p>
</div>
```

#### Card con Glass Effect

```tsx
<div className="glass rounded-xl p-6">
  <h3 className="text-foreground font-semibold">Info importante</h3>
</div>
```

---

### Tablas

```tsx
<table className="w-full">
  <thead className="bg-panel border-b border-border">
    <tr>
      <th className="text-foreground text-left px-4 py-3">Tipo</th>
      <th className="text-foreground text-right px-4 py-3">Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-panel-hover transition-colors">
      <td className="text-foreground px-4 py-3">Blue</td>
      <td className="text-brand font-bold text-right px-4 py-3">$1,250</td>
    </tr>
  </tbody>
</table>
```

---

### Badges

```tsx
// Success badge
<span className="bg-success-bg-light dark:bg-success-bg-dark text-success px-2 py-1 rounded text-xs font-semibold">
  Subió
</span>

// Brand badge
<span className="bg-brand text-white px-2 py-1 rounded text-xs font-semibold">
  Nuevo
</span>

// Violet badge
<span className="bg-secondary-brand text-white px-2 py-1 rounded text-xs font-semibold">
  Premium
</span>
```

---

### Links

```tsx
// Link principal (BingX Blue)
<a href="#" className="text-brand hover:text-brand-light underline transition-colors">
  Ver detalles
</a>

// Link secundario
<a href="#" className="text-secondary hover:text-foreground transition-colors">
  Más información
</a>
```

---

## 🔄 Migración de Colores Antiguos

### Mapeo de colores legacy → BingX

| Antiguo          | Nuevo                 | Uso                                    |
| ---------------- | --------------------- | -------------------------------------- |
| `accent-emerald` | `brand`               | Botones principales, links importantes |
| `accent-teal`    | `brand-light`         | Hover states                           |
| `accent-blue`    | `brand`               | Primario                               |
| `accent-indigo`  | `secondary-brand`     | Secundario                             |
| `accent-gold`    | `warning`             | Alertas, highlights                    |
| `dark-bg`        | `background-dark`     | Fondo oscuro                           |
| `dark-lighter`   | `panel-dark-elevated` | Cards oscuras                          |

### Ejemplos de migración

**Antes:**

```tsx
<button className="bg-accent-emerald hover:bg-accent-teal">Comprar</button>
```

**Después:**

```tsx
<button className="bg-brand hover:bg-brand-light">Comprar</button>
```

---

**Antes:**

```tsx
<div className="gradient-text">Dólar Gaucho</div>
```

**Después:**

```tsx
<div className="gradient-text">Dólar Gaucho</div>
<!-- ¡Ya usa BingX Blue automáticamente! -->
```

---

## 🌓 Dark Mode Toggle

El sistema automáticamente cambia entre light/dark usando la clase `.dark` en el elemento root:

```tsx
// Componente de ejemplo
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggle} className="bg-brand text-white px-4 py-2 rounded">
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## 💡 Mejores Prácticas

### 1. Consistencia

- ✅ Usar `brand` para acciones principales
- ✅ Usar `secondary-brand` para acciones secundarias
- ✅ Usar semantic colors (success, error) para estados

### 2. Contraste

- ✅ Siempre verificar contraste text/background
- ✅ Usar `text-foreground` para mejor legibilidad
- ✅ Usar `text-secondary` para información secundaria

### 3. Profesionalismo

- ✅ Evitar colores muy saturados
- ✅ Usar la paleta BingX para brand consistency
- ✅ Mantener jerarquía visual clara

### 4. Accesibilidad

- ✅ Ratio de contraste mínimo 4.5:1 para texto normal
- ✅ Ratio de contraste mínimo 3:1 para texto grande
- ✅ Usar semantic colors con significado claro

---

## 📊 Comparación Light vs Dark Mode

| Elemento    | Light Mode            | Dark Mode                    |
| ----------- | --------------------- | ---------------------------- |
| **Fondo**   | Blanco puro (#FFFFFF) | Azul-negro (#0B0E1A)         |
| **Texto**   | Casi negro (#0F172A)  | Casi blanco (#F8FAFC)        |
| **Paneles** | Gris claro (#F8FAFC)  | Azul oscuro (#14182B)        |
| **Bordes**  | Gris (#E2E8F0)        | Azul con alpha (#5056A9 15%) |
| **Accent**  | BingX Blue (#0047FF)  | BingX Blue (#0047FF)         |
| **Glass**   | Azul sutil            | Azul-violeta sutil           |

---

## 🚀 Próximos Pasos

1. **Revisar componentes existentes** - Migrar gradualmente a nuevos colores
2. **Testear contraste** - Verificar accesibilidad en ambos modos
3. **Actualizar documentación** - Documentar componentes actualizados
4. **User feedback** - Recoger feedback sobre la nueva paleta

---

## 🎨 Visualización de la Paleta

```
┌──────────────────────────────────────────────────────┐
│                  LIGHT MODE                          │
├──────────────────────────────────────────────────────┤
│ Background:  ████████ #FFFFFF (Blanco puro)         │
│ Panel:       ████████ #F8FAFC (Gris muy claro)      │
│ Text:        ████████ #0F172A (Casi negro)          │
│ Secondary:   ████████ #475569 (Gris)                │
│ Brand:       ████████ #0047FF (BingX Blue)          │
│ Violet:      ████████ #5056A9 (BingX Violet)        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  DARK MODE                           │
├──────────────────────────────────────────────────────┤
│ Background:  ████████ #0B0E1A (Azul-negro)          │
│ Panel:       ████████ #14182B (Azul oscuro)         │
│ Text:        ████████ #F8FAFC (Casi blanco)         │
│ Secondary:   ████████ #94A3B8 (Gris claro)          │
│ Brand:       ████████ #0047FF (BingX Blue)          │
│ Violet:      ████████ #5056A9 (BingX Violet)        │
└──────────────────────────────────────────────────────┘
```

---

**Última actualización:** 2025-10-15
**Inspirado en:** BingX Brand Identity
**Colores oficiales BingX:**

- Blue Ribbon: #0047FF
- Blue Violet: #5056A9
- White: #FFFFFF

**Fuente:** [BingX Brand Assets - Brandfetch](https://brandfetch.com/bingx.pro)
