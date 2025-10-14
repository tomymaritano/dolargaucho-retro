/* @refresh reset */
'use client';

/**
 * Authentication Context
 * Provides auth state and methods throughout the app
 * Supports both Supabase and Demo mode
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/types/user';
import { Database } from '@/types/database';
import { getAuthMode } from '@/lib/auth/helpers';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { logger } from '@/lib/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  preferences: UserPreferences | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Calculate demo mode ONCE on mount - never changes during component lifetime
  const [isDemoMode] = useState(() => getAuthMode() === 'demo');

  // Track if component is mounted to prevent updates during SSR/hydration
  const [isMounted, setIsMounted] = useState(false);

  // Demo mode auth
  const demoAuth = useDemoAuth();

  // Supabase auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Set mounted flag after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user preferences from Supabase
  const fetchPreferences = useCallback(async (userId: string): Promise<UserPreferences | null> => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If table doesn't exist (404), return default preferences without trying to create
      if (error && error.code === '42P01') {
        logger.warn('user_preferences table does not exist', { context: 'auth', action: 'fetchPreferences' });
        return null;
      }

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching preferences', error, { context: 'auth', userId });
        return null;
      }

      // Create default preferences if none exist
      if (!data) {
        const defaultPrefs: Database['public']['Tables']['user_preferences']['Insert'] = {
          user_id: userId,
          favorite_dolares: [],
          favorite_currencies: [],
          dashboard_layout: null,
          theme: 'dark',
          notifications_enabled: true,
          email_alerts: false,
        };

        const { data: newPrefs, error: insertError } = (await supabase
          .from('user_preferences')
          .insert(defaultPrefs as unknown as never)
          .select()
          .single()) as unknown as { data: UserPreferences | null; error: unknown };

        if (insertError) {
          logger.error('Error creating preferences', insertError, { context: 'auth', userId });
          return null;
        }

        return newPrefs;
      }

      return data;
    } catch (error) {
      logger.error('Error in fetchPreferences', error, { context: 'auth', userId });
      return null;
    }
  }, []);

  // Initialize Supabase auth (only if not demo mode and after hydration)
  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    // Don't initialize auth until component is mounted (after hydration)
    if (!isMounted) {
      return;
    }

    let mounted = true;

    // Get initial session
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // DISABLED: Fetch preferences to prevent infinite loop until table is created
        // if (session?.user) {
        //   const prefs = await fetchPreferences(session.user.id);
        //   if (mounted) {
        //     setPreferences(prefs);
        //   }
        // }
      } catch (error) {
        logger.error('Error initializing auth', error, { context: 'auth' });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      // DISABLED: Fetch preferences to prevent infinite loop until table is created
      // if (session?.user) {
      //   const prefs = await fetchPreferences(session.user.id);
      //   if (mounted) {
      //     setPreferences(prefs);
      //   }
      // } else {
      //   setPreferences(null);
      // }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemoMode, isMounted]);

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, metadata?: Record<string, unknown>) => {
      if (isDemoMode) {
        await demoAuth.signUp(email, password, metadata);
        return { error: null };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      return { error };
    },
    [isDemoMode, demoAuth]
  );

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (isDemoMode) {
        await demoAuth.signIn(email, password);
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    },
    [isDemoMode, demoAuth]
  );

  // Sign out
  const signOut = useCallback(async () => {
    if (isDemoMode) {
      await demoAuth.signOut();
      return;
    }

    await supabase.auth.signOut();
    setPreferences(null);
  }, [isDemoMode, demoAuth]);

  // Sign in with OAuth
  const signInWithProvider = useCallback(
    async (provider: 'google' | 'github') => {
      if (isDemoMode) {
        return { error: { message: 'OAuth no disponible en modo demo' } as AuthError };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { error };
    },
    [isDemoMode]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      if (isDemoMode) {
        await demoAuth.updatePreferences(prefs);
        return;
      }

      if (!user) return;

      const updateData: Database['public']['Tables']['user_preferences']['Update'] = {
        ...prefs,
        updated_at: new Date().toISOString(),
      };

      const { error } = (await supabase
        .from('user_preferences')
        .update(updateData as unknown as never)
        .eq('user_id', user.id)) as unknown as { error: unknown };

      if (error) {
        logger.error('Error updating preferences', error, { context: 'auth', userId: user.id });
        return;
      }

      const updated = await fetchPreferences(user.id);
      setPreferences(updated);
    },
    [isDemoMode, demoAuth, user, fetchPreferences]
  );

  // Refresh preferences
  const refreshPreferences = useCallback(async () => {
    if (isDemoMode) {
      // Demo mode preferences are already in sync
      return;
    }

    if (!user) return;

    const prefs = await fetchPreferences(user.id);
    setPreferences(prefs);
  }, [isDemoMode, user, fetchPreferences]);

  // Memoize context value to prevent unnecessary re-renders
  // Note: We use the entire demoAuth object to avoid subscribing to individual properties
  const value = useMemo<AuthContextType>(
    () => ({
      user: isDemoMode ? demoAuth.user : user,
      session,
      preferences: isDemoMode ? demoAuth.preferences : preferences,
      loading: isDemoMode ? demoAuth.loading : loading,
      signUp,
      signIn,
      signOut,
      signInWithProvider,
      updatePreferences,
      refreshPreferences,
      isDemoMode,
    }),
    [
      isDemoMode,
      demoAuth, // Use whole object instead of individual properties
      user,
      session,
      preferences,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithProvider,
      updatePreferences,
      refreshPreferences,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
