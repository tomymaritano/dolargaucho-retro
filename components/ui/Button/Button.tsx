/**
 * Button - Ultra Minimal
 *
 * Features:
 * - Clean, minimal design (Stripe/Vercel style)
 * - Solid backgrounds
 * - Subtle lift on hover
 * - Optional StarBorder effect
 */

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { buttonVariants, type ButtonVariants } from './buttonVariants';
import { StarBorder } from '@/components/ui/StarBorder';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'>, ButtonVariants {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showStars?: boolean; // Enable StarBorder effect
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      children,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      showStars = false,
      ...props
    },
    ref
  ) => {
    const buttonContent = (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Left Icon */}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}

        {/* Text Content */}
        <span>{isLoading && loadingText ? loadingText : children}</span>

        {/* Right Icon */}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </motion.button>
    );

    // Wrap with StarBorder if enabled
    if (showStars) {
      return <StarBorder starCount={12}>{buttonContent}</StarBorder>;
    }

    return buttonContent;
  }
);

Button.displayName = 'Button';
