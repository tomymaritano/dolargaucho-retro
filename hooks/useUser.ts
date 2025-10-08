'use client';

import { useAuth } from './useAuth';
import { UserProfile } from '@/types/user';

/**
 * Hook to get user profile with preferences
 */
export function useUser(): UserProfile | null {
  const { user, preferences } = useAuth();

  if (!user) return null;

  return {
    user,
    preferences,
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useAuth();
  return !!user;
}
