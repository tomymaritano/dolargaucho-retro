/**
 * MetricCard Component
 *
 * Single Responsibility: Compact card for displaying key metrics
 * Features:
 * - Reduced padding (p-3 instead of p-6)
 * - Compact text sizes
 * - Minimal animations
 * - Variant-based styling
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function MetricCard({
  label,
  value,
  sublabel,
  variant = 'success',
  className = '',
}: MetricCardProps) {
  const variantStyles = {
    success: 'bg-success/5 border-success/20',
    error: 'bg-error/5 border-error/20',
    warning: 'bg-warning/5 border-warning/20',
    info: 'bg-brand/5 border-brand/20',
  };

  const valueColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-brand',
  };

  return (
    <Card
      variant="solid"
      padding="none"
      className={`border ${variantStyles[variant]} ${className}`}
    >
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-secondary mb-1 font-medium">{label}</p>
        <p className={`text-2xl font-bold font-mono ${valueColors[variant]} leading-tight`}>
          {value}
        </p>
        {sublabel && <p className="text-xs text-secondary mt-1">{sublabel}</p>}
      </div>
    </Card>
  );
}
