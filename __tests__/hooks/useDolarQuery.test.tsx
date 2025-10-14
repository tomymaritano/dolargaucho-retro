import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDolarQuery } from '@/hooks/useDolarQuery';

// Mock fetch
global.fetch = jest.fn();

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

describe('useDolarQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches dólar data successfully', async () => {
    const mockData = [
      {
        moneda: 'USD',
        casa: 'blue',
        nombre: 'Blue',
        compra: 1000,
        venta: 1020,
        fechaActualizacion: '2025-10-08T10:00:00.000Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useDolarQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('https://dolarapi.com/v1/dolares');
  });

  it('returns loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useDolarQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
