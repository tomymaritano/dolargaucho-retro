# 🏗️ Arquitectura Profesional - Dólar Gaucho

## 📋 Índice

1. [Expansión del Producto con DolarAPI](#1-expansión-del-producto-con-dolarapi)
2. [Mejores Prácticas React](#2-mejores-prácticas-react)
3. [Librerías de Gráficos Profesionales](#3-librerías-de-gráficos-profesionales)
4. [Organización CSS/Styling](#4-organización-cssstyling)
5. [Integración de AI para Noticias](#5-integración-de-ai-para-noticias)
6. [Sistema de Documentos/PDFs](#6-sistema-de-documentospdfs)

---

## 1. Expansión del Producto con DolarAPI

### Endpoints Disponibles en DolarAPI.com

#### 🌎 Cotizaciones Argentina

```typescript
// Endpoints disponibles
GET / v1 / dolares; // Todos los tipos de dólar
GET / v1 / dolares / oficial; // Dólar Oficial
GET / v1 / dolares / blue; // Dólar Blue
GET / v1 / dolares / bolsa; // Dólar MEP
GET / v1 / dolares / contadoconliqui; // Dólar CCL
GET / v1 / dolares / tarjeta; // Dólar Tarjeta
GET / v1 / dolares / mayorista; // Dólar Mayorista
GET / v1 / dolares / cripto; // Dólar Cripto

// Otras monedas
GET / v1 / cotizaciones; // Todas las cotizaciones
GET / v1 / euros; // Euros
GET / v1 / reales; // Reales brasileños
```

#### 🌎 Soporte Multi-región

- Argentina ✅ (Actualmente en uso)
- Chile
- Venezuela
- Uruguay
- México
- Bolivia
- Brasil

### Arquitectura Propuesta para Multi-región

```typescript
// types/currencies.ts
export type Region =
  | 'argentina'
  | 'chile'
  | 'venezuela'
  | 'uruguay'
  | 'mexico'
  | 'bolivia'
  | 'brasil';

export interface ApiConfig {
  baseUrl: string;
  region: Region;
  endpoints: {
    dolares: string;
    euros: string;
    crypto: string;
  };
}

// lib/api/config.ts
export const API_CONFIGS: Record<Region, ApiConfig> = {
  argentina: {
    baseUrl: 'https://dolarapi.com/v1',
    region: 'argentina',
    endpoints: {
      dolares: '/dolares',
      euros: '/euros',
      crypto: '/cotizaciones/cripto',
    },
  },
  // ... otras regiones
};
```

---

## 2. Mejores Prácticas React

### 🎯 Estructura de Carpetas Recomendada

```
src/
├── app/                      # Next.js 15 App Router
│   ├── (dashboard)/          # Route groups
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                  # API routes
│   │   ├── dolares/
│   │   └── noticias/
│   └── layout.tsx
├── components/
│   ├── ui/                   # Componentes base reutilizables
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx  # Storybook
│   │   │   └── Button.test.tsx     # Tests
│   │   ├── Card/
│   │   └── Input/
│   ├── features/             # Componentes por feature
│   │   ├── charts/
│   │   │   ├── DolarChart/
│   │   │   └── InflationChart/
│   │   ├── calculators/
│   │   └── news/
│   └── layouts/              # Layouts
├── hooks/                    # Custom hooks
│   ├── useDolar.ts
│   ├── useChartData.ts
│   └── useNewsAI.ts
├── lib/                      # Utilidades y configs
│   ├── api/
│   │   ├── client.ts         # API client configurado
│   │   └── endpoints.ts
│   ├── utils/
│   └── constants/
├── styles/
│   ├── globals.css
│   └── themes/               # Tema organizado
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
└── types/                    # TypeScript types
    ├── api.ts
    ├── charts.ts
    └── news.ts
```

### ✅ Mejores Prácticas

#### 1. **Custom Hooks Reutilizables**

```typescript
// hooks/useFetch.ts
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network error');
        const result = await response.json();

        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

// Uso:
// const { data, loading, error } = useFetch<DolarData[]>('/api/dolares');
```

#### 2. **React Query (TanStack Query)** - RECOMENDADO 🌟

```bash
npm install @tanstack/react-query
```

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      retry: 3,
    },
  },
});

// hooks/useDolarQuery.ts
import { useQuery } from '@tanstack/react-query';

export function useDolarQuery() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: async () => {
      const res = await fetch('https://dolarapi.com/v1/dolares');
      if (!res.ok) throw new Error('Error fetching');
      return res.json();
    },
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Auto-refetch cada minuto
  });
}
```

#### 3. **Componentes Compuestos (Compound Components)**

```typescript
// components/ui/Card/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('glass-strong rounded-xl p-6', className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
};

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-bold">{children}</h3>;
};

Card.Content = function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
};

