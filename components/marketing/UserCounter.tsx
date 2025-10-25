'use client';

/**
 * UserCounter Component
 *
 * Displays the total number of registered users
 * Provides social proof in landing page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useUsersCount } from '@/hooks/useUsersCount';
import { UserAvatarsFloat } from './UserAvatarsFloat';

interface UserCounterProps {
  className?: string;
  variant?: 'default' | 'compact' | 'hero' | 'withAvatars';
  showAvatars?: boolean;
  maxAvatars?: number;
}

export function UserCounter({
  className = '',
  variant = 'default',
  showAvatars = false,
  maxAvatars = 5,
}: UserCounterProps) {
  const { data, isLoading, isError } = useUsersCount();

  // Don't render if error (graceful degradation)
  if (isError) {
    return null;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-panel/10 border border-white/5 animate-pulse ${className}`}
      >
        <div className="w-2 h-2 bg-white/20 rounded-full" />
        <div className="w-32 h-4 bg-white/20 rounded" />
      </div>
    );
  }

  const count = data?.count || 0;
  const formattedCount = count.toLocaleString('es-AR');

  // Hero variant - larger, more prominent
  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className={`inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-success/10 to-success/5 border border-success/20 shadow-lg shadow-success/5 ${className}`}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20"
        >
          <FaUsers className="text-success text-lg" />
        </motion.div>
        <div className="text-left">
          <div className="text-2xl font-black text-success">+{formattedCount}</div>
          <div className="text-xs text-success/80 font-semibold">usuarios registrados</div>
        </div>
      </motion.div>
    );
  }

  // WithAvatars variant - only avatars, no counter text
  if (variant === 'withAvatars') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`inline-flex items-center ${className}`}
      >
        {showAvatars && <UserAvatarsFloat maxAvatars={maxAvatars} size="md" />}
      </motion.div>
    );
  }

  // Compact variant - smaller, minimal
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/10 ${className}`}
      >
        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-success">+{formattedCount} usuarios</span>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-2 h-2 bg-success rounded-full"
      />
      <span className="text-sm font-semibold text-success">
        +{formattedCount} usuarios registrados
      </span>
    </motion.div>
  );
}
