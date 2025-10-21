import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChartActionResult {
  success: boolean;
  message: string;
}

export interface FavoritesState {
  dolares: string[];
  currencies: string[];
  cryptos: string[];
  charts: string[]; // Gráficos favoritos (ej: 'fred-rate', 'ecb-usd', 'inflacion-ar')
  addDolar: (casa: string) => ChartActionResult;
  removeDolar: (casa: string) => ChartActionResult;
  toggleDolar: (casa: string) => ChartActionResult;
  addCurrency: (moneda: string) => ChartActionResult;
  removeCurrency: (moneda: string) => ChartActionResult;
  toggleCurrency: (moneda: string) => ChartActionResult;
  addCrypto: (cryptoId: string) => ChartActionResult;
  removeCrypto: (cryptoId: string) => ChartActionResult;
  toggleCrypto: (cryptoId: string) => ChartActionResult;
  addChart: (chartId: string) => ChartActionResult;
  removeChart: (chartId: string) => ChartActionResult;
  toggleChart: (chartId: string) => ChartActionResult;
  getTotalCount: () => number;
  clearAll: () => void;
  // Sync methods
  loadFromBackend: (
    favorites: Partial<{
      dolares: string[];
      currencies: string[];
      cryptos: string[];
      charts: string[];
    }>
  ) => void;
  syncToBackend: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      dolares: [],
      currencies: [],
      cryptos: [],
      charts: [],

      // Dolar actions
      addDolar: (casa: string) => {
        const state = get();
        if (state.dolares.includes(casa)) {
          return { success: false, message: 'Este dólar ya está en favoritos' };
        }
        set({ dolares: [...state.dolares, casa] });
        return { success: true, message: 'Dólar agregado a favoritos' };
      },

      removeDolar: (casa: string) => {
        const state = get();
        if (!state.dolares.includes(casa)) {
          return { success: false, message: 'Este dólar no está en favoritos' };
        }
        set({ dolares: state.dolares.filter((d) => d !== casa) });
        return { success: true, message: 'Dólar quitado de favoritos' };
      },

      toggleDolar: (casa: string) => {
        const state = get();
        if (state.dolares.includes(casa)) {
          set({ dolares: state.dolares.filter((d) => d !== casa) });
          get().syncToBackend(); // Sync to backend
          return { success: true, message: 'Dólar quitado de favoritos' };
        }
        set({ dolares: [...state.dolares, casa] });
        get().syncToBackend(); // Sync to backend
        return { success: true, message: 'Dólar agregado a favoritos' };
      },

      // Currency actions
      addCurrency: (moneda: string) => {
        const state = get();
        if (state.currencies.includes(moneda)) {
          return { success: false, message: 'Esta moneda ya está en favoritos' };
        }
        set({ currencies: [...state.currencies, moneda] });
        return { success: true, message: 'Moneda agregada a favoritos' };
      },

      removeCurrency: (moneda: string) => {
        const state = get();
        if (!state.currencies.includes(moneda)) {
          return { success: false, message: 'Esta moneda no está en favoritos' };
        }
        set({ currencies: state.currencies.filter((m) => m !== moneda) });
        return { success: true, message: 'Moneda quitada de favoritos' };
      },

      toggleCurrency: (moneda: string) => {
        const state = get();
        if (state.currencies.includes(moneda)) {
          set({ currencies: state.currencies.filter((m) => m !== moneda) });
          get().syncToBackend(); // Sync to backend
          return { success: true, message: 'Moneda quitada de favoritos' };
        }
        set({ currencies: [...state.currencies, moneda] });
        get().syncToBackend(); // Sync to backend
        return { success: true, message: 'Moneda agregada a favoritos' };
      },

      // Crypto actions
      addCrypto: (cryptoId: string) => {
        const state = get();
        if (state.cryptos.includes(cryptoId)) {
          return { success: false, message: 'Esta crypto ya está en favoritos' };
        }
        set({ cryptos: [...state.cryptos, cryptoId] });
        return { success: true, message: 'Crypto agregada a favoritos' };
      },

