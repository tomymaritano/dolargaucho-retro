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

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

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
    await signOut();
    router.push('/');
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
      <nav className="fixed top-12 left-0 right-0 z-[45] bg-background border-b border-white/5">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg hover:bg-background-secondary/50 transition-colors"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? (
                <FaTimes className="text-xl text-foreground" />
              ) : (
                <FaBars className="text-xl text-foreground" />
              )}
            </button>
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
              <button
                onClick={handleProfileToggle}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors"
                aria-label="Menú de usuario"
              >
                <FaUser className="text-sm text-foreground/70" />
                <span className="hidden sm:inline text-sm text-foreground">
                  {user?.name?.split(' ')[0] || 'Usuario'}
                </span>
              </button>

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
                    <div className="px-4 py-3 border-b border-white/5">
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
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background-secondary transition-colors text-left border-t border-white/5"
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
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
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
                    {menuItems.slice(0, 4).map((item) => {
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
                              : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
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
                              : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
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
                              : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
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
                <div className="pt-4 border-t border-white/5">
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
    </>
  );
});
