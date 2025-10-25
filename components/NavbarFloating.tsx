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
import {
  FaSpinner,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaRocket,
  FaUserPlus,
  FaSignInAlt,
  FaTachometerAlt,
} from 'react-icons/fa';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { ChangelogButton } from './ChangelogButton';
import { RoadmapButton } from './RoadmapButton';
import { NavbarSearch } from './NavbarSearch';
import { useChangelog } from './WhatsNew';

export function NavbarFloating() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openChangelog } = useChangelog();
  const searchButtonRef = React.useRef<HTMLDivElement>(null);

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
        <div className="bg-background/80 backdrop-blur-xl border border-subtle rounded-2xl shadow-xl shadow-black/5 px-4 md:px-6 py-3">
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
                <div className="px-4 py-2 text-sm font-medium bg-panel/10 text-secondary rounded-lg flex items-center gap-2">
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

      {/* Mobile Drawer - Full Screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <AnimatedLogo size={32} />
                  <span className="text-xl font-bold">Menú</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-panel/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-3">
                  {/* Search Button - Custom Design for Mobile Drawer */}
                  <button
                    onClick={() => {
                      // Trigger the hidden NavbarSearch
                      const searchBtn = searchButtonRef.current?.querySelector('button');
                      if (searchBtn) {
                        searchBtn.click();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-panel/10 hover:bg-panel/20 border border-white/5 transition-all group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <FaSearch size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-base text-foreground">Buscar</div>
                      <div className="text-xs text-secondary">Encuentra dólares, tasas y más</div>
                    </div>
                  </button>

                  {/* Changelog */}
                  <button
                    onClick={() => {
                      openChangelog();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-panel/10 hover:bg-panel/20 border border-white/5 transition-all group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
                      <FaBell size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-base text-foreground">Novedades</div>
                      <div className="text-xs text-secondary">
                        Últimas actualizaciones y mejoras
                      </div>
                    </div>
                  </button>

                  {/* Roadmap */}
                  <Link
                    href="/roadmap"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-panel/10 hover:bg-panel/20 border border-white/5 transition-all group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <FaRocket size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-base text-foreground">Roadmap</div>
                      <div className="text-xs text-secondary">Próximas features y timeline</div>
                    </div>
                  </Link>
                </nav>

                {/* Auth Section */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  {loading ? (
                    <div className="w-full px-4 py-4 text-sm font-medium bg-panel/10 text-secondary rounded-xl flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      <span>Cargando...</span>
                    </div>
                  ) : user ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-brand text-white hover:bg-brand/90 transition-all shadow-lg shadow-brand/20"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                        <FaTachometerAlt size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-base">Ver Dashboard</div>
                        <div className="text-xs opacity-90">Accede a tu panel</div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth?tab=signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-brand text-white hover:bg-brand/90 transition-all shadow-lg shadow-brand/20"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                          <FaUserPlus size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-base">Registrarse</div>
                          <div className="text-xs opacity-90">Crea tu cuenta gratis</div>
                        </div>
                      </Link>

                      <Link
                        href="/auth"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-panel/10 hover:bg-panel/20 border border-white/5 transition-all"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand/10 text-brand">
                          <FaSignInAlt size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base text-foreground">
                            Iniciar Sesión
                          </div>
                          <div className="text-xs text-secondary">Accede a tu cuenta</div>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden NavbarSearch for triggering from mobile drawer */}
      <div ref={searchButtonRef} className="invisible fixed -top-96 pointer-events-auto">
        <NavbarSearch />
      </div>
    </>
  );
}
