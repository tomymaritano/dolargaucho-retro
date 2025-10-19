/**
 * Forgot Password Page
 *
 * Allows users to request a password reset link
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';
import { AuthLayout } from '@/components/layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
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
    <AuthLayout
      title="Recuperar Contraseña"
      heading={success ? 'Email Enviado' : '¿Olvidaste tu contraseña?'}
      subtitle={
        !success
          ? 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'
          : undefined
      }
      showBackToHome={!success}
    >
      <Card variant="elevated" padding="lg">
        {success ? (
          // Success State
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
              <FaCheckCircle className="text-4xl text-success" />
            </div>
            <p className="text-secondary mb-6">
              Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu
              contraseña.
            </p>
            <p className="text-sm text-secondary mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones del email.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-light transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Volver al login
            </Link>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-brand transition-colors"
              >
                <FaArrowLeft className="text-xs" />
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}
