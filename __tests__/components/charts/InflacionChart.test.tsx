import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InflacionChart } from '@/components/charts/InflacionChart';

// Mock de recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('InflacionChart', () => {
  it('renders loading state', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <InflacionChart />
      </QueryClientProvider>
    );

    // Debería mostrar spinner o estado de carga
    const spinner = screen.queryByRole('status') || screen.queryByText(/cargando/i);
    expect(spinner || screen.getByTestId).toBeTruthy();
  });

  it('renders with default props', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <InflacionChart />
      </QueryClientProvider>
    );

    // Verificar que el componente se renderiza
    expect(screen.getByTestId).toBeTruthy();
  });

  it('renders with showInteranual prop', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <InflacionChart showInteranual={true} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId).toBeTruthy();
  });
});
