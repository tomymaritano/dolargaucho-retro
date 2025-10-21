/**
 * Herramientas Hub Page
 *
 * Central hub for tools and utilities:
 * - Calculadoras Financieras
 * - Sistema de Alertas
 * - Calendario Económico
 * - Portfolio Tracker (futuro)
 */

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card/Card';
import Link from 'next/link';
import {
  FaCalculator,
  FaBell,
  FaCalendarAlt,
  FaBriefcase,
  FaTools,
  FaArrowRight,
  FaClock,
  FaChartPie,
} from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useAlertasStore } from '@/lib/store/alertas';

const herramientasCards = [
  {
    title: 'Calculadoras',
    description: '10+ calculadoras: inflación, plazo fijo, UVA, conversores y más',
    icon: FaCalculator,
    href: '/dashboard/calculadoras',
    color: 'from-brand/20 to-brand/5',
    iconColor: 'text-brand',
    stats: '10+ herramientas',
    badge: 'Popular',
  },
  {
    title: 'Alertas',
    description: 'Notificaciones cuando una cotización alcanza tu objetivo',
    icon: FaBell,
    href: '/dashboard/alertas',
    color: 'from-warning/20 to-warning/5',
    iconColor: 'text-warning',
    dataKey: 'alertas',
  },
  {
    title: 'Calendario',
    description: 'Feriados, vencimientos de impuestos, y eventos económicos',
    icon: FaCalendarAlt,
    href: '/dashboard/calendario',
    color: 'from-info/20 to-info/5',
    iconColor: 'text-info',
    stats: 'Eventos próximos',
  },
  {
    title: 'Portfolio Tracker',
    description: 'Seguimiento de inversiones en dólares, crypto, bonos y acciones',
    icon: FaBriefcase,
    href: '/dashboard',
    color: 'from-success/20 to-success/5',
    iconColor: 'text-success',
    stats: 'Próximamente',
    badge: 'Pronto',
  },
];

const calculadorasPopulares = [
  {
    name: 'Inflación Argentina',
    description: 'Calcula el poder adquisitivo entre fechas',
    icon: FaChartPie,
    href: '/dashboard/calculadoras',
  },
  {
    name: 'Plazo Fijo',
    description: 'Simula rendimiento vs inflación',
    icon: FaClock,
    href: '/dashboard/calculadoras',
  },
  {
    name: 'Conversores',
    description: 'USD, EUR, crypto y más',
    icon: FaCalculator,
    href: '/dashboard/calculadoras',
  },
];

export default function HerramientasHubPage() {
  const getTotalFavorites = useFavoritesStore((state) => state.getTotalCount);
  const getTotalAlertas = useAlertasStore((state) => state.getTotalCount);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Herramientas"
          description="Utilidades y calculadoras para tomar mejores decisiones financieras"
          icon={FaTools}
          breadcrumbs={[{ label: 'Herramientas' }]}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Calculadoras</p>
                <p className="text-3xl font-bold text-brand">10+</p>
                <p className="text-xs text-secondary mt-1">Herramientas disponibles</p>
              </div>
              <div className="p-4 rounded-xl bg-brand/10">
                <FaCalculator className="text-brand text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Alertas Activas</p>
                <p className="text-3xl font-bold text-warning">{getTotalAlertas()}</p>
                <p className="text-xs text-secondary mt-1">Notificaciones configuradas</p>
              </div>
              <div className="p-4 rounded-xl bg-warning/10">
                <FaBell className="text-warning text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Favoritos</p>
                <p className="text-3xl font-bold text-success">{getTotalFavorites()}</p>
                <p className="text-xs text-secondary mt-1">Items guardados</p>
              </div>
              <div className="p-4 rounded-xl bg-success/10">
                <FaChartPie className="text-success text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {herramientasCards.map((card, index) => {
            const Icon = card.icon;
            const stat = card.dataKey === 'alertas' ? `${getTotalAlertas()} activas` : card.stats;

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
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                          {card.title}
                        </h3>
                        {card.badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              card.badge === 'Pronto'
                                ? 'bg-success/10 text-success'
                                : 'bg-brand/10 text-brand'
                            }`}
                          >
                            {card.badge}
                          </span>
                        )}
                      </div>
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

        {/* Calculadoras Populares */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <FaCalculator className="text-brand" />
            Calculadoras Más Usadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calculadorasPopulares.map((calc, index) => {
              const Icon = calc.icon;

              return (
                <Link key={index} href={calc.href}>
                  <Card
                    variant="elevated"
                    padding="md"
                    hover="lift"
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-brand/10">
                        <Icon className="text-brand text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                          {calc.name}
                        </h4>
                        <p className="text-xs text-secondary">{calc.description}</p>
                      </div>
                      <FaArrowRight className="text-brand opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand/10 flex-shrink-0">
              <FaTools className="text-brand text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Todas las herramientas son gratuitas
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Las calculadoras utilizan datos reales de APIs oficiales para brindarte resultados
                precisos. Configurá alertas personalizadas para recibir notificaciones cuando una
                cotización alcance tu objetivo. Todo 100% gratis.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
