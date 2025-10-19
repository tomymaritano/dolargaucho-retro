/**
 * LinkButton - Ultra Minimal Link with Next.js
 *
 * Same ultra minimal design as Button but works with Next Link
 */

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { buttonVariants, type ButtonVariants } from './buttonVariants';
import { StarBorder } from '@/components/ui/StarBorder';
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
      ...props
    },
    ref
  ) => {
    const MotionLink = motion(Link);

    const linkContent = (
      <MotionLink
        ref={ref}
        href={href}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        onClick={onClick}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}

        {/* Text */}
        <span>{children}</span>

        {/* Right Icon */}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </MotionLink>
    );

    // Wrap with StarBorder if enabled
    if (showStars) {
      return <StarBorder starCount={12}>{linkContent}</StarBorder>;
    }

    return linkContent;
  }
);

LinkButton.displayName = 'LinkButton';
