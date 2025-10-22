/**
 * useSignupForm Hook
 *
 * Manages signup form state, validation, and submission
 * Extracted from pages/auth.tsx for reusability
 */

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateSignupForm, validateNickname } from '@/lib/auth/validation';

export function useSignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nicknameCheckTimer = useRef<NodeJS.Timeout | null>(null);

  const checkNicknameAvailability = useCallback(async (nick: string) => {
    if (nick.length < 3) {
      setNicknameAvailable(null);
      return;
    }

    setCheckingNickname(true);

    try {
      const response = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nick)}`);
      const data = await response.json();

      if (response.ok && 'available' in data) {
        setNicknameAvailable(data.available);
      } else {
        setNicknameAvailable(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking nickname:', error);
      }
      setNicknameAvailable(null);
    } finally {
      setCheckingNickname(false);
    }
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleNicknameChange = useCallback(
    (value: string) => {
      setNickname(value);
      setNicknameAvailable(null);

      // Clear previous timer
      if (nicknameCheckTimer.current) {
        clearTimeout(nicknameCheckTimer.current);
      }

      // Only check if nickname has at least 3 characters
      if (value.length >= 3) {
        nicknameCheckTimer.current = setTimeout(() => {
          checkNicknameAvailability(value);
        }, 500); // 500ms debounce
      }
    },
    [checkNicknameAvailability]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setNickname('');
    setNicknameAvailable(null);
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validation
      const validation = validateSignupForm({ email, password, confirmPassword, name, nickname });
      if (!validation.valid) {
        setError(validation.error || 'Error de validación');
        return;
      }

      // Check nickname availability if provided
      if (nickname && nicknameAvailable === false) {
        setError('El nickname elegido ya está en uso');
        return;
      }

      setLoading(true);

      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useSignupForm] Starting signup...');
        }

        const { error: signUpError } = await signUp(email, password, name, nickname || undefined);

        if (signUpError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useSignupForm] Signup failed:', signUpError);
          }
          setError(signUpError);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useSignupForm] Signup successful!');
          }
          setSuccessMessage(
            '¡Cuenta creada exitosamente! 🎉 Revisa tu email para el mensaje de bienvenida.'
          );
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useSignupForm] Unexpected error:', err);
        }
        setError('Error al crear cuenta. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, confirmPassword, name, nickname, nicknameAvailable, signUp, router]
  );

  return {
    email,
    password,
    confirmPassword,
    name,
    nickname,
    nicknameAvailable,
    checkingNickname,
    error,
    successMessage,
    loading,
    showPassword,
    showConfirmPassword,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNameChange,
    handleNicknameChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    resetForm,
  };
}
