'use client';

/**
 * AnimatedLogo - Logo with drawing animation
 *
 * Features:
 * - SVG path drawing animation
 * - Smooth entrance effect
 * - Responsive sizing
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export function AnimatedLogo({ size = 32, className = '' }: AnimatedLogoProps) {
  // Paths para el símbolo $
  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Círculo exterior */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        variants={pathVariants}
      />

      {/* Símbolo $ */}
      <motion.path
        d="M 50 20 L 50 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        variants={pathVariants}
      />

      <motion.path
        d="M 35 35 Q 35 25 50 25 Q 65 25 65 35 Q 65 45 50 45 Q 35 45 35 55 Q 35 65 50 65 Q 65 65 65 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        variants={pathVariants}
      />

      {/* Puntos decorativos */}
      <motion.circle cx="30" cy="70" r="3" fill="currentColor" variants={pathVariants} />
      <motion.circle cx="70" cy="30" r="3" fill="currentColor" variants={pathVariants} />
    </motion.svg>
  );
}
