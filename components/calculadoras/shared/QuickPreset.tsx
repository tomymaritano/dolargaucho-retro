/**
 * QuickPreset Component
 *
 * Single Responsibility: Small preset button chips for quick value selection
 * Features:
 * - Compact size
 * - Active state styling
 * - Hover effects
 */

import React from 'react';

interface QuickPresetProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export function QuickPreset({ label, isActive, onClick, className = '' }: QuickPresetProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs font-medium rounded transition-all ${
        isActive
          ? 'bg-brand text-background-dark border border-brand'
          : 'bg-background-dark text-secondary border border-slate-700 hover:border-brand/50 hover:text-brand'
      } ${className}`}
    >
      {label}
    </button>
  );
}
