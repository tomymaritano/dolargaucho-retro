/**
 * CircularProgress Component
 *
 * Circular progress indicator for metrics, goals, completion
 * Common in fintech apps for savings goals, budget usage, etc.
 *
 * Features:
 * - Animated progress fill
 * - Customizable colors
 * - Size variants
 * - Center content support (label, value, icon)
 * - Gradient support
 * - Smooth animations
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface CircularProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'emerald' | 'blue' | 'purple' | 'gold' | 'error';
  strokeWidth?: number;
  showPercentage?: boolean;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const CircularProgress = memo(function CircularProgress({
  value,
  size = 'md',
  color = 'emerald',
  strokeWidth,
  showPercentage = false,
  label,
  children,
  className,
  gradient = false,
}: CircularProgressProps) {
  // Clamp value between 0 and 100
  const percentage = Math.min(Math.max(value, 0), 100);

  // Size configurations
  const sizeConfig = {
    sm: { diameter: 48, defaultStrokeWidth: 4, fontSize: 'text-xs' },
    md: { diameter: 80, defaultStrokeWidth: 6, fontSize: 'text-sm' },
    lg: { diameter: 120, defaultStrokeWidth: 8, fontSize: 'text-lg' },
    xl: { diameter: 160, defaultStrokeWidth: 10, fontSize: 'text-xl' },
  };

  const { diameter, defaultStrokeWidth, fontSize } = sizeConfig[size];
  const stroke = strokeWidth || defaultStrokeWidth;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color configurations
  const colorConfig = {
    emerald: {
      stroke: '#10B981',
      gradient: { from: '#10B981', to: '#14B8A6' },
    },
    blue: {
      stroke: '#3B82F6',
      gradient: { from: '#3B82F6', to: '#6366F1' },
    },
    purple: {
      stroke: '#A855F7',
      gradient: { from: '#A855F7', to: '#EC4899' },
    },
    gold: {
      stroke: '#F59E0B',
      gradient: { from: '#F59E0B', to: '#F97316' },
    },
    error: {
      stroke: '#EF4444',
      gradient: { from: '#EF4444', to: '#F87171' },
    },
  };

  const colors = colorConfig[color];
  const gradientId = `gradient-${color}-${size}`;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Gradient definition */}
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gradient.from} />
              <stop offset="100%" stopColor={colors.gradient.to} />
            </linearGradient>
          </defs>
        )}

        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-white/10 dark:text-white/10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={gradient ? `url(#${gradientId})` : colors.stroke}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            {showPercentage && (
              <span className={cn('font-bold text-foreground tabular-nums', fontSize)}>
                {Math.round(percentage)}%
              </span>
            )}
            {label && (
              <span
                className={cn('text-secondary mt-1', size === 'sm' ? 'text-[10px]' : 'text-xs')}
              >
                {label}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
});

// Pre-configured variants for common use cases
export const ProgressGoal = ({
  current,
  target,
  size = 'md',
  color = 'emerald',
}: {
  current: number;
  target: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'emerald' | 'blue' | 'purple' | 'gold' | 'error';
}) => {
  const percentage = (current / target) * 100;
  return (
    <CircularProgress value={percentage} size={size} color={color} gradient>
      <div className="text-center">
        <div className={cn('font-bold text-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ${current.toLocaleString()}
        </div>
        <div className={cn('text-secondary', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          de ${target.toLocaleString()}
        </div>
      </div>
    </CircularProgress>
  );
};