// Uso:
<Card>
  <Card.Header>
    <Card.Title>Dólar Blue</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>$1,200</p>
  </Card.Content>
</Card>
```

#### 4. **Error Boundaries**

```typescript
// components/ErrorBoundary.tsx
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 glass-strong rounded-xl border border-error/30">
          <h2 className="text-xl font-bold text-error mb-2">Algo salió mal</h2>
          <p className="text-secondary">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 3. Librerías de Gráficos Profesionales

### Análisis de Opciones

Ya tienes instalado **Chart.js** y **Recharts**. Aquí está la comparación:

| Librería           | Ventajas                                           | Desventajas                               | Recomendación                      |
| ------------------ | -------------------------------------------------- | ----------------------------------------- | ---------------------------------- |
| **Recharts**       | ✅ Nativo React<br>✅ Declarativo<br>✅ Responsive | ❌ Menos tipos de gráficos                | ⭐⭐⭐⭐⭐ MEJOR para React        |
| **Chart.js**       | ✅ Muy completo<br>✅ Muchos plugins               | ❌ Imperativo<br>❌ No tan React-friendly | ⭐⭐⭐                             |
| **Visx**           | ✅ D3 + React<br>✅ Muy flexible                   | ❌ Curva de aprendizaje                   | ⭐⭐⭐⭐ Para casos avanzados      |
| **Victory**        | ✅ Animaciones<br>✅ Mobile-first                  | ❌ Bundle size grande                     | ⭐⭐⭐                             |
| **Apache ECharts** | ✅ Profesional<br>✅ Muchas opciones               | ❌ Bundle pesado                          | ⭐⭐⭐⭐ Para dashboards complejos |

### 🌟 Recomendación: **Recharts** (que ya tienes)

```typescript
// components/features/charts/DolarChart/DolarChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface DolarChartProps {
  data: Array<{
    fecha: string;
    valor: number;
  }>;
  type?: 'line' | 'area';
  color?: string;
}

export function DolarChart({
  data,
  type = 'line',
  color = '#10B981'
}: DolarChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartComponent data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.05)"
        />
        <XAxis
          dataKey="fecha"
          stroke="#6B7280"
          style={{ fontSize: 11 }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(18, 23, 46, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <DataComponent
          type="monotone"
          dataKey="valor"
          stroke={color}
          fill={type === 'area' ? `${color}20` : undefined}
          strokeWidth={2}
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
}
```

### Gráficos Avanzados con Recharts

```typescript
// Gráfico comparativo multi-línea
export function ComparativeChart({ data }: { data: DolarComparison[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="fecha" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="oficial"
          stroke="#10B981"
          name="Oficial"
        />
        <Line
          type="monotone"
          dataKey="blue"
          stroke="#14B8A6"
          name="Blue"
        />
        <Line
          type="monotone"
          dataKey="mep"
          stroke="#3B82F6"
          name="MEP"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 4. Organización CSS/Styling

### Problema Actual: Hardcodeo de Estilos

❌ **Problema:**

```typescript
<div className="p-5 bg-[#1e2336] border border-gray-800 rounded-xl">
```

### ✅ Solución: Design Tokens + CVA (Class Variance Authority)

#### 1. **Instalar CVA**

```bash
npm install class-variance-authority clsx tailwind-merge
```

#### 2. **Crear Utilidad `cn`**

```typescript
// lib/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 3. **Design Tokens en Tailwind**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: 'var(--color-dark)',
          light: 'var(--color-dark-light)',
          lighter: 'var(--color-dark-lighter)',
        },
        accent: {
          emerald: 'var(--color-accent-emerald)',
          teal: 'var(--color-accent-teal)',
          blue: 'var(--color-accent-blue)',
        },
        // ... más colores
      },
      spacing: {
        card: 'var(--spacing-card)',
        section: 'var(--spacing-section)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
  plugins: [],
};

export default config;
```

```css
/* styles/globals.css */
:root {
  /* Colors */
  --color-dark: #0a0e27;
  --color-dark-light: #12172e;
  --color-dark-lighter: #1a1f3a;

  --color-accent-emerald: #10b981;
  --color-accent-teal: #14b8a6;
  --color-accent-blue: #3b82f6;

  /* Spacing */
  --spacing-card: 1.5rem;
  --spacing-section: 4rem;

  /* Radius */
  --radius-card: 1rem;
}
```

#### 4. **CVA para Componentes**

```typescript
// components/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-accent-emerald text-dark hover:bg-accent-teal',
        secondary: 'glass border border-white/5 text-white hover:bg-white/10',
        outline: 'border-2 border-accent-emerald text-accent-emerald hover:bg-accent-emerald/10',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

// Uso:
<Button variant="primary" size="lg">Click Me</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

#### 5. **Componentes Base con CVA**

