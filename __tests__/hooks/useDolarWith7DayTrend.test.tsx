import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDolarWith7DayTrend } from '@/hooks/useDolarWith7DayTrend';

// Mock fetch globally
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

describe('useDolarWith7DayTrend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data with both 24h and 7-day trend properties', async () => {
    // Mock all fetch calls to return consistent data
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      // Mock current dolares
      if (url.includes('/dolares') && !url.includes('historico')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              casa: 'blue',
              nombre: 'Dólar Blue',
              compra: 1000,
              venta: 1010,
              moneda: 'USD',
              fechaActualizacion: '2025-01-14T10:00:00Z',
            },
          ],
        });
      }

      // Mock any historical request
      return Promise.resolve({
        ok: true,
        json: async () => ({
          casa: 'blue',
          compra: 950,
          venta: 960,
          fecha: '2025-01-07',
        }),
      });
    });

    const { result } = renderHook(() => useDolarWith7DayTrend(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.data).toBeDefined();

    if (result.current.data.length > 0) {
      const firstDolar = result.current.data[0];

      // Check that both trend properties exist
      expect(firstDolar.variation24h).toBeDefined();
      expect(firstDolar.variation7d).toBeDefined();

      // Check structure
      expect(firstDolar.variation24h).toHaveProperty('percentage');
      expect(firstDolar.variation24h).toHaveProperty('trend');
      expect(firstDolar.variation7d).toHaveProperty('percentage');
      expect(firstDolar.variation7d).toHaveProperty('trend');
    }
  });

  it('should handle missing 7-day data gracefully', async () => {
    const mockDolares = [
      {
        casa: 'oficial',
        nombre: 'Dólar Oficial',
        compra: 800,
        venta: 850,
        moneda: 'USD',
        fechaActualizacion: '2025-01-14T10:00:00Z',
      },
    ];

    const mockHistoricalYesterday = {
      casa: 'oficial',
      compra: 795,
      venta: 845,
      fecha: '2025-01-13',
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDolares,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistoricalYesterday,
      })
      // Mock failed 7-day requests
      .mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useDolarWith7DayTrend(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const oficialData = result.current.data.find((d) => d.casa === 'oficial');
    expect(oficialData).toBeDefined();

    if (oficialData) {
      // Should still have 24h data
      expect(oficialData.variation24h).toBeDefined();

      // 7-day should have defaults
      expect(oficialData.variation7d.percentage).toBe(0);
      expect(oficialData.variation7d.trend).toBe('neutral');
    }
  });
});
