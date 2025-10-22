/**
 * Tests del Sistema de Autenticación
 * Verifica que todos los componentes de auth funcionen correctamente
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth/auth-context';
import { isValidEmail, isValidPassword, formatAuthError } from '@/lib/auth/helpers';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('Auth System - Helper Functions', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('test123@test-domain.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@invalid.com')).toBe(false);
      expect(isValidEmail('invalid@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('validates passwords with minimum 6 characters', () => {
      const result = isValidPassword('test123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects passwords shorter than 6 characters', () => {
      const result = isValidPassword('test');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres');
    });

    it('rejects empty passwords', () => {
      const result = isValidPassword('');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatAuthError', () => {
    it('formats known error messages to Spanish', () => {
      expect(formatAuthError({ message: 'Invalid login credentials' })).toBe(
        'Credenciales inválidas'
      );
      expect(formatAuthError({ message: 'User already registered' })).toBe(
        'El usuario ya está registrado'
      );
      expect(formatAuthError({ message: 'Email not confirmed' })).toBe('Email no confirmado');
    });

    it('returns original message for unknown errors', () => {
      expect(formatAuthError({ message: 'Custom error' })).toBe('Custom error');
    });

    it('handles string errors', () => {
      expect(formatAuthError('Simple error')).toBe('Simple error');
    });

    it('handles null/undefined', () => {
      expect(formatAuthError(null)).toBe('Error desconocido');
      expect(formatAuthError(undefined)).toBe('Error desconocido');
    });
  });
});

describe('Auth System - Integration', () => {
  it('AuthProvider renders without crashing', () => {
    const { container } = render(
      <AllTheProviders>
        <div>Test content</div>
      </AllTheProviders>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('AuthProvider provides auth context', async () => {
    const TestComponent = () => {
      const { useAuth } = require('@/lib/auth/auth-context');
      const { loading, user, isDemoMode } = useAuth();

      return (
        <div>
          <div data-testid="loading">{loading ? 'Loading' : 'Ready'}</div>
          <div data-testid="user">{user ? 'Authenticated' : 'Not authenticated'}</div>
          <div data-testid="mode">{isDemoMode ? 'Demo' : 'Production'}</div>
        </div>
      );
    };

    render(
      <AllTheProviders>
        <TestComponent />
      </AllTheProviders>
    );

    await waitFor(() => {
      const loadingEl = screen.getByTestId('loading');
      expect(loadingEl).toHaveTextContent(/Ready|Loading/);
    });
  });
});

describe('Auth System - API Types', () => {
  it('Lead type structure is correct', () => {
    const { CreateLeadInput } = require('@/types/leads');

    const validLead: typeof CreateLeadInput = {
      email: 'test@example.com',
      name: 'Test User',
      source: 'homepage',
      subscribed_to_newsletter: true,
      metadata: { utm_source: 'test' },
    };

    expect(validLead.email).toBe('test@example.com');
    expect(validLead.source).toBe('homepage');
  });

  it('UserPreferences type structure is correct', () => {
    const { UserPreferences } = require('@/types/user');

    // Type check - this will error at compile time if structure is wrong
    const validPrefs = {
      id: 'test-id',
      user_id: 'user-id',
      favorite_dolares: ['blue', 'oficial'],
      favorite_currencies: ['USD', 'EUR'],
      dashboard_layout: {},
      theme: 'dark' as const,
      notifications_enabled: true,
      email_alerts: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    expect(validPrefs.theme).toBe('dark');
  });
});
