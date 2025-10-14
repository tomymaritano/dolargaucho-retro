/**
 * JWT Utilities for Custom Authentication
 *
 * Provides functions to generate and verify JSON Web Tokens
 * for secure, stateless authentication.
 */

import jwt, { type SignOptions } from 'jsonwebtoken';

/**
 * JWT Payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Get JWT secret from environment
 * In production, this should be a strong, random string (min 32 characters)
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  return secret;
}

/**
 * Get JWT expiration time from environment
 * Defaults to 7 days if not set
 */
function getJWTExpiration(): string {
  return process.env.JWT_EXPIRATION || '7d';
}

/**
 * Generate a JWT token for a user
 *
 * @param userId - Unique user identifier
 * @param email - User email
 * @returns Signed JWT token
 */
export function generateToken(userId: string, email: string): string {
  const payload: JWTPayload = {
    userId,
    email,
  };

  const secret = getJWTSecret();
  const expiresIn = getJWTExpiration();

  console.log('[JWT] Generating token with secret length:', secret.length);
  console.log('[JWT] Token expiration:', expiresIn);

  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
    algorithm: 'HS256',
  } as jwt.SignOptions);

  return token;
}

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT token to verify
 * @returns Decoded payload if valid, null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    console.log('[JWT] Verifying token with secret length:', secret.length);

    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as JWTPayload;

    console.log('[JWT] Token verified successfully for user:', decoded.email);
    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.error('[JWT] Token verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Decode a JWT token without verifying (for debugging)
 * WARNING: Do NOT use this for authentication - use verifyToken instead
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Check if a token is expired without full verification
 * Useful for client-side checks before making requests
 *
 * @param token - JWT token to check
 * @returns true if expired, false if valid or malformed
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
