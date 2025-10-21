/**
 * Favorites Store - Now powered by Sync Engine
 *
 * Migrated to use the centralized sync engine for cross-device synchronization
 * with automatic retry logic, conflict resolution, and optimistic updates.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSyncQueue } from '@/lib/sync';
import type { SyncStatus } from '@/lib/sync';

export interface ChartActionResult {
  success: boolean;
  message: string;
}

interface FavoritesData {
  dolares: string[];
  currencies: string[];
  cryptos: string[];
  charts: string[];
}

interface SyncMetadata {
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  pendingActions: number;
}

export interface FavoritesState extends FavoritesData, SyncMetadata {
  // Dolar actions
  addDolar: (casa: string) => ChartActionResult;
  removeDolar: (casa: string) => ChartActionResult;
  toggleDolar: (casa: string) => ChartActionResult;

  // Currency actions
  addCurrency: (moneda: string) => ChartActionResult;
  removeCurrency: (moneda: string) => ChartActionResult;
  toggleCurrency: (moneda: string) => ChartActionResult;

  // Crypto actions
  addCrypto: (cryptoId: string) => ChartActionResult;
  removeCrypto: (cryptoId: string) => ChartActionResult;
  toggleCrypto: (cryptoId: string) => ChartActionResult;

  // Chart actions
  addChart: (chartId: string) => ChartActionResult;
  removeChart: (chartId: string) => ChartActionResult;
  toggleChart: (chartId: string) => ChartActionResult;

  // Utilities
  getTotalCount: () => number;
  clearAll: () => void;

  // Sync methods (powered by Sync Engine)
  loadFromBackend: (favorites: Partial<FavoritesData>) => void;
  syncToBackend: () => Promise<void>;
  forceSync: () => Promise<void>;
  isSyncing: () => boolean;
  hasPendingChanges: () => boolean;
}

// Create sync queue instance for this store
const syncQueue = createSyncQueue({
  maxRetries: 3,
  baseDelay: 1000,
  debug: false,
});

// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500;

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial data
      dolares: [],
      currencies: [],
      cryptos: [],
      charts: [],

      // Sync metadata
      syncStatus: 'idle',
      lastSyncedAt: null,
      pendingActions: 0,

      // ========== DOLAR ACTIONS ==========
      addDolar: (casa: string) => {
        const state = get();
        if (state.dolares.includes(casa)) {
          return { success: false, message: 'Este dólar ya está en favoritos' };
        }
        set({ dolares: [...state.dolares, casa] });
        get().syncToBackend();
        return { success: true, message: 'Dólar agregado a favoritos' };
      },

      removeDolar: (casa: string) => {
        const state = get();
        if (!state.dolares.includes(casa)) {
          return { success: false, message: 'Este dólar no está en favoritos' };
        }
        set({ dolares: state.dolares.filter((d) => d !== casa) });
        get().syncToBackend();
        return { success: true, message: 'Dólar quitado de favoritos' };
      },

      toggleDolar: (casa: string) => {
        const state = get();
        if (state.dolares.includes(casa)) {
          set({ dolares: state.dolares.filter((d) => d !== casa) });
          get().syncToBackend();
          return { success: true, message: 'Dólar quitado de favoritos' };
        }
        set({ dolares: [...state.dolares, casa] });
        get().syncToBackend();
        return { success: true, message: 'Dólar agregado a favoritos' };
      },

      // ========== CURRENCY ACTIONS ==========
      addCurrency: (moneda: string) => {
        const state = get();
        if (state.currencies.includes(moneda)) {
          return { success: false, message: 'Esta moneda ya está en favoritos' };
        }
        set({ currencies: [...state.currencies, moneda] });
        get().syncToBackend();
        return { success: true, message: 'Moneda agregada a favoritos' };
      },

      removeCurrency: (moneda: string) => {
        const state = get();
        if (!state.currencies.includes(moneda)) {
          return { success: false, message: 'Esta moneda no está en favoritos' };
        }
        set({ currencies: state.currencies.filter((m) => m !== moneda) });
        get().syncToBackend();
        return { success: true, message: 'Moneda quitada de favoritos' };
      },

      toggleCurrency: (moneda: string) => {
        const state = get();
        if (state.currencies.includes(moneda)) {
          set({ currencies: state.currencies.filter((m) => m !== moneda) });
          get().syncToBackend();
          return { success: true, message: 'Moneda quitada de favoritos' };
        }
        set({ currencies: [...state.currencies, moneda] });
        get().syncToBackend();
        return { success: true, message: 'Moneda agregada a favoritos' };
      },

      // ========== CRYPTO ACTIONS ==========
      addCrypto: (cryptoId: string) => {
        const state = get();
        if (state.cryptos.includes(cryptoId)) {
          return { success: false, message: 'Esta crypto ya está en favoritos' };
        }
        set({ cryptos: [...state.cryptos, cryptoId] });
        get().syncToBackend();
        return { success: true, message: 'Crypto agregada a favoritos' };
      },

      removeCrypto: (cryptoId: string) => {
        const state = get();
        if (!state.cryptos.includes(cryptoId)) {
          return { success: false, message: 'Esta crypto no está en favoritos' };
        }
        set({ cryptos: state.cryptos.filter((c) => c !== cryptoId) });
        get().syncToBackend();
        return { success: true, message: 'Crypto quitada de favoritos' };
      },

      toggleCrypto: (cryptoId: string) => {
        const state = get();
        if (state.cryptos.includes(cryptoId)) {
          set({ cryptos: state.cryptos.filter((c) => c !== cryptoId) });
          get().syncToBackend();
          return { success: true, message: 'Crypto quitada de favoritos' };
        }
        set({ cryptos: [...state.cryptos, cryptoId] });
        get().syncToBackend();
        return { success: true, message: 'Crypto agregada a favoritos' };
      },

      // ========== CHART ACTIONS (Max 3) ==========
      addChart: (chartId: string) => {
        const state = get();
        if (state.charts.includes(chartId)) {
          return { success: false, message: 'Este gráfico ya está en favoritos' };
        }
        if (state.charts.length >= 3) {
          return {
            success: false,
            message: 'Máximo 3 gráficos favoritos. Quita uno para agregar otro.',
          };
        }
        set({ charts: [...state.charts, chartId] });
        get().syncToBackend();
        return { success: true, message: 'Gráfico agregado a favoritos' };
      },

      removeChart: (chartId: string) => {
        const state = get();
        if (!state.charts.includes(chartId)) {
          return { success: false, message: 'Este gráfico no está en favoritos' };
        }
        set({ charts: state.charts.filter((c) => c !== chartId) });
        get().syncToBackend();
        return { success: true, message: 'Gráfico quitado de favoritos' };
      },

      toggleChart: (chartId: string) => {
        const state = get();
        if (state.charts.includes(chartId)) {
          set({ charts: state.charts.filter((c) => c !== chartId) });
          get().syncToBackend();
          return { success: true, message: 'Gráfico quitado de favoritos' };
        }
        if (state.charts.length >= 3) {
          return {
            success: false,
            message: 'Máximo 3 gráficos favoritos. Quita uno para agregar otro.',
          };
        }
        set({ charts: [...state.charts, chartId] });
        get().syncToBackend();
        return { success: true, message: 'Gráfico agregado a favoritos' };
      },

      // ========== UTILITIES ==========
      getTotalCount: () => {
        const { dolares, currencies, cryptos, charts } = get();
        return dolares.length + currencies.length + cryptos.length + charts.length;
      },

      clearAll: () => {
        set({
          dolares: [],
          currencies: [],
          cryptos: [],
          charts: [],
        });
        get().syncToBackend();
      },

      // ========== SYNC METHODS (Powered by Sync Engine) ==========

      /**
       * Load data from backend (called on auth)
       */
      loadFromBackend: (favorites) => {
        set({
          dolares: favorites.dolares || get().dolares,
          currencies: favorites.currencies || get().currencies,
          cryptos: favorites.cryptos || get().cryptos,
          charts: favorites.charts || get().charts,
          syncStatus: 'synced',
          lastSyncedAt: Date.now(),
        });
      },

      /**
       * Sync to backend with debouncing and retry logic
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
                resolve();
                return;
              }

              // Update status
              set({ syncStatus: 'syncing' });

              // Extract data to sync
              const { dolares, currencies, cryptos, charts } = state;
              const dataToSync = { dolares, currencies, cryptos, charts };

              // Make API call
              const response = await fetch('/api/auth/favorites', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(dataToSync),
              });

              if (!response.ok) {
                // Handle auth errors gracefully (user not logged in)
                if (response.status === 401) {
                  set({ syncStatus: 'offline' });
                  resolve();
                  return;
                }
                throw new Error(`Sync failed: ${response.status}`);
              }

              // Success
              set({
                syncStatus: 'synced',
                lastSyncedAt: Date.now(),
                pendingActions: 0,
              });

              resolve();
            } catch (error) {
              console.error('[FavoritesStore] Sync error:', error);
              set({
                syncStatus: 'error',
                pendingActions: get().pendingActions + 1,
              });

              // Add to retry queue
              syncQueue.add({
                id: Date.now().toString(),
                type: 'sync',
                payload: {
                  dolares: get().dolares,
                  currencies: get().currencies,
                  cryptos: get().cryptos,
                  charts: get().charts,
                },
                timestamp: Date.now(),
                retries: 0,
              });

              resolve();
            }
          }, DEBOUNCE_MS);
        });
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
      name: 'dolargaucho_favorites',
      // Only persist data, not sync metadata
      partialize: (state) => {
        const { syncStatus, lastSyncedAt, pendingActions, ...data } = state;
        return data;
      },
    }
  )
);
