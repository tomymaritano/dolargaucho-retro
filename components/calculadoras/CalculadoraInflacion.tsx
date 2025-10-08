import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaMoneyBillWave, FaChevronDown, FaCalculator } from 'react-icons/fa';
import { Chart, registerables, TooltipItem } from 'chart.js';

Chart.register(...registerables);

export default function CalculadoraInflacion() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState<number>(84.5);
  const [years, setYears] = useState(5);
  const [futureValues, setFutureValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchInflationRate = async () => {
      try {
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const lastValue = data[data.length - 1];
          setInflationRate(lastValue.valor);
        }
      } catch (error) {
        console.error('Error al obtener la inflación:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInflationRate();
  }, []);

  useEffect(() => {
    const values: number[] = [];
    for (let i = 0; i <= years; i++) {
      values.push(initialAmount / Math.pow(1 + inflationRate / 100, i));
    }
    setFutureValues(values);
  }, [initialAmount, inflationRate, years]);

  const chartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `${i} año${i === 1 ? '' : 's'}`),
    datasets: [
      {
        label: 'Valor Ajustado por Inflación',
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(18, 23, 46, 0.95)',
        titleColor: '#fff',
        bodyColor: '#10B981',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = tooltipItem.raw as number;
            return `ARS ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: { size: 11 },
          callback: (value: number | string) => `$${value}`,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="mx-auto text-white p-6 md:p-10 rounded-2xl max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaCalculator className="text-accent-emerald text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Calculadora de <span className="gradient-text">Inflación</span>
        </h2>
        <p className="text-secondary text-sm max-w-2xl mx-auto">
          Proyecta el impacto de la inflación en tu dinero
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-6 glass-strong p-4 rounded-xl border border-white/5">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex justify-between items-center text-sm font-medium text-white hover:text-accent-emerald transition-colors"
        >
          ¿Cómo funciona esta calculadora?
          <FaChevronDown
            className={`transition-transform text-accent-emerald text-xs ${showExplanation ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {showExplanation && (
          <div className="mt-3 text-secondary text-xs leading-relaxed space-y-2 border-t border-white/5 pt-3">
            <p>
              Esta herramienta estima la pérdida de valor del dinero debido a la inflación en
              Argentina.
            </p>
            <p>
              Ingresa un <strong className="text-white">monto inicial</strong> y los{' '}
              <strong className="text-white">años</strong> de proyección para ver el valor real
              futuro.
            </p>
            <p>El gráfico muestra la evolución del poder adquisitivo en el tiempo.</p>
          </div>
        )}
      </div>

      {/* Inflation Rate */}
      {loading ? (
        <div className="text-center p-4 glass rounded-xl border border-white/5">
          <p className="text-sm text-secondary">Cargando datos de inflación...</p>
        </div>
      ) : (
        <div className="mb-6 p-4 glass-strong rounded-xl border border-accent-emerald/10 flex items-center justify-between">
          <span className="text-sm text-secondary">Inflación Interanual</span>
          <span className="text-xl font-bold font-mono text-accent-emerald">
            {inflationRate.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
            <FaMoneyBillWave className="text-accent-emerald" />
            Monto Inicial (ARS)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg mt-2 focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
          />
        </div>

        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-accent-emerald" />
            Años de Proyección
          </label>
          <input
            type="number"
            value={years}
            min="1"
            max="30"
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg mt-2 focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
          />
        </div>
      </div>

      {/* Result Card */}
      {!loading && (
        <div className="mb-6 p-6 glass-strong rounded-xl border border-accent-emerald/20 text-center">
          <p className="text-xs uppercase tracking-wider text-secondary mb-2">
            Valor Estimado en {years} {years === 1 ? 'año' : 'años'}
          </p>
          <p className="text-3xl md:text-4xl font-bold font-mono text-accent-emerald">
            ARS {futureValues[years]?.toFixed(2)}
          </p>
          <p className="text-xs text-secondary mt-2">
            Pérdida estimada: {((1 - futureValues[years] / initialAmount) * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="glass-strong p-6 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-secondary text-center mb-4 uppercase tracking-wider">
          Proyección del Valor
        </h3>
        <div className="h-64 md:h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
