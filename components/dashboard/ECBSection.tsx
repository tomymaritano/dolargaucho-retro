/**
 * ECBSection Component
 *
 * Single Responsibility: Display European Central Bank exchange rates and historical charts
 * Composition: Uses Card, FredChart for visualization with favorite toggle functionality
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FredChart } from '@/components/charts/FredChart';
import { FaGlobeAmericas, FaChartLine, FaStar, FaRegStar } from 'react-icons/fa';

interface ECBRatesData {
  rates: {
    USD: number;
    ARS?: number;
    GBP?: number;
    JPY?: number;
    CHF?: number;
    BRL?: number;
  };
  date: string;
}

interface ECBHistoricalData {
  USD?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  ARS?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  GBP?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
  BRL?: {
    latest: number;
    data: Array<{ date: string; rate: number }>;
  };
}

interface ECBSectionProps {
  ecbData: ECBRatesData | undefined;
  ecbLoading: boolean;
  ecbHistorical: ECBHistoricalData | undefined;
  ecbHistoricalLoading: boolean;
  showECBCharts: boolean;
  onToggleCharts: () => void;
  favoriteChartIds: string[];
  onToggleChart: (chartId: string) => void;
}

/**
 * Renders ECB section with exchange rates and interactive charts
 * @param ecbData - European Central Bank rates data
 * @param ecbLoading - Loading state for rates
 * @param ecbHistorical - Historical ECB data
 * @param ecbHistoricalLoading - Loading state for historical data
 * @param showECBCharts - Whether to show charts
 * @param onToggleCharts - Function to toggle charts visibility
 * @param favoriteChartIds - Array of favorited chart IDs
 * @param onToggleChart - Function to toggle chart favorite status
 */
