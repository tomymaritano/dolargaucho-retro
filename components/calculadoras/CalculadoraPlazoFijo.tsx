import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';
import { FaPercent, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import {
  CalculatorLayout,
  CalculatorResultCard,
  CalculatorInfoBanner,
  CalculatorChartContainer,
} from './CalculatorLayout';

Chart.register(...registerables);

interface CalculadoraPlazoFijoProps {
  showHeader?: boolean;
}

export function CalculadoraPlazoFijo({ showHeader = true }: CalculadoraPlazoFijoProps) {
  const [capital, setCapital] = useState<string>('100000');
  const [dias, setDias] = useState<number>(90);
  const [tasaPersonalizada, setTasaPersonalizada] = useState<string>('');
  const [usarTasaActual, setUsarTasaActual] = useState(true);

  const { data: tasas, isLoading: loadingTasas } = useTasaPlazoFijo();

  const plazosComunes = [
    { dias: 30, label: '30 días' },
    { dias: 60, label: '60 días' },
    { dias: 90, label: '90 días' },
    { dias: 180, label: '180 días' },
    { dias: 360, label: '360 días' },
  ];

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

  // Calcular rendimiento
  const resultado = useMemo(() => {
    const capitalNum = parseFloat(capital.replace(/\./g, ''));
    if (isNaN(capitalNum) || capitalNum <= 0) {
      return null;
    }

    // Determinar TNA
    let tna: number;
    if (usarTasaActual && tasas && tasas.length > 0) {
      const mejorTasa = tasas.reduce((max, current) => {
        if (!current.tnaClientes) return max;
        if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
          return current;
        }
        return max;
      }, tasas[0]);
      tna = (mejorTasa.tnaClientes || 0) * 100;
    } else {
      const tasaNum = parseFloat(tasaPersonalizada);
      if (isNaN(tasaNum) || tasaNum <= 0) {
        return null;
      }
      tna = tasaNum;
    }

    // Cálculo simple de plazo fijo
    const interes = (capitalNum * tna * (dias / 365)) / 100;
    const total = capitalNum + interes;
    const rendimientoPorcentaje = ((total - capitalNum) / capitalNum) * 100;

    // Generar datos para el gráfico (evolución día a día)
    const puntosGrafico = 20;
    const incrementoDias = dias / puntosGrafico;
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i <= puntosGrafico; i++) {
      const diasTranscurridos = Math.round(i * incrementoDias);
      const interesAcumulado = (capitalNum * tna * (diasTranscurridos / 365)) / 100;
      const totalAcumulado = capitalNum + interesAcumulado;

      labels.push(`Día ${diasTranscurridos}`);
      data.push(totalAcumulado);
    }

    return {
      capital: capitalNum,
      tna,
      dias,
      interes,
      total,
      rendimientoPorcentaje,
      chartLabels: labels,
      chartData: data,
    };
  }, [capital, dias, tasaPersonalizada, usarTasaActual, tasas]);

  const chartData = resultado
    ? {
        labels: resultado.chartLabels,
        datasets: [
          {
            label: 'Capital Total (ARS)',
            data: resultado.chartData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#fff',
            tension: 0.4,
            borderWidth: 3,
          },
        ],
      }
    : null;

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
        bodyColor: '#10B981',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = tooltipItem.raw as number;
            return `Total: ${formatCurrency(value)}`;
          },
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
          callback: (value: number | string) => formatCurrency(Number(value)),
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
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Plazo Fijo</span>
        </>
      }
      description="Calculá el rendimiento de tu plazo fijo con las tasas actuales del mercado"
      showHeader={showHeader}
    >
      {/* Tasa Actual Banner */}
      {tasas && tasas.length > 0 && (
        <CalculatorInfoBanner
          title="Tasa de Mercado"
          subtitle="TNA promedio bancos argentinos"
          value={`${((tasas[0]?.tnaClientes || 0) * 100).toFixed(2)}%`}
          loading={loadingTasas}
        />
      )}

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Capital */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Capital Inicial</label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={formatNumber(capital)}
              onChange={(e) => handleCapitalChange(e.target.value)}
              placeholder="100.000"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>

        {/* Plazo */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Plazo en Días</label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {plazosComunes.map((plazo) => (
              <button
                key={plazo.dias}
                onClick={() => setDias(plazo.dias)}
                className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all border ${
                  dias === plazo.dias
                    ? 'bg-brand text-background-dark border-brand'
                    : 'glass border-border text-foreground hover:border-brand/30'
                }`}
              >
                {plazo.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="number"
              value={dias}
              onChange={(e) => setDias(parseInt(e.target.value) || 30)}
              min="1"
              max="730"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>
      </div>

      {/* TNA Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">
          Tasa de Interés (TNA)
        </label>
        <div className="flex gap-4 mb-3">
          <button
            onClick={() => setUsarTasaActual(true)}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all border ${
              usarTasaActual
                ? 'bg-brand text-background-dark border-brand'
                : 'glass border-border text-secondary hover:text-foreground hover:border-brand/30'
            }`}
          >
            Tasa de Mercado
          </button>
          <button
            onClick={() => setUsarTasaActual(false)}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all border ${
              !usarTasaActual
                ? 'bg-brand text-background-dark border-brand'
                : 'glass border-border text-secondary hover:text-foreground hover:border-brand/30'
            }`}
          >
            Tasa Personalizada
          </button>
        </div>

        {!usarTasaActual && (
          <div className="relative">
            <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="number"
              value={tasaPersonalizada}
              onChange={(e) => setTasaPersonalizada(e.target.value)}
              placeholder="Ej: 65"
              step="0.1"
              min="0"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        )}
      </div>

      {/* Results */}
      {resultado && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CalculatorResultCard
              label="Interés Generado"
              value={formatCurrency(resultado.interes)}
              sublabel={`${resultado.rendimientoPorcentaje.toFixed(2)}% de rendimiento`}
              variant="success"
            />

            <CalculatorResultCard
              label="Total al Vencimiento"
              value={formatCurrency(resultado.total)}
              sublabel={`En ${resultado.dias} días`}
              variant="info"
            />

            <CalculatorResultCard
              label="TNA Aplicada"
              value={`${resultado.tna.toFixed(2)}%`}
              sublabel="Tasa Nominal Anual"
              variant="info"
            />
          </div>

          {/* Chart */}
          {chartData && (
            <CalculatorChartContainer title="Evolución del Capital">
              <Line data={chartData} options={chartOptions} />
            </CalculatorChartContainer>
          )}
        </>
      )}

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-secondary">
          <span>ℹ️</span>
          <p>
            <strong className="text-foreground">TNA</strong> (Tasa Nominal Anual): tasa de interés
            expresada en términos anuales. El cálculo usa la fórmula estándar de plazo fijo:{' '}
            <code className="text-brand">Interés = Capital × TNA × (Días / 365) / 100</code>
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
