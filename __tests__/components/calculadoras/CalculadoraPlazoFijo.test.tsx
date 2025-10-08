import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalculadoraPlazoFijo } from '@/components/calculadoras/CalculadoraPlazoFijo';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('CalculadoraPlazoFijo', () => {
  it('renders the calculator', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CalculadoraPlazoFijo />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Calculadora/i)).toBeInTheDocument();
  });

  it('allows input changes', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CalculadoraPlazoFijo />
      </QueryClientProvider>
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);

    // Test that we can change values
    if (inputs[0]) {
      fireEvent.change(inputs[0], { target: { value: '10000' } });
      expect(inputs[0]).toHaveValue(10000);
    }
  });
});
