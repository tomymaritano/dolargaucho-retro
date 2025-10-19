/**
 * SpotlightCard - Card with mouse-tracking spotlight effect
 *
 * Inspired by ReactBits SpotlightCard
 * Features:
 * - Mouse-tracking radial gradient spotlight
 * - Smooth opacity transitions
 * - Customizable spotlight color
 * - Reusable wrapper component
 */

'use client';

import React, { useState, useRef, MouseEvent } from 'react';

interface SpotlightCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional class names for the card */
  className?: string;
  /** Spotlight color (default: brand color) */
  spotlightColor?: string;
  /** Spotlight opacity (default: 0.15) */
  spotlightOpacity?: number;
  /** Spotlight size in pixels (default: 300) */
  spotlightSize?: number;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0, 71, 255, 0.25)', // brand color with transparency
  spotlightOpacity = 0.15,
  spotlightSize = 300,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? spotlightOpacity : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
