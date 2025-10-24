/**
 * Election Service
 *
 * Business logic for election results
 * Pure functions - no side effects, transformations only
 */

import type {
  ElectionAPIResponse,
  ProcessedElectionResults,
  SimplifiedCandidate,
  Agrupacion,
} from '@/types/api/election';
import { ELECTION_CONSTANTS, DEFAULT_PARTY_COLORS } from '@/types/api/election';

export class ElectionService {
  /**
   * Process raw API response into app-friendly format
   *
   * @param response - Raw API response
   * @returns Processed results ready for display
   */
  static processResults(response: ElectionAPIResponse): ProcessedElectionResults {
    const candidates = this.extractCandidates(response.valoresTotalizadosPositivos);
    const totalValidVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const winnerPercentage = candidates[0]?.percentage || null;
    const runoffRequired = this.isRunoffRequired(candidates);

    return {
      // Metadata - Use real data from API, fallback to constants/defaults
      lastUpdate: response.fechaTotalizacion,
      electionYear: response.anioEleccion || ELECTION_CONSTANTS.ELECTION_YEAR,
      electionType: response.tipoEleccionNombre || 'Generales',
      category: response.categoriaNombre || 'Presidente y Vicepresidente',
      district: response.distritoNombre || 'Nacional',
      isProvisional: true, // Always provisional for real-time

      // Progress - Using estadoRecuento
      progress: {
        totalPollingStations: response.estadoRecuento.mesasEsperadas,
        talliedPollingStations: response.estadoRecuento.mesasTotalizadas,
        talliedPercentage: response.estadoRecuento.mesasTotalizadasPorcentaje,
        totalElectors: response.estadoRecuento.cantidadElectores,
        totalVoters: response.estadoRecuento.cantidadVotantes,
        participationPercentage: response.estadoRecuento.participacionPorcentaje,
      },

      // Candidates (already sorted by votes DESC)
      candidates,

      // Other votes - Using valoresTotalizadosOtros
      otherVotes: {
        null: response.valoresTotalizadosOtros.votosNulos,
        nullPercentage: response.valoresTotalizadosOtros.votosNulosPorcentaje,
        blank: response.valoresTotalizadosOtros.votosEnBlanco,
        blankPercentage: response.valoresTotalizadosOtros.votosEnBlancoPorcentaje,
        challenged: response.valoresTotalizadosOtros.votosRecurridosComandoImpugnados,
        challengedPercentage:
          response.valoresTotalizadosOtros.votosRecurridosComandoImpugnadosPorcentaje,
        total:
          response.valoresTotalizadosOtros.votosNulos +
          response.valoresTotalizadosOtros.votosEnBlanco +
          response.valoresTotalizadosOtros.votosRecurridosComandoImpugnados,
      },

      // Summary
      totalValidVotes,
      winnerPercentage,
      runoffRequired,
    };
  }

  /**
   * Extract and sort candidates from agrupaciones
   *
   * @param agrupaciones - Political groups from API
   * @returns Sorted list of candidates
   */
  private static extractCandidates(agrupaciones: Agrupacion[]): SimplifiedCandidate[] {
    return agrupaciones
      .map((agrupacion) => {
        // Get first lista (usually the main one)
        const lista = agrupacion.listas[0];

        // Find president and vice candidates
        const presidente = lista.candidatos?.find((c) => c.tipoCandidato === 'presidente');
        const vice = lista.candidatos?.find((c) => c.tipoCandidato === 'vice');

        // Build full name (Presidente + Vice if available)
        let fullName = presidente
          ? `${presidente.candidatoNombre} ${presidente.candidatoApellido}`
          : agrupacion.agrupacionNombre;

        if (vice) {
          fullName += ` / ${vice.candidatoNombre} ${vice.candidatoApellido}`;
        }

        // Get party color (from API or default)
        const partyColor =
          agrupacion.agrupacionColor ||
          DEFAULT_PARTY_COLORS[agrupacion.agrupacionNombre.toUpperCase()] ||
          DEFAULT_PARTY_COLORS.DEFAULT;

        return {
          id: agrupacion.agrupacionId,
          fullName,
          party: agrupacion.agrupacionNombre,
          partyColor,
          votes: agrupacion.votos,
          percentage: agrupacion.votosPorcentaje,
          position: 'president' as const,
        };
      })
      .sort((a, b) => b.votes - a.votes); // Sort by votes DESC
  }

