'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaStar,
  FaCalculator,
  FaChartLine,
  FaBars,
  FaTimes,
  FaLandmark,
  FaChartBar,
  FaBell,
  FaCalendarAlt,
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaBitcoin,
} from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useAlertasStore } from '@/lib/store/alertas';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { RiesgoPaisBadge } from '@/components/ui/RiesgoPaisBadge/RiesgoPaisBadge';
import { DolarMarquee } from '@/components/ui/DolarMarquee/DolarMarquee';

const menuItems = [
  { icon: FaHome, label: 'Dashboard', href: '/dashboard', description: 'Panel principal' },
  { icon: FaBitcoin, label: 'Criptomonedas', href: '/dashboard/crypto', description: 'Bitcoin, Ethereum, USDT y más', badge: 'NUEVO' },
  { icon: FaChartLine, label: 'Análisis', href: '/dashboard/analisis', description: 'Análisis de mercado' },
  { icon: FaLandmark, label: 'Política', href: '/dashboard/politica', description: 'Senado y Diputados' },
  { icon: FaChartBar, label: 'Finanzas', href: '/dashboard/finanzas', description: 'Índices y FCIs' },
  { icon: FaCalculator, label: 'Calculadoras', href: '/dashboard/calculadoras', description: 'Inflación, Plazo Fijo, UVA, y más' },
  { icon: FaBell, label: 'Alertas', href: '/dashboard/alertas', description: 'Notificaciones personalizadas' },
  { icon: FaCalendarAlt, label: 'Calendario', href: '/dashboard/calendario', description: 'Eventos y feriados' },
];

export function UnifiedNavbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const getTotalCount = useFavoritesStore((state) => state.getTotalCount);
  const getTotalAlertas = useAlertasStore((state) => state.getTotalCount);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [router.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-strong border-b border-border backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group z-50">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  width={40}
                  height={40}
                  alt="Dolar Gaucho"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="absolute -inset-2 bg-accent-emerald/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-lg sm:text-xl gradient-text">
                  Dólar Gaucho
                </div>
                <div className="text-[10px] text-secondary uppercase tracking-wider">Pro</div>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Riesgo País - Desktop only */}
              <div className="hidden lg:block">
                <RiesgoPaisBadge />
              </div>

              {/* Theme Toggle - Desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-accent-emerald"
                aria-label="Buscar"
              >
                <FaSearch className="text-lg" />
              </button>

              {/* Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-foreground z-50"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Expanded) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar cotizaciones, senadores, diputados..."
                    className="w-full pl-12 pr-4 py-3 bg-panel border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-accent-emerald/50 focus:ring-2 focus:ring-accent-emerald/20 transition-all text-sm sm:text-base"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Dolar Marquee */}
      <DolarMarquee />

      {/* Mobile/Desktop Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
          >
            {/* Backdrop - Solo visible en desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm hidden md:block"
            />

            {/* Menu - Fullscreen en mobile, Sidebar en desktop */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-full md:w-80 md:max-w-[85vw] glass-strong md:border-r border-border flex flex-col overflow-hidden bg-background"
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.svg" width={48} height={48} alt="Dolar Gaucho" />
                    <div>
                      <div className="font-display font-bold text-xl gradient-text">Dólar Gaucho</div>
                      <div className="text-xs text-secondary uppercase tracking-wider">
                        Dashboard Profesional
                      </div>
                    </div>
                  </div>
                  {/* Close button - Visible en mobile */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="md:hidden p-2 rounded-lg glass hover:bg-white/5 transition-colors text-foreground"
                    aria-label="Cerrar menú"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 md:px-3 custom-scrollbar">
                <div className="space-y-2 md:space-y-1">
                  {menuItems.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-start gap-4 p-4 md:p-3 rounded-xl transition-all group ${
                            active
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'hover:bg-white/5 dark:hover:bg-white/5 text-secondary hover:text-foreground'
                          }`}
                        >
                          <div
                            className={`p-3 md:p-2 rounded-lg transition-colors ${
                              active
                                ? 'bg-accent-emerald/30'
                                : 'bg-white/5 dark:bg-white/5 group-hover:bg-accent-emerald/10'
                            }`}
                          >
                            <item.icon
                              className={`text-xl md:text-lg ${active ? 'text-accent-emerald' : 'text-foreground'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={`font-medium text-base md:text-sm ${active ? 'text-accent-emerald' : 'text-foreground'}`}
                              >
                                {item.label}
                              </div>
                              {'badge' in item && item.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-accent-emerald text-background-dark rounded font-bold uppercase">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-sm md:text-xs text-secondary mt-1 md:mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Footer - Quick Stats & User */}
              <div className="border-t border-border">
                {/* Quick Stats */}
                <div className="p-6 md:p-6 pb-4">
                  <div className="flex items-center justify-between text-sm md:text-xs text-secondary mb-3">
                    <span>Quick Stats</span>
                    {/* Theme Toggle en mobile */}
                    <div className="md:hidden">
                      <ThemeToggle />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href="/dashboard/favoritos"
                      className="flex-1 glass p-4 md:p-3 rounded-lg hover:bg-accent-emerald/10 transition-all cursor-pointer group"
                    >
                      <div className="text-2xl md:text-lg font-bold text-accent-emerald group-hover:scale-110 transition-transform">{getTotalCount()}</div>
                      <div className="text-xs md:text-[10px] text-secondary uppercase mt-1 flex items-center gap-1">
                        <FaStar className="text-[10px]" />
                        Favoritos
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/alertas"
                      className="flex-1 glass p-4 md:p-3 rounded-lg hover:bg-accent-emerald/10 transition-all cursor-pointer group"
                    >
                      <div className="text-2xl md:text-lg font-bold text-accent-emerald group-hover:scale-110 transition-transform">{getTotalAlertas()}</div>
                      <div className="text-xs md:text-[10px] text-secondary uppercase mt-1 flex items-center gap-1">
                        <FaBell className="text-[10px]" />
                        Alertas
                      </div>
                    </Link>
                  </div>
                </div>

                {/* User Info & Logout */}
                <div className="p-6 md:p-6 pt-0 pb-8 md:pb-6">
                  <div className="glass rounded-lg p-4 md:p-4 border border-border">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4 md:mb-3">
                      <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                        <FaUser className="text-accent-emerald text-lg md:text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base md:text-sm font-medium text-foreground truncate">
                          {user?.name || 'Usuario'}
                        </div>
                        <div className="text-sm md:text-xs text-secondary truncate">{user?.email}</div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all font-medium text-base md:text-sm group"
                    >
                      <FaSignOutAlt className="text-base md:text-sm group-hover:translate-x-0.5 transition-transform" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </>
  );
}
