'use client';

/**
 * UnifiedNavbarMarketing - Navbar unificado para Marketing + Dashboard
 *
 * Detecta automáticamente la ruta y se adapta:
 * - Marketing mode (/): Links a secciones, CTA "Probar Dashboard"
 * - Dashboard mode (/dashboard/*): Links completos del dashboard
 *
 * Single source of truth para branding, logo, theme
 */

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
  FaChevronDown,
} from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useAlertasStore } from '@/lib/store/alertas';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { DolarMarquee } from '@/components/ui/DolarMarquee/DolarMarquee';
import { LinkButton } from '@/components/ui/Button';

// Dashboard menu sections
const dashboardMenuSections = [
  {
    title: 'Principal',
    items: [
      { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
      { icon: FaBitcoin, label: 'Criptomonedas', href: '/dashboard/crypto', badge: 'NUEVO' },
    ],
  },
  {
    title: 'Análisis',
    items: [
      { icon: FaChartLine, label: 'Análisis', href: '/dashboard/analisis' },
      { icon: FaLandmark, label: 'Política', href: '/dashboard/politica' },
      { icon: FaChartBar, label: 'Finanzas', href: '/dashboard/finanzas' },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      { icon: FaCalculator, label: 'Calculadoras', href: '/dashboard/calculadoras' },
      { icon: FaBell, label: 'Alertas', href: '/dashboard/alertas' },
      { icon: FaCalendarAlt, label: 'Calendario', href: '/dashboard/calendario' },
    ],
  },
];

// Marketing menu links
const marketingMenuLinks = [
  { label: 'Características', href: '#features' },
  { label: 'Demo en Vivo', href: '#demo' },
  { label: 'Por qué Dólar Gaucho', href: '#why' },
  { label: 'FAQs', href: '#faqs' },
];

export function UnifiedNavbarMarketing() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const getTotalCount = useFavoritesStore((state) => state.getTotalCount);
  const getTotalAlertas = useAlertasStore((state) => state.getTotalCount);

  // Detect mode based on route
  const isDashboardMode = router.pathname.startsWith('/dashboard');
  const isMarketingMode = !isDashboardMode;

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
      {/* Dolar Marquee - Solo en dashboard */}
      {isDashboardMode && <DolarMarquee />}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${isDashboardMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl bg-background/80 ${isDashboardMode ? 'border-b border-white/5' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href={isDashboardMode ? '/dashboard' : '/'}
              className="flex items-center gap-3 group z-50"
            >
              <div className="relative">
                <Image
                  src="/logo.svg"
                  width={40}
                  height={40}
                  alt="Dolar Gaucho"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="absolute -inset-2 bg-brand/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
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
              {/* Theme Toggle - Desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Search Button - Solo en dashboard */}
              {isDashboardMode && (
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-md hover:bg-brand/10 transition-colors text-foreground/60 hover:text-brand"
                  aria-label="Buscar"
                >
                  <FaSearch className="text-base" />
                </button>
              )}

              {/* CTA Button - Solo en marketing */}
              {isMarketingMode && (
                <div className="hidden md:block">
                  <LinkButton href="/dashboard" variant="primary" size="sm">
                    Ver Dashboard
                  </LinkButton>
                </div>
              )}

              {/* Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md hover:bg-brand/10 transition-colors text-foreground/60 hover:text-brand z-50"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {menuOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Expanded) - Solo dashboard */}
        {isDashboardMode && (
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/5 overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                      type="text"
                      placeholder="Buscar cotizaciones, senadores, diputados..."
                      className="w-full pl-12 pr-4 py-3 bg-panel border border-white/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all text-sm sm:text-base"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.nav>

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
              className="absolute left-0 top-0 bottom-0 w-full md:w-64 md:max-w-[85vw] backdrop-blur-xl bg-background/80 md:border-r border-white/5 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.svg" width={28} height={28} alt="Dolar Gaucho" />
                    <div>
                      <div className="font-display font-bold text-sm gradient-text">
                        Dólar Gaucho
                      </div>
                      <div className="text-[8px] text-brand uppercase tracking-wider font-semibold">
                        Pro
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Theme Toggle - Visible en mobile */}
                    <div className="md:hidden">
                      <ThemeToggle />
                    </div>
                    {/* Close button - Visible en mobile */}
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="md:hidden p-1.5 rounded-md hover:bg-white/5 transition-colors text-foreground/60"
                      aria-label="Cerrar menú"
                    >
                      <FaTimes className="text-base" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {isDashboardMode ? (
                  // Dashboard Menu
                  <>
                    {dashboardMenuSections.map((section, sectionIndex) => (
                      <div key={section.title} className={sectionIndex > 0 ? 'mt-4' : ''}>
                        {/* Section Title */}
                        <div className="px-3 mb-2">
                          <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">
                            {section.title}
                          </span>
                        </div>

                        {/* Section Items */}
                        <div className="space-y-0.5">
                          {section.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 my-0.5 ${
                                  active
                                    ? 'bg-brand/10 text-brand border-l-3 border-brand'
                                    : 'text-foreground/70 hover:text-foreground hover:bg-white/10 hover:scale-[1.02] border-l-3 border-transparent'
                                }`}
                              >
                                <item.icon
                                  className={`text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${active ? '' : 'opacity-70'}`}
                                />
                                <span className="font-medium text-sm">{item.label}</span>
                                {'badge' in item && item.badge && (
                                  <span className="ml-auto px-2 py-0.5 text-[8px] bg-brand text-white rounded-full font-bold uppercase animate-pulse">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Separator */}
                        {sectionIndex < dashboardMenuSections.length - 1 && (
                          <div className="border-t border-white/5 mt-3" />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  // Marketing Menu
                  <div className="space-y-1">
                    {marketingMenuLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-white/10 transition-all font-medium text-sm"
                      >
                        {link.label}
                      </a>
                    ))}

                    <div className="border-t border-white/5 my-4" />

                    {/* CTA in Menu */}
                    <LinkButton href="/dashboard" variant="primary" size="md" fullWidth>
                      Ver Dashboard
                    </LinkButton>
                  </div>
                )}
              </nav>

              {/* Footer - User Menu (Solo en Dashboard) */}
              {isDashboardMode && user && (
                <div className="border-t border-white/5 p-2.5">
                  {/* User Info Button - Clickeable */}
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center ring-1 ring-brand/20 group-hover:ring-brand/40 transition-all">
                        <FaUser className="text-brand text-[10px]" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border border-background" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-[11px] font-semibold text-foreground truncate leading-tight">
                        {user?.name || 'Usuario'}
                      </div>
                      <div className="text-[9px] text-secondary truncate leading-tight mt-0.5">
                        Plan Gratuito
                      </div>
                    </div>
                    <FaChevronDown
                      className={`text-[10px] text-foreground/50 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu - Expandible */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-0.5">
                          {/* Profile */}
                          <Link
                            href="/dashboard/perfil"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/10 text-foreground/70 hover:text-foreground transition-all group"
                          >
                            <FaUser className="text-[11px] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Mi Perfil</span>
                          </Link>

                          {/* Notifications */}
                          <Link
                            href="/dashboard/alertas"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/10 text-foreground/70 hover:text-foreground transition-all group"
                          >
                            <FaBell className="text-[11px] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Notificaciones</span>
                            {getTotalAlertas() > 0 && (
                              <span className="ml-auto px-1.5 py-0.5 text-[8px] bg-brand text-white rounded-full font-bold">
                                {getTotalAlertas()}
                              </span>
                            )}
                          </Link>

                          {/* Separator */}
                          <div className="border-t border-white/5 my-1.5" />

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/10 text-foreground/60 hover:text-red-400 transition-all group"
                          >
                            <FaSignOutAlt className="text-[11px] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">Cerrar sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal - Solo dashboard */}
      {isDashboardMode && <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin: 4px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 71, 255, 0.4);
          border-radius: 12px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 71, 255, 0.6);
        }
      `}</style>
    </>
  );
}
