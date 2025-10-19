/**
 * Signup Page
 *
 * User registration form with email, password, and name fields
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function SignupPage() {
  const { signUp, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && user) {
      console.log('[SignupPage] User already logged in, redirecting...');
      window.location.href = '/dashboard';
    }
  }, [user, mounted]);

  // If already authenticated, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-brand" />
      </div>
    );
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      console.log('[SignupPage] Starting registration...');
      const { error: signUpError } = await signUp(email, password, name || undefined);

      if (signUpError) {
        console.error('[SignupPage] Registration failed:', signUpError);
        setError(signUpError);
      } else {
        console.log('[SignupPage] Registration successful!');
        // Use window.location.href for full page reload to ensure cookie propagation
        setTimeout(() => {
          console.log('[SignupPage] Redirecting to dashboard');
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.error('[SignupPage] Unexpected error:', err);
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      heading="Únete a Dólar Gaucho"
      subtitle="Crea tu cuenta para acceder a herramientas exclusivas"
      maxWidth="md"
      footerAction={
        <p className="text-secondary">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-brand hover:text-brand-light transition-colors font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name (Optional) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nombre <span className="text-xs text-secondary">(opcional)</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="pl-10"
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-red-400">*</span>
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
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña <span className="text-red-400">*</span>
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
                required
              />
            </div>
            {password && (
              <div className="mt-2 flex items-center gap-2">
                {isStrongPassword(password) ? (
                  <>
                    <FaCheckCircle className="text-success text-sm" />
                    <p className="text-xs text-success">Contraseña segura</p>
                  </>
                ) : (
                  <p className="text-xs text-secondary">Mínimo 8 caracteres</p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Confirmar Contraseña <span className="text-red-400">*</span>
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
                required
              />
            </div>
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {password === confirmPassword ? (
                  <>
                    <FaCheckCircle className="text-success text-sm" />
                    <p className="text-xs text-success">Las contraseñas coinciden</p>
                  </>
                ) : (
                  <p className="text-xs text-error">Las contraseñas no coinciden</p>
                )}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-secondary text-center">
            Al crear una cuenta, aceptas nuestros{' '}
            <Link href="/terms" className="text-brand hover:underline">
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/privacy" className="text-brand hover:underline">
              Política de Privacidad
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
