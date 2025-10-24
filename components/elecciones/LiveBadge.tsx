'use client';

/**
 * LiveBadge - Animated "EN VIVO" badge for live election results
 *
 * Shows pulsing indicator when election results are being updated in real-time
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LiveBadgeProps {
  /** Show badge (only on election day) */
  isLive?: boolean;
  /** Optional custom text */
  text?: string;
}

export const LiveBadge = React.memo(function LiveBadge({
  isLive = true,
  text = 'EN VIVO',
}: LiveBadgeProps) {
  if (!isLive) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-sm"
    >
      {/* Pulsing Dot */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <motion.div
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
      </motion.div>

      {/* Text */}
      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{text}</span>
    </motion.div>
  );
});
