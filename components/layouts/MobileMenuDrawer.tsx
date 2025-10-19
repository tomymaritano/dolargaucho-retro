/**
 * MobileMenuDrawer Component
 *
 * Single Responsibility: Render mobile/desktop navigation drawer
 * Extracted from UnifiedNavbar.tsx
 *
 * Professional hover improvements:
 * - Menu items with scale animations (1.02x)
 * - Icon background transitions
 * - Quick stats with scale on hover (1.10x)
 * - Smooth backdrop blur
 * - Staggered entrance animations
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaStar,
  FaCalculator,
  FaChartLine,
  FaTimes,
  FaLandmark,
  FaChartBar,
  FaBell,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUser,
  FaBitcoin,
} from 'react-icons/fa';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface MenuItemType {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  description: string;
  badge?: string;
}

const menuItems: MenuItemType[] = [
  { icon: FaHome, label: 'Dashboard', href: '/dashboard', description: 'Panel principal' },
  {
    icon: FaBitcoin,
    label: 'Criptomonedas',
    href: '/dashboard/crypto',
    description: 'Bitcoin, Ethereum, USDT y más',
    badge: 'NUEVO',
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
    description: 'Inflación, Plazo Fijo, UVA, y más',
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

interface MobileMenuDrawerProps {
  isOpen: boolean;
  currentPath: string;
  onClose: () => void;
  favoritesCount: number;
  alertasCount: number;
  user: { name?: string; email?: string } | null;
  onLogout: () => void;
}

export function MobileMenuDrawer({
  isOpen,
  currentPath,
  onClose,
  favoritesCount,
  alertasCount,
  user,
  onLogout,
}: MobileMenuDrawerProps) {
  if (!isOpen) return null;

  const isActive = (href: string) => currentPath === href;

  return (
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
        onClick={onClose}
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm hidden md:block"
      />

      {/* Menu - Fullscreen en mobile, Sidebar en desktop */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute left-0 top-0 bottom-0 w-full md:w-80 md:max-w-[85vw] flex flex-col overflow-hidden bg-background"
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Image src="/logo.svg" width={48} height={48} alt="Dolar Gaucho" />
                <div className="absolute -inset-2 bg-brand/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <div>
                <div className="font-display font-bold text-xl gradient-text">Dólar Gaucho</div>
                <div className="text-xs text-secondary uppercase tracking-wider">
                  Dashboard Profesional
                </div>
              </div>
            </div>
            {/* Close button - Visible en mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95 text-foreground"
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
                    className={`flex items-start gap-4 p-4 md:p-3 rounded-xl transition-all duration-300 group/item hover:scale-[1.02] ${
                      active
                        ? 'bg-brand/20 text-brand'
                        : 'hover:bg-white/5 dark:hover:bg-white/5 text-secondary hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`p-3 md:p-2 rounded-lg transition-all duration-300 ${
                        active
                          ? 'bg-brand/30 scale-110'
                          : 'bg-white/5 dark:bg-white/5 group-hover/item:bg-brand/10 group-hover/item:scale-110'
                      }`}
                    >
                      <item.icon
                        className={`text-xl md:text-lg ${active ? 'text-brand' : 'text-foreground'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-medium text-base md:text-sm ${active ? 'text-brand' : 'text-foreground'}`}
                        >
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-brand text-background-dark rounded font-bold uppercase">
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
        <div>
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
                className="flex-1 glass p-4 md:p-3 rounded-lg hover:bg-brand/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="text-2xl md:text-lg font-bold text-brand group-hover:scale-110 transition-transform duration-300">
                  {favoritesCount}
                </div>
                <div className="text-xs md:text-[10px] text-secondary uppercase mt-1 flex items-center gap-1">
                  <FaStar className="text-[10px]" />
                  Favoritos
                </div>
              </Link>
              <Link
                href="/dashboard/alertas"
                className="flex-1 glass p-4 md:p-3 rounded-lg hover:bg-brand/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="text-2xl md:text-lg font-bold text-brand group-hover:scale-110 transition-transform duration-300">
                  {alertasCount}
                </div>
                <div className="text-xs md:text-[10px] text-secondary uppercase mt-1 flex items-center gap-1">
                  <FaBell className="text-[10px]" />
                  Alertas
                </div>
              </Link>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="p-6 md:p-6 pt-0 pb-8 md:pb-6">
            <div className="bg-panel rounded-lg p-4 md:p-4 transition-all duration-300">
              {/* User Info */}
              <Link href="/dashboard/perfil" className="block mb-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group/profile">
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-brand/20 flex items-center justify-center group-hover/profile:bg-brand/30 transition-colors">
                    <FaUser className="text-brand text-lg md:text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base md:text-sm font-medium text-foreground truncate group-hover/profile:text-brand transition-colors">
                      {user?.name || 'Usuario'}
                    </div>
                    <div className="text-sm md:text-xs text-secondary truncate">{user?.email}</div>
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 font-medium text-base md:text-sm group hover:scale-[1.02]"
              >
                <FaSignOutAlt className="text-base md:text-sm group-hover:translate-x-0.5 transition-transform duration-300" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </motion.div>

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
    </motion.div>
  );
}
