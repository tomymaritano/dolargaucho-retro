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
 * - Mobile-responsive with hamburger menu and slide-in drawer
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaBars, FaTimes } from 'react-icons/fa';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { ChangelogButton } from './ChangelogButton';
import { RoadmapButton } from './RoadmapButton';
import { NavbarSearch } from './NavbarSearch';

export function NavbarFloating() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto"
      >
        <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/5 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <Link href="/" className="flex items-center group">
              <AnimatedLogo size={32} />
            </Link>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3">
              <NavbarSearch />
              <ChangelogButton />
              <RoadmapButton />
              <ThemeToggle />

              {/* Auth Button - Context Aware */}
              {loading ? (
                <div className="px-4 py-2 text-sm font-medium bg-white/5 text-secondary rounded-lg flex items-center gap-2">
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Cargando...</span>
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

            {/* Mobile Actions - Visible only on mobile */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground hover:text-brand transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-white/10 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <span className="text-lg font-semibold">Menú</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {/* Search */}
                  <div onClick={() => setMobileMenuOpen(false)}>
                    <NavbarSearch />
                  </div>

                  {/* Changelog Button */}
                  <div onClick={() => setMobileMenuOpen(false)}>
                    <ChangelogButton />
                  </div>

                  {/* Roadmap Button */}
                  <div onClick={() => setMobileMenuOpen(false)}>
                    <RoadmapButton />
                  </div>

                  {/* Auth Button */}
                  <div className="pt-4 border-t border-white/10">
                    {loading ? (
                      <div className="w-full px-4 py-3 text-sm font-medium bg-white/5 text-secondary rounded-lg flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin text-xs" />
                        <span>Cargando...</span>
                      </div>
                    ) : user ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-sm font-medium text-center bg-brand text-white rounded-lg shadow-sm hover:bg-brand/90 transition-all"
                      >
                        Ver Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/auth"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-sm font-medium text-center bg-brand text-white rounded-lg shadow-sm hover:bg-brand/90 transition-all"
                      >
                        Iniciar Sesión
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
