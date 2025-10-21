'use client';

/**
 * NavbarFloating - Minimal floating navbar
 *
 * Features:
 * - Floating design with padding from edges
 * - Minimal design: Logo + Theme Toggle + Auth button (context-aware)
 * - Glass morphism background
 * - Rounded borders
 * - Detects user session and shows "Iniciar Sesión" or "Ver Dashboard"
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { ChangelogButton } from './ChangelogButton';
import { RoadmapButton } from './RoadmapButton';
import { NavbarSearch } from './NavbarSearch';

export function NavbarFloating() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Check auth state by calling the API endpoint
  const checkAuth = React.useCallback(async () => {
    try {
      console.log('[NavbarFloating] Checking auth state...');
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          console.log('[NavbarFloating] User authenticated:', data.user.email);
          setUser(data.user);
        } else {
          console.log('[NavbarFloating] No user session');
          setUser(null);
        }
      } else {
        console.log('[NavbarFloating] Auth check failed');
        setUser(null);
      }
    } catch (error) {
      console.error('[NavbarFloating] Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check auth when window regains focus (e.g., user returns from auth page)
  React.useEffect(() => {
    const handleFocus = () => {
      console.log('[NavbarFloating] Window focused, rechecking auth...');
      checkAuth();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkAuth]);

  // Also listen for storage events (in case auth changes in another tab)
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth-change') {
        console.log('[NavbarFloating] Auth change detected in storage');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkAuth]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto"
    >
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/5 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center group">
            <AnimatedLogo size={32} />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <NavbarSearch />
            <ChangelogButton />
            <RoadmapButton />
            <ThemeToggle />

            {/* Auth Button - Context Aware */}
            {loading ? (
              <div className="px-4 py-2 text-sm font-medium bg-white/5 text-secondary rounded-lg flex items-center gap-2">
                <FaSpinner className="animate-spin text-xs" />
                <span className="hidden sm:inline">Cargando...</span>
              </div>
            ) : user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg shadow-sm shadow-black/10 hover:shadow hover:shadow-black/20 hover:bg-brand/90 transition-all"
              >
                Ver Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg shadow-sm shadow-black/10 hover:shadow hover:shadow-black/20 hover:bg-brand/90 transition-all"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
