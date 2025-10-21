/**
 * useUsersCount Hook
 *
 * Fetches the total number of registered users
 * Used for social proof in landing page
 */

import { useQuery } from '@tanstack/react-query';

interface UsersCountResponse {
  count: number;
}

async function fetchUsersCount(): Promise<UsersCountResponse> {
  const response = await fetch('/api/stats/users-count');

  if (!response.ok) {
    throw new Error('Failed to fetch users count');
  }

  return response.json();
}

export function useUsersCount() {
  return useQuery<UsersCountResponse>({
    queryKey: ['stats', 'users-count'],
    queryFn: fetchUsersCount,
    staleTime: 1000 * 60 * 5, // 5 minutos - no necesita actualizarse frecuentemente
    gcTime: 1000 * 60 * 30, // 30 minutos (gcTime reemplaza cacheTime en v5)
    retry: 1, // Solo un reintento si falla
  });
}
