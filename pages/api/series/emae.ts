/**
 * EMAE API Proxy
 *
 * Fetches EMAE (Estimador Mensual de Actividad Económica) from Argentina.gob.ar API
 * EMAE measures monthly economic activity in Argentina
 *
 * Data source: https://apis.datos.gob.ar/series/api/series/
 * Series ID: 11.3_VIPAA_2004_M_31 (EMAE)
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface SeriesDataPoint {
  date: string;
  value: number;
}

interface SeriesResponse {
  data: Array<[string, number | null]>;
  meta: {
    frequency: string;
    start_date: string;
    end_date: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { limit = '12' } = req.query; // Default to last 12 months

  try {
    const url = `https://apis.datos.gob.ar/series/api/series?ids=11.3_VIPAA_2004_M_31&limit=${limit}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DolarGaucho/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[EMAE API] Error:`, response.status);
      return res.status(response.status).json({
        error: 'Argentina Datos API error',
        status: response.status,
      });
    }

    const data: SeriesResponse = await response.json();

    // Transform data to standardized format
    const observations: SeriesDataPoint[] = data.data
      .filter((point) => point[1] !== null)
      .map((point) => ({
        date: point[0],
        value: point[1] as number,
      }))
      .reverse(); // Most recent last

    // Get latest value for quick access
    const latest = observations[observations.length - 1];

    // Calculate variation (current vs previous month)
    let variation = null;
    if (observations.length >= 2) {
      const current = observations[observations.length - 1].value;
      const previous = observations[observations.length - 2].value;
      variation = ((current - previous) / previous) * 100;
    }

    // Cache for 1 day (EMAE data is monthly, updates infrequently)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');

    return res.status(200).json({
      series_id: '11.3_VIPAA_2004_M_31',
      name: 'EMAE',
      description: 'Estimador Mensual de Actividad Económica',
      count: observations.length,
      latest: {
        date: latest.date,
        value: latest.value,
        variation,
      },
      data: observations,
      meta: data.meta,
    });
  } catch (error) {
    console.error(`[EMAE API] Fetch error:`, error);
    return res.status(500).json({
      error: 'Failed to fetch EMAE data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
