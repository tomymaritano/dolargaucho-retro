import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { CalculadoraPlazoFijo } from '@/components/calculadoras/CalculadoraPlazoFijo';
import CalculadoraInflacion from '@/components/calculadoras/CalculadoraInflacion';
import { CalculadoraUVA } from '@/components/calculadoras/CalculadoraUVA';
import { FaCalculator, FaPercent, FaChartLine, FaHome } from 'react-icons/fa';

type CalculadoraType = 'plazo-fijo' | 'inflacion' | 'uva';

export default function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState<CalculadoraType>('plazo-fijo');

  const tabs = [
    {
      id: 'plazo-fijo' as CalculadoraType,
      label: 'Plazo Fijo',
      icon: FaPercent,
      description: 'Calculá el rendimiento de tu plazo fijo tradicional',
    },
    {
      id: 'inflacion' as CalculadoraType,
      label: 'Inflación',
      icon: FaChartLine,
      description: 'Estimá el impacto de la inflación en tu dinero',
    },
    {
      id: 'uva' as CalculadoraType,
      label: 'Crédito UVA',
      icon: FaHome,
      description: 'Simulá tu crédito hipotecario en UVAs',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Calculadoras Financieras</h1>
          <p className="text-secondary">Herramientas para tomar mejores decisiones con tu dinero</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tabs.map((tab) => (
            <Card
              key={tab.id}
              variant="elevated"
              padding="lg"
              hover="glow"
              className={`cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'ring-2 ring-accent-emerald'
                  : 'hover:ring-1 hover:ring-white/20'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    activeTab === tab.id ? 'bg-accent-emerald/20' : 'glass'
                  }`}
                >
                  <tab.icon
                    className={`text-2xl ${
                      activeTab === tab.id ? 'text-accent-emerald' : 'text-white'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      activeTab === tab.id ? 'text-accent-emerald' : 'text-white'
                    }`}
                  >
                    {tab.label}
                  </h3>
                  <p className="text-sm text-secondary">{tab.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Calculadora Activa */}
        <div>
          {activeTab === 'plazo-fijo' && <CalculadoraPlazoFijo />}
          {activeTab === 'inflacion' && <CalculadoraInflacion />}
          {activeTab === 'uva' && <CalculadoraUVA />}
        </div>

        {/* Info Footer */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 glass rounded-xl">
              <FaCalculator className="text-accent-emerald text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Sobre las Calculadoras</h3>
              <div className="text-secondary text-sm space-y-2">
                <p>
                  <strong className="text-white">Plazo Fijo:</strong> Calculá cuánto vas a ganar con
                  un plazo fijo tradicional. Podés usar la tasa actual del mercado o ingresar tu
                  propia tasa.
                </p>
                <p>
                  <strong className="text-white">Inflación:</strong> Estimá cuánto perdió tu dinero
                  su poder adquisitivo debido a la inflación en Argentina. Basado en datos oficiales
                  históricos.
                </p>
                <p>
                  <strong className="text-white">Crédito UVA:</strong> Simulá un crédito hipotecario
                  ajustable por UVA (índice que sigue la inflación). Te mostramos cómo evolucionaría
                  tu cuota en el tiempo.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-secondary border-t border-white/10 pt-4">
                <div>
                  <span className="text-white font-semibold">Precisión:</span> Aproximada
                </div>
                <div>
                  <span className="text-white font-semibold">Fuente de Datos:</span> ArgentinaData
                  API
                </div>
                <div>
                  <span className="text-white font-semibold">Actualización:</span> Diaria
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card variant="elevated" padding="lg" className="bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-2xl">⚠️</span>
            <div>
              <h4 className="text-yellow-200 font-semibold mb-1">Aviso Importante</h4>
              <p className="text-sm text-yellow-100/80 leading-relaxed">
                Las calculadoras proporcionan estimaciones aproximadas con fines informativos. Los
                resultados reales pueden variar según las condiciones del mercado, las políticas de
                cada entidad financiera y otros factores. Consultá con un asesor financiero para
                decisiones importantes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
