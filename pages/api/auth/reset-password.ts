/**
 * Reset Password API Endpoint
 *
 * POST /api/auth/reset-password
 * Validates reset token and updates user password
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { validatePasswordResetToken, deletePasswordResetToken } from '@/lib/auth/password-reset';
import { hashPassword } from '@/lib/auth/password';
import { updateUserPassword } from '@/lib/db/queries';

/**
 * Request body validation schema
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token es requerido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
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

type ResetPasswordResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResetPasswordResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Parse and validate request body
    const body = resetPasswordSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { token, password } = body.data;

    // Validate reset token and get user ID
    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido o expirado. Por favor solicita un nuevo enlace de restablecimiento.',
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await updateUserPassword(userId, passwordHash);

    // Delete used reset token
    await deletePasswordResetToken(token);

    console.log('[Reset Password] Password updated for user:', userId);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al restablecer la contraseña. Por favor intenta de nuevo.',
    });
  }
}
