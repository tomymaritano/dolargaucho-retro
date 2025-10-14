'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaLock, FaUser, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const { signUp, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && user) {
      console.log('[RegisterPage] User already logged in, redirecting...');
      window.location.href = '/dashboard';
    }
  }, [user, mounted]);

  // If already authenticated, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-accent-emerald" />
      </div>
    );
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener letras y números');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      console.log('[RegisterPage] Starting registration...');
      const { error: signUpError } = await signUp(email, password, name);

      if (signUpError) {
        console.error('[RegisterPage] Registration failed:', signUpError);
        setError(signUpError);
      } else {
        console.log('[RegisterPage] Registration successful!');
        setSuccess(true);
        // Use window.location.href for full page reload to ensure cookie propagation
        // This prevents redirect loops caused by Next.js data prefetching
        setTimeout(() => {
          console.log('[RegisterPage] Redirecting to dashboard...');
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (err) {
      console.error('[RegisterPage] Unexpected error:', err);
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dólar Gaucho</h1>
          <p className="text-secondary">
            Crea tu cuenta y accede a funciones exclusivas
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-accent-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-emerald"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Cuenta creada!</h3>
              <p className="text-secondary mb-6">
                Tu cuenta ha sido creada exitosamente. Redirigiendo al dashboard...
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="primary"
                className="w-full"
              >
                Ir al dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-xs text-secondary mt-1">
                  Mínimo 8 caracteres, debe incluir letras y números
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border bg-dark-light text-accent-emerald focus:ring-accent-emerald/50"
                    disabled={loading}
                  />
                  <span className="text-sm text-foreground">
                    Acepto los{' '}
                    <Link href="/terms" className="text-accent-emerald hover:underline">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacy" className="text-accent-emerald hover:underline">
                      política de privacidad
                    </Link>
                  </span>
                </label>

                {/* Newsletter */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border bg-dark-light text-accent-emerald focus:ring-accent-emerald/50"
                    disabled={loading}
                  />
                  <span className="text-sm text-secondary">
                    Quiero recibir actualizaciones y novedades por email
                  </span>
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>
          )}
        </Card>

        {/* Sign in link */}
        {!success && (
          <div className="mt-6 text-center">
            <p className="text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="text-accent-emerald hover:text-accent-teal transition-colors font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-secondary hover:text-foreground transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
