'use client';

import React from 'react';
import { useBloqueStats } from '@/hooks/usePolitica';
import { Card } from '@/components/ui/Card/Card';
import { FaUsers, FaSpinner } from 'react-icons/fa';

export function BloqueStatsCard() {
  const { data: stats, isLoading } = useBloqueStats();

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-accent-emerald text-3xl" />
        </div>
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FaUsers className="text-accent-emerald" />
          Composición por Bloques
        </h3>
        <p className="text-secondary text-sm">No hay datos disponibles</p>
      </Card>
    );
  }

  // Sort by total representatives
  const sortedStats = [...stats].sort((a, b) => b.total - a.total);

  // Calculate total representatives
  const totalRepresentantes = sortedStats.reduce((sum, stat) => sum + stat.total, 0);

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaUsers className="text-accent-emerald" />
          Composición por Bloques
        </h3>
        <span className="text-sm text-secondary">
          Total: <span className="text-white font-semibold">{totalRepresentantes}</span>
        </span>
      </div>

      <div className="space-y-4">
        {sortedStats.slice(0, 10).map((stat, index) => {
          const percentage = ((stat.total / totalRepresentantes) * 100).toFixed(1);

          return (
            <div key={`${stat.bloque}-${index}`} className="space-y-2">
              {/* Bloque name and count */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm truncate">{stat.bloque}</p>
                  <p className="text-xs text-secondary mt-0.5">
                    {stat.senadores} senadores • {stat.diputados} diputados
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-white font-semibold">{stat.total}</p>
                  <p className="text-xs text-secondary">{percentage}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-dark-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-emerald to-accent-teal transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {sortedStats.length > 10 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-secondary text-center">
            Mostrando los 10 bloques más representados de {sortedStats.length} totales
          </p>
        </div>
      )}
    </Card>
  );
}
