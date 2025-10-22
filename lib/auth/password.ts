/**
 * Password Hashing Utilities
 *
 * Provides secure password hashing and verification using bcrypt
 * with enterprise-level security (12 rounds)
 */

import bcrypt from 'bcryptjs';

/**
 * Salt rounds for bcrypt hashing
 * 12 rounds provides enterprise-level security
 * Takes ~250ms to hash, making brute-force attacks impractical
 */
const SALT_ROUNDS = 12;

/**
 * Minimum password length requirement
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Maximum password length to prevent DoS attacks
 */
export const MAX_PASSWORD_LENGTH = 128;

/**
 * Validate password meets security requirements
 *
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña no puede exceder ${MAX_PASSWORD_LENGTH} caracteres`,
    };
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra y un número',
    };
  }

  return { isValid: true };
}

/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password to hash
 * @returns Hashed password
 * @throws Error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
  // Validate password before hashing
  const validation = validatePassword(password);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    // If comparison fails, return false rather than throwing
    // This prevents timing attacks
    return false;
  }
}

/**
 * Check if a hashed password needs rehashing
 * (e.g., if salt rounds have increased)
 *
 * @param hashedPassword - Hashed password to check
 * @returns true if needs rehashing, false otherwise
 */
export function needsRehash(hashedPassword: string): boolean {
  try {
    const rounds = bcrypt.getRounds(hashedPassword);
    return rounds < SALT_ROUNDS;
  } catch (error) {
    // If we can't determine rounds, assume it needs rehashing
    return true;
  }
}
