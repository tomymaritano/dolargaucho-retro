/**
 * LinearProgress Component
 *
 * Linear progress bar for loading states and completion tracking
 * Common in fintech apps for loading, steps, and progress
 *
 * Features:
 * - Determinate (specific percentage) or indeterminate (loading)
 * - Gradient support
 * - Size variants
 * - Color variants
 * - Animated fills
 * - Label support
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface LinearProgressProps {
  value?: number; // 0-100, undefined for indeterminate
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'purple' | 'gold' | 'error';
  gradient?: boolean;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const LinearProgress = memo(function LinearProgress({
  value,
  size = 'md',
  color = 'emerald',
  gradient = false,
  showPercentage = false,
  label,
  className,
}: LinearProgressProps) {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(Math.max(value, 0), 100);

  // Size configurations
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Color configurations
  const colorClasses = {
    emerald: gradient ? 'bg-gradient-to-r from-brand to-brand-light' : 'bg-brand',
    blue: gradient ? 'bg-gradient-to-r from-accent-blue to-accent-indigo' : 'bg-accent-blue',
    purple: gradient ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-purple-500',
    gold: gradient ? 'bg-gradient-to-r from-accent-gold to-orange-500' : 'bg-accent-gold',
    error: gradient ? 'bg-gradient-to-r from-error to-red-400' : 'bg-error',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label and percentage */}
      {(label || (showPercentage && !isIndeterminate)) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-secondary">{label}</span>}
          {showPercentage && !isIndeterminate && (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={cn(
          'w-full bg-white/10 dark:bg-white/10 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        {isIndeterminate ? (
          /* Indeterminate animation */
          <motion.div
            className={cn('h-full rounded-full', colorClasses[color])}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '50%' }}
          />
        ) : (
          /* Determinate progress */
          <motion.div
            className={cn('h-full rounded-full', colorClasses[color])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
});

// Pre-configured variants for common use cases
export const LoadingProgress = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <LinearProgress size={size} color="emerald" gradient />
);

export const StepProgress = ({
  currentStep,
  totalSteps,
  size = 'md',
}: {
  currentStep: number;
  totalSteps: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) => {
  const percentage = (currentStep / totalSteps) * 100;
  return (
    <LinearProgress
      value={percentage}
      size={size}
      color="emerald"
      gradient
      label={`Paso ${currentStep} de ${totalSteps}`}
    />
  );
};
