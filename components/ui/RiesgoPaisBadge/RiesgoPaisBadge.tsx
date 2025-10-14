'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import { useRiesgoPaisWithVariation } from '@/hooks/useFinanzas';
import ElectricBorder from '@/components/ui/ElectricBorder/ElectricBorder';

export function RiesgoPaisBadge() {
  const { data, isLoading } = useRiesgoPaisWithVariation();

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-2 glass rounded-lg animate-pulse">
        <div className="h-4 w-24 bg-white/10 rounded" />
      </div>
    );
  }

  if (!data?.current) {
    return null;
  }

  const { current: riesgoPais, variation } = data;
  const { trend, percentage } = variation;
  const isNeutral = trend === 'neutral';

  const VariationIcon = isNeutral ? null : trend === 'up' ? FaArrowUp : FaArrowDown;
  const variationColor = isNeutral
    ? 'text-secondary'
    : trend === 'up'
      ? 'text-error'
      : 'text-success';

  // Electric border color based on trend
  // Up = red (bad), Down = green (good), Neutral = orange
  const electricColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#10b981' : '#f59e0b';

  return (
    <Link
      href="/dashboard/finanzas"
      className="hidden md:block group"
      title="Ver detalles de Riesgo País"
    >
      <ElectricBorder
        color={electricColor}
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 12 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-panel/80 backdrop-blur-sm hover:bg-panel transition-colors cursor-pointer">
          <FaExclamationTriangle
            className={`text-sm flex-shrink-0 ${trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning'}`}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Riesgo País
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {riesgoPais.valor.toLocaleString('es-AR')}
            </span>
            {!isNeutral && VariationIcon && (
              <div className={`flex items-center gap-1 ${variationColor}`}>
                <VariationIcon className="text-xs" />
                <span className="text-xs font-semibold tabular-nums">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </ElectricBorder>
    </Link>
  );
}
