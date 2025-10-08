'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaChartLine,
  FaCalculator,
  FaHome,
  FaLandmark,
  FaChartBar,
  FaBell,
  FaCalendarAlt,
  FaTachometerAlt,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa';

interface NavbarProProps {
  variant?: 'transparent' | 'solid';
}

export function NavbarPro({ variant = 'transparent' }: NavbarProProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isTransparent = variant === 'transparent' && !scrolled;

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${
      isTransparent
        ? 'bg-transparent'
        : 'glass-strong border-b border-accent-emerald/20 backdrop-blur-xl'
    }
  `;

  const menuItems = [
    { icon: FaHome, label: 'Inicio', href: '/', description: 'Página principal' },
    {
      icon: FaTachometerAlt,
      label: 'Dashboard',
      href: '/dashboard',
      description: 'Panel principal',
    },
    {
      icon: FaChartLine,
      label: 'Análisis',
      href: '/dashboard/analisis',
      description: 'Análisis de mercado',
    },
    {
      icon: FaLandmark,
      label: 'Política',
      href: '/dashboard/politica',
      description: 'Senado y Diputados',
    },
    {
      icon: FaChartBar,
      label: 'Finanzas',
      href: '/dashboard/finanzas',
      description: 'Índices y FCIs',
    },
    {
      icon: FaCalculator,
      label: 'Calculadoras',
      href: '/dashboard/calculadoras',
      description: 'Herramientas financieras',
    },
    {
      icon: FaBell,
      label: 'Alertas',
      href: '/dashboard/alertas',
      description: 'Notificaciones personalizadas',
    },
    {
      icon: FaCalendarAlt,
      label: 'Calendario',
      href: '/dashboard/calendario',
      description: 'Eventos y feriados',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={navbarClasses}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group z-50">
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
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-accent-emerald"
                aria-label="Buscar"
              >
                <FaSearch className="text-lg" />
              </button>

              {/* Menu Toggle (All Screens) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-white z-50"
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
              className="border-t border-white/10 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar cotizaciones, senadores, diputados..."
                    className="w-full pl-12 pr-4 py-3 bg-dark-light border border-white/10 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent-emerald/50 focus:ring-2 focus:ring-accent-emerald/20 transition-all text-sm sm:text-base"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Sidebar Menu (All Screens) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] glass-strong border-r border-accent-emerald/20 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Image src="/logo.svg" width={48} height={48} alt="Dolar Gaucho" />
                  <div>
                    <div className="font-display font-bold text-xl gradient-text">Dólar Gaucho</div>
                    <div className="text-xs text-secondary uppercase tracking-wider">
                      Dashboard Profesional
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                <div className="space-y-1">
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
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                            active
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'hover:bg-white/5 text-secondary hover:text-white'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              active
                                ? 'bg-accent-emerald/30'
                                : 'bg-white/5 group-hover:bg-accent-emerald/10'
                            }`}
                          >
                            <item.icon
                              className={`text-lg ${active ? 'text-accent-emerald' : 'text-white'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-sm ${active ? 'text-accent-emerald' : 'text-white'}`}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-secondary mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span>© 2025 Dólar Gaucho</span>
                  <div className="flex gap-3">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-emerald transition-colors"
                    >
                      <FaGithub className="text-lg" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-emerald transition-colors"
                    >
                      <FaTwitter className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
