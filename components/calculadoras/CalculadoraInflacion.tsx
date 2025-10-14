import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { Chart, registerables, TooltipItem } from 'chart.js';
import {
  CalculatorLayout,
  CalculatorInput,
  CalculatorResultCard,
  CalculatorModeToggle,
  CalculatorInfoBanner,
  CalculatorChartContainer,
} from './CalculatorLayout';
import { logger } from '@/lib/utils/logger';

Chart.register(...registerables);

interface CalculadoraInflacionProps {
  showHeader?: boolean;
}

export default function CalculadoraInflacion({ showHeader = true }: CalculadoraInflacionProps) {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState<number>(84.5);
  const [years, setYears] = useState(5);
  const [futureValues, setFutureValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [historicalRate, setHistoricalRate] = useState<number | null>(null);

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
        logger.error('Error al obtener la inflación', error, { component: 'CalculadoraInflacion', endpoint: 'inflacionInteranual' });
      } finally {
        setLoading(false);
      }
    };

    fetchInflationRate();
  }, []);

  // Fetch historical inflation if custom date is used
  useEffect(() => {
    if (!useCustomDate || !startDate) {
      setHistoricalRate(null);
      return;
    }

    const fetchHistoricalRate = async () => {
      try {
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Find the rate closest to the selected date
          const selectedDate = new Date(startDate);
          const closest = data.reduce((prev: any, curr: any) => {
            const currDate = new Date(curr.fecha);
            const prevDate = new Date(prev.fecha);
            return Math.abs(currDate.getTime() - selectedDate.getTime()) <
              Math.abs(prevDate.getTime() - selectedDate.getTime())
              ? curr
              : prev;
          });
          setHistoricalRate(closest.valor);
        }
      } catch (error) {
        logger.error('Error al obtener inflación histórica', error, { component: 'CalculadoraInflacion', startDate });
      }
    };

    fetchHistoricalRate();
  }, [useCustomDate, startDate]);

  useEffect(() => {
    const activeRate = useCustomDate && historicalRate !== null ? historicalRate : inflationRate;
    const values: number[] = [];
    for (let i = 0; i <= years; i++) {
      values.push(initialAmount / Math.pow(1 + activeRate / 100, i));
    }
    setFutureValues(values);
  }, [initialAmount, inflationRate, historicalRate, years, useCustomDate]);

  // Determine if purchasing power is decreasing or increasing
  const isPowerDecreasing = futureValues.length > 1 && futureValues[futureValues.length - 1] < futureValues[0];
  const chartColor = isPowerDecreasing ? '#EF4444' : '#10B981'; // Red if decreasing, green if increasing
  const chartColorRgba = isPowerDecreasing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';

  const chartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `${i} año${i === 1 ? '' : 's'}`),
    datasets: [
      {
        label: 'Valor Ajustado por Inflación',
        data: futureValues,
        borderColor: chartColor,
        backgroundColor: chartColorRgba,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: chartColor,
        pointBorderColor: '#fff',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(18, 23, 46, 0.95)',
        titleColor: '#fff',
        bodyColor: chartColor,
        borderColor: isPowerDecreasing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = tooltipItem.raw as number;
            return `Valor: ARS ${value.toFixed(2)}`;
          },
        },
      },
      crosshair: {
        line: {
          color: isPowerDecreasing ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
          width: 1,
        },
        sync: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: true,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 },
          callback: (value: number | string) => `$${value}`,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: true,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 },
        },
      },
    },
    hover: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <CalculatorLayout
      title={<>Calculadora de <span className="gradient-text">Inflación</span></>}
      description="Proyecta el impacto de la inflación en tu dinero a lo largo del tiempo"
      showHeader={showHeader}
    >
      {/* Mode Toggle */}
      <CalculatorModeToggle
        modes={[
          { label: 'Proyección Futura', value: 'future' },
          { label: 'Desde Fecha Pasada', value: 'past' },
        ]}
        activeMode={useCustomDate ? 'past' : 'future'}
        onModeChange={(mode) => setUseCustomDate(mode === 'past')}
      />

      {/* Inflation Rate Banner */}
      <CalculatorInfoBanner
        title={useCustomDate && historicalRate !== null ? 'Tasa Histórica' : 'Tasa Actual'}
        subtitle={
          useCustomDate && startDate
            ? `Inflación desde ${new Date(startDate).toLocaleDateString('es-AR')}`
            : 'Inflación Interanual Argentina'
        }
        value={`${
          useCustomDate && historicalRate !== null
            ? historicalRate.toFixed(2)
            : inflationRate.toFixed(2)
        }%`}
        loading={loading}
      />

      {/* Input Fields - Compact Inline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CalculatorInput
          label="Monto Inicial"
          value={initialAmount}
          onChange={(value) => setInitialAmount(Number(value))}
          type="number"
          prefix="ARS"
        />

        {useCustomDate && (
          <CalculatorInput
            label="Fecha de Compra"
            value={startDate}
            onChange={setStartDate}
            type="date"
            max={new Date().toISOString().split('T')[0]}
          />
        )}

        <CalculatorInput
          label={useCustomDate ? 'Años desde compra' : 'Años de Proyección'}
          value={years}
          onChange={(value) => setYears(Number(value))}
          type="number"
          min="1"
          max="30"
        />
      </div>

      {/* Results - Clean Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CalculatorResultCard
            label={`Poder Adquisitivo en ${years} ${years === 1 ? 'año' : 'años'}`}
            value={`$${futureValues[years]?.toFixed(2)}`}
            sublabel={`Equivalente a tu inversión inicial de $${initialAmount.toFixed(2)}`}
            variant="success"
          />

          <CalculatorResultCard
            label="Pérdida de Valor"
            value={`${((1 - futureValues[years] / initialAmount) * 100).toFixed(1)}%`}
            sublabel="Devaluación proyectada del poder de compra"
            variant="error"
          />
        </div>
      )}

      {/* Chart */}
      <CalculatorChartContainer title="Evolución del Poder Adquisitivo">
        <Line data={chartData} options={chartOptions} />
      </CalculatorChartContainer>

      {/* Explanation - Minimalist */}
      <div className="mt-6 pt-6 border-t border-border">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex justify-between items-center text-sm font-medium text-secondary hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            <FaCalendarAlt className="text-xs" />
            ¿Cómo se calcula esto?
          </span>
          <FaChevronDown
            className={`transition-transform text-accent-emerald text-xs ${showExplanation ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {showExplanation && (
          <div className="mt-4 text-secondary text-sm leading-relaxed space-y-2">
            {useCustomDate ? (
              <>
                <p>
                  <strong className="text-foreground">Modo Histórico:</strong> Calcula cuánto perdió tu dinero desde una fecha pasada hasta hoy.
                </p>
                <p>
                  Ideal para saber: "Compré algo por $1000 el año pasado, ¿cuánto vale hoy con la inflación?"
                </p>
                <p className="text-xs italic">
                  Usa la tasa de inflación interanual del momento de compra para calcular la devaluación hasta hoy.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong className="text-foreground">Modo Proyección:</strong> Estima cómo se devaluará tu dinero hacia el futuro.
                </p>
                <p>
                  Utiliza la tasa de inflación interanual actual para proyectar el poder adquisitivo futuro.
                </p>
                <p className="text-xs italic">
                  Las proyecciones asumen que la tasa de inflación se mantiene constante, lo cual puede no reflejar la realidad económica.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
