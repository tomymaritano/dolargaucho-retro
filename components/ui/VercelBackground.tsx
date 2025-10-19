'use client';

/**
 * VercelBackground - Vercel-style background with radial gradient and dots
 *
 * Features:
 * - Radial gradient from center
 * - Subtle dot pattern
 * - Adapts to light/dark mode
 */

import React from 'react';

export function VercelBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Radial gradient base - más intenso */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 71, 255, 0.3), transparent)',
        }}
      />

      {/* Secondary gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 100% 100%, rgba(80, 86, 169, 0.2), transparent)',
        }}
      />

      {/* Dot pattern - más visible */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette effect suave */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--background) 100%)',
        }}
      />
    </div>
  );
}
