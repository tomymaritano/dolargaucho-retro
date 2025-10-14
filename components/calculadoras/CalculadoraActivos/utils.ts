import { DatosInflacion, DatosCotizacion } from './types';

/**
 * Calcula la inflación acumulada entre dos fechas
 */
export function calcularInflacionAcumulada(
  fechaInicio: Date,
  fechaFin: Date,
  datosIPC: DatosInflacion[]
): number {
  // Filtrar datos entre fechas
  const datosEnRango = datosIPC.filter((d) => {
    const fecha = new Date(d.fecha);
    return fecha >= fechaInicio && fecha <= fechaFin;
  });

  if (datosEnRango.length === 0) return 0;

  // Calcular inflación compuesta
  const inflacionTotal =
    datosEnRango.reduce((acum, dato) => {
      return acum * (1 + dato.valor / 100);
    }, 1) - 1;

  return inflacionTotal * 100; // Retornar en porcentaje
}

/**
 * Ajusta un valor por inflación
 */
export function ajustarPorInflacion(valorInicial: number, inflacionAcumulada: number): number {
  return valorInicial * (1 + inflacionAcumulada / 100);
}

/**
 * Calcula la rentabilidad real ajustada por inflación
 */
export function calcularRentabilidadReal(
  precioCompra: number,
  precioVenta: number,
  inflacionAcumulada: number
): number {
  const valorAjustado = ajustarPorInflacion(precioCompra, inflacionAcumulada);
  return ((precioVenta - valorAjustado) / valorAjustado) * 100;
}

/**
 * Calcula la rentabilidad nominal simple
 */
export function calcularRentabilidadNominal(precioCompra: number, precioVenta: number): number {
  return ((precioVenta - precioCompra) / precioCompra) * 100;
}

/**
 * Obtiene la cotización del dólar en una fecha específica
 */
export function obtenerCotizacionEnFecha(
  fecha: Date,
  cotizaciones: DatosCotizacion[]
): number | null {
  // Buscar cotización exacta o la más cercana anterior
  const cotizacionesOrdenadas = [...cotizaciones].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  let cotizacionMasCercana: DatosCotizacion | null = null;

  for (const cotizacion of cotizacionesOrdenadas) {
    const fechaCotizacion = new Date(cotizacion.fecha);
    if (fechaCotizacion <= fecha) {
      cotizacionMasCercana = cotizacion;
    } else {
      break;
    }
  }

  return cotizacionMasCercana ? cotizacionMasCercana.venta : null;
}

/**
 * Compara la inversión con la compra de dólares
 */
export function compararConDolar(
  precioCompra: number,
  precioVenta: number,
  dolarCompra: number,
  dolarVenta: number
): {
  usdInicial: number;
  valorHoyARS: number;
  ganancia: number;
  rentabilidad: number;
  diferenciaPorcentual: number;
} {
  const usdInicial = precioCompra / dolarCompra;
  const valorHoyARS = usdInicial * dolarVenta;
  const ganancia = valorHoyARS - precioCompra;
  const rentabilidad = ((valorHoyARS - precioCompra) / precioCompra) * 100;
  const rentabilidadActivo = calcularRentabilidadNominal(precioCompra, precioVenta);
  const diferenciaPorcentual = rentabilidad - rentabilidadActivo;

  return {
    usdInicial,
    valorHoyARS,
    ganancia,
    rentabilidad,
    diferenciaPorcentual,
  };
}

/**
 * Formatea un número como moneda
 */
export function formatearMoneda(valor: number, moneda: 'ARS' | 'USD' = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Formatea un porcentaje
 */
export function formatearPorcentaje(valor: number, decimales: number = 2): string {
  return `${valor >= 0 ? '+' : ''}${valor.toFixed(decimales)}%`;
}

/**
 * Determina si hubo ganancia o pérdida
 */
export function determinarResultado(rentabilidad: number): 'ganancia' | 'perdida' | 'neutro' {
  if (rentabilidad > 2) return 'ganancia';
  if (rentabilidad < -2) return 'perdida';
  return 'neutro';
}
