# 🎨 Implementación del Theme System - Guía Paso a Paso

**Objetivo**: Agregar toggle de Dark/Light mode completamente funcional

**Tiempo estimado**: 2-3 días
**Prioridad**: CRÍTICA

---

## 📋 Checklist de Implementación

### Día 1: Setup Básico (4-5 horas)

- [ ] 1.1 Crear ThemeContext
- [ ] 1.2 Actualizar Tailwind config
- [ ] 1.3 Actualizar CSS variables
- [ ] 1.4 Crear ThemeToggle component
- [ ] 1.5 Integrar en _app.tsx

### Día 2: Migración de Componentes (6-7 horas)

- [ ] 2.1 Migrar componentes UI (Button, Card, Input)
- [ ] 2.2 Migrar DashboardLayout
- [ ] 2.3 Migrar páginas principales
- [ ] 2.4 Migrar charts

### Día 3: Testing y Polish (3-4 horas)

- [ ] 3.1 Testing manual en ambos temas
- [ ] 3.2 Verificar contraste de colores
- [ ] 3.3 Fix bugs
- [ ] 3.4 Deploy

---

## 🚀 Paso a Paso Detallado

### 1.1 Crear ThemeContext (30 min)

**Archivo**: `lib/contexts/ThemeContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Solo ejecutar en cliente
  useEffect(() => {
    setMounted(true);

    // 1. Intentar leer de localStorage
    const stored = localStorage.getItem('dolargaucho-theme') as Theme | null;

    // 2. Si no hay, usar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = stored || (prefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('dolargaucho-theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Evitar flash de tema incorrecto en SSR
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

**Verificar**: ✅ No errores de TypeScript

---

### 1.2 Actualizar Tailwind Config (15 min)

**Archivo**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // ✅ IMPORTANTE: Cambiar a 'class'
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: 'var(--background)',
          light: '#FFFFFF',
          dark: '#0A0E27',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          light: '#1A1A1A',
          dark: '#F8F9FA',
        },

        // Panel/Card backgrounds
        panel: {
          DEFAULT: 'var(--panel)',
          light: '#F9FAFB',
          dark: '#1A1F3A',
        },
        'panel-hover': {
          light: '#F3F4F6',
          dark: '#12172E',
        },

        // Text colors
        primary: {
          DEFAULT: 'var(--text-primary)',
          light: '#111827',
          dark: '#F8F9FA',
        },
        secondary: {
          DEFAULT: 'var(--text-secondary)',
          light: '#6B7280',
          dark: '#9CA3AF',
        },

        // Borders
        border: {
          DEFAULT: 'var(--border)',
          light: '#E5E7EB',
          dark: 'rgba(255, 255, 255, 0.1)',
        },

        // Accent colors (mismo en ambos temas)
        accent: {
          emerald: '#10B981',
          teal: '#14B8A6',
          blue: '#3B82F6',
          indigo: '#6366F1',
          gold: '#F59E0B',
          slate: '#64748B',
        },

        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#059669',
          dark: '#34D399',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#DC2626',
          dark: '#F87171',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#D97706',
          dark: '#FBBF24',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#2563EB',
          dark: '#60A5FA',
        },

        // Legacy support (mantener por compatibilidad)
        dark: {
          DEFAULT: '#0A0E27',
          light: '#12172E',
          lighter: '#1A1F3A',
        },
        glass: {
          light: 'rgba(0, 0, 0, 0.05)',
          dark: 'rgba(255, 255, 255, 0.05)',
        },
      },

      // Resto de tu config actual...
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Verificar**: ✅ `npm run build` sin errores

---

### 1.3 Actualizar CSS Variables (15 min)

**Archivo**: `styles/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* ===========================
     CSS VARIABLES POR TEMA
     =========================== */

  :root {
    /* Light theme (default) */
    --background: #FFFFFF;
    --foreground: #1A1A1A;
    --panel: #F9FAFB;
    --border: #E5E7EB;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --accent: #10B981;

    /* Shadows for light mode */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .dark {
    /* Dark theme */
    --background: #0A0E27;
    --foreground: #F8F9FA;
    --panel: #1A1F3A;
    --border: rgba(255, 255, 255, 0.1);
    --text-primary: #F8F9FA;
    --text-secondary: #9CA3AF;
    --accent: #10B981;

    /* Shadows for dark mode */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 8px 16px -4px rgb(0 0 0 / 0.4);
  }

  /* ===========================
     GLOBAL STYLES
     =========================== */

  * {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* ===========================
     SCROLLBAR PERSONALIZADO
     =========================== */

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-panel;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-accent-emerald rounded;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-accent-teal;
  }

  /* ===========================
     UTILITY CLASSES
     =========================== */

  .glass {
    @apply backdrop-blur-md bg-white/5 dark:bg-white/5;
  }

  .glass-strong {
    @apply backdrop-blur-lg bg-white/10 dark:bg-white/10;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-accent-emerald to-accent-teal bg-clip-text text-transparent;
  }
}
```

**Verificar**: ✅ Scrollbar se ve bien, transiciones suaves

---

### 1.4 Crear ThemeToggle Component (30 min)

**Archivo**: `components/ui/ThemeToggle/ThemeToggle.tsx`

```typescript
'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Evitar mismatch hydration
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg glass animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2.5 rounded-lg glass
        hover:bg-accent/10
        active:scale-95
        transition-all duration-200
        group
      "
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      title={`Modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {/* Icon container con animación */}
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <FaSun
          className={`
            absolute inset-0 text-accent-gold
            transition-all duration-300
            ${theme === 'dark'
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />

        {/* Moon icon */}
        <FaMoon
          className={`
            absolute inset-0 text-accent-indigo
            transition-all duration-300
            ${theme === 'light'
              ? 'opacity-0 -rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
      </div>

      {/* Glow effect on hover */}
      <span
        className="
          absolute inset-0 rounded-lg
          bg-gradient-to-r from-accent-gold to-accent-indigo
          opacity-0 group-hover:opacity-20
          transition-opacity duration-300
          blur-sm
        "
      />
    </button>
  );
}
```

**Archivo**: `components/ui/ThemeToggle/index.ts`

```typescript
export { ThemeToggle } from './ThemeToggle';
```

**Verificar**: ✅ Toggle funciona, animación suave

---

### 1.5 Integrar en _app.tsx (10 min)

**Archivo**: `pages/_app.tsx`

```typescript
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ThemeProvider } from '@/lib/contexts/ThemeContext'; // ✅ Nuevo

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider> {/* ✅ Wrap todo con ThemeProvider */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

**Verificar**: ✅ App se renderiza correctamente

---

### 1.6 Agregar Toggle en DashboardLayout (15 min)

**Archivo**: `components/layouts/DashboardLayout.tsx`

```typescript
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// ... resto del componente

// En el sidebar, agregar:
<div className="px-6 py-4 border-t border-border">
  <div className="flex items-center justify-between">
    <span className="text-sm text-secondary">Tema</span>
    <ThemeToggle />
  </div>
</div>
```

**Verificar**: ✅ Toggle visible en sidebar

---

## 🎨 Día 2: Migración de Componentes

### 2.1 Migrar Button Component (30 min)

**Archivo**: `components/ui/Button/Button.tsx`

```typescript
// ANTES:
className="bg-accent-emerald hover:bg-accent-emerald/90 text-white"

// DESPUÉS:
className="
  bg-accent-emerald hover:bg-accent-emerald/90
  text-white dark:text-white
  shadow-md dark:shadow-lg
  border border-transparent dark:border-accent-emerald/20
"
```

### 2.2 Migrar Card Component (45 min)

**Archivo**: `components/ui/Card/Card.tsx`

```typescript
const cardVariants = cva('rounded-xl transition-all duration-300', {
  variants: {
    variant: {
      default: `
        bg-white dark:bg-panel
        border border-gray-200 dark:border-white/10
        shadow-sm dark:shadow-md
      `,
      elevated: `
        bg-white dark:bg-panel
        border border-gray-200 dark:border-white/10
        shadow-lg dark:shadow-xl
      `,
      glass: `
        glass
        border border-gray-200 dark:border-white/10
      `,
    },
    hover: {
      none: '',
      lift: 'hover:shadow-xl hover:-translate-y-1',
      glow: 'hover:shadow-glow-green dark:hover:shadow-glow',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    hover: 'none',
  },
});
```

### 2.3 Migración en Batch (3-4 horas)

**Lista de archivos a migrar**:

```bash
# Componentes UI
components/ui/Input/Input.tsx
components/ui/NavbarPro/NavbarPro.tsx

# Layouts
components/layouts/DashboardLayout.tsx

# Pages
pages/dashboard/index.tsx
pages/dashboard/favoritos.tsx
pages/dashboard/analisis.tsx
pages/dashboard/calculadoras.tsx
pages/dashboard/alertas.tsx

# Charts
components/charts/InflacionChart.tsx
components/charts/RiesgoPaisChart.tsx
```

**Patrón de migración**:

```typescript
// ❌ Hardcoded dark colors
<div className="bg-dark-light text-white border-white/10">

// ✅ Theme-aware
<div className="bg-panel text-foreground border-border">

// O si necesitas diferentes estilos:
<div className="bg-gray-100 dark:bg-dark-light text-gray-900 dark:text-white">
```

---

## ✅ Testing Checklist

### Verificación Manual

- [ ] **Toggle funciona**
  - [ ] Click en toggle cambia tema
  - [ ] Tema persiste en refresh
  - [ ] Animación suave

- [ ] **Visual Light Mode**
  - [ ] Fondo blanco
  - [ ] Texto oscuro legible
  - [ ] Cards con sombra sutil
  - [ ] Contraste adecuado

- [ ] **Visual Dark Mode**
  - [ ] Fondo oscuro (#0A0E27)
  - [ ] Texto claro (#F8F9FA)
  - [ ] Glass effect funciona
  - [ ] Glow effects visibles

- [ ] **Componentes**
  - [ ] Buttons se ven bien en ambos temas
  - [ ] Cards tienen borde correcto
  - [ ] Charts legibles en ambos temas
  - [ ] Sidebar funcional

### Herramientas de Testing

```bash
# 1. Contrast checker
https://webaim.org/resources/contrastchecker/

# 2. Lighthouse audit
npm run build && npm run start
# Abrir DevTools > Lighthouse > Generar reporte

# 3. Visual check en navegadores
- Chrome (light + dark)
- Firefox (light + dark)
- Safari (light + dark)
```

---

## 🐛 Troubleshooting Común

### Problema 1: Flash de tema incorrecto

**Solución**: Script en _document.tsx

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        {/* Prevenir flash de tema */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('dolargaucho-theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Problema 2: Hydration mismatch

**Solución**: Usar `mounted` state

```typescript
const { mounted } = useTheme();

if (!mounted) {
  return <div className="w-10 h-10 glass" />; // Placeholder
}

return <ThemeToggle />;
```

### Problema 3: Tailwind no aplica dark classes

**Solución**: Verificar `tailwind.config.ts`

```typescript
export default {
  darkMode: 'class', // ✅ DEBE SER 'class', NO 'media'
  // ...
}
```

---

## 📊 Verificación Final

### Checklist Completo

```
✅ ThemeContext implementado
✅ Tailwind config actualizado (darkMode: 'class')
✅ CSS variables configuradas
✅ ThemeToggle component creado
✅ Integrado en _app.tsx
✅ DashboardLayout muestra toggle
✅ Button migrado
✅ Card migrado
✅ Input migrado
✅ Todas las páginas migradas
✅ Charts migrados
✅ Testing manual completo
✅ No hay flash de tema
✅ Persiste en localStorage
✅ Contraste adecuado en ambos temas
✅ Build exitoso
✅ Deploy realizado
```

---

## 🚀 Deploy

```bash
# 1. Final build local
npm run build

# 2. Test producción local
npm run start

# 3. Commit
git add .
git commit -m "feat: Implement dark/light theme system

- Add ThemeContext with localStorage persistence
- Update Tailwind config for class-based dark mode
- Create ThemeToggle component with smooth animations
- Migrate all components to theme-aware styles
- Add CSS variables for both themes
- Fix hydration issues with mounted state

Closes #[issue-number]

🚀 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Push
git push origin main

# 5. Verificar deploy en Netlify/Vercel
```

---

## 🎯 Success Criteria

### Funcionalidad
- ✅ Toggle cambia tema instantáneamente
- ✅ Tema persiste entre sesiones
- ✅ Respeta preferencia del sistema operativo (inicial)
- ✅ No hay flash de tema incorrecto

### Visual
- ✅ Contraste mínimo 4.5:1 en ambos temas
- ✅ Colores consistentes con brand
- ✅ Animaciones suaves (300ms transitions)
- ✅ Iconos intuitivos (Sol/Luna)

### Performance
- ✅ Bundle size no aumenta >5KB
- ✅ Lighthouse score mantiene >85
- ✅ No re-renders innecesarios

### Accessibility
- ✅ Toggle tiene aria-label
- ✅ Funciona con teclado (Space/Enter)
- ✅ Focus visible
- ✅ Screen reader friendly

---

**Última actualización**: 8 de octubre, 2025
**Tiempo total estimado**: 2-3 días
**Próximo paso**: Error Boundaries
