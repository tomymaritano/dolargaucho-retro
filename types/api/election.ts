/**
 * Election API Types
 *
 * Tipos para la API de resultados electorales del Ministerio del Interior
 * API: https://resultados.mininterior.gob.ar/api
 */

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface ElectionRequestParams {
  anioEleccion: number; // 2025
  tipoRecuento: number; // 1 = provisorio, 2 = definitivo
  tipoEleccion: number; // 2 = generales
  categoriaId: number; // 1 = presidente, 2 = diputados, etc.
  distritoId?: string; // opcional - distrito específico
}

// ============================================================================
// RESPONSE TYPES (API oficial)
// ============================================================================

/**
 * Agrupación política con sus votos
 */
export interface Agrupacion {
  agrupacionId: number;
  agrupacionNombre: string;
  agrupacionColor?: string; // hex color
  listas: Lista[];
  votos: number;
  votosPorcentaje: number;
}

/**
 * Lista electoral dentro de una agrupación
 */
export interface Lista {
  listaNumero: string;
  listaNombre: string;
  candidatos?: Candidato[];
}

/**
 * Candidato en una lista
 */
export interface Candidato {
  candidatoId: number;
  candidatoNombre: string;
  candidatoApellido: string;
  tipoCandidato: 'presidente' | 'vice' | 'diputado' | 'senador';
  orden: number;
}

/**
 * Estado del recuento electoral
 */
export interface EstadoRecuento {
  mesasEsperadas: number; // Total de mesas esperadas
  mesasTotalizadas: number; // Mesas ya escrutadas
  mesasTotalizadasPorcentaje: number; // Porcentaje de progreso
  cantidadElectores: number; // Total de electores habilitados
  cantidadVotantes: number; // Cantidad de personas que votaron
  participacionPorcentaje: number | null; // Porcentaje de participación
}

/**
 * Votos no positivos (nulos, blanco, impugnados)
 */
export interface ValoresTotalizadosOtros {
  votosNulos: number;
  votosNulosPorcentaje: number | null;
  votosEnBlanco: number;
  votosEnBlancoPorcentaje: number | null;
  votosRecurridosComandoImpugnados: number;
  votosRecurridosComandoImpugnadosPorcentaje: number | null;
}

/**
 * Respuesta completa de la API oficial (ESTRUCTURA REAL)
 */
export interface ElectionAPIResponse {
  // Timestamp de la última actualización
  fechaTotalizacion: string; // ISO date

  // Metadata de la elección (cuando hay datos)
  anioEleccion?: number;
  tipoEleccion?: string;
  tipoEleccionNombre?: string;
  categoria?: string;
  categoriaNombre?: string;
  distrito?: string;
  distritoNombre?: string;

  // Estado del recuento
  estadoRecuento: EstadoRecuento;

  // Resultados positivos (candidatos/listas)
  valoresTotalizadosPositivos: Agrupacion[];

  // Votos especiales (nulos, blanco, impugnados)
  valoresTotalizadosOtros: ValoresTotalizadosOtros;
}

// ============================================================================
// PROCESSED TYPES (para nuestra app)
// ============================================================================

/**
 * Candidato simplificado para mostrar
 */
export interface SimplifiedCandidate {
  id: number;
  fullName: string;
  party: string;
  partyColor: string;
  votes: number;
  percentage: number;
  position: 'president' | 'vice';
}

/**
 * Resultados procesados y listos para mostrar
 */
export interface ProcessedElectionResults {
  // Metadata
  lastUpdate: string; // ISO date
  electionYear: number;
  electionType: string;
  category: string;
  district: string;
  isProvisional: boolean;

  // Progress
  progress: {
    totalPollingStations: number; // mesasEsperadas
    talliedPollingStations: number; // mesasTotalizadas
    talliedPercentage: number; // mesasTotalizadasPorcentaje
    totalElectors: number; // cantidadElectores (habilitados para votar)
    totalVoters: number; // cantidadVotantes (que realmente votaron)
    participationPercentage: number | null; // participacionPorcentaje
  };

  // Candidates (sorted by votes DESC)
  candidates: SimplifiedCandidate[];

  // Other votes
  otherVotes: {
    null: number;
    nullPercentage: number | null;
    blank: number;
    blankPercentage: number | null;
    challenged: number;
    challengedPercentage: number | null;
    total: number;
  };

  // Summary
  totalValidVotes: number;
  winnerPercentage: number | null;
  runoffRequired: boolean; // true if winner < 45% or < 40% with 10% diff
}

/**
 * Estado de la conexión con la API
 */
export interface ElectionStatus {
  isLive: boolean;
  lastFetch: Date;
  nextFetch: Date;
  error: string | null;
  retryCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ELECTION_CONSTANTS = {
  // Request params
  // PRODUCTION MODE: Using 2025 for real election data
  ELECTION_YEAR: 2025,
  RECUENTO_PROVISORIO: 1,
  RECUENTO_DEFINITIVO: 2,
  TIPO_GENERALES: 2,
  CATEGORIA_PRESIDENTE: 1,
  CATEGORIA_DIPUTADOS: 2,
  CATEGORIA_SENADORES: 3,

  // Polling config
  POLL_INTERVAL_MS: 10000, // 10 seconds
  CACHE_TTL_MS: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_BACKOFF_MS: [1000, 3000, 5000], // exponential backoff

  // Ballotage rules
  BALLOTAGE_THRESHOLD_HIGH: 45, // Win if > 45%
  BALLOTAGE_THRESHOLD_LOW: 40, // Win if > 40% AND 10% diff with 2nd
  BALLOTAGE_DIFF_REQUIRED: 10, // Difference required for 40% rule
} as const;

// ============================================================================
// COLOR PALETTE (default party colors)
// ============================================================================

export const DEFAULT_PARTY_COLORS: Record<string, string> = {
  // Principales partidos
  'LA LIBERTAD AVANZA': '#6B4C9A', // Púrpura
  'UNION POR LA PATRIA': '#87CEEB', // Celeste
  'JUNTOS POR EL CAMBIO': '#FFD700', // Amarillo
  'HACEMOS POR NUESTRO PAIS': '#FF6B6B', // Rojo
  UCR: '#E74C3C', // Rojo UCR
  PRO: '#F39C12', // Amarillo PRO
  FDT: '#3498DB', // Azul FDT
  // Default
  DEFAULT: '#95A5A6', // Gris
} as const;
