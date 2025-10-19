/**
 * Update Profile API Endpoint
 *
 * POST /api/auth/update-profile
 * Updates user profile information (name, email)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';
import { updateUser, findUserByEmail } from '@/lib/db/queries';

/**
 * Request body validation schema
 */
const updateProfileSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }).optional(),
  email: z.string().email({ message: 'Email inválido' }).optional(),
});

/**
 * Response types
 */
interface SuccessResponse {
  success: true;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

type UpdateProfileResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateProfileResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Verify authentication
    const token = getAuthToken(req.headers.cookie);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    // Parse and validate request body
    const body = updateProfileSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { name, email } = body.data;

    // Check if email is already taken by another user
    if (email && email !== payload.email) {
      const existingUser = await findUserByEmail(email.toLowerCase());
      if (existingUser && existingUser.id !== payload.userId) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está en uso',
        });
      }
    }

    // Update user
    const updatedUser = await updateUser(payload.userId, {
      name,
      email: email?.toLowerCase(),
    });

    console.log('[Update Profile] Profile updated for user:', updatedUser.email);

    // Return success response
    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar el perfil. Por favor intenta de nuevo.',
    });
  }
}
