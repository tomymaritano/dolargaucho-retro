/**
 * User Logout API Endpoint
 *
 * POST /api/auth/logout
 * Removes authentication cookie to log user out
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { removeAuthCookie } from '@/lib/auth/cookies';

/**
 * Response types
 */
interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type LogoutResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<LogoutResponse>) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Remove authentication cookie
    removeAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al cerrar sesión',
    });
  }
}
