import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';

// Mock de recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('RiesgoPaisChart', () => {
  it('renders loading state', () => {
    const queryClient = createTestQueryClient();

    const { container } = render(
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RiesgoPaisChart />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('renders with custom limit', () => {
    const queryClient = createTestQueryClient();

    const { container } = render(
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RiesgoPaisChart limit={60} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeTruthy();
  });
});
