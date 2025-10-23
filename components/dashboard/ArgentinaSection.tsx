/**
 * ArgentinaSection Component
 *
 * Single Responsibility: Display Argentina economic data and historical charts
 * Composition: Uses Card, UniversalLightweightChart for visualization with favorite toggle functionality
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { FaMapMarkerAlt, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import type { IndiceUVAResponse, RiesgoPaisResponse } from '@/types/api/argentina';

interface ArgentinaData {
  inflacion?: {
    latest: number;
    change: number;
    data: Array<{ date: string; value: number }>;
  };
  uva?: {
    latest: number;
    change: number;
    data: Array<{ date: string; value: number }>;
  };
  riesgoPais?: {
    latest: number;
    change: number;
    data: Array<{ date: string; value: number }>;
  };
}

interface ArgentinaSectionProps {
  argentinaDat?: ArgentinaData;
  argentinaeLoading: boolean;
  uvaData: IndiceUVAResponse | undefined;
  riesgoPaisData: RiesgoPaisResponse | undefined;
  inflacionData: Array<{ fecha: string; valor: number }> | undefined;
  showArgentinaCharts: boolean;
  onToggleCharts: () => void;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

/**
 * Renders Argentina section with economic indicators and interactive charts
 * @param argentinaeData - Argentina economic data
 * @param argentinaeLoading - Loading state
 * @param showArgentinaCharts - Whether to show charts
 * @param onToggleCharts - Function to toggle charts visibility
 * @param favoriteChartIds - Array of favorited chart IDs
 * @param onToggleChart - Function to toggle chart favorite status
 */
export const ArgentinaSection = React.memo(function ArgentinaSection({
  argentinaeLoading,
  uvaData,
  riesgoPaisData,
  inflacionData,
  showArgentinaCharts,
  onToggleCharts,
  favoriteChartIds,
  onToggleChart,
}: ArgentinaSectionProps) {
  if (argentinaeLoading) {
    return null;
  }

  // Calculate latest values and changes
  const latestInflacion = inflacionData?.[inflacionData.length - 1];
  const prevInflacion = inflacionData?.[inflacionData.length - 2];
  const inflacionChange =
    latestInflacion && prevInflacion ? latestInflacion.valor - prevInflacion.valor : 0;

  const latestUVA = uvaData?.[uvaData.length - 1];
  const prevUVA = uvaData?.[uvaData.length - 2];
  const uvaChange = latestUVA && prevUVA ? latestUVA.valor - prevUVA.valor : 0;

  const latestRiesgoPais = riesgoPaisData?.[riesgoPaisData.length - 1];
  const prevRiesgoPais = riesgoPaisData?.[riesgoPaisData.length - 2];
  const riesgoPaisChange =
    latestRiesgoPais && prevRiesgoPais ? latestRiesgoPais.valor - prevRiesgoPais.valor : 0;

  return (
    <Card variant="outlined" padding="none">
      <div className="p-6 pb-4 border-b border-slate-700/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-xl text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Datos Económicos Argentina</h2>
              <p className="text-xs text-secondary mt-1">Índices y Tasas (API Argentina Datos)</p>
            </div>
          </div>
          <button
            onClick={onToggleCharts}
            className="px-4 py-2 rounded-lg text-cyan-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-cyan-300"
          >
            <FaChartLine />
            {showArgentinaCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Inflación Mensual */}
          {latestInflacion && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">IPC Mensual</p>
              <p className="text-2xl font-bold text-cyan-400 tabular-nums">
                {latestInflacion.valor.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                {inflacionChange !== 0 && (
                  <>
                    {inflacionChange > 0 ? (
                      <FaArrowUp className="text-[10px] text-error" />
                    ) : (
                      <FaArrowDown className="text-[10px] text-success" />
                    )}
                    <span className="text-[10px] text-secondary">
                      {Math.abs(inflacionChange).toFixed(1)}pp
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-secondary mt-1">Última medición</p>
            </div>
          )}

          {/* Índice UVA */}
          {latestUVA && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">Índice UVA</p>
              <p className="text-2xl font-bold text-cyan-400 tabular-nums">
                ${latestUVA.valor.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {uvaChange !== 0 && (
                  <>
                    {uvaChange > 0 ? (
                      <FaArrowUp className="text-[10px] text-success" />
                    ) : (
                      <FaArrowDown className="text-[10px] text-error" />
                    )}
                    <span className="text-[10px] text-secondary">
                      ${Math.abs(uvaChange).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-secondary mt-1">Valor actualizado</p>
            </div>
          )}

          {/* Riesgo País */}
          {latestRiesgoPais && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">Riesgo País</p>
              <p className="text-2xl font-bold text-cyan-400 tabular-nums">
                {latestRiesgoPais.valor.toFixed(0)} bps
              </p>
              <div className="flex items-center gap-1 mt-1">
                {riesgoPaisChange !== 0 && (
                  <>
                    {riesgoPaisChange > 0 ? (
                      <FaArrowUp className="text-[10px] text-error" />
                    ) : (
                      <FaArrowDown className="text-[10px] text-success" />
                    )}
                    <span className="text-[10px] text-secondary">
                      {Math.abs(riesgoPaisChange).toFixed(0)} bps
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-secondary mt-1">EMBI+ Argentina</p>
            </div>
          )}
        </div>

        {/* Interactive Charts */}
        {showArgentinaCharts && (
          <div className="mt-6 pt-6 border-t border-slate-700/10">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FaChartLine className="text-cyan-400" />
              Evolución Histórica (últimos 24 meses)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IPC Chart */}
              {inflacionData && inflacionData.length > 0 && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={inflacionData.map((d) => ({ date: d.fecha, value: d.valor }))}
                      title="IPC Mensual"
                      color="#f87171"
                      formatValue={(v) => `${v.toFixed(1)}%`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('inflacion-mensual')}
                      onToggleFavorite={() => onToggleChart('inflacion-mensual')}
                    />
                  </div>
                </div>
              )}

              {/* UVA Chart */}
              {uvaData && uvaData.length > 0 && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={uvaData.map((d) => ({ date: d.fecha, value: d.valor }))}
                      title="Índice UVA"
                      color="#8b5cf6"
                      formatValue={(v) => `$${v.toFixed(2)}`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('indice-uva')}
                      onToggleFavorite={() => onToggleChart('indice-uva')}
                    />
                  </div>
                </div>
              )}

              {/* Riesgo País Chart */}
              {riesgoPaisData && riesgoPaisData.length > 0 && (
                <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
                  <div className="h-72">
                    <UniversalLightweightChart
                      data={riesgoPaisData.map((d) => ({ date: d.fecha, value: d.valor }))}
                      title="Riesgo País"
                      color="#06b6d4"
                      formatValue={(v) => `${v.toFixed(0)} bps`}
                      height={288}
                      isFavorite={favoriteChartIds.includes('riesgo-pais')}
                      onToggleFavorite={() => onToggleChart('riesgo-pais')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-4 pt-6 border-t border-slate-700/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-secondary">
              <strong className="text-foreground">Argentina Datos</strong> - Datos oficiales
              económicos y financieros de Argentina.
              {latestInflacion && (
                <span className="text-cyan-400 ml-2">
                  Actualizado:{' '}
                  {new Date(latestInflacion.fecha).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </p>
            <a
              href="https://argentinadatos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 rounded-lg text-cyan-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-cyan-300"
            >
              Explorar Argentina Datos →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
});
