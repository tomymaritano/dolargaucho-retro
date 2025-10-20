import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { TasasChart } from '@/components/charts/TasasChart';
import { FCIBrowser } from '@/components/finanzas/FCIBrowser';
import { useUltimoUVA, useUltimaTasaPlazoFijo } from '@/hooks/useFinanzas';
import { FaChartLine, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import { PageHeader } from '@/components/ui/PageHeader';

export default function FinanzasPage() {
  const [activeTab, setActiveTab] = useState<'tasas' | 'fci'>('tasas');

  const { data: ultimoUVA } = useUltimoUVA();
  const { data: ultimaTasaPF } = useUltimaTasaPlazoFijo();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Finanzas' }]}
        icon={FaChartLine}
        title="Indicadores Financieros"
        description="Tasas de interés, instrumentos de inversión y fondos comunes (FCI)"
      />

      {/* Quick Stats Grid - Solo instrumentos financieros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Índice UVA */}
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <FaCalendar className="text-brand-light" />
                <span className="uppercase tracking-wider">Índice UVA</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {ultimoUVA?.valor ? ultimoUVA.valor.toFixed(2) : '—'}
              </div>
              <p className="text-xs text-secondary">
                {ultimoUVA?.fecha ? new Date(ultimoUVA.fecha).toLocaleDateString('es-AR') : '—'}
              </p>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendar className="text-brand-light text-xl" />
            </div>
          </div>
        </Card>

        {/* Tasa Plazo Fijo */}
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <FaMoneyBillWave className="text-warning" />
                <span className="uppercase tracking-wider">Mejor Tasa PF</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {ultimaTasaPF?.tnaClientes
                  ? `${(ultimaTasaPF.tnaClientes * 100).toFixed(2)}%`
                  : '—'}
              </div>
              <p className="text-xs text-secondary">
                {ultimaTasaPF?.entidad
                  ? ultimaTasaPF.entidad.split(' ').slice(0, 3).join(' ')
                  : '—'}
              </p>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaMoneyBillWave className="text-warning text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('tasas')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'tasas'
              ? 'border-brand text-brand'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          Tasas de Interés
        </button>
        <button
          onClick={() => setActiveTab('fci')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'fci'
              ? 'border-brand text-brand'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          Fondos Comunes (FCI)
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'tasas' && (
          <>
            {/* Gráfico de Tasas */}
            <TasasChart limit={12} />
          </>
        )}

        {activeTab === 'fci' && (
          <>
            {/* FCI Browser */}
            <FCIBrowser />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
