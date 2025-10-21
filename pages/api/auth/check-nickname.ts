/**
 * Check Nickname Availability API Endpoint
 *
 * GET /api/auth/check-nickname?nickname=example
 * Checks if a nickname is available for registration
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { findUserByNickname } from '@/lib/db/queries';

/**
 * Response types
 */
interface SuccessResponse {
  available: boolean;
  nickname: string;
}

interface ErrorResponse {
  error: string;
}

type CheckNicknameResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckNicknameResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método no permitido',
    });
  }

  try {
    const { nickname } = req.query;

    // Validate nickname parameter
    if (!nickname || typeof nickname !== 'string') {
      return res.status(400).json({
        error: 'Nickname es requerido',
      });
    }

    // Validate nickname length
    if (nickname.length < 3 || nickname.length > 20) {
      return res.status(400).json({
        error: 'El nickname debe tener entre 3 y 20 caracteres',
      });
    }

    // Validate nickname format (alphanumeric, hyphens, underscores)
    const nicknameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!nicknameRegex.test(nickname)) {
      return res.status(400).json({
        error: 'El nickname solo puede contener letras, números, guiones y guiones bajos',
      });
    }

    // Check if nickname exists
    const existingUser = await findUserByNickname(nickname);

    return res.status(200).json({
      available: !existingUser,
      nickname,
    });
  } catch (error) {
    console.error('Error checking nickname availability:', error);

    return res.status(500).json({
      error: 'Error al verificar disponibilidad del nickname',
    });
  }
}
