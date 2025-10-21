/**
 * Economía Hub Page
 *
 * Central hub for economic indicators:
 * - Inflación (Argentina & USA)
 * - Riesgo País
 * - Tasas de Interés
 * - Índices Bursátiles
 */

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import Link from 'next/link';
import {
  FaChartLine,
  FaPercentage,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUniversity,
  FaArrowRight,
  FaGlobeAmericas,
  FaChartBar,
} from 'react-icons/fa';
import {
  useUltimaInflacion,
  useUltimoRiesgoPais,
  useUltimaTasaPlazoFijo,
} from '@/hooks/useFinanzas';
import { PageHeader } from '@/components/ui/PageHeader';

const economiaCards = [
  {
    title: 'Inflación Argentina',
    description: 'Inflación mensual e interanual con datos del INDEC',
    icon: FaPercentage,
    href: '/dashboard',
    color: 'from-error/20 to-error/5',
    iconColor: 'text-error',
    dataKey: 'inflacion',
  },
  {
    title: 'Riesgo País',
    description: 'Índice EMBI+ Argentina en tiempo real',
    icon: FaExclamationTriangle,
    href: '/dashboard/finanzas',
    color: 'from-warning/20 to-warning/5',
    iconColor: 'text-warning',
    dataKey: 'riesgoPais',
  },
  {
    title: 'Tasas de Interés',
    description: 'Tasas de plazo fijo, UVA, y otros instrumentos',
    icon: FaMoneyBillWave,
    href: '/dashboard/finanzas',
    color: 'from-success/20 to-success/5',
    iconColor: 'text-success',
    dataKey: 'tasas',
  },
  {
    title: 'Indicadores USA',
    description: 'FED rate, inflación USA, PIB, desempleo (FRED)',
    icon: FaGlobeAmericas,
    href: '/dashboard',
    color: 'from-info/20 to-info/5',
    iconColor: 'text-info',
    stats: 'Datos de la Reserva Federal',
  },
  {
    title: 'Índices Bursátiles',
    description: 'S&P 500, Dow Jones, NASDAQ, Merval',
    icon: FaChartBar,
    href: '/dashboard/finanzas',
    color: 'from-brand/20 to-brand/5',
    iconColor: 'text-brand',
    stats: 'Mercados internacionales',
  },
];

export default function EconomiaHubPage() {
  const { data: ultimaInflacion, isLoading: loadingInflacion } = useUltimaInflacion();
  const { data: ultimoRiesgoPais, isLoading: loadingRiesgo } = useUltimoRiesgoPais();
  const { data: ultimaTasaPF, isLoading: loadingTasa } = useUltimaTasaPlazoFijo();

  const getCardStat = (dataKey: string) => {
    if (dataKey === 'inflacion' && !loadingInflacion && ultimaInflacion) {
      return `${ultimaInflacion.valor.toFixed(2)}% mensual`;
    }
    if (dataKey === 'riesgoPais' && !loadingRiesgo && ultimoRiesgoPais) {
      return `${ultimoRiesgoPais.valor.toLocaleString('es-AR')} puntos`;
    }
    if (dataKey === 'tasas' && !loadingTasa && ultimaTasaPF && ultimaTasaPF.tnaClientes !== null) {
      return `Mejor TNA: ${(ultimaTasaPF.tnaClientes * 100).toFixed(2)}%`;
    }
    return 'Cargando...';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Economía' }]}
          icon={FaUniversity}
          title="Hub de Economía"
          description="Indicadores macroeconómicos y datos del mercado financiero argentino"
        />

        {/* Page Section Header - Preserved for context */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
              <FaGlobeAmericas className="text-brand" />
              Indicadores Principales
            </h2>
            <p className="text-secondary text-lg">Indicadores económicos de Argentina y el mundo</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Inflación Mensual</p>
                {loadingInflacion ? (
                  <div className="h-9 w-24 bg-white/5 rounded animate-pulse" />
                ) : ultimaInflacion ? (
                  <>
                    <p className="text-3xl font-bold text-error">
                      {ultimaInflacion.valor.toFixed(2)}%
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      {new Date(ultimaInflacion.fecha).toLocaleDateString('es-AR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-secondary">Sin datos</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-error/10">
                <FaPercentage className="text-error text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Riesgo País</p>
                {loadingRiesgo ? (
                  <div className="h-9 w-24 bg-white/5 rounded animate-pulse" />
                ) : ultimoRiesgoPais ? (
                  <>
                    <p className="text-3xl font-bold text-warning">
                      {ultimoRiesgoPais.valor.toLocaleString('es-AR')}
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      {new Date(ultimoRiesgoPais.fecha).toLocaleDateString('es-AR')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-secondary">Sin datos</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-warning/10">
                <FaExclamationTriangle className="text-warning text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Mejor Tasa PF</p>
                {loadingTasa ? (
                  <div className="h-9 w-24 bg-white/5 rounded animate-pulse" />
                ) : ultimaTasaPF && ultimaTasaPF.tnaClientes !== null ? (
                  <>
                    <p className="text-3xl font-bold text-success">
                      {(ultimaTasaPF.tnaClientes * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      {ultimaTasaPF.entidad.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-secondary">Sin datos</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-success/10">
                <FaMoneyBillWave className="text-success text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Economic Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {economiaCards.map((card, index) => {
            const Icon = card.icon;
            const stat = card.dataKey ? getCardStat(card.dataKey) : card.stats;

            return (
              <Link key={index} href={card.href}>
                <Card
                  variant="elevated"
                  padding="lg"
                  hover="lift"
                  className="h-full cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <Icon className={`text-3xl ${card.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-secondary mb-3 leading-relaxed">
                        {card.description}
                      </p>
                      <p className="text-xs text-secondary font-semibold">{stat}</p>
                    </div>

                    {/* Arrow */}
                    <FaArrowRight className="text-brand opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-info/10 flex-shrink-0">
              <FaChartLine className="text-info text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Fuentes de Datos</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Los datos económicos provienen de fuentes oficiales:
                <span className="font-semibold text-foreground"> INDEC</span> (inflación),
                <span className="font-semibold text-foreground"> JP Morgan</span> (riesgo país),
                <span className="font-semibold text-foreground"> BCRA</span> (tasas de interés), y
                <span className="font-semibold text-foreground"> FRED</span> (Federal Reserve
                Economic Data) para indicadores de USA.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
