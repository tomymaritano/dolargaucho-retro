/**
 * Roadmap Voting API
 *
 * POST /api/roadmap/vote - Vote for a feature (requires auth)
 * DELETE /api/roadmap/vote - Remove vote from a feature (requires auth)
 *
 * Body: { featureId: string }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';

interface VoteRequest {
  featureId: string;
}

interface VoteResponse {
  success: boolean;
  message: string;
  votes?: number;
  hasVoted?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VoteResponse>) {
  try {
    // Verify authentication
    const token = getAuthToken(req.headers.cookie);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión para votar',
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    const userId = payload.userId;

    // Validate request body
    const { featureId } = req.body as VoteRequest;
    if (!featureId || typeof featureId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Feature ID es requerido',
      });
    }

    if (req.method === 'POST') {
      // Add vote
      try {
        await sql`
          INSERT INTO feature_votes (user_id, feature_id)
          VALUES (${userId}, ${featureId})
          ON CONFLICT (user_id, feature_id) DO NOTHING
        `;

        // Get updated vote count
        const voteCount = await sql`
          SELECT COUNT(*) as count
          FROM feature_votes
          WHERE feature_id = ${featureId}
        `;

        const votes = parseInt(voteCount.rows[0].count);

        return res.status(200).json({
          success: true,
          message: 'Voto registrado exitosamente',
          votes,
          hasVoted: true,
        });
      } catch (error) {
        console.error('[Vote API] Error adding vote:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al registrar voto',
        });
      }
    } else if (req.method === 'DELETE') {
      // Remove vote
      try {
        await sql`
          DELETE FROM feature_votes
          WHERE user_id = ${userId} AND feature_id = ${featureId}
        `;

        // Get updated vote count
        const voteCount = await sql`
          SELECT COUNT(*) as count
          FROM feature_votes
          WHERE feature_id = ${featureId}
        `;

        const votes = parseInt(voteCount.rows[0].count);

        return res.status(200).json({
          success: true,
          message: 'Voto eliminado exitosamente',
          votes,
          hasVoted: false,
        });
      } catch (error) {
        console.error('[Vote API] Error removing vote:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar voto',
        });
      }
    } else {
      return res.status(405).json({
        success: false,
        message: 'Método no permitido',
      });
    }
  } catch (error) {
    console.error('[Vote API] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
