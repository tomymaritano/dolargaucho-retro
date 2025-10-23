import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartLine } from 'react-icons/fa';

interface InflacionData {
  fecha: string;
  valor: number;
}

interface FredData {
  federalFundsRate?: {
    latest: number;
    change: number;
  };
  inflationCPI?: {
    yearOverYear: number;
  };
  unemploymentRate?: {
    latest: number;
  };
  treasury10y?: {
    latest: number;
  };
  gdp?: {
    quarterlyGrowth: number;
  };
}

interface ArgentinaUSAComparisonProps {
  argInflacion: InflacionData[];
  fredData: FredData;
}

/**
 * ArgentinaUSAComparison Component
 *
 * Displays a comparison between Argentina and USA economic indicators.
 * Shows inflation comparison and key US economic context metrics.
 */
export function ArgentinaUSAComparison({ argInflacion, fredData }: ArgentinaUSAComparisonProps) {
  const latestArgInflation = argInflacion[argInflacion.length - 1];
  const usInflation = fredData.inflationCPI?.yearOverYear || 1;
  const inflationRatio = latestArgInflation?.valor / usInflation;

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/20">
          <FaChartLine className="text-2xl text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            Argentina vs USA
            <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full font-semibold uppercase">
              Comparativa
            </span>
          </h2>
          <p className="text-sm text-secondary">
            Contexto económico comparado: entendé cómo se posiciona Argentina frente a Estados
            Unidos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inflation Comparison */}
        <Card
          variant="elevated"
          padding="md"
          className="border border-border hover:border-purple-400/40 transition-all duration-300"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            📊 Inflación Anual
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-secondary flex items-center gap-2">🇦🇷 Argentina</span>
                <span className="text-xs text-red-400">Interanual</span>
              </div>
              <p className="text-3xl font-bold text-red-400">
                {latestArgInflation?.valor.toFixed(1)}%
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-secondary flex items-center gap-2">🇺🇸 USA</span>
                <span className="text-xs text-blue-400">Year over Year</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{usInflation.toFixed(1)}%</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-secondary">
                <strong className="text-brand">Ratio: {inflationRatio.toFixed(1)}x</strong> La
                inflación argentina es {inflationRatio.toFixed(0)} veces mayor que la estadounidense
              </p>
            </div>
          </div>
        </Card>

        {/* Economic Context */}
        <Card
          variant="elevated"
          padding="md"
          className="border border-border hover:border-purple-400/40 transition-all duration-300"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">💹 Contexto Económico</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-secondary">Tasa FED (USA)</span>
              <span className="font-bold text-blue-400">
                {fredData.federalFundsRate?.latest.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-secondary">Desempleo USA</span>
              <span className="font-bold text-foreground">
                {fredData.unemploymentRate?.latest.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-secondary">Bonos 10Y USA</span>
              <span className="font-bold text-foreground">
                {fredData.treasury10y?.latest.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-secondary">PIB USA (QoQ)</span>
              <span
                className={`font-bold ${
                  (fredData.gdp?.quarterlyGrowth || 0) > 0 ? 'text-success' : 'text-error'
                }`}
              >
                {(fredData.gdp?.quarterlyGrowth || 0) > 0 ? '+' : ''}
                {fredData.gdp?.quarterlyGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
