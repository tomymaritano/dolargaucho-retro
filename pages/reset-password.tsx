/**
 * Reset Password Page
 *
 * Allows users to set a new password using a reset token
 */

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if token exists
  useEffect(() => {
    if (router.isReady && !token) {
      setError('Token inválido o faltante');
    }
  }, [router.isReady, token]);

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Error al restablecer la contraseña. Por favor intenta de nuevo.');
      }
    } catch {
      setError('Error al procesar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Restablecer Contraseña | Dólar Gaucho</title>
        <meta name="description" content="Crea una nueva contraseña para tu cuenta" />
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background-dark to-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-display font-bold gradient-text">Dólar Gaucho</h1>
              <p className="text-sm text-secondary mt-1">Dashboard Profesional</p>
            </Link>
          </div>

          <Card variant="elevated" padding="lg">
            {success ? (
              // Success State
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
                  <FaCheckCircle className="text-4xl text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Contraseña Actualizada</h2>
                <p className="text-secondary mb-6">
                  Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.
                </p>
                <p className="text-sm text-secondary">Redirigiendo al login...</p>
              </div>
            ) : (
              // Form State
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Nueva Contraseña</h2>
                  <p className="text-secondary text-sm">Ingresa tu nueva contraseña</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password Input */}
                  <div className="group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                        placeholder="Mínimo 8 caracteres"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="group">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                        placeholder="Repite tu contraseña"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-3 bg-brand/5 border border-brand/20 rounded-lg">
                    <p className="text-xs text-secondary">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
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
                    disabled={loading || !token}
                    className="w-full py-3 bg-brand text-background-dark rounded-lg font-semibold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              </>
            )}
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-secondary mt-6">
            © 2024 Dólar Gaucho. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  );
}
