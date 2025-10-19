/**
 * TechStackLogos - Display tech stack icons with subtle animations
 *
 * Componentizable tech stack display with:
 * - Icon-only display (cleaner than badges)
 * - Hover lift effect
 * - Staggered entry animations
 * - Tooltips on hover
 */

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface TechStackItem {
  icon: IconType;
  name: string;
  color: string;
}

interface TechStackLogosProps {
  /** Array of tech stack items */
  stack: TechStackItem[];
  /** Size of icons (default: 2xl) */
  size?: 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Show labels below icons (default: false) */
  showLabels?: boolean;
  /** Base delay for stagger animation (default: 0.4) */
  baseDelay?: number;
  /** Class name for container */
  className?: string;
}

const sizeClasses = {
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export function TechStackLogos({
  stack,
  size = '2xl',
  showLabels = false,
  baseDelay = 0.4,
  className = '',
}: TechStackLogosProps) {
  return (
    <div className={`flex flex-wrap justify-center items-center gap-4 ${className}`}>
      {stack.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="group cursor-default flex flex-col items-center gap-2"
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: baseDelay + index * 0.05, type: 'spring', stiffness: 400 }}
          title={tech.name}
        >
          <tech.icon
            className={`${sizeClasses[size]} ${tech.color} opacity-60 group-hover:opacity-100 transition-opacity`}
          />
          {showLabels && (
            <span className="text-xs text-secondary group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
              {tech.name}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
