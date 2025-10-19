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
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Radial gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 71, 255, 0.15), transparent)',
        }}
      />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, var(--background) 100%)',
        }}
      />
    </div>
  );
}
