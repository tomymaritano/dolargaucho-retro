'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('[LoginPage] User already logged in, redirecting...');
      const redirect = router.query.redirect as string;
      window.location.href = redirect || '/dashboard';
    }
  }, [user, router.query.redirect, mounted]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      console.log('[LoginPage] Starting login...');
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('[LoginPage] Login failed:', signInError);
        setError(signInError);
      } else {
        console.log('[LoginPage] Login successful!');
        // Use window.location.href for full page reload to ensure cookie propagation
        const redirect = router.query.redirect as string;
        setTimeout(() => {
          console.log('[LoginPage] Redirecting to:', redirect || '/dashboard');
          window.location.href = redirect || '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.error('[LoginPage] Unexpected error:', err);
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      heading="Bienvenido"
      subtitle="Inicia sesión para acceder a tu dashboard"
      maxWidth="md"
      footerAction={
        <p className="text-secondary">
          ¿No tienes cuenta?{' '}
          <Link
            href="/signup"
            className="text-brand hover:text-brand-light transition-colors font-medium"
          >
            Regístrate gratis
          </Link>
        </p>
      }
    >
      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand hover:text-brand-light transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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
                autoComplete="current-password"
              />
            </div>
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
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
