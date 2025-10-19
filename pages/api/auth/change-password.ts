/**
 * Change Password API Endpoint
 *
 * POST /api/auth/change-password
 * Allows authenticated users to change their password
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';
import { findUserByEmail, updateUserPassword } from '@/lib/db/queries';
import { comparePassword, hashPassword } from '@/lib/auth/password';

/**
 * Request body validation schema
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'La contraseña actual es requerida' }),
  newPassword: z
    .string()
    .min(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' }),
});

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

type ChangePasswordResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChangePasswordResponse>
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
    const body = changePasswordSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { currentPassword, newPassword } = body.data;

    // Get user with password hash
    const user = await findUserByEmail(payload.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'La contraseña actual es incorrecta',
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await updateUserPassword(payload.userId, newPasswordHash);

    console.log('[Change Password] Password changed for user:', user.email);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    console.error('Change password error:', error);

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al cambiar la contraseña. Por favor intenta de nuevo.',
    });
  }
}
