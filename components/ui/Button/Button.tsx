import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-accent-emerald text-background hover:bg-accent-teal focus:ring-accent-emerald',
        secondary: 'glass border border-border text-foreground hover:bg-white/10 focus:ring-accent-emerald/20',
        outline:
          'border-2 border-accent-emerald text-accent-emerald hover:bg-accent-emerald/10 focus:ring-accent-emerald',
        ghost: 'text-accent-emerald hover:bg-accent-emerald/10',
        danger: 'bg-error text-foreground hover:bg-error/90 focus:ring-error',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
        xl: 'px-8 py-5 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button = memo(function Button({
  className,
  variant,
  size,
  fullWidth,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});
