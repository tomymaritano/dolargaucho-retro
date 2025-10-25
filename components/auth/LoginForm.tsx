/**
 * LoginForm Component
 *
 * Extracted from pages/auth.tsx
 * Handles login form UI and user interaction
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/Button/Button';
import { useLoginForm } from '@/hooks/useLoginForm';

export function LoginForm() {
  const {
    email,
    password,
    error,
    loading,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();

  return (
    <motion.form
      key="login"
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
            className="w-full px-4 py-3 pl-10 rounded-lg bg-panel/10 border border-border
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
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-panel/10 border border-border
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
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
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
  );
}
