/**
 * Dolar Type Store (Global State)
 *
 * Manages the selected dolar type for ARS conversions across the app
 * Used for crypto prices, calculators, and all ARS conversions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DolarType } from '@/types/api/dolar';

export interface DolarTypeState {
  selectedType: DolarType;
  setDolarType: (type: DolarType) => void;
}

export const useDolarTypeStore = create<DolarTypeState>()(
  persist(
    (set) => ({
      selectedType: 'blue', // Default to blue

      setDolarType: (type: DolarType) => {
        set({ selectedType: type });
      },
    }),
    {
      name: 'dolargaucho_dolar_type', // localStorage key
    }
  )
);
