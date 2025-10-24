'use client';

/**
 * ProgressRing - Circular progress indicator for vote tallying
 *
 * Shows percentage of polling stations tallied with animated SVG ring
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** Percentage complete (0-100) */
  percentage: number;
  /** Ring size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color of progress ring */
  color?: string;
  /** Show percentage text in center */
  showLabel?: boolean;
}

export const ProgressRing = React.memo(function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#a78bfa', // purple-400
  showLabel = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.5))',
          }}
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-3xl font-black text-foreground"
          >
            {percentage.toFixed(1)}%
          </motion.div>
          <div className="text-xs text-secondary uppercase tracking-wide mt-1">Escrutado</div>
        </div>
      )}
    </div>
  );
});
