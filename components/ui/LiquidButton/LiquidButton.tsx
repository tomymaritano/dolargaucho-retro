'use client';

/**
 * LiquidButton - Efecto blob suave al hover
 *
 * El botón se deforma suavemente como una gota de líquido
 * usando border-radius animado
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Intensidad de la deformación (0-50)
  disabled?: boolean;
}

export function LiquidButton({
  children,
  className = '',
  intensity = 20,
  disabled = false,
}: LiquidButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values para el border radius
  const borderRadius = useMotionValue('12px');

  // Spring configs para movimiento suave
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
    borderRadius.set('12px');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calcular offset del cursor
    const offsetX = (e.clientX - centerX) / rect.width;
    const offsetY = (e.clientY - centerY) / rect.height;

    x.set(offsetX * intensity);
    y.set(offsetY * intensity);

    // Deformar border-radius basado en posición del cursor
    const topLeft = Math.max(5, 12 - offsetX * intensity - offsetY * intensity);
    const topRight = Math.max(5, 12 + offsetX * intensity - offsetY * intensity);
    const bottomRight = Math.max(5, 12 + offsetX * intensity + offsetY * intensity);
    const bottomLeft = Math.max(5, 12 - offsetX * intensity + offsetY * intensity);

    borderRadius.set(`${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`inline-block ${className}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <motion.div
        style={{
          x,
          y,
          borderRadius,
        }}
        animate={{
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
