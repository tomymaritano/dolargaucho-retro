import { useQuery } from '@tanstack/react-query';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useInflacion } from '@/hooks/useInflacion';
import { useInflacionUS } from '@/hooks/useInflacionUS';
import { Activo, ResultadoAnalisis } from '../types';
import {
  calcularInflacionAcumulada,
  ajustarPorInflacion,
  calcularRentabilidadNominal,
  calcularRentabilidadReal,
  compararConDolar,
} from '../utils';

export function useComparativas(activo: Activo | null) {
  const { data: inflacionARSData } = useInflacion();
  const { data: inflacionUSDData } = useInflacionUS();
  const { data: dolarActualData } = useDolarQuery();

  return useQuery({
    queryKey: ['comparativas-activo', activo],
    queryFn: () =>
      calcularAnalisis(activo!, inflacionARSData!, inflacionUSDData!, dolarActualData!),
    enabled: !!activo && !!inflacionARSData && !!inflacionUSDData && !!dolarActualData,
    staleTime: 0, // Siempre recalcular
  });
}

interface DolarActual {
  casa: string;
  compra: number;
  venta: number;
}

function calcularAnalisis(
  activo: Activo,
  inflacionARSData: { fecha: string; valor: number }[],
  inflacionUSDData: { fecha: string; valor: number }[],
  dolarActualData: DolarActual[]
): ResultadoAnalisis {
  // Determinar si es moneda local (ARS) o extranjera (USD)
  const esMonedaLocal = activo.monedaCompra === 'ARS';

  // 1. Calcular inflación acumulada según la moneda
  // ARS: usar inflación argentina
  // USD: usar inflación estadounidense
  const inflacionData = esMonedaLocal ? inflacionARSData : inflacionUSDData;

  const datosIPC = inflacionData.map((d) => ({
    fecha: d.fecha,
    valor: d.valor, // IPC mensual
  }));

  const inflacionAcumulada = calcularInflacionAcumulada(
    activo.fechaCompra,
    activo.fechaVenta,
    datosIPC
  );

  // 2. Calcular rentabilidades
  const rentabilidadNominal = calcularRentabilidadNominal(activo.precioCompra, activo.precioVenta);

  // Rentabilidad real ajustada por inflación (ARS o USD según corresponda)
  const rentabilidadReal = calcularRentabilidadReal(
    activo.precioCompra,
    activo.precioVenta,
    inflacionAcumulada
  );

  // 3. Valor ajustado por inflación
  const valorAjustadoInflacion = ajustarPorInflacion(activo.precioCompra, inflacionAcumulada);

  // 4. Ganancias absolutas y reales
  const gananciaAbsoluta = activo.precioVenta - activo.precioCompra;
  const gananciaReal = activo.precioVenta - valorAjustadoInflacion;

  // 5. Comparativas con dólares
  // NOTA: Para USD, NO comparar con dólar (no tiene sentido)
  // NOTA: Para ARS, usar cotización actual como proxy (simplificación)
  const comparativas: ResultadoAnalisis['comparativas'] = {};

  // Solo calcular comparativas si es ARS
  if (esMonedaLocal) {
    const dolarBlue = dolarActualData.find((d) => d.casa === 'blue');
    const dolarOficial = dolarActualData.find((d) => d.casa === 'oficial');

    // Comparativa con dólar blue
    if (dolarBlue) {
      const comparativaBlue = compararConDolar(
        activo.precioCompra,
        activo.precioVenta,
        dolarBlue.venta * 0.5, // Aproximación: asumimos que el dólar estaba a la mitad
        dolarBlue.venta
      );

      comparativas.dolarBlue = {
        valorFinal: comparativaBlue.valorHoyARS,
        ganancia: comparativaBlue.ganancia,
        rentabilidad: comparativaBlue.rentabilidad,
        diferenciaPorcentual: comparativaBlue.diferenciaPorcentual,
      };
    }

    // Comparativa con dólar oficial
    if (dolarOficial) {
      const comparativaOficial = compararConDolar(
        activo.precioCompra,
        activo.precioVenta,
        dolarOficial.venta * 0.5, // Aproximación: asumimos que el dólar estaba a la mitad
        dolarOficial.venta
      );

      comparativas.dolarOficial = {
        valorFinal: comparativaOficial.valorHoyARS,
        ganancia: comparativaOficial.ganancia,
        rentabilidad: comparativaOficial.rentabilidad,
        diferenciaPorcentual: comparativaOficial.diferenciaPorcentual,
      };
    }
  }

  return {
    rentabilidadNominal,
    rentabilidadReal,
    inflacionAcumulada,
    valorAjustadoInflacion,
    gananciaAbsoluta,
    gananciaReal,
    comparativas,
  };
}
