/**
 * NavbarSearch Component
 *
 * Single Responsibility: Render expandable search bar
 * Extracted from UnifiedNavbar.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

interface NavbarSearchProps {
  isOpen: boolean;
}

export function NavbarSearch({ isOpen }: NavbarSearchProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand transition-colors duration-300" />
          <input
            type="text"
            placeholder="Buscar cotizaciones, senadores, diputados..."
            className="w-full pl-12 pr-4 py-3 bg-panel rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all text-sm sm:text-base"
            autoFocus
          />
        </div>
      </div>
    </motion.div>
  );
}
