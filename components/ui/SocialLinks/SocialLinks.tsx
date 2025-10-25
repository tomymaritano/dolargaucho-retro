/**
 * SocialLinks - Ultra Minimal Social Media Icons
 *
 * Features:
 * - Simple rounded-square outline icons
 * - No background blocks
 * - Subtle hover effects
 * - Optional StarBorder effect
 * - Stripe/Vercel style minimal design
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS, SocialLink } from '@/constants/socialLinks';
import { StarBorder } from '@/components/ui/StarBorder';

interface SocialLinksProps {
  /** Size of the links */
  size?: 'sm' | 'md' | 'lg';
  /** Enable StarBorder effect */
  showStars?: boolean;
  /** Additional class names */
  className?: string;
}

const sizeClasses = {
  square: {
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  },
  iconSize: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
};

function SocialLinkButton({
  social,
  size,
  showStars = false,
}: {
  social: SocialLink;
  size: 'sm' | 'md' | 'lg';
  showStars?: boolean;
}) {
  const Icon = social.icon;

  const buttonContent = (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      className={`group relative inline-flex items-center justify-center ${sizeClasses.square[size]} rounded-lg border border-border/5 hover:border-border/10 transition-all`}
      aria-label={social.label}
    >
      {/* Icon */}
      <Icon
        className={`${sizeClasses.iconSize[size]} text-foreground/60 group-hover:text-foreground transition-colors`}
      />
    </motion.a>
  );

  // Wrap with StarBorder if enabled
  if (showStars) {
    return (
      <StarBorder starCount={8} starColor="#0047FF" animationSpeed={3}>
        {buttonContent}
      </StarBorder>
    );
  }

  return buttonContent;
}

export function SocialLinks({ size = 'md', showStars = false, className = '' }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <SocialLinkButton key={social.label} social={social} size={size} showStars={showStars} />
      ))}
    </div>
  );
}
