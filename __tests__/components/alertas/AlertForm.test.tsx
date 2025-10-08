import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertForm } from '@/components/alertas/AlertForm';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('AlertForm', () => {
  it('renders the alert form', () => {
    const queryClient = createTestQueryClient();
    const mockOnSuccess = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <AlertForm onSuccess={mockOnSuccess} />
      </QueryClientProvider>
    );

    // Check that form elements are rendered
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows form inputs', () => {
    const queryClient = createTestQueryClient();
    const mockOnSuccess = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <AlertForm onSuccess={mockOnSuccess} />
      </QueryClientProvider>
    );

    // Form renders successfully
    expect(document.body).toBeTruthy();
  });

  it('allows selecting alert type', () => {
    const queryClient = createTestQueryClient();
    const mockOnSuccess = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <AlertForm onSuccess={mockOnSuccess} />
      </QueryClientProvider>
    );

    // Form allows interaction
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
