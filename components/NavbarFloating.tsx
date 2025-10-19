'use client';

/**
 * NavbarFloating - Minimal floating navbar
 *
 * Features:
 * - Floating design with padding from edges
 * - Minimal design: Logo + Theme Toggle + Login button only
 * - Glass morphism background
 * - Rounded borders
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';

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
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/logo.svg"
                width={32}
                height={32}
                alt="Dolar Gaucho"
                className="w-8 h-8"
              />
            </div>
          </Link>

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
