import React, { useState, useEffect, useRef } from 'react';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useInflacionInteranual } from '@/hooks/useFinanzas';
import { createChart, ColorType, LineStyle, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { FaChartLine } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';
import type { NumericChartDataPoint, TickFormatter } from '@/types/charts';

// Internal chart component
function InflationProjectionChart({
  futureValues,
  labels,
}: {
  futureValues: number[];
  labels: string[];
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || futureValues.length === 0) return;

    // Convertir datos al formato de Lightweight Charts
    const chartData: NumericChartDataPoint[] = futureValues.map((value, index) => ({
      time: index as Time,
      value: value,
    }));

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6B7280',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.05)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(16, 185, 129, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: 'rgba(16, 185, 129, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
        timeVisible: false,
        tickMarkFormatter: ((time: Time) => {
          const index = typeof time === 'number' ? time : 0;
          return labels[index] || '';
        }) as TickFormatter,
      },
    });

    chartRef.current = chart;

    // Add area series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#10B981',
      topColor: 'rgba(16, 185, 129, 0.28)',
      bottomColor: 'rgba(16, 185, 129, 0.05)',
      lineWidth: 3,
    });

    seriesRef.current = areaSeries;
    areaSeries.setData(chartData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [futureValues, labels]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="mt-6 border border-border hover:border-brand/40 transition-all duration-300"
    >
      <h3 className="text-sm font-semibold text-secondary text-center mb-4 uppercase tracking-wider">
        Proyección de Inflación
      </h3>
      <div className="h-64 md:h-80">
        <div
          ref={chartContainerRef}
          className="rounded-lg"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Card>
  );
}

const FinancialCalculator = React.memo(function FinancialCalculator() {
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

  // Labels para el gráfico
  const chartLabels = ['Hoy', '1 año', '2 años', '3 años', '4 años', '5 años'];

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
        <Card variant="elevated" padding="md" className="border border-border text-center">
          <p className="text-sm text-brand">Cargando cotización del dólar...</p>
        </Card>
      )}
      {inflacionLoading && (
        <Card variant="elevated" padding="md" className="border border-border text-center">
          <p className="text-sm text-brand">Cargando inflación...</p>
        </Card>
      )}
      {dolarError && (
        <Card
          variant="elevated"
          padding="md"
          className="border border-error/30 bg-error/5 text-center"
        >
          <p className="text-sm text-error">{dolarError.message}</p>
        </Card>
      )}
      {inflacionError && (
        <Card
          variant="elevated"
          padding="md"
          className="border border-error/30 bg-error/5 text-center"
        >
          <p className="text-sm text-error">{inflacionError.message}</p>
        </Card>
      )}

      {!dolarLoading && !dolarError && !inflacionLoading && !inflacionError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card
            variant="elevated"
            padding="md"
            className="border border-brand/10 bg-brand/5 text-center hover:border-brand/30 transition-all duration-300"
          >
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Cotización USD Oficial
            </p>
            <p className="text-3xl font-mono font-bold text-brand">
              {dolar.find((d) => d.nombre === 'Oficial')?.venta
                ? `$${dolar.find((d) => d.nombre === 'Oficial')?.venta.toFixed(2)}`
                : 'N/A'}
            </p>
          </Card>
          <Card
            variant="elevated"
            padding="md"
            className="border border-brand/10 bg-brand/5 text-center hover:border-brand/30 transition-all duration-300"
          >
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Inflación Interanual
            </p>
            <p className="text-3xl font-mono font-bold text-brand-light">
              {inflationInterannual ? `${inflationInterannual.toFixed(2)}%` : 'N/A'}
            </p>
          </Card>
        </div>
      )}

      {/* Input de monto */}
      <Card
        variant="elevated"
        padding="md"
        className="border border-border mb-4 hover:border-brand/40 transition-all duration-300"
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
          Monto en ARS
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
          placeholder="Ej: 100000"
        />
      </Card>

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
          <Card
            variant="elevated"
            padding="md"
            className="border border-brand/20 bg-brand/5 text-center hover:border-brand/40 transition-all duration-300"
          >
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Equivalente en USD
            </p>
            <p className="text-3xl font-mono font-bold text-brand">${convertedUSD.toFixed(2)}</p>
          </Card>
        )}

        {inflationAdjusted !== null && (
          <Card
            variant="elevated"
            padding="md"
            className="border border-brand-light/20 bg-brand-light/5 text-center hover:border-brand-light/40 transition-all duration-300"
          >
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">
              Valor Ajustado por Inflación
            </p>
            <p className="text-3xl font-mono font-bold text-brand-light">
              ARS {inflationAdjusted.toFixed(2)}
            </p>
          </Card>
        )}
      </div>

      {/* Gráfico de inflación */}
      {futureValues.length > 0 && (
        <InflationProjectionChart futureValues={futureValues} labels={chartLabels} />
      )}
    </div>
  );
});

export default FinancialCalculator;
