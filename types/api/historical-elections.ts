/**
 * Types for Historical Elections API
 *
 * Datos oficiales de DINE servidos desde PostgreSQL
 */

/**
 * Resultado de una agrupación política en una elección
 */
export interface HistoricalAgrupacion {
  nombre: string;
  votos: number;
  porcentaje: number;
  posicion: number;
}

/**
 * Datos completos de una elección legislativa histórica
 */
export interface HistoricalElectionData {
  year: number;
  date: string;
  category: string;
  total_electores: number;
  total_votantes: number;
  mesas_totalizadas: number;
  participacion: number;
  total_votos_positivos: number;
  total_votos: number;
  votos_nulos: number;
  votos_blanco: number;
  votos_otros: number;
  agrupaciones: HistoricalAgrupacion[];
}

/**
 * Respuesta de la API (puede ser array o single)
 */
export type HistoricalElectionsResponse = HistoricalElectionData | HistoricalElectionData[];
