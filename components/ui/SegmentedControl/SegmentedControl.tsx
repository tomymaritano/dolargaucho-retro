/**
 * SegmentedControl Component
 *
 * iOS-style segmented control for filtering/tabs
 * Common pattern in Ualá, Mercado Pago, Nubank
 *
 * Features:
 * - Smooth sliding indicator animation
 * - Keyboard navigation (arrow keys)
 * - Accessibility support
 * - Size variants (sm, md, lg)
 * - Full width or auto width
 * - Icon support
 */

import { memo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedControl = memo(function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className,
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Calculate indicator position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = options.findIndex((opt) => opt.value === value);
    const buttons = container.querySelectorAll('button');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [value, options]);

  // Size classes
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const paddingClasses = {
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-5',
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevOption = options[index - 1];
      if (!prevOption.disabled) onChange(prevOption.value);
    } else if (e.key === 'ArrowRight' && index < options.length - 1) {
      e.preventDefault();
      const nextOption = options[index + 1];
      if (!nextOption.disabled) onChange(nextOption.value);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex p-1 glass rounded-lg', fullWidth && 'w-full', className)}
      role="tablist"
    >
      {/* Animated background indicator */}
      <motion.div
        className="absolute bg-brand rounded-md"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          height: `calc(100% - 8px)`,
          top: 4,
        }}
      />

      {/* Segment buttons */}
      {options.map((option, index) => {
        const isActive = option.value === value;
        const isDisabled = option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200',
              sizeClasses[size],
              paddingClasses[size],
              fullWidth && 'flex-1',
              isActive ? 'text-background-dark' : 'text-secondary hover:text-foreground',
              isDisabled && 'opacity-40 cursor-not-allowed',
              !isDisabled && 'cursor-pointer'
            )}
          >
            {option.icon && (
              <span className={cn('flex-shrink-0', size === 'sm' && 'text-xs')}>{option.icon}</span>
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
});
