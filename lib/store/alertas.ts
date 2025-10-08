import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Alerta, CrearAlertaInput } from '@/types/alertas';
import { v4 as uuidv4 } from 'uuid';

export interface AlertasState {
  alertas: Alerta[];
  addAlerta: (input: CrearAlertaInput) => Alerta;
  removeAlerta: (id: string) => void;
  toggleAlerta: (id: string) => void;
  updateAlerta: (id: string, updates: Partial<Alerta>) => void;
  clearAll: () => void;
  getAlertasActivas: () => Alerta[];
  getAlertasDisparadas: () => Alerta[];
  getAlertasPausadas: () => Alerta[];
  getTotalCount: () => number;
}

export const useAlertasStore = create<AlertasState>()(
  persist(
    (set, get) => ({
      alertas: [],

      addAlerta: (input: CrearAlertaInput) => {
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

        return nuevaAlerta;
      },

      removeAlerta: (id: string) =>
        set((state) => ({
          alertas: state.alertas.filter((a) => a.id !== id),
        })),

      toggleAlerta: (id: string) =>
        set((state) => ({
          alertas: state.alertas.map((a) =>
            a.id === id
              ? {
                  ...a,
                  estado: a.estado === 'activa' ? 'pausada' : 'activa',
                }
              : a
          ),
        })),

      updateAlerta: (id: string, updates: Partial<Alerta>) =>
        set((state) => ({
          alertas: state.alertas.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      clearAll: () => set({ alertas: [] }),

      getAlertasActivas: () => {
        return get().alertas.filter((a) => a.estado === 'activa');
      },

      getAlertasDisparadas: () => {
        return get().alertas.filter((a) => a.estado === 'disparada');
      },

      getAlertasPausadas: () => {
        return get().alertas.filter((a) => a.estado === 'pausada');
      },

      getTotalCount: () => {
        return get().alertas.length;
      },
    }),
    {
      name: 'dolargaucho_alertas', // localStorage key
    }
  )
);
