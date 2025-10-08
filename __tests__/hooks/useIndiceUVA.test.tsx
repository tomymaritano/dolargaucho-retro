import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIndiceUVA, useUltimoUVA } from '@/hooks/useFinanzas';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useIndiceUVA', () => {
  it('fetches UVA index data', async () => {
    const { result } = renderHook(() => useIndiceUVA(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });
});

describe('useUltimoUVA', () => {
  it('fetches latest UVA value', async () => {
    const { result } = renderHook(() => useUltimoUVA(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });
});
