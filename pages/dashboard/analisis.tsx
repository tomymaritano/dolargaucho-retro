import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card/Card';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { TradingViewAdvancedChart } from '@/components/tradingview/TradingViewAdvancedChart';
import { DolarAreaChart } from '@/components/charts/DolarAreaChart';
import { FaInfoCircle, FaChartLine, FaChartBar } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SEO } from '@/components/SEO';

export default function AnalisisPage() {
  const { data: dolares } = useDolarQuery();

  // Selector de rango de fechas para comparativa
  const [selectedRange, setSelectedRange] = useState<7 | 30 | 90>(30);

  // TradingView symbol selector
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');

  // Tipos de dólar a comparar
  const casasToCompare = ['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta'];
  const { data: historicalData, isLoading: loadingHistorical } = useMultipleDolarHistoricoRange(
    casasToCompare,
    selectedRange
  );

  // Calcular datos
  const dolarOficial = dolares?.find((d) => d.casa === 'oficial');
  const dolarBlue = dolares?.find((d) => d.casa === 'blue');
  const dolarMEP = dolares?.find((d) => d.casa === 'bolsa');
  const dolarCCL = dolares?.find((d) => d.casa === 'contadoconliqui');

  return (
    <>
      <SEO
        title="Análisis Económico"
        description="Análisis financiero completo de Argentina: inflación mensual e interanual, riesgo país, brechas cambiarias, tasas de plazo fijo y evolución histórica del dólar."
        noindex={true}
      />
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <PageHeader
            title="Análisis Económico"
            description="Visualización avanzada y análisis técnico del mercado"
            icon={FaChartLine}
            breadcrumbs={[{ label: 'Análisis' }]}
          />

          {/* Evolución Comparativa de Cotizaciones */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Evolución de Cotizaciones
                </h2>
                <p className="text-xs text-secondary">Comparativa histórica del tipo de cambio</p>
              </div>

              {/* Selector de rango */}
              <div className="flex items-center gap-2">
                {([7, 30, 90] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedRange === range
                        ? 'bg-brand text-white'
                        : 'bg-panel/10 text-secondary hover:bg-panel/20 hover:text-foreground'
                    }`}
                  >
                    {range}D
                  </button>
                ))}
              </div>
            </div>

            {/* Gráfico comparativo */}
            {loadingHistorical ? (
              <div className="flex items-center justify-center h-80">
                <div className="text-secondary">Cargando datos históricos...</div>
              </div>
            ) : historicalData ? (
              <div className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={(() => {
                      // Combinar todos los datos por fecha
                      const dateMap = new Map<string, any>();

                      Object.entries(historicalData).forEach(([casa, casaData]) => {
                        casaData.data.forEach((point) => {
                          const dateKey = new Date(point.fecha).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                          });

                          if (!dateMap.has(dateKey)) {
                            dateMap.set(dateKey, { fecha: dateKey });
                          }

                          dateMap.get(dateKey)![casa] = point.valor;
                        });
                      });

                      return Array.from(dateMap.values());
                    })()}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="fecha"
                      stroke="rgba(255,255,255,0.3)"
                      style={{ fontSize: '10px' }}
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      style={{ fontSize: '10px' }}
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                      tickFormatter={(value) => `$${value}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid rgba(0, 71, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                      labelStyle={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '11px',
                        marginBottom: '4px',
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                      formatter={(value) => {
                        const names: Record<string, string> = {
                          oficial: 'Oficial',
                          blue: 'Blue',
                          bolsa: 'MEP',
                          contadoconliqui: 'CCL',
                          tarjeta: 'Tarjeta',
                        };
                        return names[value] || value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="oficial"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="oficial"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="blue"
                      stroke="#0047FF"
                      strokeWidth={3}
                      name="blue"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bolsa"
                      stroke="#8B5CF6"
                      strokeWidth={2.5}
                      name="bolsa"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contadoconliqui"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      name="contadoconliqui"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tarjeta"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="tarjeta"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Resumen de cambios */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
                  {Object.entries(historicalData).map(([casa, casaData]) => {
                    const nombres: Record<string, string> = {
                      oficial: 'Oficial',
                      blue: 'Blue',
                      bolsa: 'MEP',
                      contadoconliqui: 'CCL',
                      tarjeta: 'Tarjeta',
                    };

                    return (
                      <Card key={casa} variant="elevated" padding="md" hover="glow">
                        <div className="text-xs text-secondary mb-1">{nombres[casa]}</div>
                        <div className="text-lg font-black text-foreground mb-1">
                          ${casaData.latest.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            casaData.change > 0 ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {casaData.change > 0 ? '+' : ''}
                          {casaData.changePercent.toFixed(1)}%
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Professional Candlestick Charts */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <FaChartBar className="text-brand" />
                Análisis Técnico Profesional
              </h2>
              <p className="text-xs text-secondary">
                Visualización avanzada con baseline y medias móviles
              </p>
            </div>

            {/* Dolar Area Chart with Selector */}
            <div className="rounded-lg">
              <DolarAreaChart />
            </div>

            {/* Info sobre el gráfico */}
            <Card variant="elevated" padding="md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand/10 flex-shrink-0">
                  <FaInfoCircle className="text-brand text-sm" />
                </div>
                <div className="space-y-1 text-xs text-secondary">
                  <p>
                    <span className="text-foreground font-medium">Baseline:</span> Rojo = dólar más
                    caro (difícil comprar), Verde = dólar más barato (fácil comprar).
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Media Móvil 7D:</span> Línea
                    morada que promedia los últimos 7 días para identificar tendencias.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Controles:</span> Todos los
                    controles están integrados en el gráfico (estilo TradingView). Cambia período,
                    tipo de dólar y activa/desactiva indicadores.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* TradingView Advanced Chart */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                  <FaChartLine className="text-brand" />
                  Análisis Técnico Avanzado
                </h2>
                <p className="text-xs text-secondary">
                  Gráficos profesionales con indicadores técnicos de TradingView
                </p>
              </div>
            </div>

            {/* Symbol Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
                { label: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
                { label: 'S&P 500', symbol: 'SP:SPX' },
                { label: 'NASDAQ', symbol: 'NASDAQ:NDX' },
                { label: 'Oro', symbol: 'OANDA:XAUUSD' },
                { label: 'Petróleo', symbol: 'TVC:USOIL' },
                { label: 'DXY', symbol: 'TVC:DXY' },
                { label: 'YPF', symbol: 'NYSE:YPF' },
              ].map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedSymbol === item.symbol
                      ? 'bg-brand text-white'
                      : 'bg-panel/10 text-secondary hover:bg-panel/20 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* TradingView Chart */}
            <div className="rounded-lg overflow-hidden">
              <TradingViewAdvancedChart
                symbol={selectedSymbol}
                height={600}
                interval="D"
                theme="dark"
                allow_symbol_change={true}
                save_image={true}
              />
            </div>

            {/* Info sobre TradingView */}
            <Card variant="elevated" padding="md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand/10 flex-shrink-0">
                  <FaInfoCircle className="text-brand text-sm" />
                </div>
                <div className="space-y-1 text-xs text-secondary">
                  <p>
                    <span className="text-foreground font-medium">TradingView:</span> Plataforma
                    profesional de análisis técnico. Podés cambiar indicadores, dibujar líneas de
                    tendencia y explorar diferentes marcos temporales.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Uso:</span> Clickea en el símbolo
                    para cambiar el activo, usa la rueda del mouse para hacer zoom, y clickea en los
                    botones superiores para agregar indicadores como RSI, MACD, Bollinger Bands,
                    etc.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Brechas Cambiarias - Comparativa Visual */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Brechas Cambiarias</h2>
              <p className="text-xs text-secondary">Comparativa vs Dólar Oficial</p>
            </div>

            <div className="space-y-3">
              {[
                { nombre: 'Blue', casa: 'blue', valor: dolarBlue?.venta, color: 'blue' },
                { nombre: 'MEP', casa: 'bolsa', valor: dolarMEP?.venta, color: 'purple' },
                { nombre: 'CCL', casa: 'contadoconliqui', valor: dolarCCL?.venta, color: 'orange' },
              ].map((item) => {
                const brecha =
                  dolarOficial?.venta && item.valor
                    ? ((item.valor - dolarOficial.venta) / dolarOficial.venta) * 100
                    : null;
                const diferencia =
                  item.valor && dolarOficial?.venta ? item.valor - dolarOficial.venta : null;

                // Calcular porcentaje para barra visual (máximo 100% de brecha = ancho completo)
                const maxBrecha = 100; // 100% de brecha = ancho completo
                const barWidth = brecha ? Math.min((brecha / maxBrecha) * 100, 100) : 0;

                const getColorClasses = () => {
                  if (!brecha) return 'border-gray-500/30 text-gray-400';
                  if (brecha > 50) return 'border-red-500/30 text-red-400';
                  if (brecha > 20) return 'border-orange-500/30 text-orange-400';
                  return 'border-brand/30 text-brand';
                };

                const getBarColor = () => {
                  if (!brecha) return 'bg-gradient-to-r from-gray-500/50 to-gray-500/20';
                  if (brecha > 50) return 'bg-gradient-to-r from-red-500/50 to-red-500/20';
                  if (brecha > 20) return 'bg-gradient-to-r from-orange-500/50 to-orange-500/20';
                  return 'bg-gradient-to-r from-brand/50 to-brand/20';
                };

                return (
                  <div
                    key={item.casa}
                    className={`p-4 rounded-xl border-2 hover:bg-white/[0.02] transition-all ${getColorClasses()}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {/* Nombre y valor */}
                      <div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          Dólar {item.nombre}
                        </div>
                        <div className="text-2xl font-black text-foreground">
                          ${item.valor ? item.valor.toFixed(2) : '—'}
                        </div>
                      </div>

                      {/* Brecha */}
                      <div className="text-right">
                        {brecha !== null && (
                          <>
                            <div className="text-xs text-secondary mb-1">Brecha</div>
                            <div
                              className={`text-2xl font-black ${brecha > 0 ? 'text-red-400' : 'text-green-400'}`}
                            >
                              {brecha > 0 ? '+' : ''}
                              {brecha.toFixed(1)}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Diferencia en pesos */}
                    {diferencia !== null && (
                      <div className="text-xs text-secondary mb-2">
                        <span className="font-semibold text-foreground">
                          ${diferencia.toFixed(2)}
                        </span>{' '}
                        más caro que el oficial
                      </div>
                    )}

                    {/* Barra visual de brecha */}
                    <div className="h-2 bg-panel/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Referencia oficial */}
                    <div className="mt-2 text-xs text-secondary">
                      Oficial: ${dolarOficial?.venta.toFixed(2) || '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info contextual */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-brand/10 flex-shrink-0">
                <FaInfoCircle className="text-brand text-lg" />
              </div>
              <div className="space-y-2 text-sm text-secondary">
                <p>
                  <span className="text-foreground font-medium">Página de Análisis:</span> Esta
                  sección está dedicada a visualización avanzada y análisis técnico. Para ver
                  indicadores básicos (IPC, Riesgo País, UVA), visitá el{' '}
                  <a href="/dashboard" className="text-brand hover:underline">
                    Dashboard principal
                  </a>
                  .
                </p>
                <p>
                  <span className="text-foreground font-medium">Brechas cambiarias:</span> La
                  diferencia entre el dólar oficial y los paralelos (Blue, MEP, CCL) indica la
                  tensión cambiaria del mercado argentino.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
