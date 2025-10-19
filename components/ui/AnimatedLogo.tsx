'use client';

/**
 * AnimatedLogo - Logo with rotate + scale animation
 *
 * Features:
 * - Rotates 360° while scaling up
 * - Smooth entrance effect
 * - Uses actual logo.svg file
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
      className={className}
      style={{ width: size, height: size }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Bounce suave
      }}
    >
      <Image
        src="/logo.svg"
        width={size}
        height={size}
        alt="Dolar Gaucho"
        className="w-full h-full"
        priority
      />
    </motion.div>
  );
}
