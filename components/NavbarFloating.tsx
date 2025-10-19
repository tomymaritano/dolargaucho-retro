'use client';

/**
 * NavbarFloating - Modern floating navbar with dropdowns
 *
 * Features:
 * - Floating design with padding from edges
 * - No hamburger menu - shows all links
 * - Dropdown menus for complex navigation
 * - Glass morphism background
 * - Rounded borders
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Producto',
    dropdown: [
      { label: 'Dashboard', href: '/dashboard', description: 'Cotizaciones en tiempo real' },
      {
        label: 'Calculadoras',
        href: '/dashboard/calculadoras',
        description: 'Herramientas financieras',
      },
      {
        label: 'Alertas',
        href: '/dashboard/alertas',
        description: 'Notificaciones personalizadas',
      },
    ],
  },
  {
    label: 'Recursos',
    dropdown: [
      { label: 'Ayuda', href: '/help', description: 'Centro de ayuda' },
      { label: 'API', href: '#api', description: 'Documentación API' },
    ],
  },
];

function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.dropdown) {
    return (
      <Link
        href={item.href || '#'}
        className="px-3 py-2 text-sm font-medium text-secondary hover:text-foreground transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary hover:text-foreground transition-colors">
        {item.label}
        <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-2 w-72"
          >
            <div className="bg-background border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              <div className="p-3 space-y-1">
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="block px-4 py-3 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-150 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors duration-150">
                          {subItem.label}
                        </div>
                        {subItem.description && (
                          <div className="text-xs text-secondary/80 mt-1 leading-relaxed">
                            {subItem.description}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-brand/60"
                        >
                          <path
                            d="M6.5 3L11.5 8L6.5 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavbarFloating() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto"
    >
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/5 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.svg"
                width={32}
                height={32}
                alt="Dolar Gaucho"
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="font-display font-bold text-base gradient-text">Dólar Gaucho</div>
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavDropdown key={item.label} item={item} />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/auth"
              className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg shadow-sm shadow-black/10 hover:shadow hover:shadow-black/20 hover:bg-brand/90 transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
