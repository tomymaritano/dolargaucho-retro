/**
 * BCRA Tasas API
 *
 * Fetches interest rates (BADLAR, TAMAR) from BCRA
 * Data source: https://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas1_ser.txt
 *
 * BADLAR: Tasa de interés de depósitos a plazo fijo
 * TAMAR: Tasa de interés activa promedio del sistema
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface TasaDataPoint {
  date: string;
  badlar: number | null;
  tamar: number | null;
}

interface TasasResponse {
  latest: {
    date: string;
    badlar: number | null;
    tamar: number | null;
  };
  data: TasaDataPoint[];
  count: number;
}

/**
 * Parse BCRA TXT file format
 * Format: date\tbadlar\ttamar (tab-separated)
 */
function parseBCRATxt(text: string, limit: number = 30): TasaDataPoint[] {
  const lines = text.trim().split('\n');
  const data: TasaDataPoint[] = [];

  // Skip header line (first line)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split('\t');
    if (parts.length < 3) continue;

    const [dateStr, badlarStr, tamarStr] = parts;

    // Parse date (format: DD/MM/YYYY)
    const date = dateStr.trim();

    // Parse values
    const badlar =
      badlarStr && badlarStr.trim() !== '' ? parseFloat(badlarStr.replace(',', '.')) : null;
    const tamar =
      tamarStr && tamarStr.trim() !== '' ? parseFloat(tamarStr.replace(',', '.')) : null;

    if (date && (badlar !== null || tamar !== null)) {
      data.push({ date, badlar, tamar });
    }
  }

  // Return most recent data first, limited
  return data.slice(0, limit).reverse();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { limit = '30' } = req.query;
  const limitNum = parseInt(limit as string, 10);

  try {
    const url = 'https://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/tas1_ser.txt';

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DolarGaucho/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[BCRA Tasas] Error:`, response.status);
      return res.status(response.status).json({
        error: 'BCRA API error',
        status: response.status,
      });
    }

    const text = await response.text();
    const data = parseBCRATxt(text, limitNum);

    if (data.length === 0) {
      return res.status(500).json({
        error: 'Failed to parse BCRA tasas data',
        message: 'No valid data found',
      });
    }

    // Latest values
    const latest = data[data.length - 1];

    // Cache for 12 hours (BCRA updates daily)
    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');

    const result: TasasResponse = {
      latest,
      data,
      count: data.length,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(`[BCRA Tasas] Fetch error:`, error);
    return res.status(500).json({
      error: 'Failed to fetch BCRA tasas',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
