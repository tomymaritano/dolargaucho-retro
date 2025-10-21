/**
 * Recent Users API Endpoint
 *
 * GET /api/stats/recent-users
 * Returns recent users who have registered (for Community Thanks section)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

interface RecentUser {
  nickname: string;
  created_at: string;
}

interface SuccessResponse {
  success: true;
  users: RecentUser[];
}

interface ErrorResponse {
  success: false;
  error: string;
}

type RecentUsersResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecentUsersResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Get last 30 users with nicknames (ordered by creation date)
    const result = await sql`
      SELECT nickname, created_at
      FROM users
      WHERE nickname IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 30
    `;

    const users: RecentUser[] = result.rows.map((row) => ({
      nickname: row.nickname,
      created_at: row.created_at,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios recientes',
    });
  }
}