```typescript
// components/ui/Card/Card.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva(
  'rounded-xl transition-all',
  {
    variants: {
      variant: {
        default: 'glass-strong border border-white/5',
        outlined: 'border-2 border-accent-emerald/20',
        elevated: 'glass-strong shadow-2xl border border-white/10',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:border-accent-emerald/20 hover:scale-[1.01]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: false,
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant, padding, hover, className, children }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, hover, className }))}>
      {children}
    </div>
  );
}
```

---

## 5. Integración de AI para Noticias

Ya tienes **OpenAI** instalado. Aquí está la arquitectura completa:

### Arquitectura AI + Noticias

```
┌─────────────────┐
│  News API       │──┐
│  (NewsAPI.org)  │  │
└─────────────────┘  │
                     ├──▶ ┌──────────────┐
┌─────────────────┐  │    │  Next.js API │
│  RSS Feeds      │──┤    │  Route       │
│  (Clarín, etc)  │  │    │  /api/news   │
└─────────────────┘  │    └──────┬───────┘
                     │           │
┌─────────────────┐  │           ▼
│  Twitter API    │──┘    ┌──────────────┐
│  (Financial)    │       │  OpenAI GPT  │
└─────────────────┘       │  Analysis    │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Supabase    │
                          │  Storage     │
                          └──────────────┘
```

### Implementación

#### 1. **API Route para Análisis AI**

```typescript
// app/api/news/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { newsArticle, dolarData } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Eres un analista financiero experto en economía argentina.
          Analiza noticias y relaciona su impacto con las cotizaciones del dólar.
          Proporciona análisis concisos, profesionales y basados en datos.`,
        },
        {
          role: 'user',
          content: `
Noticia: ${newsArticle.title}
${newsArticle.content}

Datos actuales del dólar:
- Oficial: $${dolarData.oficial}
- Blue: $${dolarData.blue}
- MEP: $${dolarData.mep}

Analiza:
1. Impacto potencial en las cotizaciones
2. Tendencia esperada (alcista/bajista/neutral)
3. Recomendaciones para inversores
4. Resumen ejecutivo (max 2 líneas)
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      analysis,
      tokens: completion.usage,
    });
  } catch (error) {
    console.error('Error analyzing news:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}
```

#### 2. **Hook para AI Analysis**

```typescript
// hooks/useNewsAnalysis.ts
import { useState } from 'react';

interface NewsArticle {
  title: string;
  content: string;
  url: string;
  publishedAt: string;
}

interface DolarData {
  oficial: number;
  blue: number;
  mep: number;
}

export function useNewsAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function analyzeNews(article: NewsArticle, dolarData: DolarData) {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsArticle: article,
          dolarData,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysis(data.analysis);
      return data.analysis;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  return { analyzeNews, analyzing, analysis, error };
}
```

#### 3. **Componente de Noticias con AI**

```typescript
// components/features/news/NewsCard.tsx
'use client';

import { useState } from 'react';
import { useNewsAnalysis } from '@/hooks/useNewsAnalysis';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaRobot, FaNewspaper } from 'react-icons/fa';

interface NewsCardProps {
  article: {
    title: string;
    content: string;
    url: string;
    publishedAt: string;
    image?: string;
  };
  dolarData: {
    oficial: number;
    blue: number;
    mep: number;
  };
}

export function NewsCard({ article, dolarData }: NewsCardProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { analyzeNews, analyzing, analysis } = useNewsAnalysis();

  async function handleAnalyze() {
    if (!analysis) {
      await analyzeNews(article, dolarData);
    }
    setShowAnalysis(true);
  }

  return (
    <Card variant="elevated" padding="md" hover>
      <div className="flex gap-4">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <FaNewspaper className="text-accent-emerald mt-1" />
            <h3 className="font-bold text-lg">{article.title}</h3>
          </div>

          <p className="text-secondary text-sm mb-3 line-clamp-2">
            {article.content}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              <FaRobot className="mr-2" />
              {analyzing ? 'Analizando...' : 'Análisis AI'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(article.url, '_blank')}
            >
              Leer más
            </Button>
          </div>

          {showAnalysis && analysis && (
            <div className="mt-4 p-4 glass rounded-lg border border-accent-emerald/20">
              <h4 className="text-sm font-semibold text-accent-emerald mb-2">
                Análisis AI
              </h4>
              <p className="text-sm text-secondary whitespace-pre-line">
                {analysis}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
```

#### 4. **Fuentes de Noticias**

```typescript
// lib/api/news.ts
export async function fetchFinancialNews() {
  // Opción 1: NewsAPI.org
  const newsApiKey = process.env.NEWS_API_KEY;
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=dolar+argentina&language=es&apiKey=${newsApiKey}`
  );

  // Opción 2: RSS Parser (gratis)
  // npm install rss-parser

  // Opción 3: Scraping (con límites)
  // npm install cheerio

  return response.json();
}
```

---

## 6. Sistema de Documentos/PDFs

### Arquitectura con Supabase

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// types/documents.ts
export interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  category: 'informe' | 'analisis' | 'whitepaper' | 'presentacion';
  author: string;
  published_at: string;
  downloads: number;
  tags: string[];
}
```

