/**
 * LinkButton - Ultra Minimal Link with Next.js
 *
 * Same ultra minimal design as Button but works with Next Link
 */

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, type ButtonVariants } from './buttonVariants';
import { StarBorder } from '@/components/ui/StarBorder';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BorderAnimationButton } from '@/components/ui/ShimmerButton';
import { useRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils/cn';

export interface LinkButtonProps extends ButtonVariants {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  showStars?: boolean; // Enable StarBorder effect
  magnetic?: boolean; // Enable Magnetic effect
  magneticStrength?: number; // Magnetic strength (0-1)
  ripple?: boolean; // Enable Ripple effect
  rippleDuration?: number; // Ripple animation duration (ms)
  shimmer?: boolean; // Enable Shimmer/shine effect
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      href,
      children,
      variant,
      size,
      fullWidth,
      external = false,
      leftIcon,
      rightIcon,
      className,
      onClick,
      showStars = false,
      magnetic = false,
      magneticStrength = 0.4,
      ripple = false,
      rippleDuration = 600,
      shimmer = false,
      ...props
    },
    ref
  ) => {
    const MotionLink = motion(Link);
    const { ripples, addRipple } = useRipple(rippleDuration);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (ripple) {
        addRipple(e);
      }
      onClick?.();
    };

    const linkContent = (
      <MotionLink
        ref={ref}
        href={href}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          'relative overflow-hidden',
          className
        )}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        whileTap={{ scale: 0.98 }}
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

        {/* Left Icon */}
        {leftIcon && <span className="inline-flex relative z-10">{leftIcon}</span>}

        {/* Text */}
        <span className="relative z-10">{children}</span>

        {/* Right Icon */}
        {rightIcon && <span className="inline-flex relative z-10">{rightIcon}</span>}
      </MotionLink>
    );

    // Wrap with effects
    let wrappedContent = linkContent;

    // Apply StarBorder if enabled
    if (showStars) {
      wrappedContent = <StarBorder starCount={12}>{wrappedContent}</StarBorder>;
    }

    // Apply Border Animation effect if enabled
    if (shimmer) {
      wrappedContent = <BorderAnimationButton>{wrappedContent}</BorderAnimationButton>;
    }

    // Apply Magnetic effect if enabled
    if (magnetic) {
      wrappedContent = (
        <MagneticButton magneticStrength={magneticStrength}>{wrappedContent}</MagneticButton>
      );
    }

    return wrappedContent;
  }
);

LinkButton.displayName = 'LinkButton';
