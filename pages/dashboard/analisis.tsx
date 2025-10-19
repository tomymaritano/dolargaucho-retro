import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useInflacionMensual, useRiesgoPais } from '@/hooks/useFinanzas';
import { InflacionChart } from '@/components/charts/InflacionChart';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaInfoCircle } from 'react-icons/fa';

export default function AnalisisPage() {
  const { data: dolares } = useDolarQuery();
  const { data: inflacion } = useInflacionMensual();
  const { data: riesgoPais } = useRiesgoPais();

  // Calcular datos
  const dolarOficial = dolares?.find((d) => d.casa === 'oficial');
  const dolarBlue = dolares?.find((d) => d.casa === 'blue');
  const dolarMEP = dolares?.find((d) => d.casa === 'bolsa');
  const dolarCCL = dolares?.find((d) => d.casa === 'contadoconliqui');

  const brechaBlue =
    dolarOficial?.venta && dolarBlue?.venta
      ? ((dolarBlue.venta - dolarOficial.venta) / dolarOficial.venta) * 100
      : null;

  const ultimaInflacion = inflacion?.[inflacion.length - 1];
  const inflacionAnterior = inflacion?.[inflacion.length - 2];
  const cambioInflacion =
    ultimaInflacion && inflacionAnterior ? ultimaInflacion.valor - inflacionAnterior.valor : null;

  const ultimoRiesgoPais = riesgoPais?.[riesgoPais.length - 1];
  const riesgoPaisAnterior = riesgoPais?.[riesgoPais.length - 2];
  const cambioRiesgo =
    ultimoRiesgoPais && riesgoPaisAnterior
      ? ultimoRiesgoPais.valor - riesgoPaisAnterior.valor
      : null;

  const getTendenciaIcon = (cambio: number | null) => {
    if (cambio === null) return <FaMinus className="text-secondary" />;
    if (cambio > 0) return <FaArrowUp className="text-red-400" />;
    if (cambio < 0) return <FaArrowDown className="text-green-400" />;
    return <FaMinus className="text-secondary" />;
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
        {/* Header Simple */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Análisis Económico</h1>
          <p className="text-sm text-secondary">Indicadores clave y evolución del mercado</p>
        </div>

        {/* Indicadores principales - Diseño limpio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brecha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">Brecha Blue</span>
              {getTendenciaIcon(brechaBlue)}
            </div>
            <div className="text-4xl font-bold text-foreground">
              {brechaBlue ? `${brechaBlue.toFixed(1)}%` : '—'}
            </div>
            <div className="text-sm text-secondary">
              Oficial ${dolarOficial?.venta?.toFixed(2) || '—'} • Blue $
              {dolarBlue?.venta?.toFixed(2) || '—'}
            </div>
          </div>

          {/* Inflación */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">Inflación</span>
              {getTendenciaIcon(cambioInflacion)}
            </div>
            <div className="text-4xl font-bold text-foreground">
              {ultimaInflacion ? `${ultimaInflacion.valor.toFixed(1)}%` : '—'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-secondary">
                {ultimaInflacion
                  ? new Date(ultimaInflacion.fecha).toLocaleDateString('es-AR', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
              {cambioInflacion !== null && (
                <span className={`text-xs font-medium ${getTendenciaColor(cambioInflacion)}`}>
                  {cambioInflacion > 0 ? '+' : ''}
                  {cambioInflacion.toFixed(1)}pp
                </span>
              )}
            </div>
          </div>

          {/* Riesgo País */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary uppercase tracking-wider">Riesgo País</span>
              {getTendenciaIcon(cambioRiesgo)}
            </div>
            <div className="text-4xl font-bold text-foreground">
              {ultimoRiesgoPais ? ultimoRiesgoPais.valor.toFixed(0) : '—'}
              <span className="text-lg text-secondary ml-1">pb</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-secondary">
                {ultimoRiesgoPais
                  ? new Date(ultimoRiesgoPais.fecha).toLocaleDateString('es-AR')
                  : '—'}
              </span>
              {cambioRiesgo !== null && (
                <span className={`text-xs font-medium ${getTendenciaColor(cambioRiesgo)}`}>
                  {cambioRiesgo > 0 ? '+' : ''}
                  {cambioRiesgo.toFixed(0)}pb
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Comparativa Visual de Dólares */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Cotizaciones</h2>

          <div className="space-y-3">
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
                  <div key={dolar.nombre} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground min-w-[80px]">
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
                      <span className="text-lg font-bold text-foreground">
                        ${dolar.venta.toFixed(2)}
                      </span>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOficial
                            ? 'bg-gradient-to-r from-blue-500/60 to-blue-500/40'
                            : brecha > 50
                              ? 'bg-gradient-to-r from-red-500/60 to-red-500/40'
                              : brecha > 20
                                ? 'bg-gradient-to-r from-orange-500/60 to-orange-500/40'
                                : 'bg-gradient-to-r from-brand/60 to-brand/40'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InflacionChart showInteranual={false} limit={12} />
          <RiesgoPaisChart limit={30} />
        </div>

        {/* Info contextual */}
        <div className="bg-white/[0.02] rounded-lg p-5">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-brand text-lg mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-secondary">
              <p>
                <span className="text-foreground font-medium">Brecha cambiaria:</span> Diferencia
                entre dólares paralelos y el oficial. Refleja restricciones en el mercado de
                cambios.
              </p>
              <p>
                <span className="text-foreground font-medium">Riesgo país:</span> Sobretasa de bonos
                argentinos vs bonos del tesoro de EE.UU. Mayor valor indica mayor percepción de
                riesgo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
