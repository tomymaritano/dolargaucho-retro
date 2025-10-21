/**
 * FRED API Proxy
 *
 * Acts as a server-side proxy to fetch data from FRED API
 * This is necessary because FRED API doesn't support CORS for browser requests
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface FredObservation {
  date: string;
  value: string;
  realtime_start: string;
  realtime_end: string;
}

interface FredResponse {
  observations: FredObservation[];
}

interface FredDataPoint {
  date: string;
  value: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { series_id, limit = '24' } = req.query;

  // Validate series_id
  if (!series_id || typeof series_id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid series_id parameter' });
  }

  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'FRED API key not configured' });
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[FRED API] Error for ${series_id}:`, response.status, errorData);
      return res.status(response.status).json({
        error: 'FRED API error',
        details: errorData,
      });
    }

    const data: FredResponse = await response.json();

    // Transform and filter data
    const observations: FredDataPoint[] = data.observations
      .map((obs) => ({
        date: obs.date,
        value: parseFloat(obs.value) || 0,
      }))
      .filter((point) => !isNaN(point.value))
      .reverse(); // Reverse to get chronological order

    // Cache for 6 hours (FRED data doesn't update frequently)
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=43200');

    return res.status(200).json({
      series_id,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error(`[FRED API] Fetch error for ${series_id}:`, error);
    return res.status(500).json({
      error: 'Failed to fetch FRED data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
