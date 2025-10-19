import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useInflacionMensual, useRiesgoPais } from '@/hooks/useFinanzas';
import { InflacionChart } from '@/components/charts/InflacionChart';
import { RiesgoPaisChart } from '@/components/charts/RiesgoPaisChart';
import {
  FaChartLine,
  FaDollarSign,
  FaPercent,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaInfoCircle,
} from 'react-icons/fa';

export default function AnalisisPage() {
  const { data: dolares } = useDolarQuery();
  const { data: inflacion } = useInflacionMensual();
  const { data: riesgoPais } = useRiesgoPais();

  // Calcular brechas
  const dolarOficial = dolares?.find((d) => d.casa === 'oficial');
  const dolarBlue = dolares?.find((d) => d.casa === 'blue');
  const dolarMEP = dolares?.find((d) => d.casa === 'bolsa');
  const dolarCCL = dolares?.find((d) => d.casa === 'contadoconliqui');

  const brechas = React.useMemo(() => {
    if (!dolarOficial) return [];

    const calcularBrecha = (nombre: string, valor?: number) => {
      if (!valor) return null;
      const brecha = ((valor - dolarOficial.venta) / dolarOficial.venta) * 100;
      return { nombre, valor, brecha };
    };

    return [
      calcularBrecha('Blue', dolarBlue?.venta),
      calcularBrecha('MEP', dolarMEP?.venta),
      calcularBrecha('CCL', dolarCCL?.venta),
    ].filter(Boolean);
  }, [dolarOficial, dolarBlue, dolarMEP, dolarCCL]);

  // Última inflación
  const ultimaInflacion = inflacion?.[inflacion.length - 1];
  const inflacionAnterior = inflacion?.[inflacion.length - 2];
  const tendenciaInflacion =
    ultimaInflacion && inflacionAnterior ? ultimaInflacion.valor > inflacionAnterior.valor : null;

  // Último riesgo país
  const ultimoRiesgoPais = riesgoPais?.[riesgoPais.length - 1];
  const riesgoPaisAnterior = riesgoPais?.[riesgoPais.length - 2];
  const tendenciaRiesgo =
    ultimoRiesgoPais && riesgoPaisAnterior
      ? ultimoRiesgoPais.valor > riesgoPaisAnterior.valor
      : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/20">
            <FaChartLine className="text-brand text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Análisis Económico</h1>
            <p className="text-sm text-secondary">
              Indicadores clave y evolución del mercado cambiario
            </p>
          </div>
        </div>

        {/* Indicadores Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brecha Cambiaria */}
          <div className="bg-panel border border-white/10 rounded-xl p-5 hover:border-brand/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-secondary text-xs mb-2 uppercase tracking-wider font-medium">
                  Brecha Blue
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {brechas[0]?.brecha ? `${brechas[0].brecha.toFixed(1)}%` : '—'}
                </div>
                <div className="text-xs text-secondary">
                  Oficial ${dolarOficial?.venta?.toFixed(2) || '—'} • Blue $
                  {dolarBlue?.venta?.toFixed(2) || '—'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-brand/10">
                <FaDollarSign className="text-brand text-lg" />
              </div>
            </div>
          </div>

          {/* Inflación Mensual */}
          <div className="bg-panel border border-white/10 rounded-xl p-5 hover:border-brand/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-secondary text-xs mb-2 uppercase tracking-wider font-medium">
                  Inflación Mensual
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {ultimaInflacion?.valor ? `${ultimaInflacion.valor.toFixed(1)}%` : '—'}
                </div>
                <div className="text-xs text-secondary">
                  {ultimaInflacion
                    ? new Date(ultimaInflacion.fecha).toLocaleDateString('es-AR', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </div>
              </div>
              <div
                className={`p-2.5 rounded-lg ${
                  tendenciaInflacion ? 'bg-red-500/10' : 'bg-green-500/10'
                }`}
              >
                {tendenciaInflacion ? (
                  <FaArrowUp className="text-red-500 text-lg" />
                ) : (
                  <FaArrowDown className="text-green-500 text-lg" />
                )}
              </div>
            </div>
          </div>

          {/* Riesgo País */}
          <div className="bg-panel border border-white/10 rounded-xl p-5 hover:border-brand/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-secondary text-xs mb-2 uppercase tracking-wider font-medium">
                  Riesgo País
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {ultimoRiesgoPais?.valor ? `${ultimoRiesgoPais.valor.toFixed(0)}` : '—'}
                  <span className="text-sm text-secondary ml-1">pb</span>
                </div>
                <div className="text-xs text-secondary">
                  {ultimoRiesgoPais
                    ? new Date(ultimoRiesgoPais.fecha).toLocaleDateString('es-AR')
                    : '—'}
                </div>
              </div>
              <div
                className={`p-2.5 rounded-lg ${
                  tendenciaRiesgo ? 'bg-red-500/10' : 'bg-green-500/10'
                }`}
              >
                {tendenciaRiesgo ? (
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                ) : (
                  <FaChartLine className="text-green-500 text-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Brechas Cambiarias */}
        <div className="bg-panel border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-brand/10">
              <FaPercent className="text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Brechas Cambiarias</h2>
              <p className="text-xs text-secondary">Diferencia vs dólar oficial</p>
            </div>
          </div>

          <div className="space-y-4">
            {brechas.map((brecha) => (
              <div key={brecha?.nombre} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{brecha?.nombre}</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      ${brecha?.valor?.toFixed(2) ?? '—'}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        (brecha?.brecha ?? 0) > 0 ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {(brecha?.brecha ?? 0) > 0 ? '+' : ''}
                      {brecha?.brecha?.toFixed(1) ?? '0'}%
                    </div>
                  </div>
                </div>
                <div className="relative h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{ width: `${Math.min(Math.abs(brecha?.brecha ?? 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InflacionChart showInteranual={false} limit={12} />
          <RiesgoPaisChart limit={30} />
        </div>

        {/* Comparativa de Dólares - Gráfico de barras */}
        <div className="bg-panel border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-brand/10">
              <FaDollarSign className="text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Comparativa de Dólares</h2>
              <p className="text-xs text-secondary">Valores vs dólar oficial</p>
            </div>
          </div>

          <div className="space-y-5">
            {dolares?.map((dolar) => {
              const brecha = dolarOficial
                ? ((dolar.venta - dolarOficial.venta) / dolarOficial.venta) * 100
                : 0;
              const isOficial = dolar.casa === 'oficial';
              const maxValue = Math.max(...(dolares?.map((d) => d.venta) || [0]));
              const barWidth = (dolar.venta / maxValue) * 100;

              return (
                <div key={dolar.nombre} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground w-24">
                        {dolar.nombre}
                      </span>
                      {isOficial && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                          Oficial
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        ${dolar.venta.toFixed(2)}
                      </div>
                      {!isOficial && (
                        <div
                          className={`text-xs font-semibold ${
                            brecha > 0 ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {brecha > 0 ? '+' : ''}
                          {brecha.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    {/* Background bar */}
                    <div className="h-10 bg-background/50 rounded-lg overflow-hidden">
                      {/* Value bar */}
                      <div
                        className={`h-full flex items-center px-3 transition-all duration-500 group-hover:opacity-90 ${
                          isOficial
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10'
                            : brecha > 50
                              ? 'bg-gradient-to-r from-red-500/30 to-red-500/10'
                              : brecha > 20
                                ? 'bg-gradient-to-r from-orange-500/30 to-orange-500/10'
                                : 'bg-gradient-to-r from-brand/30 to-brand/10'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      >
                        {!isOficial && (
                          <span className="text-xs font-medium text-foreground/80 ml-auto">
                            +${(dolar.venta - (dolarOficial?.venta || 0)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500/20"></div>
                <span className="text-secondary">Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-brand/30 to-brand/10"></div>
                <span className="text-secondary">Brecha {'<'} 20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-orange-500/30 to-orange-500/10"></div>
                <span className="text-secondary">Brecha 20-50%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-500/30 to-red-500/10"></div>
                <span className="text-secondary">Brecha {'>'} 50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-brand/10 flex-shrink-0">
              <FaInfoCircle className="text-brand text-xl" />
            </div>
            <div className="flex-1 space-y-3 text-sm">
              <div>
                <span className="font-semibold text-foreground">Brecha Cambiaria:</span>
                <span className="text-secondary ml-1">
                  Diferencia porcentual entre el dólar oficial y los dólares paralelos. Una brecha
                  alta indica restricciones en el mercado oficial.
                </span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Riesgo País:</span>
                <span className="text-secondary ml-1">
                  Sobretasa que paga Argentina respecto a bonos del tesoro de EE.UU. Medido en
                  puntos básicos (pb). Un valor alto indica mayor percepción de riesgo.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
