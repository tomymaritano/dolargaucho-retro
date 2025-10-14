'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';

// Dynamic import to avoid SSR issues and hydration errors
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

/**
 * Global Providers
 * Wraps the app with:
 * - Auth Provider (custom JWT authentication)
 * - Theme Provider (dark/light mode with localStorage persistence)
 * - React Query (data fetching, caching, synchronization)
 *
 * Features:
 * - Custom JWT authentication with HTTP-only cookies
 * - PostgreSQL backend
 * - Auto-refetching on window focus
 * - Smart caching (1 minute stale time)
 * - Auto garbage collection (5 minutes)
 * - 3 retry attempts on failed requests
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient once and never recreate
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Consider data fresh for 1 minute
            staleTime: 60 * 1000,
            // Garbage collect after 5 minutes of no usage
            gcTime: 5 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Refetch when user comes back to tab
            refetchOnWindowFocus: true,
            // Refetch when network reconnects
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* DevTools with dynamic import - no hydration issues */}
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
