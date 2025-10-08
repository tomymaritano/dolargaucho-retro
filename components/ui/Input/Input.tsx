import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import React from 'react';

const inputVariants = cva(
  'w-full px-4 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'glass border border-white/10 text-white placeholder-secondary focus:border-accent-emerald/50 focus:ring-accent-emerald/20',
        outlined:
          'bg-transparent border-2 border-accent-emerald/30 text-white placeholder-secondary focus:border-accent-emerald focus:ring-accent-emerald/20',
        filled:
          'bg-dark-light border border-white/5 text-white placeholder-secondary focus:border-accent-emerald/50 focus:ring-accent-emerald/20',
        error:
          'glass border border-error/50 text-white placeholder-secondary focus:border-error focus:ring-error/20',
      },
      inputSize: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, helperText, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-white mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={cn(
            inputVariants({ variant: hasError ? 'error' : variant, inputSize, className })
          )}
          {...props}
        />

        {(error || helperText) && (
          <p className={cn('mt-2 text-sm', hasError ? 'text-error' : 'text-secondary')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
