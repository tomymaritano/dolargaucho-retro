/**
 * EJEMPLO: TanStack Query (React Query)
 *
 * Sistema profesional de fetching de datos con cache, revalidación automática,
 * y manejo de estados de loading/error.
 *
 * Instalación requerida:
 * npm install @tanstack/react-query
 */

'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ============================================================================
// 1. CONFIGURACIÓN DEL QUERY CLIENT
// ============================================================================

// app/providers.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Los datos se consideran frescos por 1 minuto
      gcTime: 5 * 60 * 1000, // Garbage collection después de 5 minutos
      retry: 3, // Reintentar 3 veces en caso de error
      refetchOnWindowFocus: true, // Re-fetch cuando el usuario vuelve a la tab
    },
  },
});

// Wrapper para la app
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Uso en app/layout.tsx:
/*
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
*/

// ============================================================================
// 2. TIPOS DE DATOS
// ============================================================================

export interface DolarData {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
  moneda: string;
}

export interface InflacionData {
  fecha: string;
  valor: number;
}

export interface RiesgoPaisData {
  fecha: string;
  valor: number;
}

// ============================================================================
// 3. API CLIENT
// ============================================================================

class DolarAPIClient {
  private baseURL = 'https://dolarapi.com/v1';

  async getDolares(): Promise<DolarData[]> {
    const response = await fetch(`${this.baseURL}/dolares`);
    if (!response.ok) throw new Error('Error fetching dolares');
    return response.json();
  }

  async getDolarByType(type: string): Promise<DolarData> {
    const response = await fetch(`${this.baseURL}/dolares/${type}`);
    if (!response.ok) throw new Error(`Error fetching dolar ${type}`);
    return response.json();
  }

  async getInflacion(): Promise<InflacionData[]> {
    const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
    if (!response.ok) throw new Error('Error fetching inflacion');
    return response.json();
  }

  async getRiesgoPais(): Promise<RiesgoPaisData[]> {
    const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais');
    if (!response.ok) throw new Error('Error fetching riesgo pais');
    return response.json();
  }
}

export const apiClient = new DolarAPIClient();

// ============================================================================
// 4. CUSTOM HOOKS CON REACT QUERY
// ============================================================================

/**
 * Hook para obtener todas las cotizaciones del dólar
 * Se actualiza automáticamente cada 30 segundos
 */
export function useDolares() {
  return useQuery({
    queryKey: ['dolares'],
    queryFn: () => apiClient.getDolares(),
    staleTime: 30 * 1000, // Datos frescos por 30 segundos
    refetchInterval: 30 * 1000, // Auto-refetch cada 30 segundos
  });
}

/**
 * Hook para obtener un tipo específico de dólar
 */
export function useDolarByType(type: string) {
  return useQuery({
    queryKey: ['dolar', type],
    queryFn: () => apiClient.getDolarByType(type),
    enabled: !!type, // Solo ejecutar si type está definido
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

/**
 * Hook para obtener datos de inflación
 */
export function useInflacion() {
  return useQuery({
    queryKey: ['inflacion'],
    queryFn: () => apiClient.getInflacion(),
    staleTime: 60 * 60 * 1000, // 1 hora (datos históricos cambian poco)
    select: (data) => {
      // Transformar datos: ordenar por fecha y tomar últimos 12 meses
      return data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 12)
        .reverse();
    },
  });
}

/**
 * Hook para obtener riesgo país
 */
export function useRiesgoPais() {
  return useQuery({
    queryKey: ['riesgo-pais'],
    queryFn: () => apiClient.getRiesgoPais(),
    staleTime: 60 * 60 * 1000, // 1 hora
    select: (data) => {
      // Transformar: ordenar y tomar últimos 30 días
      return data
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 30);
    },
  });
}

/**
 * Hook con múltiples queries en paralelo
 * Útil cuando necesitas varios datos relacionados
 */
export function useDashboardData() {
  const dolares = useDolares();
  const inflacion = useInflacion();
  const riesgoPais = useRiesgoPais();

  return {
    dolares,
    inflacion,
    riesgoPais,
    // Estado general
    isLoading: dolares.isLoading || inflacion.isLoading || riesgoPais.isLoading,
    isError: dolares.isError || inflacion.isError || riesgoPais.isError,
    error: dolares.error || inflacion.error || riesgoPais.error,
  };
}

// ============================================================================
// 5. MUTATIONS (Para operaciones POST/PUT/DELETE)
// ============================================================================

interface NewsAnalysisRequest {
  newsTitle: string;
  newsContent: string;
  dolarData: DolarData;
}

interface NewsAnalysisResponse {
  analysis: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number;
}

/**
 * Mutation para análisis de noticias con AI
 */
export function useNewsAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewsAnalysisRequest): Promise<NewsAnalysisResponse> => {
      const response = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas para refrescar UI
      queryClient.invalidateQueries({ queryKey: ['news'] });

      console.log('Analysis completed:', data);
    },
    onError: (error) => {
      console.error('Analysis error:', error);
    },
  });
}

/**
 * Mutation para subir documentos
 */
export function useDocumentUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      // Refrescar lista de documentos
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// ============================================================================
// 6. COMPONENTES DE EJEMPLO
// ============================================================================

/**
 * Componente que muestra todas las cotizaciones
 */
