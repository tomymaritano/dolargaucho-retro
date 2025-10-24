/**
 * BCRA Base Monetaria API
 *
 * Fetches monetary base data from Argentina.gob.ar API
 * Data represents BCRA's monetary base in millions of ARS
 *
 * Data source: https://apis.datos.gob.ar/series/api/series/
 * Note: Series ID may need to be updated with actual BCRA monetary base series
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface SeriesDataPoint {
  date: string;
  value: number;
}

interface SeriesResponse {
  data: Array<[string, number | null]>;
  meta?: {
    frequency?: string;
    start_date?: string;
    end_date?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { limit = '30' } = req.query; // Default to last 30 data points

  try {
    // Series ID for base monetaria - common identifier
    // This may need to be updated with the exact series ID
    const seriesId = '1.1_BASE_MONETARIA_0_0_6';
    const url = `https://apis.datos.gob.ar/series/api/series?ids=${seriesId}&limit=${limit}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DolarGaucho/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[Base Monetaria API] Error:`, response.status);

      // Fallback: return mock data for development
      // TODO: Replace with actual BCRA data source if series API fails
      return res.status(200).json({
        series_id: seriesId,
        name: 'Base Monetaria',
        description: 'Base monetaria total (millones ARS)',
        latest: {
          date: new Date().toISOString().split('T')[0],
          value: 40792969, // Mock value from research
          variation: null,
        },
        data: [],
        count: 0,
        source: 'mock',
        note: 'Data source needs to be configured',
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

    // Get latest value
    const latest = observations[observations.length - 1] || { date: '', value: 0 };

    // Calculate variation (current vs previous period)
    let variation = null;
    if (observations.length >= 2) {
      const current = observations[observations.length - 1].value;
      const previous = observations[observations.length - 2].value;
      variation = ((current - previous) / previous) * 100;
    }

    // Cache for 12 hours (base monetaria updates daily)
    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');

    return res.status(200).json({
      series_id: seriesId,
      name: 'Base Monetaria',
      description: 'Base monetaria total (millones ARS)',
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
    console.error(`[Base Monetaria API] Fetch error:`, error);

    // Return fallback data instead of error
    return res.status(200).json({
      series_id: 'fallback',
      name: 'Base Monetaria',
      description: 'Base monetaria total (millones ARS)',
      latest: {
        date: new Date().toISOString().split('T')[0],
        value: 40792969, // Mock value
        variation: null,
      },
      data: [],
      count: 0,
      source: 'fallback',
      note: 'Using fallback data - API temporarily unavailable',
    });
  }
}
