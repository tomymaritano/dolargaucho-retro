/**
 * IconBadge Component
 *
 * Fintech-style colored icon backgrounds
 * Common pattern in Mercado Pago, Ualá, Nubank, Brubank
 *
 * Features:
 * - Multiple color variants (emerald, blue, purple, orange, red)
 * - Size variants (xs, sm, md, lg, xl)
 * - Shape variants (circle, rounded, square)
 * - Automatic icon sizing
 * - Hover effects with scale and glow
 */

import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const iconBadgeVariants = cva('inline-flex items-center justify-center transition-all', {
  variants: {
    color: {
      emerald: 'bg-brand/20 text-brand hover:bg-brand/30',
      teal: 'bg-brand-light/20 text-brand-light hover:bg-brand-light/30',
      blue: 'bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30',
      indigo: 'bg-accent-indigo/20 text-accent-indigo hover:bg-accent-indigo/30',
      purple: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
      orange: 'bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30',
      red: 'bg-error/20 text-error hover:bg-error/30',
      gray: 'bg-secondary/20 text-secondary hover:bg-secondary/30',
    },
    size: {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    },
    shape: {
      circle: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-md',
    },
    hover: {
      none: '',
      scale: 'hover:scale-110',
      glow: 'hover:shadow-glow-green',
      lift: 'hover:-translate-y-0.5',
    },
  },
  defaultVariants: {
    color: 'emerald',
    size: 'md',
    shape: 'circle',
    hover: 'scale',
  },
});

export interface IconBadgeProps extends VariantProps<typeof iconBadgeVariants> {
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const IconBadge = memo(function IconBadge({
  color,
  size,
  shape,
  hover,
  icon,
  className,
  onClick,
}: IconBadgeProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        iconBadgeVariants({ color, size, shape, hover, className }),
        onClick && 'cursor-pointer active:scale-95'
      )}
    >
      {icon}
    </Component>
  );
});
