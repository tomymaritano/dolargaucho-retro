/**
 * StatusBadge Component
 *
 * Pill-style badges for status indicators
 * Common in fintech apps for labels like NEW, POPULAR, TRENDING, HOT
 *
 * Features:
 * - Multiple variants (success, info, warning, error, default)
 * - Size variants (xs, sm, md, lg)
 * - Optional icon
 * - Automatic uppercase text
 * - Pulse animation option for attention-grabbing
 */

import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 font-bold uppercase tracking-wide transition-all',
  {
    variants: {
      variant: {
        success: 'bg-success text-background-dark',
        info: 'bg-accent-blue text-background-dark',
        warning: 'bg-warning text-background-dark',
        error: 'bg-error text-background-dark',
        emerald: 'bg-brand text-background-dark',
        purple: 'bg-purple-500 text-white',
        gold: 'bg-accent-gold text-background-dark',
        default: 'bg-secondary/20 text-secondary',
        outlined: 'border-2 border-brand text-brand bg-transparent',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-[9px] rounded',
        sm: 'px-2 py-0.5 text-[10px] rounded-md',
        md: 'px-2.5 py-1 text-xs rounded-md',
        lg: 'px-3 py-1.5 text-sm rounded-lg',
      },
      pulse: {
        true: 'animate-pulse-slow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'emerald',
      size: 'sm',
      pulse: false,
    },
  }
);

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge = memo(function StatusBadge({
  variant,
  size,
  pulse,
  icon,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size, pulse, className }))}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
});

// Pre-configured badges for common use cases
export const NewBadge = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <StatusBadge variant="emerald" size={size} pulse>
    Nuevo
  </StatusBadge>
);

export const PopularBadge = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <StatusBadge variant="purple" size={size}>
    Popular
  </StatusBadge>
);

export const TrendingBadge = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <StatusBadge variant="gold" size={size}>
    Tendencia
  </StatusBadge>
);

export const HotBadge = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <StatusBadge variant="error" size={size} pulse>
    Hot
  </StatusBadge>
);
