'use client';

/**
 * Unified Auth Page - Login & Signup with Tabs
 *
 * Better UX: Users can switch between login and signup without navigation
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NavbarFloating } from '@/components/NavbarFloating';
import Aurora from '@/components/ui/Aurora/Aurora';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaUserTag,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';

// Memoize heavy components to prevent re-renders on keystroke
const MemoizedAurora = React.memo(Aurora);
const MemoizedNavbar = React.memo(NavbarFloating);

type AuthTab = 'login' | 'signup';

// ============================================================================
// VALIDATION HELPERS (Pure functions outside component)
// ============================================================================

/**
 * Validates email format with robust regex
 */
const isValidEmail = (email: string): boolean => {
  // More robust email regex that matches RFC 5322 spec
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password requirements
 */
const validatePassword = (password: string): { valid: boolean; error?: string } => {
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
 */
const validateNickname = (nickname: string): { valid: boolean; error?: string } => {
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

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in (optimized to prevent unnecessary refreshes)
  useEffect(() => {
    // Early return if conditions not met
    if (!mounted || !user) return;

    console.log('[AuthPage] User already logged in, redirecting...');
    const redirect = router.query.redirect as string;

    // Use router.push instead of window.location.href to avoid full page refresh
    router.push(redirect || '/dashboard');
  }, [user, router, mounted]);

  // Check for tab query param
  useEffect(() => {
    const tab = router.query.tab as string;
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [router.query.tab]);

  // Debounce timer for nickname check
  const nicknameCheckTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Memoized nickname availability check to prevent recreation
  const checkNicknameAvailability = React.useCallback(async (nick: string) => {
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

  const handleNicknameChange = React.useCallback(
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

  // Memoized handlers to prevent re-renders on keystroke
  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleConfirmPasswordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    },
    []
  );

  // Handle tab change with state cleanup
  const handleTabChange = React.useCallback((tab: AuthTab) => {
    setActiveTab(tab);
    // Clean up form state to prevent confusion
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setNickname('');
    setNicknameAvailable(null);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

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
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Error de validación');
      return;
    }

    setLoading(true);

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthPage] Starting login...');
      }

      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthPage] Login failed:', signInError);
        }
        setError(signInError);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthPage] Login successful!');
        }
        const redirect = router.query.redirect as string;
        setTimeout(() => {
          router.push(redirect || '/dashboard');
        }, 500);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthPage] Unexpected error:', err);
      }
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }

    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Error de validación');
      return;
    }

    // Validate password match
    if (!confirmPassword) {
      setError('Por favor confirma tu contraseña');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validate nickname if provided
    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      setError(nicknameValidation.error || 'Error de validación');
      return;
    }

    if (nickname && nicknameAvailable === false) {
      setError('El nickname elegido ya está en uso');
      return;
    }

    setLoading(true);

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthPage] Starting signup...');
      }

      const { error: signUpError } = await signUp(email, password, name, nickname || undefined);

      if (signUpError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthPage] Signup failed:', signUpError);
        }
        setError(signUpError);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthPage] Signup successful!');
        }
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthPage] Unexpected error:', err);
      }
      setError('Error al crear cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        description={
          activeTab === 'login'
            ? 'Iniciá sesión en Dólar Gaucho para acceder a tu dashboard personalizado con cotizaciones del dólar, alertas y más.'
            : 'Creá tu cuenta gratis en Dólar Gaucho y accedé a análisis financiero completo, alertas personalizadas y seguimiento del dólar en tiempo real.'
        }
        noindex={true}
      />

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Same navbar as marketing site */}
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
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => handleTabChange('login')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-secondary hover:text-foreground hover:bg-white/5'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleTabChange('signup')}
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
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'login' ? (
                  <motion.form
                    key="login"
                    onSubmit={handleLogin}
                    className="grid grid-cols-1 gap-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
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
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="tu@email.com"
                          className="w-full px-4 py-3 pl-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="email"
                          required
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
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="current-password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="text-sm" />
                          ) : (
                            <FaEye className="text-sm" />
                          )}
                        </button>
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
                      loadingText="Iniciando sesión..."
                    >
                      Iniciar sesión
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    onSubmit={handleSignup}
                    className="grid grid-cols-1 gap-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
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
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={handleNameChange}
                          placeholder="Juan Pérez"
                          className="w-full px-4 py-3 pl-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="name"
                          required
                          minLength={2}
                        />
                      </div>
                    </div>

                    {/* Nickname (Optional) */}
                    <div>
                      <label
                        htmlFor="nickname"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Nickname{' '}
                        <span className="text-xs text-secondary font-normal">(opcional)</span>
                      </label>
                      <div className="relative">
                        <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                        <input
                          id="nickname"
                          type="text"
                          value={nickname}
                          onChange={(e) => handleNicknameChange(e.target.value)}
                          placeholder="tucoolnickname"
                          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="off"
                          minLength={3}
                          maxLength={20}
                        />
                        {/* Status Icon */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {checkingNickname && (
                            <FaSpinner className="animate-spin text-brand text-sm" />
                          )}
                          {!checkingNickname && nickname && nicknameAvailable === true && (
                            <FaCheck className="text-success text-sm" />
                          )}
                          {!checkingNickname && nickname && nicknameAvailable === false && (
                            <FaTimes className="text-error text-sm" />
                          )}
                        </div>
                      </div>
                      {/* Helper text */}
                      <p className="text-xs text-secondary mt-1">
                        Tu nombre visible en la comunidad. Si no eliges uno, usaremos tu nombre
                        completo.
                      </p>
                      {/* Validation messages */}
                      {nickname && nicknameAvailable === false && !checkingNickname && (
                        <p className="text-xs text-error mt-1 flex items-center gap-1">
                          <FaTimes className="flex-shrink-0" /> Este nickname ya está en uso
                        </p>
                      )}
                      {nickname && nicknameAvailable === true && !checkingNickname && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <FaCheck className="flex-shrink-0" /> Nickname disponible
                        </p>
                      )}
                      {nickname && nickname.length > 0 && nickname.length < 3 && (
                        <p className="text-xs text-warning mt-1">Mínimo 3 caracteres</p>
                      )}
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
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="tu@email.com"
                          className="w-full px-4 py-3 pl-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="email"
                          required
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
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="new-password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="text-sm" />
                          ) : (
                            <FaEye className="text-sm" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          placeholder="Repite tu contraseña"
                          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10
                                     focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none
                                     text-foreground placeholder-secondary transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                          autoComplete="new-password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                          }
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="text-sm" />
                          ) : (
                            <FaEye className="text-sm" />
                          )}
                        </button>
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
                      loadingText="Creando cuenta..."
                    >
                      Crear cuenta gratis
                    </Button>

                    {/* Terms */}
                    <p className="text-xs text-secondary text-center -mt-2">
                      Al crear una cuenta, aceptas nuestros términos y condiciones
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
