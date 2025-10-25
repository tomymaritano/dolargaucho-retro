import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaUniversity, FaExternalLinkAlt } from 'react-icons/fa';
import { FredChart } from '@/components/charts/FredChart';
import { FREDStatsCards } from './FREDStatsCards';

interface FredDataMetric {
  latest: number;
  change?: number;
  lastUpdate?: string;
  data?: Array<{ date: string; value: number }>;
}

interface FREDSectionProps {
  fredData?: {
    federalFundsRate?: FredDataMetric;
    inflationCPI?: {
      yearOverYear: number;
      latest: number;
      data?: Array<{ date: string; value: number }>;
    };
    gdp?: {
      quarterlyGrowth: number;
      latest: number;
      data?: Array<{ date: string; value: number }>;
    };
    unemploymentRate?: FredDataMetric;
    treasury10y?: FredDataMetric;
  };
  isLoading?: boolean;
}

/**
 * FREDSection Component
 *
 * Displays Federal Reserve Economic Data (FRED) with real-time updates.
 * Includes stats cards and optional historical charts.
 */
export function FREDSection({ fredData, isLoading = false }: FREDSectionProps) {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <FaUniversity className="text-2xl text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              Datos Económicos USA (FRED)
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full font-semibold uppercase">
                Federal Reserve
              </span>
              {!isLoading && (
                <span className="px-2 py-0.5 text-xs bg-success/20 text-success rounded-full font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  En Vivo
                </span>
              )}
            </h2>
            <p className="text-sm text-secondary">
              Datos oficiales de la Reserva Federal. Información actualizada automáticamente.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-xs transition-all"
        >
          {showCharts ? 'Ocultar' : 'Ver'} Gráficos
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            <p className="text-sm text-secondary">Cargando datos de FRED...</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && fredData && (
        <>
          <FREDStatsCards
            federalFundsRate={fredData.federalFundsRate}
            inflationCPI={fredData.inflationCPI}
            gdp={fredData.gdp}
            unemploymentRate={fredData.unemploymentRate}
          />

          {/* Historical Charts */}
          {showCharts && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Evolución Histórica (últimos 24 meses)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fed Funds Rate Chart */}
                {fredData.federalFundsRate?.data && (
                  <div className="p-4 rounded-lg glass border border-white/5">
                    <h4 className="text-xs font-semibold text-secondary mb-3">Tasa FED</h4>
                    <div className="h-48">
                      <FredChart
                        data={fredData.federalFundsRate.data}
                        title="Tasa FED"
                        color="#3b82f6"
                        yAxisLabel="Tasa"
                        formatValue={(v) => `${v.toFixed(2)}%`}
                      />
                    </div>
                  </div>
                )}

                {/* Inflation Chart */}
                {fredData.inflationCPI?.data && (
                  <div className="p-4 rounded-lg glass border border-white/5">
                    <h4 className="text-xs font-semibold text-secondary mb-3">Índice CPI</h4>
                    <div className="h-48">
                      <FredChart
                        data={fredData.inflationCPI.data}
                        title="CPI"
                        color="#8b5cf6"
                        yAxisLabel="Índice"
                        formatValue={(v) => v.toFixed(1)}
                      />
                    </div>
                  </div>
                )}

                {/* Unemployment Chart */}
                {fredData.unemploymentRate?.data && (
                  <div className="p-4 rounded-lg glass border border-white/5">
                    <h4 className="text-xs font-semibold text-secondary mb-3">Desempleo USA</h4>
                    <div className="h-48">
                      <FredChart
                        data={fredData.unemploymentRate.data}
                        title="Desempleo"
                        color="#10b981"
                        yAxisLabel="Tasa"
                        formatValue={(v) => `${v.toFixed(1)}%`}
                      />
                    </div>
                  </div>
                )}

                {/* Treasury 10Y Chart */}
                {fredData.treasury10y?.data && (
                  <div className="p-4 rounded-lg glass border border-white/5">
                    <h4 className="text-xs font-semibold text-secondary mb-3">Bonos 10 Años</h4>
                    <div className="h-48">
                      <FredChart
                        data={fredData.treasury10y.data}
                        title="Treasury 10Y"
                        color="#f59e0b"
                        yAxisLabel="Rendimiento"
                        formatValue={(v) => `${v.toFixed(2)}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* FRED Info Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-secondary">
            <strong className="text-foreground">FRED</strong> (Federal Reserve Economic Data) - Base
            de datos oficial con más de 800,000 series temporales.
            {fredData?.federalFundsRate?.lastUpdate && (
              <span className="text-blue-400 ml-2">
                Última actualización:{' '}
                {new Date(fredData.federalFundsRate.lastUpdate).toLocaleDateString('es-AR')}
              </span>
            )}
          </p>
          <a
            href="https://fred.stlouisfed.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-xs transition-all flex items-center gap-2"
          >
            Explorar FRED
            <FaExternalLinkAlt className="text-[10px]" />
          </a>
        </div>
      </div>
    </Card>
  );
}
