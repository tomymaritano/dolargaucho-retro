/**
 * User Favorites API Endpoint
 *
 * GET /api/auth/favorites - Get user's favorites
 * PUT /api/auth/favorites - Update user's favorites
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';
import { getUserPreferences, updateUserPreferences } from '@/lib/db/queries';

interface FavoritesData {
  dolares: string[];
  currencies: string[];
  cryptos: string[];
  charts: string[];
}

interface SuccessResponse {
  success: true;
  favorites: FavoritesData;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type FavoritesResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FavoritesResponse>
) {
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

    const userId = payload.userId;

    // GET - Return user's favorites
    if (req.method === 'GET') {
      const preferences = await getUserPreferences(userId);

      if (!preferences) {
        return res.status(404).json({
          success: false,
          error: 'Preferencias no encontradas',
        });
      }

      return res.status(200).json({
        success: true,
        favorites: {
          dolares: preferences.favorite_dolares || [],
          currencies: preferences.favorite_currencies || [],
          cryptos: preferences.favorite_cryptos || [],
          charts: preferences.favorite_charts || [],
        },
      });
    }

    // PUT - Update user's favorites
    if (req.method === 'PUT') {
      const { dolares, currencies, cryptos, charts } = req.body as Partial<FavoritesData>;

      // Validate that at least one field is provided
      if (!dolares && !currencies && !cryptos && !charts) {
        return res.status(400).json({
          success: false,
          error: 'Debe proporcionar al menos un campo para actualizar',
        });
      }

      // Update preferences
      const updatedPreferences = await updateUserPreferences(userId, {
        ...(dolares !== undefined && { favorite_dolares: dolares }),
        ...(currencies !== undefined && { favorite_currencies: currencies }),
        ...(cryptos !== undefined && { favorite_cryptos: cryptos }),
        ...(charts !== undefined && { favorite_charts: charts }),
      });

      return res.status(200).json({
        success: true,
        favorites: {
          dolares: updatedPreferences.favorite_dolares,
          currencies: updatedPreferences.favorite_currencies,
          cryptos: updatedPreferences.favorite_cryptos,
          charts: updatedPreferences.favorite_charts,
        },
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  } catch (error) {
    console.error('Favorites API error:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al procesar favoritos',
    });
  }
}
