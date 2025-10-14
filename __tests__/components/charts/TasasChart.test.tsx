import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { TasasChart } from '@/components/charts/TasasChart';

// Mock de recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
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

describe('TasasChart', () => {
  it('renders loading state', () => {
    const queryClient = createTestQueryClient();

    const { container } = render(
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TasasChart />
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
          <TasasChart limit={5} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeTruthy();
  });
});
