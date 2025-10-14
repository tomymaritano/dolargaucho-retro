'use client';

import React, { useMemo } from 'react';
import { ResultadoAnalisis } from './types';
import {
  formatearMoneda,
  formatearPorcentaje,
  determinarResultado,
} from './utils';
import { Card } from '@/components/ui/Card/Card';
import { Tooltip as InfoTooltip } from '@/components/ui/Tooltip/Tooltip';
import {
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDollarSign,
  FaChartBar,
  FaChartPie,
} from 'react-icons/fa';
import { useChartTheme } from '@/lib/hooks/useChartTheme';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ResultadosActivoProps {
  resultado: ResultadoAnalisis;
  precioCompra: number;
  precioVenta: number;
  moneda: 'ARS' | 'USD';
}

export function ResultadosActivo({
  resultado,
  precioCompra,
  precioVenta,
  moneda,
}: ResultadosActivoProps) {
  const chartTheme = useChartTheme();
  const resultadoReal = determinarResultado(resultado.rentabilidadReal);
  const resultadoNominal = determinarResultado(resultado.rentabilidadNominal);

  const IconoResultado =
    resultadoReal === 'ganancia'
      ? FaCheckCircle
      : resultadoReal === 'perdida'
        ? FaTimesCircle
        : FaExclamationTriangle;

  const colorResultado =
    resultadoReal === 'ganancia'
      ? 'text-success'
      : resultadoReal === 'perdida'
        ? 'text-error'
        : 'text-warning';

  // Datos para gráfico de barras
  const dataBarras = useMemo(
    () => [
      {
        name: 'Nominal',
        valor: resultado.rentabilidadNominal,
        fill: resultado.rentabilidadNominal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Real',
        valor: resultado.rentabilidadReal,
        fill: resultado.rentabilidadReal >= 0 ? '#10B981' : '#EF4444',
      },
      {
        name: 'Inflación',
        valor: resultado.inflacionAcumulada,
        fill: '#F59E0B',
      },
    ],
    [resultado]
  );

  // Datos para gráfico circular
  const dataPie = useMemo(() => {
    const datos = [
      {
        name: 'Inversión Inicial',
        value: precioCompra,
        fill: '#3B82F6',
      },
      {
        name: 'Ganancia/Pérdida',
        value: Math.abs(resultado.gananciaReal),
        fill: resultado.gananciaReal >= 0 ? '#10B981' : '#EF4444',
      },
    ];
    return datos;
  }, [precioCompra, resultado.gananciaReal]);

  return (
    <div className="space-y-6">
      {/* Header de Resultados */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Análisis de Rentabilidad</h3>
        <p className="text-secondary">
          Comparación entre inversión real y alternativas
        </p>
        {/* Badge de moneda */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-sm text-secondary">Moneda:</span>
          <span className="px-3 py-1 bg-accent-emerald/20 text-accent-emerald rounded-full font-semibold">
            {moneda === 'USD' ? '🇺🇸 USD' : '🇦🇷 ARS'}
          </span>
        </div>
      </div>

      {/* Cards Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rentabilidad Nominal */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <InfoTooltip content="Ganancia sin considerar la inflación. Es el crecimiento nominal de tu inversión.">
                <p className="text-sm text-secondary mb-1">Rentabilidad Nominal</p>
              </InfoTooltip>
              <div className="text-3xl font-bold text-foreground">
                {formatearPorcentaje(resultado.rentabilidadNominal)}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${resultadoNominal === 'ganancia' ? 'bg-success/20' : 'bg-error/20'}`}>
              <FaChartLine
                className={`text-2xl ${resultadoNominal === 'ganancia' ? 'text-success' : 'text-error'}`}
              />
            </div>
          </div>
        </Card>

        {/* Rentabilidad Real */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <InfoTooltip content="Ganancia ajustada por inflación. Este es el valor verdadero de tu inversión en términos de poder adquisitivo.">
                <p className="text-sm text-secondary mb-1">Rentabilidad Real</p>
              </InfoTooltip>
              <div className={`text-3xl font-bold ${colorResultado}`}>
                {formatearPorcentaje(resultado.rentabilidadReal)}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${resultadoReal === 'ganancia' ? 'bg-success/20' : resultadoReal === 'perdida' ? 'bg-error/20' : 'bg-warning/20'}`}>
              <IconoResultado className={`text-2xl ${colorResultado}`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Valores Absolutos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="solid" padding="md">
          <p className="text-xs text-secondary mb-1">Inversión Inicial</p>
          <p className="text-xl font-bold text-foreground">{formatearMoneda(precioCompra)}</p>
        </Card>

        <Card variant="solid" padding="md">
          <p className="text-xs text-secondary mb-1">Valor Actual</p>
          <p className="text-xl font-bold text-foreground">{formatearMoneda(precioVenta)}</p>
        </Card>

        <Card variant="solid" padding="md">
          <p className="text-xs text-secondary mb-1">Ganancia Nominal</p>
          <p
            className={`text-xl font-bold ${resultado.gananciaAbsoluta >= 0 ? 'text-success' : 'text-error'}`}
          >
            {formatearMoneda(resultado.gananciaAbsoluta)}
          </p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Rentabilidades */}
        <Card variant="elevated" padding="lg">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartBar className="text-accent-emerald" />
            Comparativa de Rentabilidades
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBarras}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
              <XAxis dataKey="name" stroke={chartTheme.axisColor} />
              <YAxis stroke={chartTheme.axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartTheme.tooltipBg,
                  color: chartTheme.tooltipColor,
                  border: `1px solid ${chartTheme.tooltipBorder}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rentabilidad']}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {dataBarras.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico Circular - Composición */}
        <Card variant="elevated" padding="lg">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartPie className="text-accent-emerald" />
            Composición de la Inversión
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: chartTheme.tooltipBg,
                  color: chartTheme.tooltipColor,
                  border: `1px solid ${chartTheme.tooltipBorder}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatearMoneda(value), 'Valor']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Inflación */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <InfoTooltip content={moneda === 'USD' ? 'Inflación estadounidense (CPI) en el período de tu inversión' : 'Inflación argentina (IPC) en el período de tu inversión'}>
              <p className="text-sm text-secondary mb-2">
                Inflación Acumulada {moneda === 'USD' ? '(USD)' : '(ARS)'}
              </p>
            </InfoTooltip>
            <div className="text-2xl font-bold text-foreground">
              {formatearPorcentaje(resultado.inflacionAcumulada, 1)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary mb-1">Valor ajustado</p>
            <p className="text-lg font-semibold text-warning">
              {moneda === 'USD'
                ? `$${resultado.valorAjustadoInflacion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : formatearMoneda(resultado.valorAjustadoInflacion)
              }
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-secondary text-center">
            {resultado.rentabilidadReal >= 0 ? (
              <>
                ✅ <span className="text-success font-semibold">Ganaste</span>{' '}
                <strong className="text-success">{formatearPorcentaje(resultado.rentabilidadReal)}</strong>{' '}
                por encima de la inflación
              </>
            ) : (
              <>
                ❌ <span className="text-error font-semibold">Perdiste</span>{' '}
                <strong className="text-error">{formatearPorcentaje(Math.abs(resultado.rentabilidadReal))}</strong>{' '}
                en términos reales
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Comparativas */}
      {(resultado.comparativas.dolarBlue || resultado.comparativas.dolarOficial) && (
        <Card variant="elevated" padding="lg">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaDollarSign className="text-accent-emerald" />
            Comparativa con Dólar
          </h4>

          <div className="space-y-3">
            {resultado.comparativas.dolarBlue && (
              <div className="p-4 bg-panel rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Dólar Blue</span>
                  <span
                    className={`text-sm font-semibold ${resultado.comparativas.dolarBlue.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                  >
                    {resultado.comparativas.dolarBlue.diferenciaPorcentual >= 0
                      ? '📉 Perdiste'
                      : '📈 Ganaste'}{' '}
                    {formatearPorcentaje(Math.abs(resultado.comparativas.dolarBlue.diferenciaPorcentual))}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-secondary">Si hubieras comprado USD:</p>
                    <p className="text-foreground font-semibold">
                      {formatearMoneda(resultado.comparativas.dolarBlue.valorFinal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary">Diferencia vs tu activo:</p>
                    <p
                      className={`font-semibold ${resultado.comparativas.dolarBlue.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                    >
                      {formatearMoneda(resultado.comparativas.dolarBlue.valorFinal - precioVenta)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {resultado.comparativas.dolarOficial && (
              <div className="p-4 bg-panel rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Dólar Oficial</span>
                  <span
                    className={`text-sm font-semibold ${resultado.comparativas.dolarOficial.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                  >
                    {resultado.comparativas.dolarOficial.diferenciaPorcentual >= 0
                      ? '📉 Perdiste'
                      : '📈 Ganaste'}{' '}
                    {formatearPorcentaje(Math.abs(resultado.comparativas.dolarOficial.diferenciaPorcentual))}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-secondary">Si hubieras comprado USD:</p>
                    <p className="text-foreground font-semibold">
                      {formatearMoneda(resultado.comparativas.dolarOficial.valorFinal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary">Diferencia vs tu activo:</p>
                    <p
                      className={`font-semibold ${resultado.comparativas.dolarOficial.diferenciaPorcentual >= 0 ? 'text-error' : 'text-success'}`}
                    >
                      {formatearMoneda(resultado.comparativas.dolarOficial.valorFinal - precioVenta)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
