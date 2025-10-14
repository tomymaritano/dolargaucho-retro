import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { InflacionChart } from '@/components/charts/InflacionChart';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';
import { TasasChart } from '@/components/charts/TasasChart';
import { FCIBrowser } from '@/components/finanzas/FCIBrowser';
import {
  useUltimaInflacion,
  useUltimoRiesgoPais,
  useUltimoUVA,
  useUltimaTasaPlazoFijo,
} from '@/hooks/useFinanzas';
import {
  FaChartLine,
  FaPercentage,
  FaExclamationTriangle,
  FaCalendar,
  FaMoneyBillWave,
} from 'react-icons/fa';

export default function FinanzasPage() {
  const [activeTab, setActiveTab] = useState<'indices' | 'tasas' | 'fci'>('indices');

  const { data: ultimaInflacion } = useUltimaInflacion();
  const { data: ultimoRiesgoPais } = useUltimoRiesgoPais();
  const { data: ultimoUVA } = useUltimoUVA();
  const { data: ultimaTasaPF } = useUltimaTasaPlazoFijo();

  return (
    <DashboardLayout>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Inflación */}
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <FaPercentage className="text-accent-emerald" />
                <span className="uppercase tracking-wider">Inflación Mensual</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {ultimaInflacion ? `${ultimaInflacion.valor.toFixed(2)}%` : '-'}
              </div>
              <p className="text-xs text-secondary">
                {ultimaInflacion
                  ? new Date(ultimaInflacion.fecha).toLocaleDateString('es-AR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Cargando...'}
              </p>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaChartLine className="text-accent-emerald text-xl" />
            </div>
          </div>
        </Card>

        {/* Riesgo País */}
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <FaExclamationTriangle className="text-error" />
                <span className="uppercase tracking-wider">Riesgo País</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {ultimoRiesgoPais?.valor ? ultimoRiesgoPais.valor.toLocaleString('es-AR') : '—'}
              </div>
              <p className="text-xs text-secondary">
                {ultimoRiesgoPais?.fecha
                  ? new Date(ultimoRiesgoPais.fecha).toLocaleDateString('es-AR')
                  : '—'}
              </p>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaExclamationTriangle className="text-error text-xl" />
            </div>
          </div>
        </Card>

        {/* Índice UVA */}
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <FaCalendar className="text-accent-teal" />
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
              <FaCalendar className="text-accent-teal text-xl" />
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
          onClick={() => setActiveTab('indices')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'indices'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          Índices Económicos
        </button>
        <button
          onClick={() => setActiveTab('tasas')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'tasas'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          Tasas de Interés
        </button>
        <button
          onClick={() => setActiveTab('fci')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'fci'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-foreground'
          }`}
        >
          Fondos Comunes (FCI)
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'indices' && (
          <>
            {/* Gráfico de Inflación */}
            <InflacionChart showInteranual={true} limit={12} />

            {/* Gráfico de Riesgo País */}
            <RiesgoPaisChart limit={30} />
          </>
        )}

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
