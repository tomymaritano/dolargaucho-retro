/**
 * API Endpoint: Get Users Count
 *
 * Returns the total number of registered users in the platform
 * Used for social proof in landing page
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCount } from '@/lib/db/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get actual count from database
    const count = await getUsersCount();

    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error in users-count endpoint:', error);

    // Return graceful fallback instead of error
    // This ensures the landing page doesn't break
    // Use a more conservative estimate
    return res.status(200).json({ count: 0 });
  }
}
