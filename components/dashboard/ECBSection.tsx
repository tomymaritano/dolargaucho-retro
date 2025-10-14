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
    <Card
      variant="elevated"
      padding="lg"
      className="mt-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20"
    >
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <FaGlobeAmericas className="text-xl text-indigo-400" />
            </div>
            <div>
              <Card.Title className="mb-0">Tipos de Cambio Oficiales</Card.Title>
              <p className="text-xs text-secondary mt-1">Banco Central Europeo (ECB)</p>
            </div>
          </div>
          <button
            onClick={onToggleCharts}
            className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2"
          >
            <FaChartLine />
            {showECBCharts ? 'Ocultar Graficos' : 'Ver Graficos'}
          </button>
        </div>
      </Card.Header>

      <Card.Content>
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* EUR/USD */}
          <div
            className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
            onClick={onToggleCharts}
          >
            <p className="text-xs text-secondary mb-2">EUR / USD</p>
            <p className="text-2xl font-bold text-indigo-400 tabular-nums">
              ${ecbData.rates.USD.toFixed(4)}
            </p>
            <p className="text-[10px] text-secondary mt-1">Dolar estadounidense</p>
          </div>

          {/* EUR/ARS */}
          {ecbData.rates.ARS && (
            <div
              className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / ARS</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                ${ecbData.rates.ARS.toFixed(2)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Peso argentino</p>
            </div>
          )}

          {/* EUR/GBP */}
          {ecbData.rates.GBP && (
            <div
              className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
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
              className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
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
              className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / CHF</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                {ecbData.rates.CHF.toFixed(4)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Franco suizo</p>
            </div>
          )}

          {/* EUR/BRL */}
          {ecbData.rates.BRL && (
            <div
              className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
              onClick={onToggleCharts}
            >
              <p className="text-xs text-secondary mb-2">EUR / BRL</p>
              <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                R${ecbData.rates.BRL.toFixed(4)}
              </p>
              <p className="text-[10px] text-secondary mt-1">Real brasileno</p>
            </div>
          )}
        </div>

        {/* Interactive Charts */}
        {showECBCharts && !ecbHistoricalLoading && ecbHistorical && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FaChartLine className="text-indigo-400" />
              Evolucion Historica (ultimos 12 meses)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EUR/USD Chart */}
              {ecbHistorical.USD?.data && (
                <div className="p-4 rounded-lg glass border border-border">
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
                          ? 'bg-accent-emerald/20 text-accent-emerald'
                          : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
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

              {/* EUR/ARS Chart */}
              {ecbHistorical.ARS?.data && (
                <div className="p-4 rounded-lg glass border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-secondary flex-1">
                      <div className="mb-1">EUR / ARS</div>
                      <span className="text-indigo-400">
                        ${ecbHistorical.ARS.latest.toFixed(2)}
                      </span>
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleChart('ecb-ars');
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        favoriteChartIds.includes('ecb-ars')
                          ? 'bg-accent-emerald/20 text-accent-emerald'
                          : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                      }`}
                      aria-label={
                        favoriteChartIds.includes('ecb-ars')
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'
                      }
                    >
                      {favoriteChartIds.includes('ecb-ars') ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
                  </div>
                  <div className="h-48">
                    <FredChart
                      data={ecbHistorical.ARS.data.map((d) => ({ date: d.date, value: d.rate }))}
                      title="EUR/ARS"
                      color="#8b5cf6"
                      yAxisLabel="Tipo de cambio"
                      formatValue={(v) => `$${v.toFixed(2)}`}
                      showPoints={true}
                      monthsToShow={12}
                    />
                  </div>
                </div>
              )}

              {/* EUR/GBP Chart */}
              {ecbHistorical.GBP?.data && (
                <div className="p-4 rounded-lg glass border border-border">
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
                          ? 'bg-accent-emerald/20 text-accent-emerald'
                          : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
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
                <div className="p-4 rounded-lg glass border border-border">
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
                          ? 'bg-accent-emerald/20 text-accent-emerald'
                          : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
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
        <div className="mt-4 pt-4 border-t border-border">
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
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2"
            >
              Ver en ECB →
            </a>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
