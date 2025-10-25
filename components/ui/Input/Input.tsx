import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import React from 'react';

const inputVariants = cva(
  'w-full rounded-lg font-medium transition-all outline-none disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-panel/10 border border-border text-foreground placeholder-secondary/60 focus:bg-white/[0.07] focus:border-white/20 hover:border-white/15',
        outlined:
          'bg-transparent border border-brand/30 text-foreground placeholder-secondary/60 focus:border-brand hover:border-brand/50',
        filled:
          'bg-panel border border-border text-foreground placeholder-secondary/60 focus:border-white/20 hover:border-white/15',
        error:
          'bg-white/5 border border-red-500/50 text-foreground placeholder-secondary/60 focus:border-red-500 hover:border-red-500/60',
      },
      inputSize: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
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
          <label className="block text-sm font-semibold text-foreground mb-2">
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
