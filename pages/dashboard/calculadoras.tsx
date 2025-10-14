import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { CalculatorTabs, type CalculadoraType } from '@/components/calculadoras/CalculatorTabs';
import { FREDSection } from '@/components/calculadoras/FREDSection';
import { ArgentinaUSAComparison } from '@/components/calculadoras/ArgentinaUSAComparison';
import { useFredData } from '@/hooks/useFredData';
import { useInflacion } from '@/hooks/useInflacion';

// Loading skeleton for lazy-loaded calculators
const LoadingSkeleton = () => (
  <Card variant="elevated" padding="lg">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-panel rounded w-1/3"></div>
      <div className="h-32 bg-panel rounded"></div>
      <div className="h-12 bg-panel rounded"></div>
    </div>
  </Card>
);

// Lazy load calculators
const CalculadoraActivos = dynamic(
  () =>
    import('@/components/calculadoras/CalculadoraActivos').then((mod) => ({
      default: mod.CalculadoraActivos,
    })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraPlazoFijo = dynamic(
  () =>
    import('@/components/calculadoras/CalculadoraPlazoFijo').then((mod) => ({
      default: mod.CalculadoraPlazoFijo,
    })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraInflacion = dynamic(
  () => import('@/components/calculadoras/CalculadoraInflacion'),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

const CalculadoraUVA = dynamic(
  () =>
    import('@/components/calculadoras/CalculadoraUVA').then((mod) => ({
      default: mod.CalculadoraUVA,
    })),
  { loading: () => <LoadingSkeleton />, ssr: false }
);

/**
 * CalculadorasPage
 *
 * Main calculators dashboard page with:
 * - Tab navigation for 4 calculator types
 * - Argentina vs USA economic comparison
 * - FRED economic data section
 */
export default function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState<CalculadoraType>('plazo-fijo');

  // Data hooks
  const { data: rawFredData, isLoading: fredLoading } = useFredData();
  const { data: argInflacion } = useInflacion();

  // Adapt FRED data: validate all required fields exist, then use type assertion
  const fredData = (
    rawFredData &&
    rawFredData.federalFundsRate &&
    rawFredData.inflationCPI &&
    rawFredData.gdp &&
    rawFredData.unemploymentRate &&
    rawFredData.treasury10y
      ? rawFredData
      : undefined
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const renderCalculator = () => {
    switch (activeTab) {
      case 'activos':
        return <CalculadoraActivos showHeader={false} />;
      case 'plazo-fijo':
        return <CalculadoraPlazoFijo showHeader={false} />;
      case 'inflacion':
        return <CalculadoraInflacion showHeader={false} />;
      case 'uva':
        return <CalculadoraUVA showHeader={false} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Calculator Navigation Tabs */}
        <CalculatorTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Active Calculator */}
        <div className="mt-6 max-w-5xl mx-auto">{renderCalculator()}</div>

        {/* Argentina vs USA Comparison */}
        {!fredLoading && fredData && argInflacion && (
          <ArgentinaUSAComparison argInflacion={argInflacion} fredData={fredData} />
        )}

        {/* FRED Economic Data Section */}
        <FREDSection fredData={fredData} isLoading={fredLoading} />

        {/* Page Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50 mt-8">
          <div className="flex items-center gap-4 text-xs text-secondary">
            <Link href="/help" className="hover:text-accent-emerald transition-colors">
              Ayuda
            </Link>
            <span>•</span>
            <Link href="/help/fuentes" className="hover:text-accent-emerald transition-colors">
              Fuentes de Datos
            </Link>
            <span>•</span>
            <span>Actualización diaria</span>
          </div>
          <p className="text-xs text-secondary text-center sm:text-right">
            Estimaciones aproximadas.{' '}
            <Link href="/help/precision" className="text-accent-emerald hover:underline">
              Más información
            </Link>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
