import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimiters } from '@/lib/utils/rateLimit';
import { logger } from '@/lib/utils/logger';

/**
 * Proxy API for DolarAPI with rate limiting
 * This prevents abuse and protects the external API
 *
 * Usage: GET /api/proxy/dolar
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting
  const rateLimitResult = await rateLimiters.generous.middleware(req, res);
  if (!rateLimitResult.success) {
    return; // Response already sent by middleware
  }

  try {
    const startTime = Date.now();

    // Fetch from DolarAPI
    const response = await fetch('https://dolarapi.com/v1/dolares', {
      headers: {
        'User-Agent': 'DolarGaucho/1.0',
      },
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      logger.error('DolarAPI request failed', {
        api: 'dolar-proxy',
        status: response.status,
        statusText: response.statusText,
      });

      return res.status(response.status).json({
        error: 'External API error',
        message: 'Failed to fetch dollar quotations',
      });
    }

    const data = await response.json();

    logger.info('DolarAPI request successful', {
      api: 'dolar-proxy',
      duration,
      recordCount: data.length,
    });

    // Set cache headers (30 seconds)
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

    return res.status(200).json(data);
  } catch (error) {
    logger.error('Error in dolar proxy', error, { api: 'dolar-proxy' });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching data',
    });
  }
}
