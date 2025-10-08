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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Indicadores Financieros</h1>
        <p className="text-secondary">
          Seguí la evolución de los principales índices económicos de Argentina
        </p>
      </div>

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
              <div className="text-3xl font-bold text-white mb-1">
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
              <div className="text-3xl font-bold text-white mb-1">
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
              <div className="text-3xl font-bold text-white mb-1">
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
              <div className="text-3xl font-bold text-white mb-1">
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
      <div className="flex items-center gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('indices')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'indices'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-white'
          }`}
        >
          Índices Económicos
        </button>
        <button
          onClick={() => setActiveTab('tasas')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'tasas'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-white'
          }`}
        >
          Tasas de Interés
        </button>
        <button
          onClick={() => setActiveTab('fci')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === 'fci'
              ? 'border-accent-emerald text-accent-emerald'
              : 'border-transparent text-secondary hover:text-white'
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

            {/* Info Card */}
            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title>Información sobre Tasas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4 text-secondary">
                  <div>
                    <h4 className="text-white font-semibold mb-2">TNA - Tasa Nominal Anual</h4>
                    <p className="text-sm">
                      Es la tasa de interés anual que se aplica sobre el capital invertido, sin
                      considerar la capitalización de intereses.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">TEA - Tasa Efectiva Anual</h4>
                    <p className="text-sm">
                      Es la tasa que refleja el rendimiento real considerando la capitalización de
                      intereses durante el período.
                    </p>
                  </div>
                  <div className="p-4 glass rounded-lg border border-accent-emerald/20">
                    <p className="text-accent-emerald text-sm">
                      💡 <strong>Tip:</strong> La TEA siempre es mayor a la TNA cuando hay
                      capitalización de intereses. Para comparar inversiones, utilizá siempre la
                      TEA.
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </>
        )}

        {activeTab === 'fci' && (
          <>
            {/* FCI Browser */}
            <FCIBrowser />
          </>
        )}
      </div>

      {/* Footer Info */}
      <Card variant="elevated" padding="lg" className="mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 glass rounded-xl">
            <FaChartLine className="text-accent-emerald text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Fuente de Datos</h3>
            <p className="text-secondary text-sm mb-3">
              Todos los datos provienen de{' '}
              <a
                href="https://argentinadatos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-emerald hover:text-accent-teal transition-colors"
              >
                ArgentinaData API
              </a>
              , una fuente oficial y confiable de información económica argentina.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-secondary">
              <div>
                <span className="text-white font-semibold">Actualización:</span> Diaria
              </div>
              <div>
                <span className="text-white font-semibold">Cache:</span> 1 hora (índices), 15 min
                (FCI)
              </div>
              <div>
                <span className="text-white font-semibold">Fuente:</span> INDEC, BCRA, CNV
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
