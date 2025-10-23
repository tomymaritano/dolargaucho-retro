import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card/Card';
import {
  FaPercent,
  FaChartLine,
  FaHome,
  FaChartBar,
  FaArrowRight,
  FaRocket,
  FaExternalLinkAlt,
} from 'react-icons/fa';

export type CalculadoraType = 'plazo-fijo' | 'inflacion' | 'uva' | 'activos';

interface Tab {
  id: CalculadoraType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface CalculatorTabsProps {
  activeTab: CalculadoraType;
  onTabChange: (tab: CalculadoraType) => void;
}

const tabs: Tab[] = [
  {
    id: 'activos',
    label: 'Rentabilidad',
    icon: FaChartBar,
    description: 'Analizá si tu inversión le ganó a la inflación',
  },
  {
    id: 'plazo-fijo',
    label: 'Plazo Fijo',
    icon: FaPercent,
    description: 'Calculá el rendimiento de tu plazo fijo tradicional',
  },
  {
    id: 'inflacion',
    label: 'Inflación',
    icon: FaChartLine,
    description: 'Estimá el impacto de la inflación en tu dinero',
  },
  {
    id: 'uva',
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

/**
 * CalculatorTabs Component
 *
 * Displays a grid of calculator options with visual indicators for the active tab.
 * Includes a special "Mega Calculadora" link card.
 */
export function CalculatorTabs({ activeTab, onTabChange }: CalculatorTabsProps) {
  return (
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
              isActive ? 'border-2 border-brand bg-brand/10' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <button className="w-full text-left">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl transition-all ${
                    isActive ? 'bg-brand/20' : 'bg-panel hover:bg-brand/10'
                  }`}
                >
                  <tab.icon className={`text-xl ${isActive ? 'text-brand' : 'text-foreground'}`} />
                </div>
                {isActive && (
                  <span className="px-2 py-0.5 text-xs bg-brand text-background-dark rounded-full font-semibold uppercase">
                    Activo
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3
                  className={`font-bold text-lg transition-colors ${
                    isActive ? 'text-brand' : 'text-foreground'
                  }`}
                >
                  {tab.label}
                </h3>
                <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                  {tab.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-end">
                <FaArrowRight
                  className={`text-sm transition-all ${isActive ? 'text-brand' : 'text-secondary'}`}
                />
              </div>
            </button>
          </Card>
        );
      })}

      {/* Mega Calculadora Link Card */}
      <Link href={megaCalculadoraCard.href}>
        <Card
          variant="elevated"
          padding="lg"
          hover="glow"
          className="cursor-pointer transition-all bg-gradient-to-br from-brand/10 to-brand-light/10 border-brand/30 hover:border-brand"
        >
          <div className="w-full text-left">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-brand/20">
                <megaCalculadoraCard.icon className="text-xl text-brand" />
              </div>
              <span className="px-2 py-0.5 text-xs bg-brand text-background-dark rounded-full font-semibold uppercase">
                {megaCalculadoraCard.badge}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-brand">{megaCalculadoraCard.label}</h3>
              <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                {megaCalculadoraCard.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <FaExternalLinkAlt className="text-sm text-brand" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
