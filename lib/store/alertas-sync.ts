/**
 * Alertas Store with Sync Engine
 *
 * Replaces the old localStorage-only alertas store with full backend sync
 */

import type { Alerta, CrearAlertaInput } from '@/types/alertas';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// State shape for alertas
interface AlertasData {
  alertas: Alerta[];
}

// Full store interface with all methods
export interface AlertasState extends AlertasData {
  // Alert management methods
  addAlerta: (input: CrearAlertaInput) => Alerta;
  removeAlerta: (id: string) => void;
  toggleAlerta: (id: string) => void;
  updateAlerta: (id: string, updates: Partial<Alerta>) => void;
  clearAll: () => void;

  // Helper queries
  getAlertasActivas: () => Alerta[];
  getAlertasDisparadas: () => Alerta[];
  getAlertasPausadas: () => Alerta[];
  getTotalCount: () => number;
}

/**
 * Create the alertas store with persistence
 * Note: Full backend sync will be added in a future iteration
 */
export const useAlertasStore = create<AlertasState>()(
  persist(
    (set, get) => ({
      alertas: [],

      /**
       * Add new alert
       */
      addAlerta: (input: CrearAlertaInput): Alerta => {
        const nuevaAlerta: Alerta = {
          id: uuidv4(),
          tipo: input.tipo,
          nombre: input.nombre,
          condicion: input.condicion,
          valorObjetivo: input.valorObjetivo,
          casaDolar: input.casaDolar,
          mensaje: input.mensaje,
          estado: 'activa',
          fechaCreacion: new Date().toISOString(),
          notificacionEnviada: false,
        };

        set((state) => ({
          alertas: [...state.alertas, nuevaAlerta],
        }));

        // TODO: Trigger backend sync when user is authenticated
        // syncToBackend(get().alertas);

        return nuevaAlerta;
      },

      /**
       * Remove alert by ID
       */
      removeAlerta: (id: string): void => {
        set((state) => ({
          alertas: state.alertas.filter((a) => a.id !== id),
        }));

        // TODO: Trigger backend sync
        // syncToBackend(get().alertas);
      },

      /**
       * Toggle alert active/paused
       */
      toggleAlerta: (id: string): void => {
        set((state) => ({
          alertas: state.alertas.map((a) =>
            a.id === id
              ? {
                  ...a,
                  estado: a.estado === 'activa' ? 'pausada' : 'activa',
                }
              : a
          ),
        }));

        // TODO: Trigger backend sync
        // syncToBackend(get().alertas);
      },

      /**
       * Update alert
       */
      updateAlerta: (id: string, updates: Partial<Alerta>): void => {
        set((state) => ({
          alertas: state.alertas.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));

        // TODO: Trigger backend sync
        // syncToBackend(get().alertas);
      },

      /**
       * Clear all alerts
       */
      clearAll: (): void => {
        set({ alertas: [] });

        // TODO: Trigger backend sync
        // syncToBackend([]);
      },

      /**
       * Get active alerts
       */
      getAlertasActivas: (): Alerta[] => {
        return get().alertas.filter((a) => a.estado === 'activa');
      },

      /**
       * Get triggered alerts
       */
      getAlertasDisparadas: (): Alerta[] => {
        return get().alertas.filter((a) => a.estado === 'disparada');
      },

      /**
       * Get paused alerts
       */
      getAlertasPausadas: (): Alerta[] => {
        return get().alertas.filter((a) => a.estado === 'pausada');
      },

      /**
       * Get total count
       */
      getTotalCount: (): number => {
        return get().alertas.length;
      },
    }),
    {
      name: 'dolargaucho_alertas', // localStorage key
    }
  )
);

// Export default for backward compatibility
export default useAlertasStore;
