/**
 * SectionHeader Component
 *
 * Reusable section header for calculator sections
 * Provides visual hierarchy and clear delineation between calculator sections
 *
 * Accessibility:
 * - Uses semantic heading level
 * - Icon has decorative role
 * - Clear visual and semantic structure
 */

import React from 'react';
import { IconType } from 'react-icons';

interface SectionHeaderProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  headingLevel = 'h3',
  className = '',
}: SectionHeaderProps) {
  const HeadingTag = headingLevel;

  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <div className="p-2 rounded-lg bg-brand/10 flex-shrink-0" aria-hidden="true">
        <Icon className="text-brand text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <HeadingTag className="text-sm font-semibold text-foreground">{title}</HeadingTag>
        {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
