import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FCIBrowser } from '@/components/finanzas/FCIBrowser';

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

describe('FCIBrowser Component', () => {
  it('renders FCI browser component', () => {
    render(<FCIBrowser />, { wrapper: createWrapper() });

    expect(screen.getByText(/fondos comunes/i)).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<FCIBrowser />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays filter options', () => {
    render(<FCIBrowser />, { wrapper: createWrapper() });

    const tipoElements = screen.getAllByText(/tipo/i);
    const monedaElements = screen.getAllByText(/moneda/i);

    expect(tipoElements.length).toBeGreaterThan(0);
    expect(monedaElements.length).toBeGreaterThan(0);
  });
});
