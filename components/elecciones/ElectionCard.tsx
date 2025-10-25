'use client';

/**
 * ElectionCard - Glassmorphism card container for election sections
 *
 * Reusable fintech-styled card with gradient borders and blur effects
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ElectionCardProps {
  children: React.ReactNode;
  /** Card title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional header action (e.g., badge, button) */
  headerAction?: React.ReactNode;
  /** Animation delay */
  delay?: number;
  /** Custom className */
  className?: string;
}

export const ElectionCard = React.memo(function ElectionCard({
  children,
  title,
  subtitle,
  headerAction,
  delay = 0,
  className = '',
}: ElectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`relative group ${className}`}
    >
      {/* Glassmorphism Card */}
      <div className="relative p-6 md:p-8 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-border/5 hover:border-white/20 transition-all duration-500">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          {(title || subtitle || headerAction) && (
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                {title && (
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">{title}</h3>
                )}
                {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
              </div>

              {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            </div>
          )}

          {/* Body */}
          {children}
        </div>

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
      </div>
    </motion.div>
  );
});
