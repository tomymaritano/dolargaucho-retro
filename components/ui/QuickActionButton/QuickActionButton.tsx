/**
 * QuickActionButton Component
 *
 * Large, prominent action buttons with icons
 * Common pattern in fintech apps for primary actions
 * Examples: "Transfer", "Pay", "Request", "Add Money"
 *
 * Features:
 * - Large touch targets (mobile-first)
 * - Icon + label + optional description
 * - Color variants
 * - Badge support (for notifications)
 * - Disabled state
 * - Hover effects with scale and glow
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const quickActionButtonVariants = cva(
  'relative flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-300 cursor-pointer group',
  {
    variants: {
      variant: {
        emerald: 'bg-brand/10 hover:bg-brand/20 border-2 border-brand/20 hover:border-brand/40',
        blue: 'bg-accent-blue/10 hover:bg-accent-blue/20 border-2 border-accent-blue/20 hover:border-accent-blue/40',
        purple:
          'bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/20 hover:border-purple-500/40',
        gold: 'bg-accent-gold/10 hover:bg-accent-gold/20 border-2 border-accent-gold/20 hover:border-accent-gold/40',
        gray: 'bg-secondary/10 hover:bg-secondary/20 border-2 border-secondary/20 hover:border-secondary/40',
        solid: 'bg-brand hover:bg-brand-light text-background-dark border-2 border-transparent',
      },
      size: {
        sm: 'p-4 min-w-[100px]',
        md: 'p-6 min-w-[120px]',
        lg: 'p-8 min-w-[140px]',
      },
      disabled: {
        true: 'opacity-40 cursor-not-allowed',
        false: 'hover:scale-[1.02] active:scale-95',
      },
    },
    defaultVariants: {
      variant: 'emerald',
      size: 'md',
      disabled: false,
    },
  }
);

export interface QuickActionButtonProps extends VariantProps<typeof quickActionButtonVariants> {
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: number;
  onClick?: () => void;
  className?: string;
}

export const QuickActionButton = memo(function QuickActionButton({
  icon,
  label,
  description,
  badge,
  variant,
  size,
  disabled,
  onClick,
  className,
}: QuickActionButtonProps) {
  // Icon color based on variant
  const iconColorClasses = {
    emerald: 'text-brand',
    blue: 'text-accent-blue',
    purple: 'text-purple-400',
    gold: 'text-accent-gold',
    gray: 'text-secondary',
    solid: 'text-background-dark',
  };

  const iconColor = iconColorClasses[variant || 'emerald'];

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || undefined}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={cn(quickActionButtonVariants({ variant, size, disabled, className }))}
    >
      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-error text-white text-xs font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg">
          {badge > 99 ? '99+' : badge}
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'text-3xl transition-transform duration-300 group-hover:scale-110',
          iconColor
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <div className="text-center">
        <div
          className={cn(
            'font-bold text-foreground transition-colors duration-300',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          )}
        >
          {label}
        </div>

        {/* Description */}
        {description && (
          <div className="text-xs text-secondary mt-1 max-w-[120px] line-clamp-2">
            {description}
          </div>
        )}
      </div>
    </motion.button>
  );
});

// Grid container for quick actions
export const QuickActionsGrid = memo(function QuickActionsGrid({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return <div className={cn('grid gap-4', gridCols[columns], className)}>{children}</div>;
});
