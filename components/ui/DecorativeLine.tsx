/**
 * DecorativeLine Component
 *
 * Decorative line that adapts to light/dark theme
 * Can be horizontal or vertical
 */

import React from 'react';

interface DecorativeLineProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  gradient?: boolean; // If true, uses gradient from transparent to border color
}

export function DecorativeLine({
  orientation = 'horizontal',
  className = '',
  gradient = true,
}: DecorativeLineProps) {
  const baseClasses =
    orientation === 'horizontal'
      ? 'h-px w-full' // Horizontal line
      : 'w-px h-full'; // Vertical line

  const colorClasses = gradient
    ? 'bg-gradient-to-r from-transparent via-border to-transparent dark:via-white/10'
    : 'bg-border dark:bg-panel/20';

  return <div className={`${baseClasses} ${colorClasses} ${className}`} aria-hidden="true" />;
}
