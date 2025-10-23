/**
 * CompactInput Component
 *
 * Single Responsibility: Compact input field for calculator sidebars
 * Features:
 * - Small height (36px) for maximum density
 * - Optional inline label
 * - Optional tooltip with help icon
 * - Support for different input types
 */

import React, { ReactNode } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';

interface CompactInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  prefix?: ReactNode;
  suffix?: string;
  tooltip?: string;
  className?: string;
}

export function CompactInput({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  min,
  max,
  step,
  prefix,
  suffix,
  tooltip,
  className = '',
}: CompactInputProps) {
  return (
    <div className={`group ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-secondary group-focus-within:text-brand transition-colors">
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <FaQuestionCircle className="text-secondary hover:text-brand cursor-help text-xs transition-colors" />
          </Tooltip>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'} py-2 h-9 text-sm font-mono font-semibold bg-background-dark border border-slate-700 rounded-lg focus:ring-1 focus:ring-brand/30 focus:border-brand/50 focus:outline-none transition-all text-foreground`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-xs font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
