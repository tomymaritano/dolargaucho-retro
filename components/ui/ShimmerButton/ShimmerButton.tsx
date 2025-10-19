'use client';

/**
 * BorderAnimationButton - Borde animado tech con curvas
 *
 * Un borde curvo que se dibuja progresivamente al hover
 * Usa SVG para seguir el border-radius del botón
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BorderAnimationButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function BorderAnimationButton({
  children,
  className = '',
  disabled = false,
}: BorderAnimationButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const radius = 12; // Border radius en px
  const strokeWidth = 2;

  // Crear path para borde redondeado
  const createRoundedRectPath = (w: number, h: number, r: number) => {
    return `
      M ${r} 0
      L ${w - r} 0
      Q ${w} 0 ${w} ${r}
      L ${w} ${h - r}
      Q ${w} ${h} ${w - r} ${h}
      L ${r} ${h}
      Q 0 ${h} 0 ${h - r}
      L 0 ${r}
      Q 0 0 ${r} 0
    `;
  };

  const pathLength =
    dimensions.width && dimensions.height ? (dimensions.width + dimensions.height) * 2 : 0;

  return (
    <motion.div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      whileHover={!disabled ? 'hover' : undefined}
      initial="initial"
    >
      {children}

      {/* SVG Border Overlay */}
      {!disabled && dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width}
          height={dimensions.height}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" /> {/* brand-light */}
              <stop offset="100%" stopColor="rgb(79, 70, 229)" /> {/* brand */}
            </linearGradient>
          </defs>
          <motion.path
            d={createRoundedRectPath(dimensions.width, dimensions.height, radius)}
            stroke="url(#borderGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            variants={{
              initial: {
                pathLength: 0,
                opacity: 0,
              },
              hover: {
                pathLength: 1,
                opacity: 1,
              },
            }}
            transition={{
              pathLength: { duration: 0.8, ease: 'easeInOut' },
              opacity: { duration: 0.2 },
            }}
          />
        </svg>
      )}
    </motion.div>
  );
}
