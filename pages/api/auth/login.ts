/**
 * User Login API Endpoint
 *
 * POST /api/auth/login
 * Authenticates user with email and password, returns JWT in HTTP-only cookie
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';
import { findUserByEmail } from '@/lib/db/queries';
import {
  rateLimitMiddleware,
  resetRateLimit,
  getClientIdentifier,
} from '@/lib/security/rate-limit';

/**
 * Request body validation schema
 */
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
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

type LoginResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  // Rate limiting: 5 attempts per 15 minutes
  const rateLimitResult = await rateLimitMiddleware(req, 'login');
  if (!rateLimitResult.success) {
    console.log('[Login] Rate limit exceeded for IP:', getClientIdentifier(req));
    return res.status(429).json({
      success: false,
      error: `Demasiados intentos. Por favor intenta de nuevo en ${rateLimitResult.retryAfter} segundos.`,
    });
  }

  try {
    // Parse and validate request body
    const body = loginSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { email, password } = body.data;

    // Find user by email
    const user = await findUserByEmail(email.toLowerCase());

    if (!user) {
      // Use generic error message to prevent email enumeration
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos',
      });
    }

    // Compare password with hash
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);
    console.log('[Login API] Generated token (first 20 chars):', token.substring(0, 20) + '...');

    // Set HTTP-only cookie
    setAuthCookie(res, token);
    console.log('[Login API] Cookie set for user:', user.email);

    // Reset rate limit on successful login
    resetRateLimit(getClientIdentifier(req), 'login');

    // Return success response (without password hash)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión. Por favor intenta de nuevo.',
    });
  }
}
