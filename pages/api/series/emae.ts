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

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DolarGaucho/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[EMAE API] Error:`, response.status);

      // Return fallback data instead of error
      return res.status(200).json({
        series_id: '11.3_VIPAA_2004_M_31',
        name: 'EMAE',
        description: 'Estimador Mensual de Actividad Económica',
        latest: {
          date: new Date().toISOString().split('T')[0],
          value: 150.2, // Mock baseline value
          variation: null,
        },
        data: [],
        count: 0,
        source: 'fallback',
        note: 'Using fallback data - API temporarily unavailable',
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
    // Handle timeout errors with cleaner logging
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('[EMAE API] Request timed out, using fallback data');
    } else {
      console.error('[EMAE API] Fetch error:', error);
    }

    // Return fallback data instead of error
    return res.status(200).json({
      series_id: '11.3_VIPAA_2004_M_31',
      name: 'EMAE',
      description: 'Estimador Mensual de Actividad Económica',
      latest: {
        date: new Date().toISOString().split('T')[0],
        value: 150.2, // Mock baseline value
        variation: null,
      },
      data: [],
      count: 0,
      source: 'fallback',
      note: 'Using fallback data - API temporarily unavailable',
    });
  }
}
