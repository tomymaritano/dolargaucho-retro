/**
 * Authentication Form Validation Utilities
 *
 * Pure validation functions for email, password, and nickname
 * Extracted from pages/auth.tsx for reusability and testability
 */

/**
 * Validates email format with robust regex
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  // More robust email regex that matches RFC 5322 spec
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password requirements
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Por favor ingresa una contraseña' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valid: true };
};

/**
 * Validates nickname format and length
 * @param nickname - Nickname to validate (optional field)
 * @returns Validation result with error message if invalid
 */
export const validateNickname = (nickname: string): { valid: boolean; error?: string } => {
  if (!nickname || nickname.length === 0) {
    return { valid: true }; // Nickname is optional
  }

  if (nickname.length < 3) {
    return { valid: false, error: 'El nickname debe tener al menos 3 caracteres' };
  }

  if (nickname.length > 20) {
    return { valid: false, error: 'El nickname no puede tener más de 20 caracteres' };
  }

  const nicknameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      valid: false,
      error: 'El nickname solo puede contener letras, números, guiones y guiones bajos',
    };
  }

  return { valid: true };
};

/**
 * Validates full signup form data
 * @param data - Signup form data
 * @returns Validation result with error message if invalid
 */
export const validateSignupForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
}): { valid: boolean; error?: string } => {
  const { email, password, confirmPassword, name, nickname } = data;

  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Por favor ingresa un email válido' };
  }

  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Por favor ingresa tu nombre' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Las contraseñas no coinciden' };
  }

  const nicknameValidation = validateNickname(nickname);
  if (!nicknameValidation.valid) {
    return nicknameValidation;
  }

  return { valid: true };
};

/**
 * Validates login form data
 * @param data - Login form data
 * @returns Validation result with error message if invalid
 */
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): { valid: boolean; error?: string } => {
  const { email, password } = data;

  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Por favor ingresa un email válido' };
  }

  if (!password || password.trim().length === 0) {
    return { valid: false, error: 'Por favor ingresa tu contraseña' };
  }

  return { valid: true };
};
