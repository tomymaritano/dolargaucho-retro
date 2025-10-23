import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { DolarAPIService } from '@/lib/api/dolarapi';

// Mock DolarAPIService
jest.mock('@/lib/api/dolarapi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useDolarQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches dólar data successfully', async () => {
    const mockData = [
      {
        moneda: 'USD' as const,
        casa: 'blue',
        nombre: 'Blue',
        compra: 1000,
        venta: 1020,
        fechaActualizacion: '2025-10-08T10:00:00.000Z',
      },
    ];

    (DolarAPIService.getAllDolares as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDolarQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(DolarAPIService.getAllDolares).toHaveBeenCalled();
  });

  it('returns loading state initially', () => {
    (DolarAPIService.getAllDolares as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useDolarQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
