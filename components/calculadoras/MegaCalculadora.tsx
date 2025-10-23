'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTasaPlazoFijo, useInflacionInteranual, useUltimaInflacion } from '@/hooks/useFinanzas';
import { useDolarByType } from '@/hooks/useDolarQuery';
import { useDolarHistorico } from '@/hooks/useDolarHistorico';
import { useMegaCalculadora } from '@/hooks/useMegaCalculadora';
import type { PortfolioAllocation } from '@/hooks/useMegaCalculadora';
import { FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import {
  CalculatorLayout,
  CalculatorInput,
  CalculatorResultCard,
  CalculatorInfoBanner,
} from './CalculatorLayout';
import { EconomicParametersSection } from './EconomicParametersSection';
import { PortfolioAllocationSection } from './PortfolioAllocationSection';
import { BestStrategyCard } from './BestStrategyCard';
import { StrategyComparisonGrid } from './StrategyComparisonGrid';
import { EvolutionChart } from './EvolutionChart';

export const MegaCalculadora = React.memo(function MegaCalculadora() {
  // Inputs principales
  const [capital, setCapital] = useState<string>('1000000');
  const [dias, setDias] = useState<number>(180);

  // Allocation para estrategia diversificada
  const [allocation, setAllocation] = useState<PortfolioAllocation>({
    plazoFijo: 40,
    dolarBlue: 30,
    dolarMEP: 30,
  });

  // Dates for plazo fijo
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 180);
    return date.toISOString().split('T')[0];
  });

  // Data hooks
  const { data: tasas } = useTasaPlazoFijo();
  const { data: dolarBlue } = useDolarByType('blue');
  const { data: dolarMEP } = useDolarByType('bolsa'); // MEP = Dólar Bolsa
  const { data: inflacionData } = useInflacionInteranual();
  const { data: ultimaInflacion } = useUltimaInflacion();

  // Historical data for devaluation calculation (1 month ago)
  const fechaMesAnterior = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }, []);
  const { data: dolarHistorico } = useDolarHistorico(fechaMesAnterior);

  // Automatic calculations from API data
  const inflacionMensualAuto = ultimaInflacion?.valor ?? 7; // Default 7% if not available
  const devaluacionMensualAuto = useMemo(() => {
    if (!dolarBlue || !dolarHistorico) return 8; // Default 8%

    const blueHistorico = dolarHistorico.find((d) => d.nombre === 'Blue');
    if (!blueHistorico) return 8;

    const devaluacion = ((dolarBlue.venta - blueHistorico.venta) / blueHistorico.venta) * 100;
    return Math.max(0, devaluacion); // No negative devaluations
  }, [dolarBlue, dolarHistorico]);

  const spreadMEPAuto = useMemo(() => {
    if (!dolarBlue || !dolarMEP) return 5; // Default 5%

    // Spread: % que el MEP es más barato que el blue
    const spread = ((dolarBlue.venta - dolarMEP.venta) / dolarBlue.venta) * 100;
    return Math.max(0, spread); // Can be negative but we show 0 minimum
  }, [dolarBlue, dolarMEP]);

  // Auto-calculate dias from date range
  useEffect(() => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays !== dias) {
      setDias(diffDays);
    }
  }, [fechaInicio, fechaFin, dias]);

  // Calculations using custom hook
  const analisisCompleto = useMegaCalculadora({
    capital,
    dias,
    allocation,
    devaluacionMensualAuto,
    inflacionMensualAuto,
    spreadMEPAuto,
    dolarBlue,
    dolarMEP,
    tasas,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
  };

  const handleCapitalChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setCapital(cleaned);
  };

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora <span className="gradient-text">Financiera Avanzada</span>
        </>
      }
      description="Análisis completo de inversiones con TIR, VAN, Sharpe Ratio y comparación de estrategias"
      maxWidth="7xl"
    >
      {/* Banners informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {dolarBlue && (
          <CalculatorInfoBanner
            title="Dólar Blue Actual"
            subtitle="Cotización de venta"
            value={`$${dolarBlue.venta.toFixed(2)}`}
          />
        )}
        {tasas && tasas.length > 0 && (
          <CalculatorInfoBanner
            title="TNA Mercado"
            subtitle="Tasa Nominal Anual"
            value={`${((tasas[0]?.tnaClientes || 0) * 100).toFixed(2)}%`}
          />
        )}
        {inflacionData && inflacionData.length > 0 && (
          <CalculatorInfoBanner
            title="Inflación Interanual"
            subtitle="Índice actual"
            value={`${inflacionData[inflacionData.length - 1].valor.toFixed(1)}%`}
          />
        )}
      </div>

      {/* Inputs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Capital Inicial</label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={formatNumber(capital)}
              onChange={(e) => handleCapitalChange(e.target.value)}
              placeholder="1.000.000"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-3 bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-4 py-3 bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
          />
        </div>

        <CalculatorInput
          label="Plazo (días)"
          value={dias}
          onChange={(value) => setDias(Number(value))}
          type="number"
          min="30"
          max="730"
        />
      </div>

      {/* Economic Parameters Section */}
      <EconomicParametersSection
        inflacionMensualAuto={inflacionMensualAuto}
        devaluacionMensualAuto={devaluacionMensualAuto}
        spreadMEPAuto={spreadMEPAuto}
        ultimaInflacion={ultimaInflacion}
        dolarHistorico={dolarHistorico}
        dolarBlue={dolarBlue}
        dolarMEP={dolarMEP}
      />

      {/* Portfolio Allocation Section */}
      <PortfolioAllocationSection allocation={allocation} onAllocationChange={setAllocation} />

      {/* Results */}
      {analisisCompleto && (
        <>
          {/* Best Strategy Card */}
          <BestStrategyCard
            strategy={analisisCompleto.mejorPorRendimiento}
            formatCurrency={formatCurrency}
          />

          {/* Strategy Comparison Grid */}
          <StrategyComparisonGrid
            estrategias={analisisCompleto.estrategias}
            formatCurrency={formatCurrency}
          />

          {/* Evolution Chart */}
          <EvolutionChart chartData={analisisCompleto.chartData} />

          {/* Métricas adicionales */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <CalculatorResultCard
              label="Capital Inicial"
              value={formatCurrency(analisisCompleto.capital)}
              variant="info"
            />
            <CalculatorResultCard
              label="Plazo"
              value={`${analisisCompleto.meses} meses`}
              sublabel={`${analisisCompleto.dias} días`}
              variant="info"
            />
            <CalculatorResultCard
              label="Inflación Proyectada"
              value={`${analisisCompleto.inflacionAcumulada.toFixed(1)}%`}
              sublabel="Acumulada"
              variant="warning"
            />
            <CalculatorResultCard
              label="Devaluación Proyectada"
              value={`$${analisisCompleto.dolarFinal.toFixed(2)}`}
              sublabel={`Desde $${analisisCompleto.dolarInicio.toFixed(2)}`}
              variant="info"
            />
          </div>

          {/* Advertencias */}
          <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="text-warning text-lg flex-shrink-0 mt-0.5" />
              <div className="text-xs text-secondary">
                <p className="font-semibold text-foreground mb-2">Consideraciones importantes:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    <strong className="text-foreground">VAN (Valor Actual Neto):</strong> Valor
                    presente del flujo futuro descontado por inflación. VAN positivo indica ganancia
                    real.
                  </li>
                  <li>
                    <strong className="text-foreground">TIR (Tasa Interna de Retorno):</strong>{' '}
                    Rentabilidad mensual efectiva. Compará con la inflación mensual (
                    {analisisCompleto.inflacionAcumulada.toFixed(1)}% / {analisisCompleto.meses} ={' '}
                    {(analisisCompleto.inflacionAcumulada / analisisCompleto.meses).toFixed(2)}%).
                  </li>
                  <li>
                    <strong className="text-foreground">Sharpe Ratio:</strong> Rendimiento ajustado
                    por riesgo. Mayor valor = mejor relación riesgo/retorno.
                  </li>
                  <li>
                    <strong className="text-foreground">Rendimiento Real:</strong> Ya descontada la
                    inflación. Este es tu ganancia/pérdida de poder adquisitivo real.
                  </li>
                  <li>
                    Las proyecciones asumen tasas constantes. La realidad puede variar
                    significativamente.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </CalculatorLayout>
  );
});
