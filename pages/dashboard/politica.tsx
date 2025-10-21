'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { SenadoresTable } from '@/components/politica/SenadoresTable';
import { DiputadosTable } from '@/components/politica/DiputadosTable';
import { BloqueStatsCard } from '@/components/politica/BloqueStatsCard';
import { ActasUnificadas } from '@/components/politica/ActasUnificadas';
import { Card } from '@/components/ui/Card/Card';
import { FaLandmark, FaUsers, FaFileAlt } from 'react-icons/fa';
import { PageHeader } from '@/components/ui/PageHeader';

type TabType = 'senadores' | 'diputados' | 'actas';

export default function PoliticaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('senadores');

  const tabs = [
    { id: 'senadores' as TabType, label: 'Senadores', icon: FaLandmark },
    { id: 'diputados' as TabType, label: 'Diputados', icon: FaUsers },
    { id: 'actas' as TabType, label: 'Actas', icon: FaFileAlt },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Política' }]}
          icon={FaLandmark}
          title="Congreso Nacional"
          description="Información actualizada sobre la composición del Senado y la Cámara de Diputados"
        />

        {/* Stats Overview - Improved Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bloque Stats Card */}
          <div className="lg:col-span-2">
            <BloqueStatsCard />
          </div>

          {/* Quick Info Cards - Stacked vertically */}
          <div className="space-y-4">
            {/* Senadores Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-brand/30 to-brand/10 border border-brand/20">
                  <FaLandmark className="text-brand text-2xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-brand mb-1">72</h3>
                  <p className="text-sm font-medium text-foreground">Senadores</p>
                  <p className="text-xs text-secondary mt-1">3 por provincia + CABA</p>
                </div>
              </div>
            </Card>

            {/* Diputados Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-brand-light/30 to-brand-light/10 border border-brand-light/20">
                  <FaUsers className="text-brand-light text-2xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-brand-light mb-1">257</h3>
                  <p className="text-sm font-medium text-foreground">Diputados</p>
                  <p className="text-xs text-secondary mt-1">Proporcional por población</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Card variant="elevated" padding="none">
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-brand border-b-2 border-brand'
                      : 'text-secondary hover:text-foreground'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Tab Content */}
        <div>
          {activeTab === 'senadores' && <SenadoresTable />}
          {activeTab === 'diputados' && <DiputadosTable />}
          {activeTab === 'actas' && <ActasUnificadas limit={50} />}
        </div>

        {/* Info Footer */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-3">
            <div className="text-brand text-2xl">ℹ️</div>
            <div>
              <h4 className="text-foreground font-semibold mb-1">Sobre los datos</h4>
              <p className="text-sm text-secondary leading-relaxed">
                Los datos políticos se obtienen de{' '}
                <a
                  href="https://argentinadatos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  ArgentinaData API
                </a>
                . La información se actualiza cada 24 horas y refleja la composición actual del
                Congreso de la Nación Argentina. Incluye datos de senadores y diputados con sus
                respectivos bloques políticos, provincias y mandatos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
