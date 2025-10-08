/**
 * Demo Auth Hook
 * Manages authentication in demo mode using localStorage
 * Isolated from main auth context to prevent re-render loops
 */

import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { UserPreferences } from '@/types/user';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  STORAGE_KEYS,
} from '@/lib/utils/storage';
import { generateDemoUserId } from '@/lib/auth/helpers';

interface DemoAuthState {
  user: User | null;
  preferences: UserPreferences | null;
  loading: boolean;
}

interface DemoAuthActions {
  signIn: (email: string, password: string) => Promise<{ error: null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => Promise<{ error: null }>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

/**
 * Create default preferences for demo user
 */
function createDefaultPreferences(userId: string): UserPreferences {
  return {
    id: userId,
    user_id: userId,
    favorite_dolares: [],
    favorite_currencies: [],
    dashboard_layout: null,
    theme: 'dark',
    notifications_enabled: true,
    email_alerts: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Create demo user object
 */
function createDemoUser(email: string, metadata?: Record<string, unknown>): User {
  const userId = generateDemoUserId(email);

  return {
    id: userId,
    email,
    user_metadata: metadata || {},
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
  } as User;
}

/**
 * Hook for demo authentication
 * Separate from main auth context to prevent circular dependencies
 */
export function useDemoAuth(): DemoAuthState & DemoAuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Use ref to always have latest preferences without causing re-renders
  const preferencesRef = useRef<UserPreferences | null>(null);
  preferencesRef.current = preferences;

  // Load demo user from storage on mount
  useEffect(() => {
    const loadDemoUser = () => {
      const storedUser = getStorageItem<User>(STORAGE_KEYS.DEMO_USER);
      const storedPrefs = getStorageItem<UserPreferences>(STORAGE_KEYS.DEMO_PREFERENCES);

      if (storedUser) {
        setUser(storedUser);
        setPreferences(storedPrefs || createDefaultPreferences(storedUser.id));
      }

      setLoading(false);
    };

    loadDemoUser();
  }, []);

  // Sign in with demo mode
  const signIn = useCallback(async (email: string, _password: string) => {
    const demoUser = createDemoUser(email);
    const demoPrefs = createDefaultPreferences(demoUser.id);

    setStorageItem(STORAGE_KEYS.DEMO_USER, demoUser);
    setStorageItem(STORAGE_KEYS.DEMO_PREFERENCES, demoPrefs);

    setUser(demoUser);
    setPreferences(demoPrefs);

    return { error: null };
  }, []);

  // Sign up with demo mode
  const signUp = useCallback(
    async (email: string, _password: string, metadata?: Record<string, unknown>) => {
      const demoUser = createDemoUser(email, metadata);
      const demoPrefs = createDefaultPreferences(demoUser.id);

      setStorageItem(STORAGE_KEYS.DEMO_USER, demoUser);
      setStorageItem(STORAGE_KEYS.DEMO_PREFERENCES, demoPrefs);

      setUser(demoUser);
      setPreferences(demoPrefs);

      return { error: null };
    },
    []
  );

  // Sign out from demo mode
  const signOut = useCallback(async () => {
    removeStorageItem(STORAGE_KEYS.DEMO_USER);
    removeStorageItem(STORAGE_KEYS.DEMO_PREFERENCES);

    setUser(null);
    setPreferences(null);
  }, []);

  // Update preferences in demo mode - use ref to avoid dependency on preferences
  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    const currentPrefs = preferencesRef.current;
    if (!currentPrefs) return;

    const updatedPrefs: UserPreferences = {
      ...currentPrefs,
      ...prefs,
      updated_at: new Date().toISOString(),
    };

    setStorageItem(STORAGE_KEYS.DEMO_PREFERENCES, updatedPrefs);
    setPreferences(updatedPrefs);
  }, []); // No dependencies - stable callback

  // Memoize return object to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      user,
      preferences,
      loading,
      signIn,
      signUp,
      signOut,
      updatePreferences,
    }),
    [user, preferences, loading, signIn, signUp, signOut, updatePreferences]
  );

  return returnValue;
}
