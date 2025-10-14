'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import './DolarMarquee.css';

export function DolarMarquee() {
  const { data: dolares, isLoading } = useDolarVariations();

  if (isLoading || !dolares || dolares.length === 0) {
    return (
      <div className="sticky top-20 z-45 bg-panel/80 backdrop-blur-md border-b border-border mt-2">
        <div className="h-12 flex items-center justify-center">
          <div className="animate-pulse h-4 w-64 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  // Duplicate items for seamless loop
  const duplicatedItems = [...dolares, ...dolares];

  return (
    <div className="sticky top-20 z-[45] bg-panel/80 backdrop-blur-md border-b border-border overflow-hidden mt-2">
      <div className="marquee-wrapper">
        <div className="marquee-container">
          {duplicatedItems.map((dolar, index) => {
            const { trend, percentage } = dolar.variation;

            const VariationIcon =
              trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;

            const variationColor =
              trend === 'up'
                ? 'text-error'
                : trend === 'down'
                  ? 'text-success'
                  : 'text-warning';

            const bgColor =
              trend === 'up'
                ? 'bg-error/10'
                : trend === 'down'
                  ? 'bg-success/10'
                  : 'bg-warning/10';

            return (
              <Link
                key={`${dolar.casa}-${index}`}
                href="/dashboard"
                className={`marquee-item ${bgColor} hover:bg-white/5 transition-colors`}
                title={`Ver detalle de ${dolar.nombre}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {dolar.nombre}
                  </span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    ${dolar.venta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className={`flex items-center gap-1 ${variationColor}`}>
                    <VariationIcon className="text-xs" />
                    <span className="text-xs font-semibold tabular-nums">
                      {percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
