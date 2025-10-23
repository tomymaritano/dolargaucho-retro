/**
 * Financial data types for calculators
 */

export interface TasaData {
  tipo: string;
  tasa: number;
  fecha: string;
}

// Re-export TasaPlazoFijo from argentina types
export type { TasaPlazoFijo, TasaPlazoFijoResponse } from './argentina';

export interface RendimientoData {
  periodo: string;
  rendimiento: number;
  rendimientoReal: number;
}

export interface ComparativaResultado {
  estrategia: string;
  valorFinal: number;
  ganancia: number;
  rentabilidad: number;
  rentabilidadReal: number;
  diferencia?: number;
}

export interface ResultadoAnalisis {
  valorInicial: number;
  valorFinal: number;
  valorAjustadoInflacion: number;
  gananciaAbsoluta: number;
  gananciaReal: number;
  rentabilidadNominal: number;
  rentabilidadReal: number;
  inflacionAcumulada: number;
  comparativas: ComparativaResultado[];
}

export interface ParametrosEconomicos {
  inflacion: number;
  tasaPlazoFijo: number;
  devaluacion: number;
  fecha: string;
}

// Re-export InflacionData from dolar types
export type { InflacionData } from './dolar';
