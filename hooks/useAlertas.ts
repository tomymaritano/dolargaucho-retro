import { useEffect, useCallback, useMemo } from 'react';
import type {
  Alerta,
  CrearAlertaInput,
  EstadisticasAlertas,
  VerificacionAlerta,
} from '@/types/alertas';
import { useDolarQuery } from './useDolarQuery';
import {
  useUltimaInflacion,
  useUltimoRiesgoPais,
  useUltimoUVA,
  useUltimaTasaPlazoFijo,
} from './useFinanzas';
import { useAlertasStore } from '@/lib/store/alertas';

/**
 * Hook para gestionar alertas de precios/indicadores
 * Ahora usa Zustand store para state management
 */
export function useAlertas() {
  // Get state and actions from Zustand store
  const {
    alertas,
    addAlerta,
    removeAlerta: removeFromStore,
    toggleAlerta: toggleInStore,
    updateAlerta,
  } = useAlertasStore();

  // Cargar datos para verificación
  const { data: dolares } = useDolarQuery();
  const { data: ultimaInflacion } = useUltimaInflacion();
  const { data: ultimoRiesgoPais } = useUltimoRiesgoPais();
  const { data: ultimoUVA } = useUltimoUVA();
  const { data: ultimaTasa } = useUltimaTasaPlazoFijo();

  // Crear nueva alerta
  const crearAlerta = useCallback(
    (input: CrearAlertaInput) => {
      return addAlerta(input);
    },
    [addAlerta]
  );

  // Eliminar alerta
  const eliminarAlerta = useCallback(
    (id: string) => {
      removeFromStore(id);
    },
    [removeFromStore]
  );

  // Pausar/reactivar alerta
  const toggleAlerta = useCallback(
    (id: string) => {
      toggleInStore(id);
    },
    [toggleInStore]
  );

  // Obtener valor actual de un indicador
  const getValorActual = useCallback(
    (alerta: Alerta): number | null => {
      switch (alerta.tipo) {
        case 'dolar':
          if (!dolares || !alerta.casaDolar) return null;
          const dolar = dolares.find((d) => d.casa === alerta.casaDolar);
          return dolar?.venta || null;

        case 'inflacion':
          return ultimaInflacion?.valor || null;

        case 'riesgo-pais':
          return ultimoRiesgoPais?.valor || null;

        case 'uva':
          return ultimoUVA?.valor || null;

        case 'tasa':
          return ultimaTasa?.tnaClientes ? ultimaTasa.tnaClientes * 100 : null;

        default:
          return null;
      }
    },
    [dolares, ultimaInflacion, ultimoRiesgoPais, ultimoUVA, ultimaTasa]
  );

  // Verificar si una alerta debe dispararse
  const verificarAlerta = useCallback(
    (alerta: Alerta): VerificacionAlerta => {
      const valorActual = getValorActual(alerta);

      if (valorActual === null) {
        return {
          alertaId: alerta.id,
          disparada: false,
          valorActual: 0,
          valorObjetivo: alerta.valorObjetivo,
          timestamp: new Date().toISOString(),
        };
      }

      let disparada = false;

      switch (alerta.condicion) {
        case 'mayor':
          disparada = valorActual > alerta.valorObjetivo;
          break;
        case 'menor':
          disparada = valorActual < alerta.valorObjetivo;
          break;
        case 'igual':
          disparada = Math.abs(valorActual - alerta.valorObjetivo) < 0.01;
          break;
      }

      return {
        alertaId: alerta.id,
        disparada,
        valorActual,
        valorObjetivo: alerta.valorObjetivo,
        timestamp: new Date().toISOString(),
      };
    },
    [getValorActual]
  );

  // Verificar todas las alertas activas
  const verificarTodasLasAlertas = useCallback(() => {
    const alertasActivas = alertas.filter((a) => a.estado === 'activa');
    const verificaciones: VerificacionAlerta[] = [];
    const updated = [...alertas];

    alertasActivas.forEach((alerta, index) => {
      const verificacion = verificarAlerta(alerta);
      verificaciones.push(verificacion);

      // Actualizar alerta si se disparó
      if (verificacion.disparada) {
        const alertaIndex = updated.findIndex((a) => a.id === alerta.id);
        if (alertaIndex !== -1) {
          updated[alertaIndex] = {
            ...updated[alertaIndex],
            estado: 'disparada',
            fechaDisparada: verificacion.timestamp,
            fechaUltimaVerificacion: verificacion.timestamp,
            notificacionEnviada: true,
          };
        }
      } else {
        // Actualizar última verificación
        const alertaIndex = updated.findIndex((a) => a.id === alerta.id);
        if (alertaIndex !== -1) {
          updated[alertaIndex] = {
            ...updated[alertaIndex],
            fechaUltimaVerificacion: verificacion.timestamp,
          };
        }
      }
    });

    // Update alertas in store if there are changes
    updated.forEach((updatedAlerta) => {
      const originalAlerta = alertas.find((a) => a.id === updatedAlerta.id);
      if (JSON.stringify(originalAlerta) !== JSON.stringify(updatedAlerta)) {
        updateAlerta(updatedAlerta.id, updatedAlerta);
      }
    });

    return verificaciones;
  }, [alertas, verificarAlerta, updateAlerta]);

  // Verificar automáticamente cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      verificarTodasLasAlertas();
    }, 30000); // 30 segundos

    // Verificar una vez al cargar
    verificarTodasLasAlertas();

    return () => clearInterval(interval);
  }, [verificarTodasLasAlertas]);

  // Estadísticas
  const estadisticas = useMemo<EstadisticasAlertas>(() => {
    return {
      total: alertas.length,
      activas: alertas.filter((a) => a.estado === 'activa').length,
      disparadas: alertas.filter((a) => a.estado === 'disparada').length,
      pausadas: alertas.filter((a) => a.estado === 'pausada').length,
    };
  }, [alertas]);

  // Alertas recientes disparadas (últimas 24h)
  const alertasRecientesDisparadas = useMemo(() => {
    const hace24h = new Date();
    hace24h.setHours(hace24h.getHours() - 24);

    return alertas.filter((a) => {
      if (a.estado !== 'disparada' || !a.fechaDisparada) return false;
      return new Date(a.fechaDisparada) > hace24h;
    });
  }, [alertas]);

  return {
    alertas,
    loading: false, // Zustand no tiene loading state, data is always available
    estadisticas,
    alertasRecientesDisparadas,
    crearAlerta,
    eliminarAlerta,
    toggleAlerta,
    verificarAlerta,
    verificarTodasLasAlertas,
    getValorActual,
  };
}
