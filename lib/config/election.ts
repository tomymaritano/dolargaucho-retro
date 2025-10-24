/**
 * Election API Configuration
 *
 * Configuration for Ministerio del Interior election results API
 */

import { ELECTION_CONSTANTS } from '@/types/api/election';

export const ELECTION_CONFIG = {
  // API Base URL - PUBLIC API (No authentication required)
  API_URL: 'https://resultados.mininterior.gob.ar/api/resultados/getResultados',

  // Default request params
  // TESTING: Para probar con datos reales, cambia ELECTION_YEAR a 2023
  // y en types/api/election.ts cambia ELECTION_YEAR: 2023
  DEFAULT_PARAMS: {
    anioEleccion: ELECTION_CONSTANTS.ELECTION_YEAR,
    tipoRecuento: ELECTION_CONSTANTS.RECUENTO_PROVISORIO,
    tipoEleccion: ELECTION_CONSTANTS.TIPO_GENERALES,
    categoriaId: ELECTION_CONSTANTS.CATEGORIA_PRESIDENTE,
  },

  // Polling & Cache
  POLL_INTERVAL: ELECTION_CONSTANTS.POLL_INTERVAL_MS,
  CACHE_TTL: ELECTION_CONSTANTS.CACHE_TTL_MS,

  // Retry config
  MAX_RETRIES: ELECTION_CONSTANTS.MAX_RETRIES,
  RETRY_DELAYS: ELECTION_CONSTANTS.RETRY_BACKOFF_MS,

  // Timeouts
  REQUEST_TIMEOUT: 5000, // 5 seconds

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/**
 * Check if election API is configured
 * The API is public, so it's always configured
 */
export function isElectionAPIConfigured(): boolean {
  return true;
}
