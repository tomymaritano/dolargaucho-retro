'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
} from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useAlertasStore } from '@/lib/store/alertas';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
  { icon: FaStar, label: 'Favoritos', href: '/dashboard/favoritos' },
  { icon: FaChartLine, label: 'Análisis', href: '/dashboard/analisis' },
  { icon: FaLandmark, label: 'Política', href: '/dashboard/politica' },
  { icon: FaChartBar, label: 'Finanzas', href: '/dashboard/finanzas' },
  { icon: FaCalculator, label: 'Calculadoras', href: '/dashboard/calculadoras' },
  { icon: FaBell, label: 'Alertas', href: '/dashboard/alertas' },
  { icon: FaCalendarAlt, label: 'Calendario', href: '/dashboard/calendario' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const getTotalCount = useFavoritesStore((state) => state.getTotalCount);
  const getTotalAlertas = useAlertasStore((state) => state.getTotalCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-accent-emerald/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:text-accent-emerald transition-colors"
              >
                {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>

              <Link href="/dashboard" className="flex items-center gap-3">
                <Image src="/logo.svg" width={32} height={32} alt="Dolar Gaucho" />
                <div className="hidden sm:block">
                  <div className="font-display font-bold text-lg gradient-text">Dólar Gaucho</div>
                  <div className="text-[10px] text-secondary uppercase tracking-wider">Pro</div>
                </div>
              </Link>
            </div>

            {/* Placeholder for future user menu */}
            <div className="text-secondary text-sm">Dashboard</div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar - Always rendered, visibility controlled by CSS */}
        <aside
          className={`fixed lg:sticky top-16 left-0 bottom-0 w-64 glass-strong border-r border-white/10 p-6 overflow-y-auto z-40 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30'
                      : 'text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 glass rounded-xl border border-accent-emerald/20">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Favoritos</span>
                <span className="text-white font-semibold">{getTotalCount()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Alertas</span>
                <span className="text-white font-semibold">{getTotalAlertas()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
