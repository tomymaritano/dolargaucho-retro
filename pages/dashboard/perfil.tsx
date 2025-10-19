/**
 * User Profile Page
 *
 * Allows users to edit their profile information and preferences
 */

import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRequireAuth } from '@/lib/contexts/AuthContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCheckCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useRequireAuth();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    setProfileLoading(true);

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        setProfileSuccess(true);
        await refreshUser();
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(data.error || 'Error al actualizar el perfil');
      }
    } catch {
      setProfileError('Error al actualizar el perfil. Por favor intenta de nuevo.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || 'Error al cambiar la contraseña');
      }
    } catch {
      setPasswordError('Error al cambiar la contraseña. Por favor intenta de nuevo.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-secondary">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Mi Perfil | Dólar Gaucho</title>
        <meta name="description" content="Gestiona tu perfil y preferencias" />
      </Head>

      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
            <p className="text-secondary">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand/20 rounded-lg">
                  <FaUser className="text-xl text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Información Personal</h2>
                  <p className="text-sm text-secondary">Actualiza tu nombre y email</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                      placeholder="Tu nombre"
                      disabled={profileLoading}
                    />
                  </div>
                </div>

                {/* Email */}
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
                      className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                      placeholder="tu@email.com"
                      disabled={profileLoading}
                    />
                  </div>
                </div>

                {/* Success Message */}
                {profileSuccess && (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <p className="text-sm text-success">Perfil actualizado correctamente</p>
                  </div>
                )}

                {/* Error Message */}
                {profileError && (
                  <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
                    <p className="text-sm text-error">{profileError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-background-dark rounded-lg font-semibold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <FaSave className="text-sm" />
                  {profileLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </Card>

            {/* Change Password */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand/20 rounded-lg">
                  <FaLock className="text-xl text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Cambiar Contraseña</h2>
                  <p className="text-sm text-secondary">Actualiza tu contraseña de acceso</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password */}
                <div className="group">
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                      placeholder="••••••••"
                      disabled={passwordLoading}
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="group">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                      placeholder="••••••••"
                      disabled={passwordLoading}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground placeholder-secondary"
                      placeholder="••••••••"
                      disabled={passwordLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-3 bg-brand/5 border border-brand/20 rounded-lg">
                  <p className="text-xs text-secondary">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2">
                    <FaCheckCircle className="text-success" />
                    <p className="text-sm text-success">Contraseña actualizada correctamente</p>
                  </div>
                )}

                {/* Error Message */}
                {passwordError && (
                  <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
                    <p className="text-sm text-error">{passwordError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-background-dark rounded-lg font-semibold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <FaSave className="text-sm" />
                  {passwordLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
              </form>
            </Card>

            {/* Account Info */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-4">Información de la Cuenta</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-secondary">Usuario ID</span>
                  <span className="text-foreground font-mono text-xs">{user?.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-secondary">Cuenta creada</span>
                  <span className="text-foreground">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
