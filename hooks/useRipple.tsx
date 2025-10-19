'use client';

/**
 * useRipple - Hook para efecto ripple/onda en botones
 *
 * Crea ondas que se expanden desde el punto de click
 */

import { useState, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function useRipple(duration: number = 600) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();

      // Calcular posición relativa al botón
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calcular tamaño del ripple (diagonal del botón para cubrir todo)
      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple: Ripple = {
        x,
        y,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remover el ripple después de la animación
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration);
    },
    [duration]
  );

  return { ripples, addRipple };
}
