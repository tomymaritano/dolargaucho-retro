/**
 * Auth helper functions
 * Utilities for authentication logic
 */

/**
 * Check if Supabase is properly configured
 * Uses function instead of module-level variable to prevent re-evaluation issues
 */
export function isSupabaseConfigured(): boolean {
  // Only check on client side
  if (typeof window === 'undefined') return false;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !!(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format auth error messages for display
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'Error desconocido';

  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;

    // Map common errors to Spanish
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Credenciales inválidas',
      'User already registered': 'El usuario ya está registrado',
      'Email not confirmed': 'Email no confirmado',
      'Invalid email': 'Email inválido',
      'Password is too weak': 'La contraseña es muy débil',
    };

    return errorMap[message] || message;
  }

  return 'Error desconocido';
}
