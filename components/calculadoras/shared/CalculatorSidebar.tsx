/**
 * CalculatorSidebar Component
 *
 * Single Responsibility: Sidebar container for calculator inputs
 * Features:
 * - Fixed 320px width
 * - Compact padding (p-4)
 * - Sticky positioning option
 * - Consistent styling across calculators
 */

import React, { ReactNode } from 'react';

interface CalculatorSidebarProps {
  children: ReactNode;
  sticky?: boolean;
  title?: string;
  subtitle?: string;
}

export function CalculatorSidebar({
  children,
  sticky = false,
  title,
  subtitle,
}: CalculatorSidebarProps) {
  return (
    <div
      className={`w-[320px] flex-shrink-0 bg-panel/50 ${sticky ? 'sticky top-0 self-start' : ''}`}
    >
      <div className="p-4 space-y-4">
        {(title || subtitle) && (
          <div className="pb-3 border-b border-border/10/50">
            {title && <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>}
            {subtitle && <p className="text-xs text-secondary">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
