/**
 * useRecentUsers Hook
 *
 * Fetches recent registered users for Community Thanks section
 */

import { useState, useEffect } from 'react';

interface RecentUser {
  nickname: string;
  created_at: string;
}

interface UseRecentUsersReturn {
  users: RecentUser[];
  loading: boolean;
  error: string | null;
}

export function useRecentUsers(): UseRecentUsersReturn {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/stats/recent-users', {
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || 'Error al cargar usuarios');
        }
      } catch (err) {
        console.error('Error fetching recent users:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
