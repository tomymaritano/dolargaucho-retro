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

export function NavbarFloating() {
  // For landing page, we don't have auth context, so we show "Iniciar Sesión"
  // This component is used both in landing and auth pages
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Try to get auth state if available (only on client side)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we're in an authenticated page
      const checkAuth = async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const {
            data: { session },
          } = await supabase.auth.getSession();
          setUser(session?.user || null);
        } catch {
          // AuthProvider not available, stay as guest
          setUser(null);
        }
        setLoading(false);
      };
      checkAuth();
    }
  }, []);

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
