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
      {/* Base background color - adapts to theme */}
      <div className="fixed inset-0 -z-10 bg-white dark:bg-[#0A0A0A]" />

      {/* Gradient layers - different colors for light/dark mode */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Primary gradient - top center */}
        <div className="absolute inset-0 bg-gradient-radial-light dark:bg-gradient-radial-dark-primary" />

        {/* Secondary gradient - bottom right */}
        <div className="absolute inset-0 bg-gradient-radial-light-secondary dark:bg-gradient-radial-dark-secondary" />

        {/* Tertiary gradient - bottom left */}
        <div className="absolute inset-0 bg-gradient-radial-light-tertiary dark:bg-gradient-radial-dark-tertiary" />
      </div>

      {/* Add custom styles for gradients */}
      <style jsx>{`
        .bg-gradient-radial-light {
          background: radial-gradient(
            ellipse 80% 50% at 50% -20%,
            rgba(0, 71, 255, 0.1),
            transparent 70%
          );
        }
        .bg-gradient-radial-light-secondary {
          background: radial-gradient(
            ellipse 60% 80% at 100% 100%,
            rgba(139, 92, 246, 0.08),
            transparent 70%
          );
        }
        .bg-gradient-radial-light-tertiary {
          background: radial-gradient(
            ellipse 60% 80% at 0% 100%,
            rgba(0, 71, 255, 0.06),
            transparent 70%
          );
        }

        .bg-gradient-radial-dark-primary {
          background: radial-gradient(
            ellipse 80% 50% at 50% -20%,
            rgba(0, 71, 255, 0.4),
            transparent 70%
          );
        }
        .bg-gradient-radial-dark-secondary {
          background: radial-gradient(
            ellipse 60% 80% at 100% 100%,
            rgba(80, 86, 169, 0.3),
            transparent 70%
          );
        }
        .bg-gradient-radial-dark-tertiary {
          background: radial-gradient(
            ellipse 60% 80% at 0% 100%,
            rgba(0, 71, 255, 0.15),
            transparent 70%
          );
        }
      `}</style>
    </>
  );
}
