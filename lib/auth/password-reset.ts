/**
 * Password Reset Token Management
 *
 * Handles creation, validation, and deletion of password reset tokens
 */

import { randomBytes } from 'crypto';
import { sql } from '@vercel/postgres';

/**
 * Token expiration time (1 hour)
 */
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure random token
 */
function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a password reset token for a user
 *
 * @param userId - User ID
 * @returns Reset token
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);
  const expiresAtISO = expiresAt.toISOString();

  // Store token in database
  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAtISO})
    ON CONFLICT (user_id)
    DO UPDATE SET token = ${token}, expires_at = ${expiresAtISO}, created_at = NOW()
  `;

  return token;
}

/**
 * Validate a password reset token
 *
 * @param token - Reset token
 * @returns User ID if valid, null otherwise
 */
export async function validatePasswordResetToken(token: string): Promise<string | null> {
  const result = await sql`
    SELECT user_id, expires_at
    FROM password_reset_tokens
    WHERE token = ${token}
  `;

  if (result.rows.length === 0) {
    return null;
  }

  const { user_id, expires_at } = result.rows[0];

  // Check if token has expired
  if (new Date(expires_at) < new Date()) {
    // Delete expired token
    await deletePasswordResetToken(token);
    return null;
  }

  return user_id;
}

/**
 * Delete a password reset token
 *
 * @param token - Reset token
 */
export async function deletePasswordResetToken(token: string): Promise<void> {
  await sql`
    DELETE FROM password_reset_tokens
    WHERE token = ${token}
  `;
}

/**
 * Delete all expired password reset tokens (cleanup)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  await sql`
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW()
  `;
}
