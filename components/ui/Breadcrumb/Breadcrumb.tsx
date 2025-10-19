/**
 * Breadcrumb Component
 *
 * Single Responsibility: Show navigation hierarchy with clickable links
 * Uses daisyUI breadcrumb styling with custom theme integration
 */

import React from 'react';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <div className={`breadcrumbs text-sm text-secondary mb-6 ${className}`}>
      <ul>
        {/* Home link always present */}
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-brand transition-colors"
          >
            <FaHome className="text-xs" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>

        {/* Dynamic items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={index}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 hover:text-brand transition-colors"
                >
                  {Icon && <Icon className="text-xs" />}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-2 ${isLast ? 'text-foreground font-semibold' : ''}`}
                >
                  {Icon && <Icon className="text-xs" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Breadcrumb separator component (optional override)
 */
export function BreadcrumbSeparator({ className = '' }: { className?: string }) {
  return <FaChevronRight className={`text-xs text-secondary/50 ${className}`} />;
}
