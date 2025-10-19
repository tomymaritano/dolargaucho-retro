import React, { useState } from 'react';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useInflacionInteranual } from '@/hooks/useFinanzas';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FaChartLine } from 'react-icons/fa';

Chart.register(...registerables);

export default function FinancialCalculator() {
  const { data: dolar = [], isLoading: dolarLoading, error: dolarError } = useDolarQuery();
  const {
    data: inflacionData,
    isLoading: inflacionLoading,
    error: inflacionError,
  } = useInflacionInteranual();
  const [amount, setAmount] = useState<string>('');
  const [convertedUSD, setConvertedUSD] = useState<number | null>(null);
  const [inflationAdjusted, setInflationAdjusted] = useState<number | null>(null);
  const [futureValues, setFutureValues] = useState<number[]>([]);

  // Get latest inflation value from hook
  const inflationInterannual =
    inflacionData && inflacionData.length > 0
      ? inflacionData[inflacionData.length - 1].valor
      : null;

  // 🔥 Función para calcular valores y generar el gráfico
  const calculateResults = () => {
    if (!amount || isNaN(Number(amount))) return;
    const numericAmount = parseFloat(amount);
    const oficialDolar = dolar.find((tipo) => tipo.nombre === 'Oficial')?.venta;

    if (oficialDolar) setConvertedUSD(numericAmount / oficialDolar);
    if (inflationInterannual) {
      setInflationAdjusted(numericAmount / Math.pow(1 + inflationInterannual / 100, 1));

      const values: number[] = [];
      for (let i = 0; i <= 5; i++) {
        values.push(numericAmount / Math.pow(1 + inflationInterannual / 100, i));
      }
      setFutureValues(values);
    }
  };

  // Datos del gráfico
  const chartData = {
    labels: ['Hoy', '1 año', '2 años', '3 años', '4 años', '5 años'],
    datasets: [
      {
        label: 'ARS Ajustado por Inflación',
        data: futureValues,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="mx-auto text-foreground p-6 md:p-10 rounded-2xl max-w-7xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaChartLine className="text-brand text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Calculadora <span className="gradient-text">Financiera</span>
        </h2>
        <p className="text-secondary text-sm max-w-7xl mx-auto">
          Analiza el impacto del dólar y la inflación en tus finanzas
        </p>
      </div>

      {/* Estado de carga */}
      {dolarLoading && (
        <p className="text-sm text-brand text-center glass-strong p-4 rounded-xl border border-white/5">
          Cargando cotización del dólar...
        </p>
      )}
      {inflacionLoading && (
        <p className="text-sm text-brand text-center glass-strong p-4 rounded-xl border border-white/5">
          Cargando inflación...
        </p>
      )}
      {dolarError && (
        <p className="text-sm text-error text-center glass-strong p-4 rounded-xl border border-error/30">
          {dolarError.message}
        </p>
      )}
      {inflacionError && (
        <p className="text-sm text-error text-center glass-strong p-4 rounded-xl border border-error/30">
          {inflacionError.message}
        </p>
      )}

      {!dolarLoading && !dolarError && !inflacionLoading && !inflacionError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 glass-strong rounded-xl border border-brand/10 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Cotización USD Oficial
            </p>
            <p className="text-3xl font-mono font-bold text-brand">
              {dolar.find((d) => d.nombre === 'Oficial')?.venta
                ? `$${dolar.find((d) => d.nombre === 'Oficial')?.venta.toFixed(2)}`
                : 'N/A'}
            </p>
          </div>
          <div className="p-5 glass-strong rounded-xl border border-brand/10 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Inflación Interanual
            </p>
            <p className="text-3xl font-mono font-bold text-brand-light">
              {inflationInterannual ? `${inflationInterannual.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Input de monto */}
      <div className="glass-strong p-5 rounded-xl border border-white/5 mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
          Monto en ARS
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-white/5 rounded-lg focus:ring-1 focus:ring-brand focus:outline-none transition-all text-foreground"
          placeholder="Ej: 100000"
        />
      </div>

      {/* Botón de cálculo */}
      <button
        onClick={calculateResults}
        className="w-full bg-brand hover:bg-brand-light text-background-dark py-3 rounded-lg font-semibold transition-all text-sm mb-6"
      >
        Calcular
      </button>

      {/* Resultados */}
      <div className="space-y-4">
        {convertedUSD !== null && (
          <div className="p-5 glass-strong rounded-xl border border-brand/20 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Equivalente en USD
            </p>
            <p className="text-3xl font-mono font-bold text-brand">${convertedUSD.toFixed(2)}</p>
          </div>
        )}

        {inflationAdjusted !== null && (
          <div className="p-5 glass-strong rounded-xl border border-brand-light/20 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Valor Ajustado por Inflación
            </p>
            <p className="text-3xl font-mono font-bold text-brand-light">
              ARS {inflationAdjusted.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Gráfico de inflación */}
      {futureValues.length > 0 && (
        <div className="mt-6 glass-strong p-6 rounded-xl border border-white/5">
          <h3 className="text-sm font-semibold text-secondary text-center mb-4 uppercase tracking-wider">
            Proyección de Inflación
          </h3>
          <div className="h-64 md:h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(18, 23, 46, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#10B981',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#6B7280', font: { size: 11 } },
                  },
                  x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#6B7280', font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
