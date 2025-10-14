import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { FaPercent, FaChartLine, FaHome, FaChartBar, FaArrowRight, FaRocket, FaExternalLinkAlt, FaUniversity, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useFredData } from '@/hooks/useFredData';
import { FredChart } from '@/components/charts/FredChart';
import { useInflacion } from '@/hooks/useInflacion';

// Lazy load calculators with loading skeleton
const LoadingSkeleton = () => (
  <Card variant="elevated" padding="lg">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-panel rounded w-1/3"></div>
      <div className="h-32 bg-panel rounded"></div>
      <div className="h-12 bg-panel rounded"></div>
    </div>
  </Card>
);

const CalculadoraActivos = dynamic(
  () => import('@/components/calculadoras/CalculadoraActivos').then(mod => ({ default: mod.CalculadoraActivos })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraPlazoFijo = dynamic(
  () => import('@/components/calculadoras/CalculadoraPlazoFijo').then(mod => ({ default: mod.CalculadoraPlazoFijo })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraInflacion = dynamic(
  () => import('@/components/calculadoras/CalculadoraInflacion'),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraUVA = dynamic(
  () => import('@/components/calculadoras/CalculadoraUVA').then(mod => ({ default: mod.CalculadoraUVA })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

type CalculadoraType = 'plazo-fijo' | 'inflacion' | 'uva' | 'activos';

export default function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState<CalculadoraType>('plazo-fijo');
  const [showFredCharts, setShowFredCharts] = useState(false);

  // FRED data
  const { data: fredData, isLoading: fredLoading } = useFredData();

  // Argentina inflation data
  const { data: argInflacion } = useInflacion();

  const tabs = [
    {
      id: 'activos' as CalculadoraType,
      label: 'Rentabilidad',
      icon: FaChartBar,
      description: 'Analizá si tu inversión le ganó a la inflación',
    },
    {
      id: 'plazo-fijo' as CalculadoraType,
      label: 'Plazo Fijo',
      icon: FaPercent,
      description: 'Calculá el rendimiento de tu plazo fijo tradicional',
    },
    {
      id: 'inflacion' as CalculadoraType,
      label: 'Inflación',
      icon: FaChartLine,
      description: 'Estimá el impacto de la inflación en tu dinero',
    },
    {
      id: 'uva' as CalculadoraType,
      label: 'Crédito UVA',
      icon: FaHome,
      description: 'Simulá tu crédito hipotecario en UVAs',
    },
  ];

  const megaCalculadoraCard = {
    label: 'Mega Calculadora',
    icon: FaRocket,
    description: 'Usá todas las calculadoras al mismo tiempo',
    href: '/dashboard/mega-calculadora',
    badge: 'NUEVO',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Cards Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-w-[1400px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Card
                key={tab.id}
                variant="elevated"
                padding="lg"
                hover={isActive ? undefined : 'glow'}
                className={`cursor-pointer transition-all ${
                  isActive ? 'border-2 border-accent-emerald bg-accent-emerald/10' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <button className="w-full text-left">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-accent-emerald/20'
                          : 'glass hover:bg-accent-emerald/10'
                      }`}
                    >
                      <tab.icon
                        className={`text-xl ${
                          isActive ? 'text-accent-emerald' : 'text-foreground'
                        }`}
                      />
                    </div>
                    {isActive && (
                      <span className="px-2 py-0.5 text-xs bg-accent-emerald text-background-dark rounded-full font-semibold uppercase">
                        Activo
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3
                      className={`font-bold text-lg transition-colors ${
                        isActive ? 'text-accent-emerald' : 'text-foreground'
                      }`}
                    >
                      {tab.label}
                    </h3>
                    <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                      {tab.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center justify-end">
                    <FaArrowRight
                      className={`text-sm transition-all ${
                        isActive ? 'text-accent-emerald' : 'text-secondary'
                      }`}
                    />
                  </div>
                </button>
              </Card>
            );
          })}

          {/* Mega Calculadora Card - Special Link Card */}
          <Link href={megaCalculadoraCard.href}>
            <Card
              variant="elevated"
              padding="lg"
              hover="glow"
              className="cursor-pointer transition-all bg-gradient-to-br from-accent-emerald/10 to-accent-teal/10 border-accent-emerald/30 hover:border-accent-emerald"
            >
              <div className="w-full text-left">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-accent-emerald/20">
                    <megaCalculadoraCard.icon className="text-xl text-accent-emerald" />
                  </div>
                  <span className="px-2 py-0.5 text-xs bg-accent-emerald text-background-dark rounded-full font-semibold uppercase">
                    {megaCalculadoraCard.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-accent-emerald">
                    {megaCalculadoraCard.label}
                  </h3>
                  <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                    {megaCalculadoraCard.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center justify-end">
                  <FaExternalLinkAlt className="text-sm text-accent-emerald" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Calculadora Activa */}
        <div className="mt-6 max-w-5xl mx-auto">
          {activeTab === 'activos' && <CalculadoraActivos showHeader={false} />}
          {activeTab === 'plazo-fijo' && <CalculadoraPlazoFijo showHeader={false} />}
          {activeTab === 'inflacion' && <CalculadoraInflacion showHeader={false} />}
          {activeTab === 'uva' && <CalculadoraUVA showHeader={false} />}
        </div>

        {/* COMPARACIÓN ARGENTINA VS USA */}
        {!fredLoading && fredData && argInflacion && (
          <Card variant="elevated" padding="lg" className="mt-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <FaChartLine className="text-2xl text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  Argentina vs USA
                  <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full font-semibold uppercase">
                    Comparativa
                  </span>
                </h2>
                <p className="text-sm text-secondary">
                  Contexto económico comparado: entendé cómo se posiciona Argentina frente a Estados Unidos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inflación Comparison */}
              <div className="p-5 rounded-lg glass border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  📊 Inflación Anual
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary flex items-center gap-2">
                        🇦🇷 Argentina
                      </span>
                      <span className="text-xs text-red-400">Interanual</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">
                      {argInflacion[argInflacion.length - 1]?.valor.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary flex items-center gap-2">
                        🇺🇸 USA
                      </span>
                      <span className="text-xs text-blue-400">Year over Year</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                      {fredData.inflationCPI?.yearOverYear.toFixed(1)}%
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-secondary">
                      <strong className="text-accent-emerald">
                        Ratio: {(
                          argInflacion[argInflacion.length - 1]?.valor /
                          (fredData.inflationCPI?.yearOverYear || 1)
                        ).toFixed(1)}x
                      </strong>
                      {' '}La inflación argentina es{' '}
                      {(
                        argInflacion[argInflacion.length - 1]?.valor /
                        (fredData.inflationCPI?.yearOverYear || 1)
                      ).toFixed(0)}
                      {' '}veces mayor que la estadounidense
                    </p>
                  </div>
                </div>
              </div>

              {/* Economic Context */}
              <div className="p-5 rounded-lg glass border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  💹 Contexto Económico
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-secondary">Tasa FED (USA)</span>
                    <span className="font-bold text-blue-400">
                      {fredData.federalFundsRate?.latest.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-secondary">Desempleo USA</span>
                    <span className="font-bold text-foreground">
                      {fredData.unemploymentRate?.latest.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-secondary">Bonos 10Y USA</span>
                    <span className="font-bold text-foreground">
                      {fredData.treasury10y?.latest.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-secondary">PIB USA (QoQ)</span>
                    <span className={`font-bold ${
                      (fredData.gdp?.quarterlyGrowth || 0) > 0 ? 'text-success' : 'text-error'
                    }`}>
                      {(fredData.gdp?.quarterlyGrowth || 0) > 0 ? '+' : ''}
                      {fredData.gdp?.quarterlyGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* FRED Section - Economic Data USA with Real-Time Data */}
        <Card variant="elevated" padding="lg" className="mt-8 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
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
                  {!fredLoading && (
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
              onClick={() => setShowFredCharts(!showFredCharts)}
              className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-xs transition-all"
            >
              {showFredCharts ? 'Ocultar' : 'Ver'} Gráficos
            </button>
          </div>

          {/* Loading State */}
          {fredLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                <p className="text-sm text-secondary">Cargando datos de FRED...</p>
              </div>
            </div>
          )}

          {/* FRED Data Cards */}
          {!fredLoading && fredData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tasa de Interés FED */}
                <div className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">Tasa FED</h3>
                    <span className="text-[10px] text-secondary">Fed Funds</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-blue-400 tabular-nums">
                      {fredData.federalFundsRate?.latest.toFixed(2)}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {fredData.federalFundsRate && fredData.federalFundsRate.change > 0 ? (
                        <FaArrowUp className="text-[10px] text-success" />
                      ) : fredData.federalFundsRate && fredData.federalFundsRate.change < 0 ? (
                        <FaArrowDown className="text-[10px] text-error" />
                      ) : null}
                      <span className="text-[10px] text-secondary">
                        vs mes anterior
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://fred.stlouisfed.org/series/FEDFUNDS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>

                {/* Inflación USA (CPI) */}
                <div className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">Inflación</h3>
                    <span className="text-[10px] text-secondary">CPI YoY</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-blue-400 tabular-nums">
                      {fredData.inflationCPI?.yearOverYear.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-secondary mt-1">Anual</p>
                  </div>
                  <a
                    href="https://fred.stlouisfed.org/series/CPIAUCSL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>

                {/* GDP USA */}
                <div className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">PIB</h3>
                    <span className="text-[10px] text-secondary">Real GDP</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-blue-400 tabular-nums">
                      {fredData.gdp?.quarterlyGrowth > 0 ? '+' : ''}
                      {fredData.gdp?.quarterlyGrowth.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-secondary mt-1">Trimestral</p>
                  </div>
                  <a
                    href="https://fred.stlouisfed.org/series/GDPC1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>

                {/* Unemployment */}
                <div className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">Desempleo</h3>
                    <span className="text-[10px] text-secondary">Rate</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-blue-400 tabular-nums">
                      {fredData.unemploymentRate?.latest.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-secondary mt-1">Tasa actual</p>
                  </div>
                  <a
                    href="https://fred.stlouisfed.org/series/UNRATE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Ver en FRED <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>
              </div>

              {/* Historical Charts */}
              {showFredCharts && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Evolución Histórica (últimos 24 meses)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fed Funds Rate Chart */}
                    {fredData.federalFundsRate && fredData.federalFundsRate.data && (
                      <div className="p-4 rounded-lg glass border border-border">
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
                    {fredData.inflationCPI && fredData.inflationCPI.data && (
                      <div className="p-4 rounded-lg glass border border-border">
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
                    {fredData.unemploymentRate && fredData.unemploymentRate.data && (
                      <div className="p-4 rounded-lg glass border border-border">
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
                    {fredData.treasury10y && fredData.treasury10y.data && (
                      <div className="p-4 rounded-lg glass border border-border">
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
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-secondary">
                <strong className="text-foreground">FRED</strong> (Federal Reserve Economic Data) - Base de datos oficial con más de 800,000 series temporales.
                {fredData?.federalFundsRate?.lastUpdate && (
                  <span className="text-blue-400 ml-2">
                    Última actualización: {new Date(fredData.federalFundsRate.lastUpdate).toLocaleDateString('es-AR')}
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

        {/* Minimal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50 mt-8">
          <div className="flex items-center gap-4 text-xs text-secondary">
            <a href="/help" className="hover:text-accent-emerald transition-colors">
              Ayuda
            </a>
            <span>•</span>
            <a href="/help/fuentes" className="hover:text-accent-emerald transition-colors">
              Fuentes de Datos
            </a>
            <span>•</span>
            <span>Actualización diaria</span>
          </div>
          <p className="text-xs text-secondary text-center sm:text-right">
            Estimaciones aproximadas.{' '}
            <a href="/help/precision" className="text-accent-emerald hover:underline">
              Más información
            </a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
