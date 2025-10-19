/**
 * AnimatedOrbs - Background decorativo con orbes animados
 *
 * Componente reutilizable para agregar fondos animados sutiles
 * Usado en: Help Center, otras hero sections
 *
 * Features:
 * - 2 orbes con blur y gradiente brand
 * - Animación infinita de scale + translate
 * - Opacity configurable
 * - Positioned absolute, requiere parent con position: relative
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedOrbsProps {
  /** Opacidad de los orbes (0-1), default: 0.2 */
  opacity?: number;
  /** Clase CSS adicional (opcional) */
  className?: string;
}

export function AnimatedOrbs({ opacity = 0.2, className = '' }: AnimatedOrbsProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Orbe 1 - Top Left */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orbe 2 - Bottom Right */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-light/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
