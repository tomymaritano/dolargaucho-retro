'use client';

/**
 * Unified Auth Page - Login & Signup with Tabs
 *
 * Better UX: Users can switch between login and signup without navigation
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NavbarFloating } from '@/components/NavbarFloating';
import Aurora from '@/components/ui/Aurora/Aurora';
import Head from 'next/head';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaLock, FaSpinner, FaUser } from 'react-icons/fa';

type AuthTab = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
      console.log('[AuthPage] User already logged in, redirecting...');
      const redirect = router.query.redirect as string;
      window.location.href = redirect || '/dashboard';
    }
  }, [user, router.query.redirect, mounted]);

  // Check for tab query param
  useEffect(() => {
    const tab = router.query.tab as string;
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [router.query.tab]);

  // Optimized handlers with useCallback to prevent re-renders
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setEmail(e.target.value);
    });
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setPassword(e.target.value);
    });
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setName(e.target.value);
    });
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // If already authenticated, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-brand" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
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
      console.log('[AuthPage] Starting login...');
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('[AuthPage] Login failed:', signInError);
        setError(signInError);
      } else {
        console.log('[AuthPage] Login successful!');
        const redirect = router.query.redirect as string;
        setTimeout(() => {
          window.location.href = redirect || '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.error('[AuthPage] Unexpected error:', err);
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('[AuthPage] Starting signup...');
      const { error: signUpError } = await signUp(email, password, name);

      if (signUpError) {
        console.error('[AuthPage] Signup failed:', signUpError);
        setError(signUpError);
      } else {
        console.log('[AuthPage] Signup successful!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.error('[AuthPage] Unexpected error:', err);
      setError('Error al crear cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'} | Dólar Gaucho</title>
      </Head>

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Same navbar as marketing site */}
        <NavbarFloating />

        {/* Aurora background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <Aurora
            colorStops={['#0047FF', '#8B5CF6', '#6366F1']}
            amplitude={1.2}
            blend={0.6}
            speed={0.8}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-32">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-secondary hover:text-foreground hover:bg-white/5'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setError('');
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'signup'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-secondary hover:text-foreground hover:bg-white/5'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* Form Card */}
            <Card variant="elevated" padding="lg">
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="grid grid-cols-1 gap-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
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
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-foreground"
                      >
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
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  {/* Error message placeholder - maintains consistent height */}
                  <div className="min-h-[52px]">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                    loadingText="Iniciando sesión..."
                  >
                    Iniciar sesión
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="grid grid-cols-1 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Nombre completo
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Juan Pérez"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="tu@email.com"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Error message placeholder - maintains consistent height */}
                  <div className="min-h-[52px]">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                    loadingText="Creando cuenta..."
                  >
                    Crear cuenta gratis
                  </Button>

                  {/* Terms */}
                  <p className="text-xs text-secondary text-center -mt-2">
                    Al crear una cuenta, aceptas nuestros{' '}
                    <Link href="#" className="text-brand hover:text-brand-light">
                      términos y condiciones
                    </Link>
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
