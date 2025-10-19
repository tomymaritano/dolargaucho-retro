import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import {
  useInflacionMensual,
  useInflacionInteranual,
  useRiesgoPais,
  useUltimoUVA,
} from '@/hooks/useFinanzas';
import { InflacionChart } from '@/components/charts/InflacionChart';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';
import { TasasChart } from '@/components/charts/TasasChart';
import { FaArrowUp, FaArrowDown, FaMinus, FaInfoCircle } from 'react-icons/fa';

export default function AnalisisPage() {
  const { data: dolares } = useDolarQuery();
  const { data: inflacionMensual } = useInflacionMensual();
  const { data: inflacionInteranual } = useInflacionInteranual();
  const { data: riesgoPais } = useRiesgoPais();
  const { data: uva } = useUltimoUVA();

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

        {/* Cotizaciones de dólares */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Cotizaciones</h2>

          <div className="space-y-2.5">
            {dolares
              ?.slice()
              .sort((a, b) => b.venta - a.venta)
              .map((dolar) => {
                const brecha = dolarOficial
                  ? ((dolar.venta - dolarOficial.venta) / dolarOficial.venta) * 100
                  : 0;
                const isOficial = dolar.casa === 'oficial';
                const maxValue = Math.max(...(dolares?.map((d) => d.venta) || [0]));
                const percentage = (dolar.venta / maxValue) * 100;

                return (
                  <div key={dolar.nombre}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-foreground min-w-[100px]">
                          {dolar.nombre}
                        </span>
                        {!isOficial && (
                          <span
                            className={`text-xs font-medium ${brecha > 0 ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {brecha > 0 ? '+' : ''}
                            {brecha.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <span className="text-base font-bold text-foreground">
                        ${dolar.venta.toFixed(2)}
                      </span>
                    </div>

                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOficial
                            ? 'bg-gradient-to-r from-blue-500/50 to-blue-500/30'
                            : brecha > 50
                              ? 'bg-gradient-to-r from-red-500/50 to-red-500/30'
                              : brecha > 20
                                ? 'bg-gradient-to-r from-orange-500/50 to-orange-500/30'
                                : 'bg-gradient-to-r from-brand/50 to-brand/30'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
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

        {/* Brechas detalladas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Brechas Cambiarias</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { nombre: 'Blue', valor: dolarBlue?.venta },
              { nombre: 'MEP', valor: dolarMEP?.venta },
              { nombre: 'CCL', valor: dolarCCL?.venta },
            ].map((item) => {
              const brecha =
                dolarOficial?.venta && item.valor
                  ? ((item.valor - dolarOficial.venta) / dolarOficial.venta) * 100
                  : null;

              return (
                <div key={item.nombre} className="bg-white/[0.02] rounded-lg p-4">
                  <div className="text-xs text-secondary mb-2">{item.nombre}</div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {item.valor ? `$${item.valor.toFixed(2)}` : '—'}
                  </div>
                  {brecha !== null && (
                    <div
                      className={`text-sm font-medium ${brecha > 0 ? 'text-red-400' : 'text-green-400'}`}
                    >
                      {brecha > 0 ? '+' : ''}
                      {brecha.toFixed(1)}% vs oficial
                    </div>
                  )}
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