export function DolarList() {
  const { data, isLoading, isError, error } = useDolares();

  if (isLoading) {
    return (
      <div className="p-6 glass-strong rounded-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-panel/20 rounded w-3/4"></div>
          <div className="h-4 bg-panel/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 glass-strong rounded-xl border border-error/30">
        <p className="text-error">Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((dolar) => (
        <div key={dolar.nombre} className="p-5 glass-strong rounded-xl">
          <h3 className="font-bold mb-2">{dolar.nombre}</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-secondary">Compra</p>
              <p className="text-lg font-mono text-brand">${dolar.compra.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary">Venta</p>
              <p className="text-lg font-mono text-brand-light">${dolar.venta.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Componente con tabs que usa queries condicionales
 */
export function DolarTabs() {
  const [selectedType, setSelectedType] = React.useState('blue');
  const { data, isLoading } = useDolarByType(selectedType);

  return (
    <div className="glass-strong p-6 rounded-xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['oficial', 'blue', 'mep', 'ccl'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedType === type
                ? 'bg-brand text-dark'
                : 'glass border border-white/5 text-secondary hover:text-white'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-panel/20 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-panel/20 rounded w-1/4"></div>
        </div>
      ) : data ? (
        <div>
          <h2 className="text-3xl font-mono font-bold text-brand">${data.venta.toFixed(2)}</h2>
          <p className="text-sm text-secondary mt-2">
            Actualizado: {new Date(data.fechaActualizacion).toLocaleString('es-AR')}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Componente que usa mutation
 */
export function NewsAnalysisForm() {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const { data: dolarData } = useDolarByType('blue');
  const mutation = useNewsAnalysis();

  async function handleAnalyze() {
    if (!dolarData) return;

    await mutation.mutateAsync({
      newsTitle: title,
      newsContent: content,
      dolarData,
    });
  }

  return (
    <div className="glass-strong p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Análisis de Noticia con AI</h2>

      <input
        type="text"
        placeholder="Título de la noticia"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 rounded-lg bg-dark-light border border-white/5"
      />

      <textarea
        placeholder="Contenido de la noticia"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 mb-3 rounded-lg bg-dark-light border border-white/5 h-32"
      />

      <button
        onClick={handleAnalyze}
        disabled={mutation.isPending}
        className="w-full py-3 bg-brand text-dark rounded-lg font-semibold hover:bg-brand-light transition-all disabled:opacity-50"
      >
        {mutation.isPending ? 'Analizando...' : 'Analizar con AI'}
      </button>

      {mutation.isSuccess && (
        <div className="mt-4 p-4 glass rounded-lg border border-brand/20">
          <h3 className="font-semibold text-brand mb-2">Resultado:</h3>
          <p className="text-sm text-secondary">{mutation.data.analysis}</p>
          <p className="text-xs text-secondary mt-2">
            Sentimiento: <span className="text-white">{mutation.data.sentiment}</span>
          </p>
        </div>
      )}

      {mutation.isError && (
        <div className="mt-4 p-4 glass rounded-lg border border-error/30">
          <p className="text-error text-sm">Error: {mutation.error?.message}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. PREFETCHING & CACHE MANAGEMENT
// ============================================================================

/**
 * Prefetch de datos para mejorar UX
 * Útil cuando sabes que el usuario va a necesitar datos pronto
 */
export function usePrefetchDolar() {
  const queryClient = useQueryClient();

  return {
    prefetchDolar: (type: string) => {
      queryClient.prefetchQuery({
        queryKey: ['dolar', type],
        queryFn: () => apiClient.getDolarByType(type),
      });
    },
    prefetchAllDolares: () => {
      queryClient.prefetchQuery({
        queryKey: ['dolares'],
        queryFn: () => apiClient.getDolares(),
      });
    },
  };
}

// Uso en navegación:
/*
function NavigationButton() {
  const { prefetchDolar } = usePrefetchDolar();

  return (
    <Link
      href="/dolar/blue"
      onMouseEnter={() => prefetchDolar('blue')} // Prefetch on hover
    >
      Ver Dólar Blue
    </Link>
  );
}
*/

/**
 * Invalidar y refrescar datos manualmente
 */
export function useRefreshData() {
  const queryClient = useQueryClient();

  return {
    refreshDolares: () => {
      queryClient.invalidateQueries({ queryKey: ['dolares'] });
    },
    refreshAll: () => {
      queryClient.invalidateQueries(); // Invalida TODAS las queries
    },
    clearCache: () => {
      queryClient.clear(); // Limpia completamente el cache
    },
  };
}

// ============================================================================
// 8. OPTIMISTIC UPDATES (Para mejor UX)
// ============================================================================

/**
 * Mutation con optimistic update
 * La UI se actualiza inmediatamente, antes de que la API responda
 */
export function useFavoriteDolar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dolarType: string) => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ type: dolarType }),
      });
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    // Optimistic update: actualizar UI antes de esperar respuesta
    onMutate: async (dolarType) => {
      // Cancelar queries en curso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      // Guardar estado anterior (por si hay que rollback)
      const previousFavorites = queryClient.getQueryData(['favorites']);

      // Actualizar optimisticamente
      queryClient.setQueryData(['favorites'], (old: string[] = []) => {
        return [...old, dolarType];
      });

      // Retornar contexto para rollback
      return { previousFavorites };
    },
    // Si falla, restaurar estado anterior
    onError: (err, dolarType, context) => {
      queryClient.setQueryData(['favorites'], context?.previousFavorites);
    },
    // Siempre refrescar después de completar
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export default {
  // Exports para usar en otros archivos
  useDolares,
  useDolarByType,
  useInflacion,
  useRiesgoPais,
  useDashboardData,
  useNewsAnalysis,
  useDocumentUpload,
  usePrefetchDolar,
  useRefreshData,
  useFavoriteDolar,
};
