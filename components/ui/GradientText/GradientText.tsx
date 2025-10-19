/**
 * GradientText Component - Animated gradient text
 * From ReactBits - Perfect for headings and CTAs
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  className = '',
  from = '#0047FF',
  via = '#3366FF',
  to = '#0047FF',
  animate = true,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to})`,
    backgroundSize: animate ? '200% auto' : '100% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  if (!animate) {
    return (
      <span className={className} style={gradientStyle}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      style={gradientStyle}
      animate={{
        backgroundPosition: ['0% center', '200% center'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}
