'use client';

/**
 * AnimatedLogo - Logo with drawing animation
 *
 * Features:
 * - Animated reveal effect on mount
 * - Smooth drawing animation
 * - Responsive sizing
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export function AnimatedLogo({ size = 32, className = '' }: AnimatedLogoProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1], // Easing cubic-bezier
      }}
    >
      {/* SVG mask for drawing effect */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="absolute inset-0"
        style={{ clipPath: 'url(#logo-reveal)' }}
      >
        <defs>
          <clipPath id="logo-reveal">
            <motion.rect
              x="0"
              y="0"
              width="32"
              height="32"
              initial={{ y: 32 }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.23, 1, 0.32, 1],
                delay: 0.2,
              }}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Actual logo image */}
      <Image
        src="/logo.svg"
        width={size}
        height={size}
        alt="Dolar Gaucho"
        className="relative z-10"
        priority
      />

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-brand/20 blur-xl opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
