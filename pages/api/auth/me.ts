/**
 * Get Current User API Endpoint
 *
 * GET /api/auth/me
 * Returns the currently authenticated user from JWT token
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';
import { findUserById, getUserPreferences } from '@/lib/db/queries';

/**
 * Response types
 */
interface SuccessResponse {
  success: true;
  user: {
    id: string;
    email: string;
    name?: string;
    created_at: Date;
  };
  preferences?: {
    theme: 'light' | 'dark';
    currency: string;
    notifications_enabled: boolean;
    favorite_dolares: string[];
    favorite_currencies: string[];
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

type MeResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Get token from cookie
    const token = getAuthToken(req.headers.cookie);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    // Verify JWT token
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }

    // Get user from database
    const user = await findUserById(payload.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // Get user preferences
    const preferences = await getUserPreferences(user.id);

    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
      preferences: preferences
        ? {
            theme: preferences.theme,
            currency: preferences.currency,
            notifications_enabled: preferences.notifications_enabled,
            favorite_dolares: preferences.favorite_dolares,
            favorite_currencies: preferences.favorite_currencies,
          }
        : undefined,
    });
  } catch (error) {
    console.error('Get current user error:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al obtener datos del usuario',
    });
  }
}
