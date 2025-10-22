/**
 * JWT Utilities for Edge Runtime (Middleware)
 *
 * Uses 'jose' library which is compatible with Edge Runtime
 * For API routes, use jwt.ts instead
 */

import { SignJWT, jwtVerify } from 'jose';

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
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Convert string to Uint8Array for jose
  return new TextEncoder().encode(secret);
}

/**
 * Get JWT expiration time from environment
 */
function getJWTExpiration(): string {
  return process.env.JWT_EXPIRATION || '7d';
}

/**
 * Parse duration string to seconds
 */
function durationToSeconds(duration: string): number {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  const match = duration.match(/^(\d+)([smhdw])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * units[unit];
}

/**
 * Generate a JWT token for a user (Edge Runtime compatible)
 *
 * @param userId - Unique user identifier
 * @param email - User email
 * @returns Signed JWT token
 */
export async function generateTokenEdge(userId: string, email: string): Promise<string> {
  const secret = getJWTSecret();
  const expiresIn = getJWTExpiration();
  const expirationSeconds = durationToSeconds(expiresIn);

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirationSeconds)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token (Edge Runtime compatible)
 *
 * @param token - JWT token to verify
 * @returns Decoded payload if valid, null if invalid
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret();

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return payload as unknown as JWTPayload;
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.error(
      '[JWT Edge] Token verification failed:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
