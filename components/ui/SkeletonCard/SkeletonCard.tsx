/**
 * SkeletonCard Component
 *
 * Skeleton screens for better loading UX
 * Common pattern in fintech apps while data loads
 *
 * Features:
 * - Multiple pre-built variants (card, list, table, stat)
 * - Animated shimmer effect
 * - Customizable shapes (circle, rectangle, rounded)
 * - Size variants
 * - Composition support for custom layouts
 */

import { memo } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'circle' | 'rectangle' | 'rounded';
  width?: string;
  height?: string;
  animate?: boolean;
}

export const Skeleton = memo(function Skeleton({
  className,
  variant = 'rounded',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const variantClasses = {
    circle: 'rounded-full',
    rectangle: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-white/5 dark:bg-white/5',
        animate && 'animate-pulse',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
});

// Pre-built skeleton variants
export const SkeletonCard = memo(function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-strong border border-border rounded-xl p-6 space-y-4', className)}>
      {/* Header with icon and title */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="16px" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2">
        <Skeleton width="100%" height="12px" />
        <Skeleton width="90%" height="12px" />
        <Skeleton width="70%" height="12px" />
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 pt-2">
        <Skeleton width="100px" height="36px" />
        <Skeleton width="100px" height="36px" />
      </div>
    </div>
  );
});

export const SkeletonList = memo(function SkeletonList({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 glass-strong rounded-lg">
          <Skeleton variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height="16px" />
            <Skeleton width="50%" height="12px" />
          </div>
          <Skeleton width="60px" height="24px" />
        </div>
      ))}
    </div>
  );
});

export const SkeletonTable = memo(function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn('glass-strong border border-border rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={i === 0 ? '30%' : '20%'} height="16px" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 p-4 border-b border-border last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={colIndex === 0 ? '30%' : '20%'} height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
});

export const SkeletonStat = memo(function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('glass-strong border border-border rounded-xl p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="40%" height="16px" />
        <Skeleton variant="circle" width="32px" height="32px" />
      </div>
      <Skeleton width="60%" height="32px" className="mb-2" />
      <Skeleton width="30%" height="12px" />
    </div>
  );
});

export const SkeletonDashboard = memo(function SkeletonDashboard({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>

      {/* Main content */}
      <SkeletonCard />
      <SkeletonTable rows={8} />
    </div>
  );
});
