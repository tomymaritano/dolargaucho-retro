import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import {
  useInflacionMensual,
  useInflacionInteranual,
  useRiesgoPais,
  useUltimoUVA,
} from '@/hooks/useFinanzas';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { InflacionChart } from '@/components/charts/InflacionChart';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';
import { TasasChart } from '@/components/charts/TasasChart';
import { FaArrowUp, FaArrowDown, FaMinus, FaInfoCircle } from 'react-icons/fa';
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

export default function AnalisisPage() {
  const { data: dolares } = useDolarQuery();
  const { data: inflacionMensual } = useInflacionMensual();
  const { data: inflacionInteranual } = useInflacionInteranual();
  const { data: riesgoPais } = useRiesgoPais();
  const { data: uva } = useUltimoUVA();

  // Selector de rango de fechas para comparativa
  const [selectedRange, setSelectedRange] = useState<7 | 30 | 90>(30);

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

  const brechaBlue =
    dolarOficial?.venta && dolarBlue?.venta
      ? ((dolarBlue.venta - dolarOficial.venta) / dolarOficial.venta) * 100
      : null;

  const ultimaInflacionMensual = inflacionMensual?.[inflacionMensual.length - 1];
  const inflacionMensualAnterior = inflacionMensual?.[inflacionMensual.length - 2];
  const cambioInflacionMensual =
    ultimaInflacionMensual && inflacionMensualAnterior
      ? ultimaInflacionMensual.valor - inflacionMensualAnterior.valor
      : null;

  const ultimaInflacionInteranual = inflacionInteranual?.[inflacionInteranual.length - 1];

  const ultimoRiesgoPais = riesgoPais?.[riesgoPais.length - 1];
  const riesgoPaisAnterior = riesgoPais?.[riesgoPais.length - 2];
  const cambioRiesgo =
    ultimoRiesgoPais && riesgoPaisAnterior
      ? ultimoRiesgoPais.valor - riesgoPaisAnterior.valor
      : null;

  const getTendenciaIcon = (cambio: number | null) => {
    if (cambio === null) return <FaMinus className="text-secondary text-sm" />;
    if (cambio > 0) return <FaArrowUp className="text-red-400 text-sm" />;
    if (cambio < 0) return <FaArrowDown className="text-green-400 text-sm" />;
    return <FaMinus className="text-secondary text-sm" />;
  };

  const getTendenciaColor = (cambio: number | null) => {
    if (cambio === null) return 'text-secondary';
    if (cambio > 0) return 'text-red-400';
    if (cambio < 0) return 'text-green-400';
    return 'text-secondary';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Análisis Económico</h1>
          <p className="text-sm text-secondary">
            Indicadores clave, cotizaciones y evolución del mercado
          </p>
        </div>

        {/* Grid de indicadores principales */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Brecha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">Brecha</span>
              {getTendenciaIcon(brechaBlue)}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {brechaBlue ? `${brechaBlue.toFixed(1)}%` : '—'}
            </div>
            <div className="text-xs text-secondary">Blue vs Oficial</div>
          </div>

          {/* Inflación Mensual */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">IPC Mensual</span>
              {getTendenciaIcon(cambioInflacionMensual)}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {ultimaInflacionMensual ? `${ultimaInflacionMensual.valor.toFixed(1)}%` : '—'}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-secondary">
                {ultimaInflacionMensual
                  ? new Date(ultimaInflacionMensual.fecha).toLocaleDateString('es-AR', {
                      month: 'short',
                    })
                  : '—'}
              </span>
              {cambioInflacionMensual !== null && (
                <span className={`font-medium ${getTendenciaColor(cambioInflacionMensual)}`}>
                  {cambioInflacionMensual > 0 ? '+' : ''}
                  {cambioInflacionMensual.toFixed(1)}pp
                </span>
              )}
            </div>
          </div>

          {/* Inflación Interanual */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">IPC Anual</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {ultimaInflacionInteranual ? `${ultimaInflacionInteranual.valor.toFixed(1)}%` : '—'}
            </div>
            <div className="text-xs text-secondary">Interanual</div>
          </div>

          {/* Riesgo País */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">Riesgo</span>
              {getTendenciaIcon(cambioRiesgo)}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {ultimoRiesgoPais ? ultimoRiesgoPais.valor.toFixed(0) : '—'}
              <span className="text-sm text-secondary ml-1">pb</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-secondary">País</span>
              {cambioRiesgo !== null && (
                <span className={`font-medium ${getTendenciaColor(cambioRiesgo)}`}>
                  {cambioRiesgo > 0 ? '+' : ''}
                  {cambioRiesgo.toFixed(0)}
                </span>
              )}
            </div>
          </div>

          {/* UVA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">UVA</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {uva ? `$${uva.valor.toFixed(2)}` : '—'}
            </div>
            <div className="text-xs text-secondary">
              {uva ? new Date(uva.fecha).toLocaleDateString('es-AR', { month: 'short' }) : '—'}
            </div>
          </div>
        </div>

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
                      : 'bg-white/5 text-secondary hover:bg-white/10 hover:text-foreground'
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
                    <div key={casa} className="p-3 rounded-lg bg-white/[0.02]">
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
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Gráficos principales - Sin cards, solo contenido */}
        <div className="space-y-8">
          <h2 className="text-lg font-semibold text-foreground">Evolución de Indicadores</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inflación */}
            <div>
              <InflacionChart showInteranual={true} limit={12} />
            </div>

            {/* Riesgo País */}
            <div>
              <RiesgoPaisChart limit={60} />
            </div>

            {/* Tasas */}
            <div className="lg:col-span-2">
              <TasasChart />
            </div>
          </div>
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
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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
        <div className="bg-white/[0.02] rounded-lg p-5">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-brand text-lg mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-secondary">
              <p>
                <span className="text-foreground font-medium">IPC:</span> Índice de Precios al
                Consumidor. Mide la variación de precios de una canasta de bienes y servicios
                representativa del consumo de los hogares.
              </p>
              <p>
                <span className="text-foreground font-medium">UVA:</span> Unidad de Valor
                Adquisitivo. Coeficiente de actualización que refleja la evolución de la inflación.
              </p>
              <p>
                <span className="text-foreground font-medium">Riesgo país:</span> Sobretasa que
                pagan los bonos argentinos respecto a los bonos del tesoro de EE.UU. Medido en
                puntos básicos (pb).
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
