import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritesState {
  dolares: string[];
  currencies: string[];
  addDolar: (casa: string) => void;
  removeDolar: (casa: string) => void;
  toggleDolar: (casa: string) => void;
  addCurrency: (moneda: string) => void;
  removeCurrency: (moneda: string) => void;
  toggleCurrency: (moneda: string) => void;
  getTotalCount: () => number;
  clearAll: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      dolares: [],
      currencies: [],

      // Dolar actions
      addDolar: (casa: string) =>
        set((state) => ({
          dolares: state.dolares.includes(casa) ? state.dolares : [...state.dolares, casa],
        })),

      removeDolar: (casa: string) =>
        set((state) => ({
          dolares: state.dolares.filter((d) => d !== casa),
        })),

      toggleDolar: (casa: string) =>
        set((state) => ({
          dolares: state.dolares.includes(casa)
            ? state.dolares.filter((d) => d !== casa)
            : [...state.dolares, casa],
        })),

      // Currency actions
      addCurrency: (moneda: string) =>
        set((state) => ({
          currencies: state.currencies.includes(moneda)
            ? state.currencies
            : [...state.currencies, moneda],
        })),

      removeCurrency: (moneda: string) =>
        set((state) => ({
          currencies: state.currencies.filter((m) => m !== moneda),
        })),

      toggleCurrency: (moneda: string) =>
        set((state) => ({
          currencies: state.currencies.includes(moneda)
            ? state.currencies.filter((m) => m !== moneda)
            : [...state.currencies, moneda],
        })),

      // Utilities
      getTotalCount: () => {
        const { dolares, currencies } = get();
        return dolares.length + currencies.length;
      },

      clearAll: () =>
        set({
          dolares: [],
          currencies: [],
        }),
    }),
    {
      name: 'dolargaucho_favorites', // localStorage key
    }
  )
);
