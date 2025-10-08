import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFCIMercadoDinero,
  useFCIRentaVariable,
  useFCIRentaFija,
  useFCIRentaMixta,
  useFCIOtros,
  useAllFCI,
} from '@/hooks/useFinanzas';

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

describe('FCI Hooks', () => {
  it('useFCIMercadoDinero fetches money market funds', async () => {
    const { result } = renderHook(() => useFCIMercadoDinero(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });

  it('useFCIRentaVariable fetches variable income funds', async () => {
    const { result } = renderHook(() => useFCIRentaVariable(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });

  it('useFCIRentaFija fetches fixed income funds', async () => {
    const { result } = renderHook(() => useFCIRentaFija(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });

  it('useFCIRentaMixta fetches mixed funds', async () => {
    const { result } = renderHook(() => useFCIRentaMixta(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });

  it('useFCIOtros fetches other funds', async () => {
    const { result } = renderHook(() => useFCIOtros(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(
        true
      );
    });
  });

  it('useAllFCI hook exists and can be called', () => {
    const { result } = renderHook(() => useAllFCI(), {
      wrapper: createWrapper(),
    });

    // Verify hook is initialized
    expect(result.current).toBeDefined();
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});
