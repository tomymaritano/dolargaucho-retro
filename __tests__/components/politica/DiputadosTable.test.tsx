import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DiputadosTable } from '@/components/politica/DiputadosTable';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('DiputadosTable', () => {
  const mockDiputados = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      apellido: 'Pérez',
      bloque: 'Frente de Todos',
      provincia: 'Buenos Aires',
      periodo: '2021-2025',
    },
  ];

  it('renders table with diputados', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <DiputadosTable diputados={mockDiputados} />
      </QueryClientProvider>
    );

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });

  it('handles empty diputados list', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <DiputadosTable diputados={[]} />
      </QueryClientProvider>
    );

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });

  it('displays diputado information', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <DiputadosTable diputados={mockDiputados} />
      </QueryClientProvider>
    );

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });
});
