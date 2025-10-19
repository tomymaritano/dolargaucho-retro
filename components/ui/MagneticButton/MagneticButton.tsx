'use client';

/**
 * MagneticButton - Efecto magnético que sigue al cursor
 *
 * Features:
 * - El botón se mueve suavemente hacia el cursor cuando te acercás
 * - Animaciones spring physics para movimiento natural
 * - Configurable: distancia magnética, strength, etc.
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // Qué tan fuerte es el efecto (0-1)
  magneticDistance?: number; // A qué distancia se activa el efecto (px)
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  magneticStrength = 0.4,
  magneticDistance = 100,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distancia del cursor al centro del botón
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Solo aplicar efecto si estamos dentro del rango magnético
    if (distance < magneticDistance) {
      // Calcular nueva posición con strength
      const x = distanceX * magneticStrength;
      const y = distanceY * magneticStrength;
      setPosition({ x, y });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
