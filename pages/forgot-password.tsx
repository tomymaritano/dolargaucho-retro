'use client';

/**
 * Forgot Password Page
 *
 * Allows users to request a password reset link
 * Matches the design of auth.tsx for consistency
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NavbarFloating } from '@/components/NavbarFloating';
import Aurora from '@/components/ui/Aurora/Aurora';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { SEO } from '@/components/SEO';

// Memoize Aurora to prevent re-renders on every keystroke
const MemoizedAurora = React.memo(Aurora);
const MemoizedNavbar = React.memo(NavbarFloating);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Error al enviar el email. Por favor intenta de nuevo.');
      }
    } catch {
      setError('Error al procesar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Recuperar Contraseña"
        description="Recuperá tu contraseña de Dólar Gaucho. Te enviaremos un enlace por email para restablecer tu contraseña de forma segura."
        noindex={true}
      />

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Same navbar as auth page */}
        <MemoizedNavbar />

        {/* Aurora background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <MemoizedAurora
            colorStops={['#0047FF', '#8B5CF6', '#6366F1']}
            amplitude={1.2}
            blend={0.6}
            speed={0.8}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center p-4 pt-32">
          <div className="w-full max-w-md mt-12">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {success ? '¡Email Enviado!' : '¿Olvidaste tu contraseña?'}
              </h1>
              {!success && (
                <p className="text-sm text-secondary">
                  Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña
                </p>
              )}
            </div>

            {/* Form Card */}
            <Card variant="elevated" padding="lg">
              {success ? (
                // Success State
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                    <FaCheckCircle className="text-4xl text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-foreground">
                      Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu
                      contraseña.
                    </p>
                    <p className="text-sm text-secondary">
                      Revisá tu bandeja de entrada y seguí las instrucciones del email.
                    </p>
                  </div>
                  <Link href="/auth">
                    <Button variant="primary" className="w-full">
                      <FaArrowLeft className="text-sm" />
                      Volver al login
                    </Button>
                  </Link>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                        disabled={loading}
                        autoComplete="email"
                        required
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
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                    loadingText="Enviando enlace..."
                  >
                    Enviar enlace de recuperación
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <Link
                      href="/auth"
                      className="inline-flex items-center gap-2 text-sm text-secondary hover:text-brand transition-colors"
                    >
                      <FaArrowLeft className="text-xs" />
                      Volver al login
                    </Link>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
