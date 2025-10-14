import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';

global.fetch = jest.fn();

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
  Wrapper.displayName = 'TestQueryWrapper';
  return Wrapper;
};

describe('useTasaPlazoFijo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasa plazo fijo data successfully', async () => {
    const mockData = [
      { entidad: 'Banco Nación', tnaClientes: 75.5, tnaNoClientes: 70.0 },
      { entidad: 'Banco Galicia', tnaClientes: 80.0, tnaNoClientes: 75.0 },
      { entidad: 'Banco Santander', tnaClientes: 85.0, tnaNoClientes: 80.0 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useTasaPlazoFijo(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data).toHaveLength(3);
  });

  it('returns data with entidad property', async () => {
    const mockData = [
      { entidad: 'Banco Santander', tnaClientes: 85.0, tnaNoClientes: 80.0 },
      { entidad: 'Banco Nación', tnaClientes: 75.5, tnaNoClientes: 70.0 },
      { entidad: 'Banco Galicia', tnaClientes: 80.0, tnaNoClientes: 75.0 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useTasaPlazoFijo(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]?.entidad).toBeDefined();
    expect(result.current.data?.[0]?.tnaClientes).toBeDefined();
  });
});
