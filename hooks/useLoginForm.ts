/**
 * useLoginForm Hook
 *
 * Manages login form state, validation, and submission
 * Extracted from pages/auth.tsx for reusability
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { validateLoginForm } from '@/lib/auth/validation';

export function useLoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validation
      const validation = validateLoginForm({ email, password });
      if (!validation.valid) {
        setError(validation.error || 'Error de validación');
        return;
      }

      setLoading(true);

      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useLoginForm] Starting login...');
        }

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useLoginForm] Login failed:', signInError);
          }
          setError(signInError);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useLoginForm] Login successful!');
          }
          const redirect = router.query.redirect as string;
          setTimeout(() => {
            router.push(redirect || '/dashboard');
          }, 500);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useLoginForm] Unexpected error:', err);
        }
        setError('Error al iniciar sesión. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, signIn, router]
  );

  return {
    email,
    password,
    error,
    loading,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
    resetForm,
  };
}
