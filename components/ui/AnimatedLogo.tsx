'use client';

/**
 * AnimatedLogo - Logo with reveal animation
 *
 * Features:
 * - Animated reveal from bottom to top
 * - Smooth scale entrance
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
    <div className={`relative overflow-hidden ${className}`} style={{ width: size, height: size }}>
      {/* Logo con animación de escala y opacidad */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1], // Easing con bounce suave
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

      {/* Overlay que se revela de abajo hacia arriba */}
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          delay: 0.1,
        }}
      />
    </div>
  );
}