      removeCrypto: (cryptoId: string) => {
        const state = get();
        if (!state.cryptos.includes(cryptoId)) {
          return { success: false, message: 'Esta crypto no está en favoritos' };
        }
        set({ cryptos: state.cryptos.filter((c) => c !== cryptoId) });
        return { success: true, message: 'Crypto quitada de favoritos' };
      },

      toggleCrypto: (cryptoId: string) => {
        const state = get();
        if (state.cryptos.includes(cryptoId)) {
          set({ cryptos: state.cryptos.filter((c) => c !== cryptoId) });
          get().syncToBackend(); // Sync to backend
          return { success: true, message: 'Crypto quitada de favoritos' };
        }
        set({ cryptos: [...state.cryptos, cryptoId] });
        get().syncToBackend(); // Sync to backend
        return { success: true, message: 'Crypto agregada a favoritos' };
      },

      // Chart actions (máximo 3 gráficos)
      addChart: (chartId: string) => {
        const state = get();
        if (state.charts.includes(chartId)) {
          return { success: false, message: 'Este gráfico ya está en favoritos' };
        }
        // Límite de 3 gráficos favoritos
        if (state.charts.length >= 3) {
          return {
            success: false,
            message: 'Máximo 3 gráficos favoritos. Quita uno para agregar otro.',
          };
        }
        set({ charts: [...state.charts, chartId] });
        return { success: true, message: 'Gráfico agregado a favoritos' };
      },

      removeChart: (chartId: string) => {
        const state = get();
        if (!state.charts.includes(chartId)) {
          return { success: false, message: 'Este gráfico no está en favoritos' };
        }
        set({ charts: state.charts.filter((c) => c !== chartId) });
        return { success: true, message: 'Gráfico quitado de favoritos' };
      },

      toggleChart: (chartId: string) => {
        const state = get();
        if (state.charts.includes(chartId)) {
          // Si ya está, quitarlo
          set({ charts: state.charts.filter((c) => c !== chartId) });
          get().syncToBackend(); // Sync to backend
          return { success: true, message: 'Gráfico quitado de favoritos' };
        }
        // Si no está y hay espacio, agregarlo
        if (state.charts.length >= 3) {
          return {
            success: false,
            message: 'Máximo 3 gráficos favoritos. Quita uno para agregar otro.',
          };
        }
        set({ charts: [...state.charts, chartId] });
        get().syncToBackend(); // Sync to backend
        return { success: true, message: 'Gráfico agregado a favoritos' };
      },

      // Utilities
      getTotalCount: () => {
        const { dolares, currencies, cryptos, charts } = get();
        return dolares.length + currencies.length + cryptos.length + charts.length;
      },

      clearAll: () =>
        set({
          dolares: [],
          currencies: [],
          cryptos: [],
          charts: [],
        }),

      // Sync methods
      loadFromBackend: (favorites) => {
        set({
          dolares: favorites.dolares || get().dolares,
          currencies: favorites.currencies || get().currencies,
          cryptos: favorites.cryptos || get().cryptos,
          charts: favorites.charts || get().charts,
        });
      },

      syncToBackend: async () => {
        try {
          const { dolares, currencies, cryptos, charts } = get();

          const response = await fetch('/api/auth/favorites', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              dolares,
              currencies,
              cryptos,
              charts,
            }),
          });

          if (!response.ok) {
            // If user is not authenticated, that's okay - localStorage will work
            if (response.status === 401) {
              return;
            }
            console.error('Failed to sync favorites to backend');
          }
        } catch (error) {
          // Silently fail - localStorage will continue to work
          console.error('Error syncing favorites:', error);
        }
      },
    }),
    {
      name: 'dolargaucho_favorites', // localStorage key
    }
  )
);
