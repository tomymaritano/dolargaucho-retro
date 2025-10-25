'use client';

/**
 * DashboardNavbar - Navbar for authenticated dashboard pages
 *
 * Features:
 * - DolarMarquee with live quotes
 * - Hamburger menu with slide-in animation
 * - NavbarSearch integration
 * - Theme toggle
 * - User profile dropdown
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaStar,
  FaChartLine,
  FaLandmark,
  FaCalculator,
  FaBell,
  FaCalendar,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaGlobeAmericas,
} from 'react-icons/fa';
import { DolarMarquee } from './ui/DolarMarquee/DolarMarquee';
import { NavbarSearch } from './NavbarSearch';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { Breadcrumbs, type Breadcrumb } from './ui/Breadcrumbs';
import { useAuth } from '@/lib/contexts/AuthContext';

const menuItems = [
  { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
  { icon: FaStar, label: 'Favoritos', href: '/dashboard/favoritos' },
  { icon: FaChartLine, label: 'Análisis', href: '/dashboard/analisis' },
  { icon: FaCoins, label: 'Crypto', href: '/dashboard/crypto' },
  { icon: FaBell, label: 'Alertas', href: '/dashboard/alertas' },
  { icon: FaCalendar, label: 'Calendario', href: '/dashboard/calendario' },
];

export const DashboardNavbar = React.memo(function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // Generate breadcrumbs from current route
  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    const path = router.pathname;
    const crumbs: Breadcrumb[] = [{ label: 'Dashboard', href: '/dashboard' }];

    if (path === '/dashboard') return crumbs;

    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      const menuItem = menuItems.find((item) => item.href.endsWith(lastSegment));

      if (menuItem) {
        crumbs.push({ label: menuItem.label });
      } else {
        // Capitalize first letter for unknown routes
        const label = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
        crumbs.push({ label });
      }
    }

    return crumbs;
  }, [router.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsLoggingOut(true);
    await signOut();
    // Small delay to ensure the loading screen is visible
    setTimeout(() => {
      router.push('/');
    }, 300);
  }, [signOut, router]);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleProfileToggle = useCallback(() => {
    setProfileOpen((prev) => !prev);
  }, []);

  const handleProfileClose = useCallback(() => {
    setProfileOpen(false);
  }, []);

  return (
    <>
      {/* DolarMarquee - Top of everything */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <DolarMarquee />
      </div>

      {/* Navbar - Below marquee */}
      <nav className="fixed top-12 left-0 right-0 z-[45] bg-background border-b border-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Hamburger, Logo, Actions */}
          <div className="h-16 flex items-center justify-between">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleMenuToggle}
                className="p-2 rounded-lg hover:bg-background-secondary/50 transition-all"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? (
                    <FaTimes className="text-xl text-foreground" />
                  ) : (
                    <FaBars className="text-xl text-foreground" />
                  )}
                </motion.div>
              </motion.button>
              <Link href="/dashboard" className="flex items-center">
                <AnimatedLogo size={32} />
              </Link>
            </div>

            {/* Right: Search + Theme + Profile */}
            <div className="flex items-center gap-3">
              <NavbarSearch />
              <ThemeToggle />

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={handleProfileToggle}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors"
                  aria-label="Menú de usuario"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUser className="text-sm text-foreground/70" />
                  <span className="hidden sm:inline text-sm text-foreground">
                    {user?.name?.split(' ')[0] || 'Usuario'}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-panel rounded-lg shadow-2xl overflow-hidden border border-white/5"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-secondary truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard/perfil"
                        onClick={handleProfileClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-background-secondary transition-colors"
                      >
                        <FaUser className="text-sm text-foreground/70" />
                        <span className="text-sm text-foreground">Mi Perfil</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background-secondary transition-colors text-left border-t border-white/10"
                      >
                        <FaSignOutAlt className="text-sm text-error" />
                        <span className="text-sm text-error">Cerrar Sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Breadcrumbs Row - Hidden on mobile, visible on desktop */}
          {breadcrumbs.length > 1 && (
            <div className="hidden md:block px-4 py-2 border-t border-white/10">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
        </div>
      </nav>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleMenuClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Menu Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-panel/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-[70] overflow-y-auto"
            >
              {/* Header with gradient */}
              <div className="sticky top-0 bg-gradient-to-b from-panel to-transparent p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AnimatedLogo size={28} />
                    <h2 className="text-lg font-bold text-foreground">Dólar Gaucho</h2>
                  </div>
                  <button
                    onClick={handleMenuClose}
                    className="p-2 rounded-lg hover:bg-panel/10 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <FaTimes className="text-lg text-foreground/70" />
                  </button>
                </div>

                {/* User Info - Compact */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background-secondary/30 border border-white/5">
                  <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center">
                    <FaUser className="text-sm text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-secondary truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items - Organized */}
              <nav className="px-4 pb-6 space-y-6">
                {/* Main Section */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3 px-3">
                    Principal
                  </p>
                  <div className="space-y-1">
                    {menuItems.slice(0, 4).map((item, index) => {
                      const isActive = router.pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={item.href}
                            onClick={handleMenuClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden ${
                              isActive
                                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                                : 'text-foreground/70 hover:text-foreground hover:bg-panel/10'
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute inset-0 bg-brand rounded-lg -z-10"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                            <motion.div
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon
                                className={`text-base ${isActive ? 'text-white' : 'text-foreground/50 group-hover:text-foreground'}`}
                              />
                            </motion.div>
                            <span className="text-sm font-medium relative z-10">{item.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Markets Section */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3 px-3">
                    Mercados
                  </p>
                  <div className="space-y-1">
                    {menuItems.slice(4, 7).map((item) => {
                      const isActive = router.pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleMenuClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                            isActive
                              ? 'bg-brand text-white shadow-lg shadow-brand/20'
                              : 'text-foreground/70 hover:text-foreground hover:bg-panel/10'
                          }`}
                        >
                          <Icon
                            className={`text-base ${isActive ? 'text-white' : 'text-foreground/50 group-hover:text-foreground'}`}
                          />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Tools Section */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3 px-3">
                    Herramientas
                  </p>
                  <div className="space-y-1">
                    {menuItems.slice(7).map((item) => {
                      const isActive = router.pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleMenuClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                            isActive
                              ? 'bg-brand text-white shadow-lg shadow-brand/20'
                              : 'text-foreground/70 hover:text-foreground hover:bg-panel/10'
                          }`}
                        >
                          <Icon
                            className={`text-base ${isActive ? 'text-white' : 'text-foreground/50 group-hover:text-foreground'}`}
                          />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-error hover:bg-error/5 transition-all group"
                  >
                    <FaSignOutAlt className="text-base text-foreground/50 group-hover:text-error" />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Loading Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <AnimatedLogo className="w-20 h-20 mb-6 mx-auto animate-pulse" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">Cerrando sesión</h2>
                <p className="text-secondary">Hasta pronto...</p>
              </motion.div>
              {/* Animated spinner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
