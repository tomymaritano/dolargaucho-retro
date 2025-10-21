'use client';

/**
 * PageHeader - Unified header component for dashboard pages
 *
 * Solves inconsistency #1: 3 different header styles across dashboard
 *
 * Features:
 * - Breadcrumbs support
 * - Title with optional gradient
 * - Description/subtitle
 * - Action buttons (CTAs)
 * - Icon support
 * - Responsive design
 *
 * @example
 * // Simple header
 * <PageHeader
 *   title="Mis Alertas"
 *   description="Gestiona tus alertas de cotizaciones"
 * />
 *
 * @example
 * // With breadcrumbs and action
 * <PageHeader
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Alertas' }
 *   ]}
 *   title="Mis Alertas"
 *   description="Gestiona tus alertas de cotizaciones"
 *   action={
 *     <Button variant="primary" href="/dashboard/alerts/new">
 *       <FaPlus className="mr-2" />
 *       Nueva Alerta
 *     </Button>
 *   }
 * />
 *
 * @example
 * // With icon and gradient title
 * <PageHeader
 *   icon={FaBell}
 *   title="Mis Alertas"
 *   titleGradient
 *   description="Gestiona tus alertas de cotizaciones"
 * />
 */

import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaChevronRight } from 'react-icons/fa';
import { GradientText } from '../GradientText';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  /** Breadcrumb navigation items */
  breadcrumbs?: Breadcrumb[];
  /** Optional icon to display before title */
  icon?: IconType;
  /** Main title text */
  title: string;
  /** Apply gradient to title */
  titleGradient?: boolean;
  /** Optional description/subtitle */
  description?: string;
  /** Optional action button(s) - typically a Button or LinkButton */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function PageHeader({
  breadcrumbs,
  icon: Icon,
  title,
  titleGradient = false,
  description,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-secondary hover:text-brand transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'text-foreground font-semibold' : 'text-secondary'}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}

                {!isLast && (
                  <FaChevronRight className="text-secondary text-xs" aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Title + Description */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <div className="p-3 bg-brand/10 rounded-xl">
                <Icon className="text-brand text-2xl" aria-hidden="true" />
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {titleGradient ? <GradientText className="font-bold">{title}</GradientText> : title}
            </h1>
          </div>

          {description && (
            <p className="text-secondary text-base md:text-lg leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Action Button(s) */}
        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>
    </header>
  );
}
