/**
 * Roadmap Votes API
 *
 * GET /api/roadmap/votes - Get vote counts for all features
 * GET /api/roadmap/votes?featureId=xxx - Get votes for specific feature
 *
 * Returns vote counts and user's vote status (if authenticated)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';

interface VoteData {
  featureId: string;
  votes: number;
  hasVoted: boolean;
}

interface VotesResponse {
  success: boolean;
  data?: VoteData[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VotesResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Check if user is authenticated (optional - votes are public but user vote status is private)
    const token = getAuthToken(req.headers.cookie);
    const payload = token ? verifyToken(token) : null;
    const userId = payload?.userId;

    const { featureId } = req.query;

    if (featureId && typeof featureId === 'string') {
      // Get votes for specific feature
      const voteCount = await sql`
        SELECT COUNT(*) as count
        FROM feature_votes
        WHERE feature_id = ${featureId}
      `;

      let hasVoted = false;
      if (userId) {
        const userVote = await sql`
          SELECT 1
          FROM feature_votes
          WHERE feature_id = ${featureId} AND user_id = ${userId}
          LIMIT 1
        `;
        hasVoted = userVote.rows.length > 0;
      }

      return res.status(200).json({
        success: true,
        data: [
          {
            featureId,
            votes: parseInt(voteCount.rows[0]?.count || '0'),
            hasVoted,
          },
        ],
      });
    } else {
      // Get votes for all features - return empty array if no votes yet
      const allVotes = await sql`
        SELECT feature_id, COUNT(*) as count
        FROM feature_votes
        GROUP BY feature_id
      `;

      let userVotes: string[] = [];
      if (userId) {
        const userVotesResult = await sql`
          SELECT feature_id
          FROM feature_votes
          WHERE user_id = ${userId}
        `;
        userVotes = userVotesResult.rows.map((row) => row.feature_id);
      }

      // If no votes exist, return empty array (not an error)
      const votesData: VoteData[] = allVotes.rows.map((row) => ({
        featureId: row.feature_id,
        votes: parseInt(row.count || '0'),
        hasVoted: userVotes.includes(row.feature_id),
      }));

      return res.status(200).json({
        success: true,
        data: votesData, // Empty array if no votes
      });
    }
  } catch (error) {
    console.error('[Votes API] Error fetching votes:', error);

    // Return empty array instead of error if table doesn't exist or is empty
    return res.status(200).json({
      success: true,
      data: [],
    });
  }
}
