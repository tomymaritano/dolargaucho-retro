/**
 * User Registration API Endpoint
 *
 * POST /api/auth/register
 * Creates a new user account with hashed password
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { hashPassword, validatePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';
import { createUser, findUserByEmail, findUserByNickname } from '@/lib/db/queries';

/**
 * Request body validation schema
 */
const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  name: z.string().optional(),
  nickname: z.string().min(3).max(20).optional(),
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
    nickname?: string;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

type RegisterResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    // Parse and validate request body
    const body = registerSchema.safeParse(req.body);

    if (!body.success) {
      const firstError = body.error.errors[0];
      return res.status(400).json({
        success: false,
        error: firstError.message,
      });
    }

    const { email, password, name, nickname } = body.data;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.error!,
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Este email ya está registrado',
      });
    }

    // Check if nickname is already taken
    if (nickname) {
      const existingNickname = await findUserByNickname(nickname);
      if (existingNickname) {
        return res.status(400).json({
          success: false,
          error: 'Este nickname ya está en uso',
        });
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in database
    const user = await createUser(email.toLowerCase(), passwordHash, name, nickname);

    // Generate JWT token
    const token = generateToken(user.id, user.email);
    console.log('[Register API] Generated token (first 20 chars):', token.substring(0, 20) + '...');

    // Set HTTP-only cookie
    setAuthCookie(res, token);
    console.log('[Register API] Cookie set for user:', user.email);

    // Return success response
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Check for specific database errors
    if (error instanceof Error) {
      // Duplicate email constraint violation
      if (error.message.includes('unique constraint')) {
        return res.status(400).json({
          success: false,
          error: 'Este email ya está registrado',
        });
      }
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Error al crear la cuenta. Por favor intenta de nuevo.',
    });
  }
}
