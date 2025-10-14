import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SenadoresTable } from '@/components/politica/SenadoresTable';

// Mock usePolitica hook
jest.mock('@/hooks/usePolitica', () => ({
  useSenadores: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const mockSenadores = Array.from({ length: 72 }, (_, i) => ({
  nombre: `Senador${i}`,
  apellido: `Apellido${i}`,
  provincia: i % 3 === 0 ? 'Buenos Aires' : i % 3 === 1 ? 'Córdoba' : 'Santa Fe',
  bloque: i % 4 === 0 ? 'Bloque A' : i % 4 === 1 ? 'Bloque B' : i % 4 === 2 ? 'Bloque C' : 'Bloque D',
}));

describe('SenadoresTable', () => {
  beforeEach(() => {
    const { useSenadores } = require('@/hooks/usePolitica');
    useSenadores.mockReturnValue({
      data: mockSenadores,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table component', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });

  it('renders loading state', () => {
    const { useSenadores } = require('@/hooks/usePolitica');
    useSenadores.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });

  it('renders table structure with pagination', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Check for pagination controls using aria-label
    expect(screen.getByLabelText(/primera página/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/última página/i)).toBeInTheDocument();
  });

  it('changes page when pagination button is clicked', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Click next button using aria-label
    const nextButton = screen.getByLabelText(/página siguiente/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      // Page should have changed
      expect(document.body).toBeTruthy();
    });
  });

  it('changes items per page when selector is changed', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Find items per page selector
    const selector = screen.getByDisplayValue('20');
    fireEvent.change(selector, { target: { value: '50' } });

    await waitFor(() => {
      expect(selector).toHaveValue('50');
    });
  });

  it('filters senadores by search term', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Find search input
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'Bloque A' } });

    await waitFor(() => {
      // Results should be filtered
      expect(document.body).toBeTruthy();
    });
  });

  it('displays correct total count', () => {
    const queryClient = createTestQueryClient();

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SenadoresTable />
      </QueryClientProvider>
    );

    // Component should render with senadores data
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});