### Schema de Supabase

```sql
-- Ejecutar en Supabase SQL Editor

create table documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text not null,
  file_name text not null,
  file_size bigint,
  category text check (category in ('informe', 'analisis', 'whitepaper', 'presentacion')),
  author text,
  published_at timestamp with time zone default now(),
  downloads integer default 0,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table documents enable row level security;

-- Policy: Anyone can read documents
create policy "Documents are viewable by everyone"
  on documents for select
  using (true);

-- Storage bucket for PDFs
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- Policy: Anyone can download from documents bucket
create policy "Documents are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'documents');
```

### API para Documentos

```typescript
// app/api/documents/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, documents: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// app/api/documents/upload/route.ts
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('documents').getPublicUrl(fileName);

    // Insert metadata into database
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        category,
        author,
      })
      .select()
      .single();

    if (docError) throw docError;

    return NextResponse.json({ success: true, document: docData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
```

### Componente de Biblioteca de Documentos

```typescript
// components/features/documents/DocumentLibrary.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';

interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  author: string;
  published_at: string;
  downloads: number;
  category: string;
}

export function DocumentLibrary() {
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.documents as Document[];
    },
  });

  async function handleDownload(doc: Document) {
    // Increment download counter
    await fetch(`/api/documents/${doc.id}/download`, { method: 'POST' });

    // Trigger download
    window.open(doc.file_url, '_blank');
  }

  if (isLoading) {
    return <div>Cargando documentos...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((doc) => (
        <Card key={doc.id} variant="elevated" padding="md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-emerald/10 rounded-lg">
              <FaFilePdf className="text-3xl text-accent-emerald" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold mb-1">{doc.title}</h3>
              <p className="text-xs text-secondary mb-2">
                {doc.author} • {new Date(doc.published_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary mt-3 mb-4 line-clamp-2">
            {doc.description}
          </p>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDownload(doc)}
              className="flex-1"
            >
              <FaDownload className="mr-2" />
              Descargar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(doc.file_url, '_blank')}
            >
              <FaEye />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-secondary">
            <span className="px-2 py-1 bg-accent-emerald/10 rounded text-accent-emerald">
              {doc.category}
            </span>
            <span>{doc.downloads} descargas</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Visor de PDF Integrado

```bash
npm install react-pdf
```

```typescript
// components/features/documents/PDFViewer.tsx
'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title: string;
}

export function PDFViewer({ url, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <div className="glass-strong p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNumber(p => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
        >
          Anterior
        </Button>

        <span className="text-sm text-secondary">
          Página {pageNumber} de {numPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
          disabled={pageNumber >= numPages}
        >
          Siguiente
        </Button>
      </div>

      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex justify-center"
      >
        <Page
          pageNumber={pageNumber}
          className="border border-white/10 rounded-lg overflow-hidden"
        />
      </Document>
    </div>
  );
}
```

---

## 🚀 Plan de Implementación

### Fase 1: Fundamentos (Semana 1-2)

- [ ] Implementar TanStack Query
- [ ] Crear sistema de componentes con CVA
- [ ] Migrar estilos hardcodeados a design tokens
- [ ] Configurar Error Boundaries

### Fase 2: Expansión API (Semana 3-4)

- [ ] Integrar todos los endpoints de DolarAPI
- [ ] Crear sistema multi-región
- [ ] Implementar gráficos comparativos con Recharts
- [ ] Optimizar fetching con React Query

### Fase 3: AI + Noticias (Semana 5-6)

- [ ] Configurar OpenAI API
- [ ] Crear API route para análisis
- [ ] Integrar fuentes de noticias
- [ ] Implementar componente NewsCard con AI

### Fase 4: Sistema de Documentos (Semana 7-8)

- [ ] Configurar Supabase Storage
- [ ] Crear tabla de documentos
- [ ] Implementar upload de PDFs
- [ ] Crear biblioteca de documentos
- [ ] Integrar visor de PDFs

### Fase 5: Optimización (Semana 9-10)

- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Testing (Jest + React Testing Library)
- [ ] Documentation

---

## 📚 Recursos Adicionales

### Documentación

- [TanStack Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
- [CVA](https://cva.style/docs)
- [Supabase](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

### Ejemplos de Código

- Ver carpeta `/examples` en este proyecto
- Shadcn UI components para referencia

---

**Creado por:** Claude
**Fecha:** 2025
**Versión:** 1.0
