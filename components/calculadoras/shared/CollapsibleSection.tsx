/**
 * CollapsibleSection Component
 *
 * Single Responsibility: Collapsible section for secondary information
 * Features:
 * - Click to expand/collapse
 * - Smooth animation
 * - Compact header
 * - Optional icon
 */

import React, { useState, ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/5/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-panel/30 hover:bg-panel/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-brand text-sm">{icon}</span>}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-secondary text-xs" />
        ) : (
          <FaChevronDown className="text-secondary text-xs" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 bg-background-dark/50 border-t border-white/10/30 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
