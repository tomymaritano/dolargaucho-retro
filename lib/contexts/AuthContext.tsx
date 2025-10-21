/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application
 * Uses custom JWT-based authentication with HTTP-only cookies
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFavoritesStore } from '@/lib/store/favorites';

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  created_at: Date;
}

/**
 * User preferences type
 */
export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  notifications_enabled: boolean;
  favorite_dolares: string[];
  favorite_currencies: string[];
  favorite_cryptos: string[];
  favorite_charts: string[];
}

/**
 * Auth context type
 */
interface AuthContextType {
  user: User | null;
  preferences: UserPreferences | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name?: string,
    nickname?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Helper function to notify other components of auth state changes
 */
function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    // Trigger a storage event to notify NavbarFloating and other components
    localStorage.setItem('auth-change', Date.now().toString());
    localStorage.removeItem('auth-change');
  }
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch current user from API
   */
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin', // IMPORTANTE: Incluir cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setPreferences(data.preferences || null);

          // Sync favorites from backend to localStorage
          if (data.preferences) {
            const loadFromBackend = useFavoritesStore.getState().loadFromBackend;
            loadFromBackend({
              dolares: data.preferences.favorite_dolares || [],
              currencies: data.preferences.favorite_currencies || [],
              cryptos: data.preferences.favorite_cryptos || [],
              charts: data.preferences.favorite_charts || [],
            });
          }
        } else {
          setUser(null);
          setPreferences(null);
        }
      } else {
        setUser(null);
        setPreferences(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setPreferences(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin', // IMPORTANTE: Incluir cookies
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          // Fetch full user data including preferences
          await fetchUser();
          // Notify other components of auth change
          notifyAuthChange();
          return {};
        } else {
          return { error: data.error || 'Error al iniciar sesión' };
        }
      } catch (error) {
        console.error('Sign in error:', error);
        return { error: 'Error al iniciar sesión. Por favor intenta de nuevo.' };
      }
    },
    [fetchUser]
  );

  /**
   * Sign up with email, password, optional name and optional nickname
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string,
      nickname?: string
    ): Promise<{ error?: string }> => {
      try {
        console.log('[AuthContext] Registering user:', email);

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin', // IMPORTANTE: Incluir cookies
          body: JSON.stringify({ email, password, name, nickname }),
        });

        console.log('[AuthContext] Register response status:', response.status);
        const data = await response.json();
        console.log('[AuthContext] Register response data:', data);

        if (data.success) {
          console.log('[AuthContext] Registration successful, setting user');
          setUser(data.user);

          // Fetch full user data including preferences (don't wait for it)
          console.log('[AuthContext] Fetching user preferences...');
          fetchUser().catch((err) => {
            console.warn('[AuthContext] Failed to fetch user preferences:', err);
            // Ignore error - we already have the user
          });

          // Notify other components of auth change
          notifyAuthChange();

          return {};
        } else {
          console.error('[AuthContext] Registration failed:', data.error);
          return { error: data.error || 'Error al crear la cuenta' };
        }
      } catch (error) {
        console.error('Sign up error:', error);
        return { error: 'Error al crear la cuenta. Por favor intenta de nuevo.' };
      }
    },
    [fetchUser]
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin', // IMPORTANTE: Incluir cookies
      });

      setUser(null);
      setPreferences(null);

      // Notify other components of auth change
      notifyAuthChange();

      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [router]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    preferences,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(router.pathname)}`);
    }
  }, [user, loading, router]);

  return { user, loading, refreshUser };
}
