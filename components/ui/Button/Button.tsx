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
import { motion, type HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { buttonVariants, type ButtonVariants } from './buttonVariants';
import { StarBorder } from '@/components/ui/StarBorder';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BorderAnimationButton } from '@/components/ui/ShimmerButton';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'>, ButtonVariants {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showStars?: boolean; // Enable StarBorder effect
  magnetic?: boolean; // Enable Magnetic effect
  magneticStrength?: number; // Magnetic strength (0-1)
  ripple?: boolean; // Enable Ripple effect
  rippleDuration?: number; // Ripple animation duration (ms)
  shimmer?: boolean; // Enable Shimmer/shine effect
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
      magnetic = false,
      magneticStrength = 0.4,
      ripple = false,
      rippleDuration = 600,
      shimmer = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const { ripples, addRipple } = useRipple(rippleDuration);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !isLoading) {
        addRipple(e);
      }
      onClick?.(e);
    };

    const buttonContent = (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          'relative overflow-hidden',
          className
        )}
        disabled={disabled || isLoading}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effect */}
        {ripple && (
          <span className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  className="absolute rounded-full"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                  }}
                  initial={{
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0.8,
                  }}
                  animate={{
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: rippleDuration / 1000,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </AnimatePresence>
          </span>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Left Icon */}
        {!isLoading && leftIcon && <span className="inline-flex relative z-10">{leftIcon}</span>}

        {/* Text Content */}
        <span className="relative z-10">{isLoading && loadingText ? loadingText : children}</span>

        {/* Right Icon */}
        {!isLoading && rightIcon && <span className="inline-flex relative z-10">{rightIcon}</span>}
      </motion.button>
    );

    // Wrap with effects
    let wrappedContent = buttonContent;

    // Apply StarBorder if enabled
    if (showStars) {
      wrappedContent = <StarBorder starCount={12}>{wrappedContent}</StarBorder>;
    }

    // Apply Border Animation effect if enabled
    if (shimmer && !disabled && !isLoading) {
      wrappedContent = (
        <BorderAnimationButton disabled={disabled}>{wrappedContent}</BorderAnimationButton>
      );
    }

    // Apply Magnetic effect if enabled
    if (magnetic && !disabled && !isLoading) {
      wrappedContent = (
        <MagneticButton magneticStrength={magneticStrength}>{wrappedContent}</MagneticButton>
      );
    }

    return wrappedContent;
  }
);

Button.displayName = 'Button';
