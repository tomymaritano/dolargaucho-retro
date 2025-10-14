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
        {/* Indicadores Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brecha Cambiaria */}
          <Card variant="elevated" padding="lg" hover="glow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                  Brecha Blue
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {brechas[0]?.brecha ? `${brechas[0].brecha.toFixed(1)}%` : '—'}
                </div>
              </div>
              <div className="p-3 glass rounded-xl">
                <FaDollarSign className="text-accent-emerald text-xl" />
              </div>
            </div>
            <div className="text-xs text-secondary">
              Oficial: ${dolarOficial?.venta?.toFixed(2) || '—'} | Blue: $
              {dolarBlue?.venta?.toFixed(2) || '—'}
            </div>
          </Card>

          {/* Inflación Mensual */}
          <Card variant="elevated" padding="lg" hover="glow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                  Inflación Mensual
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {ultimaInflacion?.valor ? `${ultimaInflacion.valor.toFixed(1)}%` : '—'}
                </div>
              </div>
              <div className="p-3 glass rounded-xl">
                {tendenciaInflacion ? (
                  <FaArrowUp className="text-red-500 text-xl" />
                ) : (
                  <FaArrowDown className="text-green-500 text-xl" />
                )}
              </div>
            </div>
            <div className="text-xs text-secondary">
              {ultimaInflacion
                ? new Date(ultimaInflacion.fecha).toLocaleDateString('es-AR', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </div>
          </Card>

          {/* Riesgo País */}
          <Card variant="elevated" padding="lg" hover="glow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                  Riesgo País
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {ultimoRiesgoPais?.valor ? `${ultimoRiesgoPais.valor.toFixed(0)} pb` : '—'}
                </div>
              </div>
              <div className="p-3 glass rounded-xl">
                {tendenciaRiesgo ? (
                  <FaExclamationTriangle className="text-red-500 text-xl" />
                ) : (
                  <FaChartLine className="text-green-500 text-xl" />
                )}
              </div>
            </div>
            <div className="text-xs text-secondary">
              {ultimoRiesgoPais
                ? new Date(ultimoRiesgoPais.fecha).toLocaleDateString('es-AR')
                : '—'}
            </div>
          </Card>
        </div>

        {/* Brecha Cambiaria Detallada */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <div className="flex items-center gap-2">
              <FaPercent className="text-accent-emerald text-xl" />
              <Card.Title>Brechas Cambiarias</Card.Title>
            </div>
            <p className="text-sm text-secondary mt-1">
              Diferencia porcentual respecto al dólar oficial
            </p>
          </Card.Header>

          <Card.Content>
            <div className="space-y-4">
              {brechas.map((brecha) => (
                <div key={brecha?.nombre} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-semibold">{brecha?.nombre}</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ${brecha?.valor?.toFixed(2) ?? '—'}
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            (brecha?.brecha ?? 0) > 0 ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {(brecha?.brecha ?? 0) > 0 ? '+' : ''}
                          {brecha?.brecha?.toFixed(1) ?? '0'}%
                        </div>
                      </div>
                    </div>
                    <div className="relative h-2 bg-panel rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-emerald to-accent-teal rounded-full transition-all"
                        style={{ width: `${Math.min(brecha?.brecha ?? 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inflación */}
          <InflacionChart showInteranual={false} limit={12} />

          {/* Riesgo País */}
          <RiesgoPaisChart limit={30} />
        </div>

        {/* Análisis Comparativo */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Comparativa de Dólares</Card.Title>
            <p className="text-sm text-secondary mt-1">Valores de venta de cada tipo de dólar</p>
          </Card.Header>

          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dolares?.map((dolar) => {
                const brecha = dolarOficial
                  ? ((dolar.venta - dolarOficial.venta) / dolarOficial.venta) * 100
                  : 0;

                return (
                  <div
                    key={dolar.nombre}
                    className="p-4 glass rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="text-sm text-secondary mb-2">{dolar.nombre}</div>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      ${dolar.venta.toFixed(2)}
                    </div>
                    {dolar.casa !== 'oficial' && (
                      <div
                        className={`text-xs font-semibold ${
                          brecha > 0 ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {brecha > 0 ? '+' : ''}
                        {brecha.toFixed(1)}% vs oficial
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>

        {/* Info Footer */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 glass rounded-xl">
              <FaChartLine className="text-accent-emerald text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-semibold mb-2">Sobre este análisis</h3>
              <div className="text-secondary text-sm space-y-2">
                <p>
                  <strong className="text-foreground">Brecha Cambiaria:</strong> Es la diferencia
                  porcentual entre el dólar oficial y los dólares paralelos (blue, MEP, CCL). Una
                  brecha alta indica restricciones en el mercado oficial.
                </p>
                <p>
                  <strong className="text-foreground">Riesgo País:</strong> Mide la sobretasa que paga
                  Argentina respecto a bonos del tesoro de EE.UU. Un valor alto indica mayor
                  percepción de riesgo de default.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
