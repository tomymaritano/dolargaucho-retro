# 🚀 Guía de Implementación Rápida

Esta guía te ayudará a implementar las mejoras paso a paso.

## 📦 Paso 1: Instalar Dependencias

```bash
# CVA para componentes
npm install class-variance-authority clsx tailwind-merge

# TanStack Query para data fetching
npm install @tanstack/react-query @tanstack/react-query-devtools

# Recharts para gráficos (ya lo tienes, pero asegúrate)
npm install recharts

# Para PDFs
npm install react-pdf pdfjs-dist

# Para RSS (opcional)
npm install rss-parser

# Para parsing de HTML (scraping de noticias)
npm install cheerio
```

## 🏗️ Paso 2: Estructura de Carpetas

Crea esta estructura:

```bash
mkdir -p lib/utils
mkdir -p lib/api
mkdir -p lib/ai
mkdir -p hooks
mkdir -p components/ui
mkdir -p components/features/charts
mkdir -p components/features/news
mkdir -p components/features/documents
mkdir -p app/api/news/analyze
mkdir -p app/api/documents
```

## 🎨 Paso 3: Configurar Utilidades Base

### 3.1 Crear `lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3.2 Copiar componentes de ejemplo

Los ejemplos están en `/examples/`. Úsalos como referencia.

## 🔄 Paso 4: Implementar TanStack Query

### 4.1 Crear Provider

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4.2 Agregar a Layout

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 4.3 Crear Custom Hook

```typescript
// hooks/useDolarQuery.ts
'use client';

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
    refetchInterval: 30 * 1000, // Auto-refetch cada 30 segundos
  });
}
```

## 🎨 Paso 5: Crear Componentes Base con CVA

### 5.1 Button Component

Copia el código de `examples/01-cva-components.tsx` a:

```
components/ui/Button/Button.tsx
```

### 5.2 Card Component

```
components/ui/Card/Card.tsx
```

### 5.3 Input Component

```
components/ui/Input/Input.tsx
```

## 📊 Paso 6: Mejorar Gráficos con Recharts

### 6.1 Crear Componente Base de Gráfico

```typescript
// components/features/charts/BaseChart.tsx
'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface BaseChartProps {
  data: Array<{ fecha: string; valor: number }>;
  color?: string;
  height?: number;
}

export function BaseChart({
  data,
  color = '#10B981',
  height = 350,
}: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.05)"
        />
        <XAxis dataKey="fecha" stroke="#6B7280" style={{ fontSize: 11 }} />
        <YAxis stroke="#6B7280" style={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(18, 23, 46, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## 🤖 Paso 7: Configurar AI para Noticias

### 7.1 Variables de Entorno

Crea/actualiza `.env.local`:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# NewsAPI (opcional, tiene plan gratuito limitado)
NEWS_API_KEY=...

# Supabase (si aún no está)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 7.2 Crear API Route

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
          Analiza noticias y relaciona su impacto con las cotizaciones del dólar.`,
        },
        {
          role: 'user',
          content: `
Noticia: ${newsArticle.title}

Datos del dólar:
- Blue: $${dolarData.blue}
- Oficial: $${dolarData.oficial}

Analiza el impacto potencial en 2-3 líneas.
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({
      success: true,
      analysis: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}
```

### 7.3 Crear Hook

```typescript
// hooks/useNewsAnalysis.ts
'use client';

import { useMutation } from '@tanstack/react-query';

export function useNewsAnalysis() {
  return useMutation({
    mutationFn: async ({ newsArticle, dolarData }) => {
      const response = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsArticle, dolarData }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
  });
}
```

## 📄 Paso 8: Sistema de Documentos con Supabase

### 8.1 Configurar Supabase

1. Ve a tu proyecto en Supabase
2. Ejecuta este SQL:

```sql
-- Crear tabla de documentos
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
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table documents enable row level security;

-- Policy de lectura pública
create policy "Documents are viewable by everyone"
  on documents for select
  using (true);

-- Crear bucket de storage
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- Policy para el bucket
create policy "Documents are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'documents');
```

### 8.2 Crear API Route para Upload

```typescript
// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    // Upload a Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from('documents').getPublicUrl(fileName);

    // Guardar metadata en DB
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        title,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
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

## 🧪 Paso 9: Testing Básico

### 9.1 Instalar Jest

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 9.2 Crear `jest.config.js`

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### 9.3 Ejemplo de Test

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
```

## 📈 Paso 10: Optimización de Performance

### 10.1 Lazy Loading de Componentes

```typescript
// app/page.tsx
import { lazy, Suspense } from 'react';

const NewsSection = lazy(() => import('@/components/features/news/NewsSection'));
const ChartSection = lazy(() => import('@/components/features/charts/ChartSection'));

export default function Home() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <NewsSection />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ChartSection />
      </Suspense>
    </div>
  );
}
```

### 10.2 Image Optimization

```typescript
import Image from 'next/image';

// En lugar de <img>
<Image
  src={article.image}
  alt={article.title}
  width={400}
  height={300}
  className="rounded-lg"
  priority // Para imágenes above the fold
/>
```

### 10.3 Memoization

```typescript
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    // Cálculo costoso
    return data.map(/* ... */);
  }, [data]);

  return <Chart data={processedData} />;
}
```

## 🚀 Paso 11: Deploy Checklist

Antes de hacer deploy:

- [ ] Variables de entorno configuradas
- [ ] Build exitoso: `npm run build`
- [ ] Tests pasando: `npm test`
- [ ] Performance audit con Lighthouse
- [ ] SEO básico implementado (meta tags)
- [ ] Error boundaries implementados
- [ ] Analytics configurado (Google Analytics, etc.)

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start producción
npm start

# Linter
npm run lint

# Tests
npm test

# Tests en watch mode
npm test -- --watch

# Analizar bundle size
npm run build && npx @next/bundle-analyzer
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'class-variance-authority'"

```bash
npm install class-variance-authority
```

### Error: React Query no funciona

Asegúrate de tener el Provider en el layout correcto.

### Supabase Storage retorna 403

Verifica las policies en Supabase Dashboard > Storage > Policies.

### OpenAI retorna 429 (Rate limit)

Estás excediendo el límite de llamadas. Implementa cache o reduce frecuencia.

## 📚 Recursos Adicionales

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [CVA Docs](https://cva.style/docs)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Docs](https://supabase.com/docs)

## 🎯 Próximos Pasos

1. Implementar autenticación (si es necesario)
2. Agregar modo oscuro/claro
3. Internacionalización (i18n)
4. PWA para mobile
5. Notificaciones push
6. Suscripciones a newsletters

---

**¿Necesitas ayuda?** Revisa los archivos en `/examples/` o consulta la documentación completa en `ARQUITECTURA_PROFESIONAL.md`.
