import React from 'react';
import ReactDOM from 'react-dom';
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
import { motion } from 'framer-motion';

// Interactive Dolar Card Component with Tooltip
function DolarCard({
  dolar,
  brecha,
  isOficial,
  spread,
  spreadPercent,
  index,
}: {
  dolar: any;
  brecha: number;
  isOficial: boolean;
  spread: number;
  spreadPercent: string;
  index: number;
}) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipPos, setTooltipPos] = React.useState({ top: 0, left: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
    }
    setShowTooltip(true);
  };

  // Color based on brecha severity
  const getBorderColor = () => {
    if (isOficial) return 'border-blue-500/30 hover:border-blue-500/50';
    if (brecha > 50) return 'border-red-500/30 hover:border-red-500/50';
    if (brecha > 20) return 'border-orange-500/30 hover:border-orange-500/50';
    return 'border-brand/30 hover:border-brand/50';
  };

  const getAccentColor = () => {
    if (isOficial) return 'text-blue-400';
    if (brecha > 50) return 'text-red-400';
    if (brecha > 20) return 'text-orange-400';
    return 'text-brand';
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative p-4 rounded-xl bg-white/[0.02] border-2 ${getBorderColor()} hover:bg-white/[0.04] transition-all cursor-help group`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
              {dolar.nombre}
            </div>
            {isOficial && (
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded uppercase">
                Oficial
              </span>
            )}
          </div>
          {!isOficial && (
            <div className={`text-xs font-bold ${brecha > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {brecha > 0 ? '+' : ''}
              {brecha.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Price */}
        <div className={`text-2xl md:text-3xl font-black mb-2 ${getAccentColor()}`}>
          ${dolar.venta.toFixed(2)}
        </div>

        {/* Spread hint */}
        <div className="text-xs text-secondary">
          Spread: <span className="font-semibold text-foreground">${spread.toFixed(2)}</span>
        </div>
      </motion.div>

      {/* Tooltip with detailed info */}
      {showTooltip &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] px-4 py-3 bg-background-dark border border-brand/30 rounded-lg shadow-2xl shadow-brand/20 pointer-events-none min-w-[200px]"
            style={{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="space-y-2">
              <div className="text-sm font-bold text-brand mb-2">{dolar.nombre}</div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Compra:</span>
                <span className="text-foreground font-bold">${dolar.compra.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Venta:</span>
                <span className="text-foreground font-bold">${dolar.venta.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-secondary font-semibold">Spread:</span>
                  <span className="text-brand font-bold">${spread.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary font-semibold">Spread %:</span>
                  <span className="text-brand font-bold">{spreadPercent}%</span>
                </div>
              </div>

              {!isOficial && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary font-semibold">Brecha vs Oficial:</span>
                    <span className={`font-bold ${brecha > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {brecha > 0 ? '+' : ''}
                      {brecha.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-3 h-3 bg-background-dark border-r border-b border-brand/30 rotate-45"></div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}

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

        {/* Cotizaciones de dólares - Interactive Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Cotizaciones del Dólar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dolares
              ?.slice()
              .sort((a, b) => b.venta - a.venta)
              .map((dolar, index) => {
                const brecha = dolarOficial
                  ? ((dolar.venta - dolarOficial.venta) / dolarOficial.venta) * 100
                  : 0;
                const isOficial = dolar.casa === 'oficial';
                const spread = dolar.venta - dolar.compra;
                const spreadPercent = ((spread / dolar.compra) * 100).toFixed(2);

                return (
                  <DolarCard
                    key={dolar.casa}
                    dolar={dolar}
                    brecha={brecha}
                    isOficial={isOficial}
                    spread={spread}
                    spreadPercent={spreadPercent}
                    index={index}
                  />
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
