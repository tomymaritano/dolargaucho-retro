/**
 * API Endpoint: Resultados electorales históricos
 *
 * GET /api/elecciones/historical
 * GET /api/elecciones/historical?year=2023
 *
 * Sirve datos oficiales de elecciones legislativas DIRECTAMENTE desde archivos JSON
 * Fuente: DINE (Dirección Nacional Electoral)
 *
 * ⚡ OPTIMIZADO: Lee desde archivos JSON en lugar de PostgreSQL para máxima velocidad
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface AgrupacionResult {
  nombre: string;
  votos: number;
  porcentaje: number;
  posicion: number;
}

interface ElectionResult {
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
  agrupaciones: AgrupacionResult[];
}

// ============================================================================
// IN-MEMORY CACHE - Load once and cache forever (historical data never changes)
// ============================================================================

let cachedElections: ElectionResult[] | null = null;

/**
 * Load all election data from JSON files
 */
function loadElections(): ElectionResult[] {
  if (cachedElections) {
    console.log('[Historical API] Serving from in-memory cache');
    return cachedElections;
  }

  console.log('[Historical API] Loading elections from JSON files...');

  const dataDir = path.join(process.cwd(), 'data');
  const elections: ElectionResult[] = [];

  // Years to load
  const years = [2011, 2013, 2015, 2017, 2019, 2021, 2023];
  const categories = ['diputados', 'senadores'];

  for (const category of categories) {
    for (const year of years) {
      const fileName = `${category}_${year}_oficial.json`;
      const filePath = path.join(dataDir, fileName);

      try {
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');

          // Skip empty files
          if (fileContent.trim().length === 0) {
            console.log(`[Historical API] Skipping empty file: ${fileName}`);
            continue;
          }

          const data = JSON.parse(fileContent);

          // Skip if no agrupaciones
          if (!data.agrupaciones || data.agrupaciones.length === 0) {
            console.log(`[Historical API] Skipping ${fileName} - no agrupaciones`);
            continue;
          }

          elections.push(data);
          console.log(
            `[Historical API] Loaded ${fileName} - ${data.agrupaciones.length} agrupaciones`
          );
        }
      } catch (error) {
        console.error(`[Historical API] Error loading ${fileName}:`, error);
      }
    }
  }

  // Sort by year descending
  elections.sort((a, b) => b.year - a.year);

  console.log(`[Historical API] Loaded ${elections.length} elections total`);

  // Cache in memory
  cachedElections = elections;

  return elections;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ElectionResult[] | ElectionResult | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { year } = req.query;

    // Load all elections (cached after first load)
    const elections = loadElections();

    // If year is specified, filter
    if (year) {
      const yearNum = parseInt(year as string);

      if (isNaN(yearNum)) {
        return res.status(400).json({ error: 'Invalid year parameter' });
      }

      const election = elections.find((e) => e.year === yearNum);

      if (!election) {
        return res.status(404).json({ error: 'Election not found' });
      }

      return res.status(200).json(election);
    }

    // Return all elections
    // Cache headers para datos históricos (no cambian)
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
    res.setHeader('ETag', `"elections-json-v3-${elections.length}"`);

    return res.status(200).json(elections);
  } catch (error) {
    console.error('[Historical Elections API] Error:', error);

    return res.status(500).json({
      error: 'Failed to fetch historical election results',
    });
  }
}
