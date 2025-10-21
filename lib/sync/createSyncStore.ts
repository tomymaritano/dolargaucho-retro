/**
 * Create Sync Store
 *
 * Factory function to create a Zustand store with automatic backend synchronization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncConfig, SyncStatus, SyncResult, SyncableStore } from './types';
import { createSyncQueue } from './queue';

/**
 * Create a store with backend synchronization
 *
 * @example
 * ```ts
 * const useFavoritesStore = createSyncStore({
 *   name: 'favorites',
 *   endpoint: '/api/auth/favorites',
 *   initialState: { dolares: [], currencies: [] },
 *   conflictStrategy: 'merge-union'
 * });
 * ```
 */
export function createSyncStore<T extends Record<string, any>>(config: SyncConfig<T>) {
  const {
    name,
    endpoint,
    initialState,
    conflictStrategy = 'last-write-wins',
    customResolver,
    optimistic = true,
    maxRetries = 3,
    retryDelay = 1000,
    debounceMs = 500,
    debug = false,
  } = config;

  // Create sync queue for this store
  const syncQueue = createSyncQueue({
    maxRetries,
    baseDelay: retryDelay,
    debug,
  });

  // Debounce timer
  let debounceTimer: NodeJS.Timeout | null = null;

  /**
   * Resolve conflicts between local and remote data
   */
  function resolveConflict(local: T, remote: T): T {
    if (customResolver) {
      return customResolver(local, remote);
    }

    switch (conflictStrategy) {
      case 'client-wins':
        return local;

      case 'server-wins':
        return remote;

      case 'merge-union':
        // Merge arrays by union (no duplicates)
        const merged: any = {};
        for (const key in remote) {
          if (Array.isArray(remote[key]) && Array.isArray(local[key])) {
            merged[key] = [...new Set([...remote[key], ...local[key]])];
          } else {
            merged[key] = remote[key];
          }
        }
        return merged as T;

      case 'last-write-wins':
      default:
        // Remote wins (server timestamp is newer)
        return remote;
    }
  }

  /**
   * Log debug messages
   */
  function log(...args: any[]) {
    if (debug) {
      console.log(`[SyncStore:${name}]`, ...args);
    }
  }

  // Create the store
  type StoreState = T &
    SyncableStore<T> & {
      _internal: {
        isMounted: boolean;
        deviceId: string;
      };
    };

  const store = create<StoreState>()(
    persist(
      (set, get) => ({
        // Initial data
        ...initialState,

        // Sync metadata
        syncStatus: 'idle' as SyncStatus,
        lastSyncedAt: null,
        pendingActions: 0,

        // Internal state
        _internal: {
          isMounted: false,
          deviceId: generateDeviceId(),
        },

        /**
         * Sync data to backend
         */
        syncToBackend: async () => {
          // Clear existing debounce
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          // Debounce sync calls
          return new Promise<void>((resolve) => {
            debounceTimer = setTimeout(async () => {
              try {
                const state = get();

                // Skip if already syncing
                if (state.syncStatus === 'syncing') {
                  log('Already syncing, skipping');
                  resolve();
                  return;
                }

                // Update status
                set({ syncStatus: 'syncing' } as any);
                log('Starting sync to backend');

                // Extract data (exclude sync metadata)
                const dataToSync = extractData(state);

                // Make API call
                const response = await fetch(endpoint, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'same-origin',
                  body: JSON.stringify(dataToSync),
                });

                if (!response.ok) {
                  // Handle auth errors gracefully (user not logged in)
                  if (response.status === 401) {
                    log('User not authenticated, skipping sync');
                    set({ syncStatus: 'offline' } as any);
                    resolve();
                    return;
                  }

                  throw new Error(`Sync failed: ${response.status}`);
                }

                const result: SyncResult<T> = await response.json();

                if (result.success) {
                  log('Sync completed successfully');
                  set({
                    syncStatus: 'synced',
                    lastSyncedAt: Date.now(),
                    pendingActions: 0,
                  } as any);

                  // Handle conflict resolution if needed
                  if (result.conflictResolved && result.data) {
                    log('Conflict detected, resolving');
                    const resolved = resolveConflict(dataToSync, result.data);
                    set({ ...resolved } as any);
                  }
                } else {
                  throw new Error(result.error || 'Sync failed');
                }

                resolve();
              } catch (error) {
                log('Sync error:', error);
                set({
                  syncStatus: 'error',
                  pendingActions: get().pendingActions + 1,
                } as any);

                // Add to retry queue
                syncQueue.add({
                  id: Date.now().toString(),
                  type: 'sync',
                  payload: extractData(get()),
                  timestamp: Date.now(),
                  retries: 0,
                });

                resolve();
              }
            }, debounceMs);
          });
        },

        /**
         * Load data from backend
         */
        loadFromBackend: (data: T) => {
          log('Loading data from backend');
          set({
            ...data,
            syncStatus: 'synced',
            lastSyncedAt: Date.now(),
          } as any);
        },

        /**
         * Force immediate sync (no debounce)
         */
        forceSync: async () => {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
          }
          await get().syncToBackend();
        },

        /**
         * Clear sync queue
         */
        clearSyncQueue: () => {
          syncQueue.clear();
          set({ pendingActions: 0 } as any);
        },

        /**
         * Check if currently syncing
         */
        isSyncing: () => {
          return get().syncStatus === 'syncing';
        },

        /**
         * Check if has pending changes
         */
        hasPendingChanges: () => {
          return get().pendingActions > 0 || !syncQueue.isEmpty();
        },
      }),
      {
        name: `dolargaucho_${name}`,
        // Only persist data, not sync metadata
        partialize: (state) => {
          const { syncStatus, lastSyncedAt, pendingActions, _internal, ...data } = state;
          return data as Partial<StoreState>;
        },
      }
    )
  );

  return store;
}

/**
 * Extract data from store state (exclude sync metadata)
 */
function extractData<T extends Record<string, any>>(
  state: T & SyncableStore<T> & { _internal: any }
): T {
  const { syncStatus, lastSyncedAt, pendingActions, _internal, ...data } = state as any;
  return data as T;
}

/**
 * Generate unique device ID
 */
function generateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}
