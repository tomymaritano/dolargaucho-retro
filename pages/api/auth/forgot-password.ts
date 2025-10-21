/**
 * Forgot Password API Endpoint
 *
 * POST /api/auth/forgot-password
 * Generates a password reset token and sends it via email
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { findUserByEmail } from '@/lib/db/queries';
import { createPasswordResetToken } from '@/lib/auth/password-reset';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimitMiddleware, getClientIdentifier } from '@/lib/security/rate-limit';

/**
 * Request body validation schema
 */
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
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

type ForgotPasswordResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ForgotPasswordResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  // Rate limiting: 3 attempts per hour
  const rateLimitResult = await rateLimitMiddleware(req, 'forgotPassword');
  if (!rateLimitResult.success) {
    console.log('[Forgot Password] Rate limit exceeded for IP:', getClientIdentifier(req));
    return res.status(429).json({
      success: false,
      error: `Demasiados intentos. Por favor intenta de nuevo en ${Math.ceil(rateLimitResult.retryAfter! / 60)} minutos.`,
    });
  }

  try {
    // Parse and validate request body
    const body = forgotPasswordSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { email } = body.data;

    // Find user by email
    const user = await findUserByEmail(email.toLowerCase());

    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log('[Forgot Password] User not found:', email);
      return res.status(200).json({
        success: true,
        message:
          'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.',
      });
    }

    // Generate password reset token (valid for 1 hour)
    const token = await createPasswordResetToken(user.id);

    // Send password reset email
    try {
      // Only send email if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY) {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name || undefined,
          resetToken: token,
        });
        console.log('[Forgot Password] Reset email sent to:', user.email);
      } else {
        console.warn('[Forgot Password] Email service not configured - email not sent');
        console.log('[Forgot Password] Reset token:', token);
        console.log(
          '[Forgot Password] Reset URL:',
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
        );
      }
    } catch (emailError) {
      console.error('[Forgot Password] Failed to send email:', emailError);
      // Don't reveal email sending failure to user for security
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message:
        'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud. Por favor intenta de nuevo.',
    });
  }
}
