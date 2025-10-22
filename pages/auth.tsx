'use client';

/**
 * Unified Auth Page - Login & Signup with Tabs
 *
 * Refactored to comply with React principles (max 200 lines)
 * Logic extracted to hooks, UI extracted to components
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NavbarFloating } from '@/components/NavbarFloating';
import Aurora from '@/components/ui/Aurora/Aurora';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { AuthTabs, type AuthTab } from '@/components/auth/AuthTabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

// Memoize heavy components to prevent re-renders
const MemoizedAurora = React.memo(Aurora);
const MemoizedNavbar = React.memo(NavbarFloating);

// Aurora props as constants (prevent recreation on every render)
const AURORA_PROPS = {
  colorStops: ['#0047FF', '#8B5CF6', '#6366F1'] as [string, string, string],
  amplitude: 1.2,
  blend: 0.6,
  speed: 0.8,
} as const;

export default function AuthPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!mounted || !user) return;

    console.log('[AuthPage] User already logged in, redirecting...');
    const redirect = router.query.redirect as string;
    router.push(redirect || '/dashboard');
  }, [user, router, mounted]);

  // Check for tab query param
  useEffect(() => {
    const tab = router.query.tab as string;
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [router.query.tab]);

  // If already authenticated, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-brand" />
      </div>
    );
  }

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
          <MemoizedAurora {...AURORA_PROPS} />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center p-4 pt-32">
          <div className="w-full max-w-md mt-12">
            {/* Tabs */}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Form Card */}
            <Card variant="elevated" padding="lg">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'login' ? <LoginForm key="login" /> : <SignupForm key="signup" />}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
