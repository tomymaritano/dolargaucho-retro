'use client';

/**
 * EmptyState - Unified empty state component
 *
 * Solves inconsistency #7: Variable icon sizes and styles in empty states
 *
 * Features:
 * - Consistent icon size (5xl = 48px)
 * - Icon background with brand color
 * - Title + description
 * - Optional primary action button
 * - Optional secondary action
 * - Responsive padding
 *
 * @example
 * // No alerts
 * <EmptyState
 *   icon={FaBell}
 *   title="No tienes alertas"
 *   description="Crea tu primera alerta para recibir notificaciones cuando las cotizaciones alcancen tu objetivo"
 *   actionLabel="Crear Primera Alerta"
 *   onAction={() => router.push('/dashboard/alerts/new')}
 * />
 *
 * @example
 * // No favorites
 * <EmptyState
 *   icon={FaStar}
 *   title="No tienes favoritos"
 *   description="Guarda tus cotizaciones favoritas para acceder rápidamente desde el dashboard"
 *   actionLabel="Explorar Cotizaciones"
 *   onAction={() => router.push('/dashboard')}
 * />
 *
 * @example
 * // Search no results with secondary action
 * <EmptyState
 *   icon={FaSearch}
 *   title="Sin resultados"
 *   description={`No encontramos resultados para "${searchQuery}". Intenta con otros términos.`}
 *   actionLabel="Limpiar búsqueda"
 *   onAction={() => setSearchQuery('')}
 *   secondaryAction={{
 *     label: 'Ver todo',
 *     onClick: () => setSearchQuery('')
 *   }}
 * />
 */

import React from 'react';
import { IconType } from 'react-icons';
import { Button } from '../Button';

export interface EmptyStateProps {
  /** Icon to display (from react-icons) */
  icon: IconType;
  /** Main title */
  title: string;
  /** Description text */
  description: string;
  /** Primary action button label */
  actionLabel?: string;
  /** Primary action handler */
  onAction?: () => void;
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Icon color variant */
  variant?: 'brand' | 'success' | 'error' | 'warning' | 'secondary';
  /** Additional CSS classes */
  className?: string;
}

const variantConfig = {
  brand: {
    iconBg: 'bg-brand/10',
    iconColor: 'text-brand',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  error: {
    iconBg: 'bg-error/10',
    iconColor: 'text-error',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  secondary: {
    iconBg: 'bg-panel/10',
    iconColor: 'text-secondary',
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  variant = 'brand',
  className = '',
}: EmptyStateProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 md:py-16 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <div className={`p-8 ${config.iconBg} rounded-2xl mb-6`}>
        <Icon className={`${config.iconColor} text-5xl`} aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{title}</h3>

      {/* Description */}
      <p className="text-secondary max-w-md mb-8 leading-relaxed">{description}</p>

      {/* Actions */}
      {(actionLabel || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" size="lg" onClick={onAction}>
              {actionLabel}
            </Button>
          )}

          {secondaryAction && (
            <Button variant="secondary" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
