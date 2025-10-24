/**
 * Election Results API Endpoint
 *
 * Fetches and caches election results from Ministerio del Interior
 * Implements polling, caching, retries with exponential backoff
 *
 * GET /api/elecciones/resultados
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ElectionAPIResponse, ProcessedElectionResults } from '@/types/api/election';
import { ElectionService } from '@/lib/services/ElectionService';
import { ELECTION_CONFIG, isElectionAPIConfigured } from '@/lib/config/election';
import { logger } from '@/lib/utils/logger';

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================

interface CacheEntry {
  data: ProcessedElectionResults;
  timestamp: number;
}

let cache: CacheEntry | null = null;

/**
 * Check if cache is still valid
 */
function isCacheValid(): boolean {
  if (!cache) return false;

  const now = Date.now();
  const age = now - cache.timestamp;

  return age < ELECTION_CONFIG.CACHE_TTL;
}

/**
 * Get cached results if valid
 */
function getCachedResults(): ProcessedElectionResults | null {
  if (isCacheValid() && cache) {
    logger.info('[Election API] Serving from cache');
    return cache.data;
  }
  return null;
}

/**
 * Update cache with new results
 */
function updateCache(data: ProcessedElectionResults): void {
  cache = {
    data,
    timestamp: Date.now(),
  };
  logger.info('[Election API] Cache updated');
}

// ============================================================================
// API FETCHER WITH RETRIES
// ============================================================================

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch election results from official API with retries
 *
 * @returns Raw API response
 * @throws Error if all retries fail
 */
async function fetchElectionResults(): Promise<ElectionAPIResponse> {
  const url = new URL(ELECTION_CONFIG.API_URL);

  // Add query params
  Object.entries(ELECTION_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < ELECTION_CONFIG.MAX_RETRIES; attempt++) {
    try {
      logger.info(
        `[Election API] Fetching results (attempt ${attempt + 1}/${ELECTION_CONFIG.MAX_RETRIES})`
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ELECTION_CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: ELECTION_CONFIG.HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ElectionAPIResponse = await response.json();

      logger.info('[Election API] Results fetched successfully', {
        mesasTotalizadas: data.estadoRecuento.mesasTotalizadas,
        mesasTotalizadasPorcentaje: data.estadoRecuento.mesasTotalizadasPorcentaje,
      });

      return data;
    } catch (error) {
      const isLastAttempt = attempt === ELECTION_CONFIG.MAX_RETRIES - 1;

      logger.error(`[Election API] Fetch failed (attempt ${attempt + 1})`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        isLastAttempt,
      });

      if (isLastAttempt) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      const delay = ELECTION_CONFIG.RETRY_DELAYS[attempt] || 5000;
      logger.info(`[Election API] Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw new Error('All retry attempts failed');
}

// ============================================================================
// API HANDLER
// ============================================================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessedElectionResults | { error: string; details?: string }>
) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to serve from cache first
    const cachedResults = getCachedResults();
    if (cachedResults) {
      return res.status(200).json(cachedResults);
    }

    // Fetch fresh results
    logger.info('[Election API] Cache miss - fetching fresh data');
    const rawResults = await fetchElectionResults();

    // Process results
    const processedResults = ElectionService.processResults(rawResults);

    // Update cache
    updateCache(processedResults);

    // Return results
    return res.status(200).json(processedResults);
  } catch (error) {
    logger.error('[Election API] Unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // If we have stale cache, serve it with a warning
    if (cache) {
      logger.warn('[Election API] Serving stale cache due to error');
      return res.status(200).json(cache.data);
    }

    // Otherwise return error
    return res.status(500).json({
      error: 'Failed to fetch election results',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
