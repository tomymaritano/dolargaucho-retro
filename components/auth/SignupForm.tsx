/**
 * SignupForm Component
 *
 * Extracted from pages/auth.tsx
 * Handles signup form UI with nickname availability check
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserTag,
  FaSpinner,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button/Button';
import { useSignupForm } from '@/hooks/useSignupForm';

export const SignupForm = React.memo(function SignupForm() {
  const {
    email,
    password,
    confirmPassword,
    name,
    nickname,
    nicknameAvailable,
    checkingNickname,
    error,
    successMessage,
    loading,
    showPassword,
    showConfirmPassword,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNameChange,
    handleNicknameChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  } = useSignupForm();

  return (
    <motion.form
      key="signup"
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
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
            className="w-full px-4 py-3 pl-10 rounded-lg bg-panel/10 border border-border/5
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
        <label htmlFor="nickname" className="block text-sm font-medium text-foreground mb-2">
          Nickname <span className="text-xs text-secondary font-normal">(opcional)</span>
        </label>
        <div className="relative">
          <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder="tucoolnickname"
            className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-panel/10 border border-border/5
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
            {checkingNickname && <FaSpinner className="animate-spin text-brand text-sm" />}
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
          Tu nombre visible en la comunidad. Si no eliges uno, usaremos tu nombre completo.
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
        <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
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
            className="w-full px-4 py-3 pl-10 rounded-lg bg-panel/10 border border-border/5
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
        <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
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
            className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-panel/10 border border-border/5
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
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
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
            className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-panel/10 border border-border/5
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
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

      {/* Success message */}
      {successMessage && (
        <div className="p-3 bg-brand/10 border border-brand/30 rounded-lg">
          <p className="text-sm text-brand font-medium">{successMessage}</p>
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
  );
});
