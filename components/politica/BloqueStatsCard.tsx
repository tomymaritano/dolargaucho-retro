'use client';

import React, { useState } from 'react';
import { useBloqueStats } from '@/hooks/usePolitica';
import { Card } from '@/components/ui/Card/Card';
import { FaUsers, FaSpinner, FaChartPie } from 'react-icons/fa';

export function BloqueStatsCard() {
  const { data: stats, isLoading } = useBloqueStats();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-brand text-3xl" />
        </div>
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FaUsers className="text-brand" />
          Composición por Bloques Políticos
        </h3>
        <p className="text-secondary text-sm">No hay datos disponibles</p>
      </Card>
    );
  }

  // Sort by total representatives
  const sortedStats = [...stats].sort((a, b) => b.total - a.total);

  // Calculate total representatives
  const totalRepresentantes = sortedStats.reduce((sum, stat) => sum + stat.total, 0);

  // Calculate total senators and deputies
  const totalSenadores = sortedStats.reduce((sum, stat) => sum + stat.senadores, 0);
  const totalDiputados = sortedStats.reduce((sum, stat) => sum + stat.diputados, 0);

  // Show top 8 or all
  const displayedStats = showAll ? sortedStats : sortedStats.slice(0, 8);

  // Color palette for top blocks
  const colors = [
    'from-brand to-brand-light',
    'from-brand-light to-accent-blue',
    'from-accent-blue to-accent-purple',
    'from-accent-purple to-accent-pink',
    'from-accent-pink to-accent-orange',
    'from-accent-orange to-accent-yellow',
    'from-accent-yellow to-brand',
    'from-secondary to-brand',
  ];

  return (
    <Card variant="elevated" padding="lg">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FaChartPie className="text-brand" />
            Composición por Bloques
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand">{sortedStats.length}</p>
            <p className="text-xs text-secondary">Bloques</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-panel border border-border">
            <p className="text-xl font-bold text-foreground">{totalRepresentantes}</p>
            <p className="text-xs text-secondary mt-1">Total</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-panel border border-border">
            <p className="text-xl font-bold text-foreground">{totalSenadores}</p>
            <p className="text-xs text-secondary mt-1">Senadores</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-panel border border-border">
            <p className="text-xl font-bold text-foreground">{totalDiputados}</p>
            <p className="text-xs text-secondary mt-1">Diputados</p>
          </div>
        </div>

        {/* Bloques List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {displayedStats.map((stat, index) => {
            const percentage = ((stat.total / totalRepresentantes) * 100).toFixed(1);
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={`${stat.bloque}-${index}`}
                className="p-3 rounded-lg bg-panel border border-border hover:border-brand/30 transition-all"
              >
                {/* Bloque info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium text-sm truncate">{stat.bloque}</p>
                      <p className="text-xs text-secondary">
                        {stat.senadores} sen. • {stat.diputados} dip.
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-lg font-bold text-foreground">{stat.total}</p>
                    <p className="text-xs text-brand">{percentage}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {sortedStats.length > 8 && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-3 py-2 rounded-lg bg-panel border border-border text-foreground hover:bg-white/5 hover:border-brand/50 transition-all text-sm"
            >
              {showAll ? 'Mostrar menos' : `Ver todos (${sortedStats.length - 8} más)`}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
