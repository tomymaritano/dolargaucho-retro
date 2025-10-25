/**
 * Mercados Page
 *
 * Comprehensive view of BCRA economic indicators
 * - Reservas Internacionales
 * - Tasas de Interés (BADLAR, TAMAR)
 * - Base Monetaria
 * - EMAE (Actividad Económica)
 */

'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { BCRAStatsGrid } from '@/components/dashboard/BCRAStatsGrid';
import {
  FaChartLine,
  FaChevronLeft,
  FaInfoCircle,
  FaUniversity,
  FaDollarSign,
  FaChartBar,
} from 'react-icons/fa';
import { HelpButton } from '@/components/ui/HelpButton/HelpButton';

const MERCADOS_FAQ = [
  {
    question: '¿De dónde vienen los datos?',
    answer:
      'Los datos provienen de fuentes oficiales: <strong>BCRA</strong> (Banco Central de la República Argentina) y <strong>API de Series de Tiempo</strong> del Gobierno Argentino. Se actualizan diariamente.',
  },
  {
    question: '¿Qué son las Reservas Internacionales?',
    answer:
      'Las <strong>Reservas Internacionales</strong> son activos en moneda extranjera (principalmente dólares) que el BCRA mantiene para respaldar la economía. Se miden en millones de USD y son un indicador clave de la fortaleza financiera del país.',
  },
  {
    question: '¿Qué significan BADLAR y TAMAR?',
    answer:
      '<strong>BADLAR</strong> es la tasa de interés que pagan los bancos por depósitos a plazo fijo (TNA - Tasa Nominal Anual). <strong>TAMAR</strong> es la tasa activa promedio que cobran los bancos por préstamos. Ambas son indicadores clave del costo del dinero.',
  },
  {
    question: '¿Qué es la Base Monetaria?',
    answer:
      'La <strong>Base Monetaria</strong> es el total de dinero en circulación (billetes + monedas) más los depósitos de los bancos en el BCRA. Se mide en millones de pesos y refleja la cantidad de dinero disponible en la economía.',
  },
  {
    question: '¿Qué es el EMAE?',
    answer:
      'El <strong>EMAE</strong> (Estimador Mensual de Actividad Económica) mide la evolución de la actividad económica argentina mes a mes. Es un adelanto del PIB que permite conocer el crecimiento o contracción de la economía.',
  },
];

export default function MercadosPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-lg hover:bg-panel/10 transition-colors text-secondary hover:text-brand"
                aria-label="Volver al Dashboard"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <span
                  onClick={() => router.push('/dashboard')}
                  className="hover:text-brand cursor-pointer transition-colors"
                >
                  Dashboard
                </span>
                <span>/</span>
                <span className="text-foreground">Mercados</span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                <FaChartLine className="text-brand text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Indicadores BCRA</h1>
                <p className="text-sm text-secondary mt-1">
                  Variables económicas clave del Banco Central de la República Argentina
                </p>
              </div>
            </div>
          </div>
          <div className="mt-14">
            <HelpButton title="Ayuda - Mercados" faqs={MERCADOS_FAQ} />
          </div>
        </div>

        {/* Main Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaUniversity className="text-brand" />
            Indicadores Principales
          </h2>
          <BCRAStatsGrid />
        </div>

        {/* Reservas Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaDollarSign className="text-green-500" />
            Reservas Internacionales
          </h2>
          <Card variant="outlined" padding="lg">
            <div className="text-center py-8 text-secondary">
              <FaChartBar className="text-4xl mx-auto mb-3 opacity-30" />
              <p className="text-sm">Gráfico histórico de reservas - Próximamente</p>
            </div>
          </Card>
        </div>

        {/* Tasas Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Tasas de Interés
          </h2>
          <Card variant="outlined" padding="lg">
            <div className="text-center py-8 text-secondary">
              <FaChartBar className="text-4xl mx-auto mb-3 opacity-30" />
              <p className="text-sm">Gráfico histórico de BADLAR y TAMAR - Próximamente</p>
            </div>
          </Card>
        </div>

        {/* Base Monetaria Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartLine className="text-amber-500" />
            Base Monetaria
          </h2>
          <Card variant="outlined" padding="lg">
            <div className="text-center py-8 text-secondary">
              <FaChartBar className="text-4xl mx-auto mb-3 opacity-30" />
              <p className="text-sm">Gráfico histórico de base monetaria - Próximamente</p>
            </div>
          </Card>
        </div>

        {/* EMAE Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartLine className="text-cyan-500" />
            EMAE - Actividad Económica
          </h2>
          <Card variant="outlined" padding="lg">
            <div className="text-center py-8 text-secondary">
              <FaChartBar className="text-4xl mx-auto mb-3 opacity-30" />
              <p className="text-sm">Gráfico histórico de EMAE - Próximamente</p>
            </div>
          </Card>
        </div>

        {/* Disclaimer Footer */}
        <div className="flex items-start gap-2 p-4 bg-panel/10 border border-white/10 rounded-lg">
          <FaInfoCircle className="text-brand text-sm mt-0.5 flex-shrink-0" />
          <p className="text-xs text-secondary leading-relaxed">
            <strong className="text-foreground">Fuentes Oficiales:</strong> Los datos provienen del
            BCRA y la API de Series de Tiempo del Gobierno Argentino. Se actualizan diariamente.
            Esta información no constituye asesoría financiera.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
