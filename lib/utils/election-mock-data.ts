/**
 * Election Mock Data
 *
 * Mock data based on 2023 election results for testing/preview purposes
 * Converts historical data to ProcessedElectionResults format
 */

import type { ProcessedElectionResults } from '@/types/api/election';
import { ELECTION_2023 } from '@/data/elections-history';

/**
 * Get mock election results based on 2023 historical data
 *
 * This simulates what the API would return during live counting
 * Useful for testing the UI without hitting the real API
 */
export function getMockElectionResults(progressPercentage: number = 100): ProcessedElectionResults {
  // Simulate partial counting by adjusting progress
  const actualProgress = Math.min(Math.max(progressPercentage, 0), 100);

  return {
    // Metadata
    lastUpdate: new Date().toISOString(),
    electionYear: 2023,
    electionType: 'Generales',
    category: 'Presidente y Vicepresidente',
    district: 'Nacional',
    isProvisional: actualProgress < 100,

    // Progress
    progress: {
      totalPollingStations: 100000,
      talliedPollingStations: Math.floor((actualProgress / 100) * 100000),
      talliedPercentage: actualProgress,
      totalElectors: 35000000, // Electores habilitados
      totalVoters: 26775000, // Votantes que realmente votaron
      participationPercentage: 76.5, // Porcentaje de participación
    },

    // Candidates (from ELECTION_2023 data - ballotage results)
    candidates: ELECTION_2023.candidates.map((candidate) => ({
      id: candidate.id,
      fullName: candidate.fullName,
      party: candidate.party,
      partyColor: candidate.partyColor,
      votes: candidate.votes,
      percentage: candidate.percentage,
      position: candidate.id === 1 ? ('president' as const) : ('vice' as const),
    })),

    // Other votes
    otherVotes: {
      null: 650000,
      nullPercentage: 2.4,
      blank: 450000,
      blankPercentage: 1.7,
      challenged: 150000,
      challengedPercentage: 0.6,
      total: 1250000,
    },

    // Summary
    totalValidVotes: ELECTION_2023.totalValidVotes,
    winnerPercentage: ELECTION_2023.winner.percentage,
    runoffRequired: false, // Ballotage already happened
  };
}

/**
 * Simulate progressive counting
 *
 * Returns mock data with different progress levels
 * Useful for testing animations and UI updates
 */
export function getMockProgressiveResults(stage: 'early' | 'mid' | 'late' | 'final') {
  const progressMap = {
    early: 15.5,
    mid: 45.3,
    late: 78.9,
    final: 100,
  };

  return getMockElectionResults(progressMap[stage]);
}

/**
 * Get mock results for Diputados category
 */
export function getMockDiputadosResults(
  progressPercentage: number = 100
): ProcessedElectionResults {
  const actualProgress = Math.min(Math.max(progressPercentage, 0), 100);

  return {
    lastUpdate: new Date().toISOString(),
    electionYear: 2023,
    electionType: 'Generales',
    category: 'Diputados Nacionales',
    district: 'Nacional',
    isProvisional: actualProgress < 100,

    progress: {
      totalPollingStations: 100000,
      talliedPollingStations: Math.floor((actualProgress / 100) * 100000),
      talliedPercentage: actualProgress,
      totalElectors: 35000000,
      totalVoters: 26775000,
      participationPercentage: 76.5,
    },

    candidates: [
      {
        id: 1,
        fullName: 'La Libertad Avanza',
        party: 'La Libertad Avanza',
        partyColor: '#6B4C9A',
        votes: 7828107,
        percentage: 31.95,
        position: 'president' as const,
      },
      {
        id: 2,
        fullName: 'Union por la Patria',
        party: 'Union por la Patria',
        partyColor: '#87CEEB',
        votes: 7076477,
        percentage: 28.88,
        position: 'vice' as const,
      },
      {
        id: 3,
        fullName: 'Juntos por el Cambio',
        party: 'Juntos por el Cambio',
        partyColor: '#FFD700',
        votes: 6821661,
        percentage: 27.84,
        position: 'vice' as const,
      },
      {
        id: 4,
        fullName: 'Hacemos por Nuestro Pais',
        party: 'Hacemos por Nuestro Pais',
        partyColor: '#FF6B6B',
        votes: 1510180,
        percentage: 6.16,
        position: 'vice' as const,
      },
    ],

    otherVotes: {
      null: 450000,
      nullPercentage: 1.9,
      blank: 350000,
      blankPercentage: 1.5,
      challenged: 100000,
      challengedPercentage: 0.4,
      total: 900000,
    },

    totalValidVotes: 23236425,
    winnerPercentage: 31.95,
    runoffRequired: false,
  };
}

/**
 * Get mock results for Senadores category
 */
export function getMockSenadoresResults(
  progressPercentage: number = 100
): ProcessedElectionResults {
  const actualProgress = Math.min(Math.max(progressPercentage, 0), 100);

  return {
    lastUpdate: new Date().toISOString(),
    electionYear: 2023,
    electionType: 'Generales',
    category: 'Senadores Nacionales',
    district: 'Nacional',
    isProvisional: actualProgress < 100,

    progress: {
      totalPollingStations: 100000,
      talliedPollingStations: Math.floor((actualProgress / 100) * 100000),
      talliedPercentage: actualProgress,
      totalElectors: 35000000,
      totalVoters: 26775000,
      participationPercentage: 76.5,
    },

    candidates: [
      {
        id: 1,
        fullName: 'La Libertad Avanza',
        party: 'La Libertad Avanza',
        partyColor: '#6B4C9A',
        votes: 7654321,
        percentage: 31.24,
        position: 'president' as const,
      },
      {
        id: 2,
        fullName: 'Union por la Patria',
        party: 'Union por la Patria',
        partyColor: '#87CEEB',
        votes: 7123456,
        percentage: 29.07,
        position: 'vice' as const,
      },
      {
        id: 3,
        fullName: 'Juntos por el Cambio',
        party: 'Juntos por el Cambio',
        partyColor: '#FFD700',
        votes: 6789012,
        percentage: 27.7,
        position: 'vice' as const,
      },
      {
        id: 4,
        fullName: 'Hacemos por Nuestro Pais',
        party: 'Hacemos por Nuestro Pais',
        partyColor: '#FF6B6B',
        votes: 1456789,
        percentage: 5.94,
        position: 'vice' as const,
      },
    ],

    otherVotes: {
      null: 400000,
      nullPercentage: 1.7,
      blank: 320000,
      blankPercentage: 1.4,
      challenged: 90000,
      challengedPercentage: 0.4,
      total: 810000,
    },

    totalValidVotes: 23023578,
    winnerPercentage: 31.24,
    runoffRequired: false,
  };
}