export function ECBSection({
  ecbData,
  ecbLoading,
  ecbHistorical,
  ecbHistoricalLoading,
  showECBCharts,
  onToggleCharts,
  favoriteChartIds,
  onToggleChart,
}: ECBSectionProps) {
  if (ecbLoading || !ecbData) {
    return null;
  }

  return (
    <Card variant="outlined" padding="none">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGlobeAmericas className="text-xl text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Tipos de Cambio Oficiales</h2>
              <p className="text-xs text-secondary mt-1">Banco Central Europeo (ECB)</p>
            </div>
          </div>
          <button
            onClick={onToggleCharts}
            className="px-4 py-2 rounded-lg text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-indigo-300"
          >
            <FaChartLine />
            {showECBCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* EUR/USD */}
          <div
            className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">EUR / USD</p>
            <p className="text-2xl font-bold text-indigo-400 tabular-nums">
              ${ecbData.rates.USD.toFixed(4)}
            </p>
            <p className="text-[10px] text-secondary mt-1">Dolar estadounidense</p>
          </div>

          {/* EUR/BRL */}
          {ecbData.rates.BRL && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / BRL</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                R${ecbData.rates.BRL.toFixed(4)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Real brasileño</p>
            </div>
          )}

          {/* EUR/GBP */}
          {ecbData.rates.GBP && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / GBP</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                ${ecbData.rates.GBP.toFixed(4)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Libra esterlina</p>
            </div>
          )}

          {/* EUR/JPY */}
          {ecbData.rates.JPY && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / JPY</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                ¥{ecbData.rates.JPY.toFixed(2)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Yen japones</p>
            </div>
          )}

          {/* EUR/CHF */}
          {ecbData.rates.CHF && (
            <div
              className="p-4 rounded-lg bg-panel transition-all cursor-pointer hover:bg-panel-hover"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / CHF</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                {ecbData.rates.CHF.toFixed(4)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Franco suizo</p>
            </div>
          )}
        </div>

        {/* Interactive Charts */}
        {showECBCharts && !ecbHistoricalLoading && ecbHistorical && (
          <div className="mt-6 pt-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FaChartLine className="text-indigo-400" />
              Evolucion Historica (ultimos 12 meses)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EUR/USD Chart */}
              {ecbHistorical.USD?.data && (
                <div className="p-4 rounded-lg bg-panel">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-secondary flex-1">
                      <div className="mb-1">EUR / USD</div>
                      <span className="text-indigo-400">
                        ${ecbHistorical.USD.latest.toFixed(4)}
                      </span>
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleChart('ecb-usd');
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        favoriteChartIds.includes('ecb-usd')
                          ? 'bg-brand/20 text-brand'
                          : 'text-secondary hover:text-brand'
                      }`}
                      aria-label={
                        favoriteChartIds.includes('ecb-usd')
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'
                      }
                    >
                      {favoriteChartIds.includes('ecb-usd') ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
                  </div>
                  <div className="h-48">
                    <FredChart
                      data={ecbHistorical.USD.data.map((d) => ({ date: d.date, value: d.rate }))}
                      title="EUR/USD"
                      color="#6366f1"
                      yAxisLabel="Tipo de cambio"
                      formatValue={(v) => `$${v.toFixed(4)}`}
                      showPoints={true}
                      monthsToShow={12}
                    />
                  </div>
                </div>
              )}

              {/* EUR/GBP Chart */}
              {ecbHistorical.GBP?.data && (
                <div className="p-4 rounded-lg bg-panel">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-secondary flex-1">
                      <div className="mb-1">EUR / GBP</div>
                      <span className="text-indigo-400">
                        ${ecbHistorical.GBP.latest.toFixed(4)}
                      </span>
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleChart('ecb-gbp');
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        favoriteChartIds.includes('ecb-gbp')
                          ? 'bg-brand/20 text-brand'
                          : 'text-secondary hover:text-brand'
                      }`}
                      aria-label={
                        favoriteChartIds.includes('ecb-gbp')
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'
                      }
                    >
                      {favoriteChartIds.includes('ecb-gbp') ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
                  </div>
                  <div className="h-48">
                    <FredChart
                      data={ecbHistorical.GBP.data.map((d) => ({ date: d.date, value: d.rate }))}
                      title="EUR/GBP"
                      color="#10b981"
                      yAxisLabel="Tipo de cambio"
                      formatValue={(v) => `$${v.toFixed(4)}`}
                      showPoints={true}
                      monthsToShow={12}
                    />
                  </div>
                </div>
              )}

              {/* EUR/BRL Chart */}
              {ecbHistorical.BRL?.data && (
                <div className="p-4 rounded-lg bg-panel">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-secondary flex-1">
                      <div className="mb-1">EUR / BRL</div>
                      <span className="text-indigo-400">
                        R${ecbHistorical.BRL.latest.toFixed(4)}
                      </span>
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleChart('ecb-brl');
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        favoriteChartIds.includes('ecb-brl')
                          ? 'bg-brand/20 text-brand'
                          : 'text-secondary hover:text-brand'
                      }`}
                      aria-label={
                        favoriteChartIds.includes('ecb-brl')
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'
                      }
                    >
                      {favoriteChartIds.includes('ecb-brl') ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
                  </div>
                  <div className="h-48">
                    <FredChart
                      data={ecbHistorical.BRL.data.map((d) => ({ date: d.date, value: d.rate }))}
                      title="EUR/BRL"
                      color="#f59e0b"
                      yAxisLabel="Tipo de cambio"
                      formatValue={(v) => `R$${v.toFixed(4)}`}
                      showPoints={true}
                      monthsToShow={12}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-4 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-secondary">
              <strong className="text-foreground">ECB</strong> (European Central Bank) - Tipos de
              cambio de referencia del Euro.
              {ecbData.date && (
                <span className="text-indigo-400 ml-2">
                  Actualizado:{' '}
                  {new Date(ecbData.date).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </p>
            <a
              href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 rounded-lg text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2 hover:text-indigo-300"
            >
              Ver en ECB →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
