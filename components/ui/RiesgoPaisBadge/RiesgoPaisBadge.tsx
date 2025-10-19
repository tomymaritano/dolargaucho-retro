'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useRiesgoPaisWithVariation } from '@/hooks/useFinanzas';

export function RiesgoPaisBadge() {
  const { data, isLoading } = useRiesgoPaisWithVariation();

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse">
        <div className="h-4 w-20 bg-white/10 rounded" />
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

  return (
    <Link
      href="/dashboard/finanzas"
      className="hidden md:block group"
      title="Ver detalles de Riesgo País"
    >
      <div className="flex flex-col gap-1 px-3 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors cursor-pointer">
        <span className="text-[10px] text-secondary uppercase tracking-wider">Riesgo País</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground tabular-nums transition-colors">
            {riesgoPais.valor.toLocaleString('es-AR')}
          </span>
          {!isNeutral && VariationIcon && (
            <div className={`flex items-center gap-1 ${variationColor}`}>
              <VariationIcon className="text-xs" />
              <span className="text-xs font-semibold tabular-nums">{percentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
