/**
 * ShimmerBorder Component - Animated gradient border
 * From ReactBits - Perfect for highlighting premium cards/features
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerBorderProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  duration?: number;
}

export default function ShimmerBorder({
  children,
  className = '',
  shimmerColor = '#0047FF',
  duration = 3,
}: ShimmerBorderProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Shimmer border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          opacity: 0.5,
        }}
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <div className="relative z-10 rounded-xl border border-white/10 bg-panel">{children}</div>
    </div>
  );
}
