'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { SenadoresTable } from '@/components/politica/SenadoresTable';
import { DiputadosTable } from '@/components/politica/DiputadosTable';
import { BloqueStatsCard } from '@/components/politica/BloqueStatsCard';
import { ActasSenado } from '@/components/politica/ActasSenado';
import { ActasDiputados } from '@/components/politica/ActasDiputados';
import { Card } from '@/components/ui/Card/Card';
import { FaLandmark, FaUsers, FaFileAlt } from 'react-icons/fa';

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            <span className="gradient-text">Datos Políticos</span>
          </h1>
          <p className="text-secondary">
            Información completa sobre senadores, diputados y sesiones del Congreso de la Nación
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BloqueStatsCard />

          {/* Quick Info Cards */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-emerald/20">
                <FaLandmark className="text-accent-emerald text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">72</h3>
                <p className="text-sm text-secondary">Senadores Nacionales</p>
                <p className="text-xs text-secondary mt-2">3 por provincia + CABA</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-teal/20">
                <FaUsers className="text-accent-teal text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">257</h3>
                <p className="text-sm text-secondary">Diputados Nacionales</p>
                <p className="text-xs text-secondary mt-2">Representación proporcional</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card variant="elevated" padding="none">
          <div className="border-b border-white/10">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-accent-emerald border-b-2 border-accent-emerald'
                      : 'text-secondary hover:text-white'
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
          {activeTab === 'actas' && (
            <div className="space-y-6">
              {/* Actas del Senado */}
              <ActasSenado limit={30} />

              {/* Actas de Diputados */}
              <ActasDiputados limit={30} />
            </div>
          )}
        </div>

        {/* Info Footer */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-3">
            <div className="text-accent-emerald text-2xl">ℹ️</div>
            <div>
              <h4 className="text-white font-semibold mb-1">Sobre los datos</h4>
              <p className="text-sm text-secondary leading-relaxed">
                Los datos políticos se obtienen de{' '}
                <a
                  href="https://argentinadatos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-emerald hover:underline"
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