  /**
   * Determine if a runoff (ballotage) is required
   *
   * Rules:
   * - Winner needs > 45% to win in first round
   * - OR > 40% with 10%+ difference with 2nd place
   *
   * @param candidates - Sorted candidates
   * @returns True if ballotage is required
   */
  private static isRunoffRequired(candidates: SimplifiedCandidate[]): boolean {
    if (candidates.length < 2) return false;

    const first = candidates[0];
    const second = candidates[1];

    // Case 1: Winner has > 45%
    if (first.percentage > ELECTION_CONSTANTS.BALLOTAGE_THRESHOLD_HIGH) {
      return false;
    }

    // Case 2: Winner has > 40% AND 10%+ difference
    if (
      first.percentage > ELECTION_CONSTANTS.BALLOTAGE_THRESHOLD_LOW &&
      first.percentage - second.percentage >= ELECTION_CONSTANTS.BALLOTAGE_DIFF_REQUIRED
    ) {
      return false;
    }

    // Otherwise, ballotage is required
    return true;
  }

  /**
   * Calculate time since last update
   *
   * @param lastUpdate - ISO date string
   * @returns Human-readable time string
   */
  static getTimeSinceUpdate(lastUpdate: string): string {
    const now = new Date();
    const updateDate = new Date(lastUpdate);
    const diffMs = now.getTime() - updateDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) {
      return 'hace instantes';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `hace ${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `hace ${diffHours} hs`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} días`;
  }

  /**
   * Format large numbers with thousands separators
   *
   * @param num - Number to format
   * @returns Formatted string (e.g., "1.234.567")
   */
  static formatVotes(num: number): string {
    return num.toLocaleString('es-AR');
  }

  /**
   * Format percentage with 2 decimals
   *
   * @param pct - Percentage number or string
   * @returns Formatted string (e.g., "45.67%")
   */
  static formatPercentage(pct: number | string): string {
    const numPct = typeof pct === 'string' ? parseFloat(pct) : pct;
    return `${numPct.toFixed(2)}%`;
  }

  /**
   * Get winner status text
   *
   * @param results - Processed election results
   * @returns Status text
   */
  static getWinnerStatus(results: ProcessedElectionResults): string {
    if (!results.candidates.length) {
      return 'Sin resultados';
    }

    const winner = results.candidates[0];

    if (results.runoffRequired) {
      return 'Ballotage requerido';
    }

    if (winner.percentage > ELECTION_CONSTANTS.BALLOTAGE_THRESHOLD_HIGH) {
      return 'Ganador en primera vuelta';
    }

    if (
      winner.percentage > ELECTION_CONSTANTS.BALLOTAGE_THRESHOLD_LOW &&
      results.candidates.length > 1
    ) {
      const diff = winner.percentage - results.candidates[1].percentage;
      if (diff >= ELECTION_CONSTANTS.BALLOTAGE_DIFF_REQUIRED) {
        return 'Ganador en primera vuelta';
      }
    }

    return 'Recuento en curso';
  }

  /**
   * Validate if results are fresh (not stale)
   *
   * @param lastUpdate - ISO date string
   * @param maxAgeMinutes - Maximum age in minutes
   * @returns True if results are fresh
   */
  static isResultsFresh(lastUpdate: string, maxAgeMinutes: number = 30): boolean {
    const now = new Date();
    const updateDate = new Date(lastUpdate);
    const diffMs = now.getTime() - updateDate.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    return diffMinutes < maxAgeMinutes;
  }
}
