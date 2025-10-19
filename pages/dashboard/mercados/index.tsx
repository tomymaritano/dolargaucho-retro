/**
 * Mercados Hub Page
 *
 * Central hub for all market data:
 * - Dólares (Argentine exchange rates)
 * - Criptomonedas (Cryptocurrencies)
 * - Cotizaciones Internacionales (International rates)
 */

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card/Card';
import Link from 'next/link';
import {
  FaDollarSign,
  FaBitcoin,
  FaGlobe,
  FaChartLine,
  FaArrowRight,
  FaStar,
  FaBell,
} from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useAlertasStore } from '@/lib/store/alertas';

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Mercados',
    icon: FaChartLine,
  },
];

const mercadosCards = [
  {
    title: 'Dólares',
    description: 'Cotizaciones de dólar blue, oficial, MEP, CCL y más',
    icon: FaDollarSign,
    href: '/dashboard',
    color: 'from-brand/20 to-brand/5',
    iconColor: 'text-brand',
    stats: 'Todas las cotizaciones en tiempo real',
    badge: 'Popular',
  },
  {
    title: 'Criptomonedas',
    description: 'Bitcoin, Ethereum, USDT, y las principales crypto',
    icon: FaBitcoin,
    href: '/dashboard/crypto',
    color: 'from-warning/20 to-warning/5',
    iconColor: 'text-warning',
    stats: 'Top 100 por market cap',
    badge: 'Nuevo',
  },
  {
    title: 'Monedas Internacionales',
    description: 'Euro, Real, Peso Chileno, y más monedas extranjeras',
    icon: FaGlobe,
    href: '/dashboard',
    color: 'from-info/20 to-info/5',
    iconColor: 'text-info',
    stats: 'Cotizaciones en tiempo real',
  },
];

export default function MercadosHubPage() {
  const getTotalFavorites = useFavoritesStore((state) => state.getTotalCount);
  const getTotalAlertas = useAlertasStore((state) => state.getTotalCount);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <FaChartLine className="text-brand" />
              Mercados
            </h1>
            <p className="text-secondary text-lg">
              Todas las cotizaciones y datos de mercado en un solo lugar
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Total Favoritos</p>
                <p className="text-3xl font-bold text-brand">{getTotalFavorites()}</p>
              </div>
              <div className="p-4 rounded-xl bg-brand/10">
                <FaStar className="text-brand text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Alertas Activas</p>
                <p className="text-3xl font-bold text-warning">{getTotalAlertas()}</p>
              </div>
              <div className="p-4 rounded-xl bg-warning/10">
                <FaBell className="text-warning text-2xl" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Mercados</p>
                <p className="text-3xl font-bold text-info">{mercadosCards.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-info/10">
                <FaChartLine className="text-info text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Market Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mercadosCards.map((card, index) => {
            const Icon = card.icon;

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
                          <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded uppercase">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary mb-3 leading-relaxed">
                        {card.description}
                      </p>
                      <p className="text-xs text-secondary">{card.stats}</p>
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
              <h3 className="text-lg font-bold text-foreground mb-2">Datos en Tiempo Real</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Todas las cotizaciones se actualizan automáticamente cada 30 segundos. Los datos
                provienen de fuentes oficiales: DolarAPI.com para dólares, CoinGecko para
                criptomonedas, y Argentina Datos API para monedas internacionales.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
