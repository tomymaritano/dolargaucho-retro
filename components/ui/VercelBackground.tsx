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
    <>
      {/* Base background color */}
      <div className="fixed inset-0 -z-10 bg-[#0A0A0A] dark:bg-[#0A0A0A]" />

      {/* Gradient layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Primary gradient - top center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 71, 255, 0.4), transparent 70%)',
          }}
        />

        {/* Secondary gradient - bottom right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 100% 100%, rgba(80, 86, 169, 0.3), transparent 70%)',
          }}
        />

        {/* Tertiary gradient - bottom left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(0, 71, 255, 0.15), transparent 70%)',
          }}
        />
      </div>
    </>
  );
}
