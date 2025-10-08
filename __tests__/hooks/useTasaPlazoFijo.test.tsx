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
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTasaPlazoFijo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasa plazo fijo data successfully', async () => {
    const mockData = [
      { plazo_dias: 30, tna: 75.5, tea: 110.2 },
      { plazo_dias: 60, tna: 80.0, tea: 120.5 },
      { plazo_dias: 90, tna: 85.0, tea: 130.8 },
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

  it('returns data sorted by plazo_dias', async () => {
    const mockData = [
      { plazo_dias: 90, tna: 85.0, tea: 130.8 },
      { plazo_dias: 30, tna: 75.5, tea: 110.2 },
      { plazo_dias: 60, tna: 80.0, tea: 120.5 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useTasaPlazoFijo(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]?.plazo_dias).toBeDefined();
  });
});
