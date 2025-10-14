'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaDatabase,
  FaUser,
  FaEnvelope,
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

/**
 * Página de Testing y Debug del Sistema de Autenticación
 *
 * URL: http://localhost:3000/test-auth
 *
 * Esta página permite verificar:
 * - Estado del sistema de auth
 * - Conexión con Supabase
 * - Tablas de la base de datos
 * - Funcionalidad de login/registro
 * - Captura de leads
 */
export default function TestAuthPage() {
  const { user, loading, isDemoMode, signIn, signUp, signOut } = useAuth();

  const [testResults, setTestResults] = useState<{
    supabaseConnection?: boolean;
    userPreferencesTable?: boolean;
    leadsTable?: boolean;
    authWorks?: boolean;
  }>({});

  const [testEmail, setTestEmail] = useState('test@dolargaucho.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [testName, setTestName] = useState('Usuario Test');
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');
  const [testSuccess, setTestSuccess] = useState('');

  // Test 1: Verificar conexión con Supabase
  const testSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('leads').select('count').limit(1);

      if (error && error.code !== 'PGRST116') {
        // Error que no sea "no rows returned"
        setTestResults((prev) => ({ ...prev, supabaseConnection: false }));
        return false;
      }

      setTestResults((prev) => ({ ...prev, supabaseConnection: true }));
      return true;
    } catch {
      setTestResults((prev) => ({ ...prev, supabaseConnection: false }));
      return false;
    }
  };

  // Test 2: Verificar tabla user_preferences
  const testUserPreferencesTable = async () => {
    try {
      const { error } = await supabase.from('user_preferences').select('count').limit(1);

      const exists = !error || error.code === 'PGRST116';
      setTestResults((prev) => ({ ...prev, userPreferencesTable: exists }));
      return exists;
    } catch {
      setTestResults((prev) => ({ ...prev, userPreferencesTable: false }));
      return false;
    }
  };

  // Test 3: Verificar tabla leads
  const testLeadsTable = async () => {
    try {
      const { error } = await supabase.from('leads').select('count').limit(1);

      const exists = !error || error.code === 'PGRST116';
      setTestResults((prev) => ({ ...prev, leadsTable: exists }));
      return exists;
    } catch {
      setTestResults((prev) => ({ ...prev, leadsTable: false }));
      return false;
    }
  };

  // Test 4: Probar registro de usuario
  const testSignUp = async () => {
    setTestLoading(true);
    setTestError('');
    setTestSuccess('');

    try {
      const { error } = await signUp(testEmail, testPassword, { name: testName });

      if (error) {
        if (
          error.message?.includes('already registered') ||
          error.message?.includes('already exists')
        ) {
          setTestSuccess('✅ Usuario ya existe (esto es OK para testing)');
          setTestResults((prev) => ({ ...prev, authWorks: true }));
        } else {
          setTestError(error.message || 'Error al registrar usuario');
          setTestResults((prev) => ({ ...prev, authWorks: false }));
        }
      } else {
        setTestSuccess('✅ Usuario registrado exitosamente');
        setTestResults((prev) => ({ ...prev, authWorks: true }));
      }
    } catch {
      setTestError('Error inesperado al registrar usuario');
      setTestResults((prev) => ({ ...prev, authWorks: false }));
    } finally {
      setTestLoading(false);
    }
  };

  // Test 5: Probar login de usuario
  const testSignIn = async () => {
    setTestLoading(true);
    setTestError('');
    setTestSuccess('');

    try {
      const { error } = await signIn(testEmail, testPassword);

      if (error) {
        setTestError(error.message || 'Error al iniciar sesión');
        setTestResults((prev) => ({ ...prev, authWorks: false }));
      } else {
        setTestSuccess('✅ Login exitoso');
        setTestResults((prev) => ({ ...prev, authWorks: true }));
      }
    } catch {
      setTestError('Error inesperado al iniciar sesión');
      setTestResults((prev) => ({ ...prev, authWorks: false }));
    } finally {
      setTestLoading(false);
    }
  };

  // Test 6: Probar API de leads
  const testLeadsAPI = async () => {
    setTestLoading(true);
    setTestError('');
    setTestSuccess('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test-${Date.now()}@example.com`,
          name: 'Test Lead',
          source: 'cta',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestSuccess('✅ API de leads funciona correctamente');
      } else {
        setTestError(`Error en API: ${data.error || 'Unknown'}`);
      }
    } catch {
      setTestError('Error al llamar API de leads');
    } finally {
      setTestLoading(false);
    }
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setTestResults({});
    setTestError('');
    setTestSuccess('');

    await testSupabaseConnection();
    await testUserPreferencesTable();
    await testLeadsTable();
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Test de Autenticación</h1>
          <p className="text-secondary">
            Página de debug para verificar el sistema de autenticación
          </p>
        </div>

        {/* Estado del Sistema */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FaDatabase className="text-accent-emerald" />
            Estado del Sistema
          </h2>

          <div className="space-y-3">
            {/* Modo */}
            <div className="flex items-center justify-between p-3 bg-dark-light rounded-lg">
              <span className="text-foreground">Modo de Operación:</span>
              <span
                className={`font-semibold ${isDemoMode ? 'text-accent-teal' : 'text-accent-emerald'}`}
              >
                {isDemoMode ? '🎭 Demo (localStorage)' : '🔐 Producción (Supabase)'}
              </span>
            </div>

            {/* Usuario actual */}
            <div className="flex items-center justify-between p-3 bg-dark-light rounded-lg">
              <span className="text-foreground">Usuario Autenticado:</span>
              {loading ? (
                <FaSpinner className="animate-spin text-accent-emerald" />
              ) : user ? (
                <span className="text-accent-emerald flex items-center gap-2">
                  <FaCheckCircle />
                  {user.email}
                </span>
              ) : (
                <span className="text-secondary flex items-center gap-2">
                  <FaTimesCircle />
                  No autenticado
                </span>
              )}
            </div>

            {/* Supabase URL */}
            <div className="flex items-center justify-between p-3 bg-dark-light rounded-lg">
              <span className="text-foreground">Supabase Configurado:</span>
              <span
                className={`font-semibold ${!isDemoMode ? 'text-accent-emerald' : 'text-secondary'}`}
              >
                {!isDemoMode ? '✅ Sí' : '❌ No (usar .env.local)'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tests de Base de Datos */}
        {!isDemoMode && (
          <Card variant="elevated" padding="lg">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaDatabase className="text-accent-emerald" />
              Tests de Base de Datos
            </h2>

            <div className="space-y-4">
              <Button onClick={runAllTests} variant="primary" className="w-full">
                Ejecutar Tests de DB
              </Button>

              <div className="space-y-2">
                <TestResult label="Conexión con Supabase" result={testResults.supabaseConnection} />
                <TestResult
                  label="Tabla user_preferences"
                  result={testResults.userPreferencesTable}
                />
                <TestResult label="Tabla leads" result={testResults.leadsTable} />
              </div>

              {Object.keys(testResults).length > 0 && (
                <div className="mt-4 p-4 bg-dark-light rounded-lg">
                  <p className="text-sm text-secondary">
                    {Object.values(testResults).every((v) => v === true)
                      ? '✅ Todas las tablas están configuradas correctamente'
                      : '⚠️ Algunas tablas no están disponibles. Ejecuta el script SQL en Supabase.'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tests de Autenticación */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FaUser className="text-accent-emerald" />
            Tests de Autenticación
          </h2>

          <div className="space-y-4">
            {/* Inputs */}
            <div className="space-y-3">
              <Input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Nombre"
                disabled={testLoading || !!user}
              />
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email"
                disabled={testLoading || !!user}
              />
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Contraseña"
                disabled={testLoading || !!user}
              />
            </div>

            {/* Messages */}
            {testError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{testError}</p>
              </div>
            )}

            {testSuccess && (
              <div className="p-3 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
                <p className="text-sm text-accent-emerald">{testSuccess}</p>
              </div>
            )}

            {/* Buttons */}
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testSignUp} variant="primary" disabled={testLoading}>
                  {testLoading ? <FaSpinner className="animate-spin" /> : 'Test Registro'}
                </Button>
                <Button onClick={testSignIn} variant="secondary" disabled={testLoading}>
                  {testLoading ? <FaSpinner className="animate-spin" /> : 'Test Login'}
                </Button>
              </div>
            ) : (
              <Button onClick={signOut} variant="secondary" className="w-full">
                Cerrar Sesión
              </Button>
            )}
          </div>
        </Card>

        {/* Test API de Leads */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FaEnvelope className="text-accent-emerald" />
            Test API de Leads
          </h2>

          <Button
            onClick={testLeadsAPI}
            variant="primary"
            className="w-full"
            disabled={testLoading}
          >
            {testLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Probando...
              </>
            ) : (
              'Probar Captura de Lead'
            )}
          </Button>
        </Card>

        {/* Instrucciones */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Instrucciones</h2>
          <div className="space-y-3 text-secondary text-sm">
            <p>
              <strong className="text-foreground">1. Verificar modo:</strong> Si estás en modo demo,
              los datos se guardan en localStorage.
            </p>
            <p>
              <strong className="text-foreground">2. Configurar Supabase:</strong> Copia el archivo{' '}
              <code className="text-accent-emerald">supabase/schema.sql</code> en el SQL Editor de
              Supabase.
            </p>
            <p>
              <strong className="text-foreground">3. Ejecutar tests:</strong> Usa los botones arriba
              para verificar que todo funcione.
            </p>
            <p>
              <strong className="text-foreground">4. Verificar resultados:</strong> Todos los tests
              deben pasar (✅) para confirmar que el sistema funciona.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar resultados de tests
function TestResult({ label, result }: { label: string; result?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-dark-light rounded-lg">
      <span className="text-foreground">{label}</span>
      {result === undefined ? (
        <span className="text-secondary">Pendiente</span>
      ) : result ? (
        <span className="text-accent-emerald flex items-center gap-2">
          <FaCheckCircle />
          Funciona
        </span>
      ) : (
        <span className="text-red-400 flex items-center gap-2">
          <FaTimesCircle />
          Error
        </span>
      )}
    </div>
  );
}
