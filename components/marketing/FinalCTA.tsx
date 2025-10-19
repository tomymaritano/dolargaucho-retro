'use client';

/**
 * FinalCTA - Sección de conversión final antes del footer
 *
 * Diseño impactante con cotizaciones en vivo y sparklines
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { LinkButton } from '@/components/ui/Button';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';

// Componente para cada fila de dólar (maneja su propio estado de tooltip)
function DolarRow({
  dolar,
  sparklineData,
  index,
}: {
  dolar: any;
  sparklineData: number[];
  index: number;
}) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipPos, setTooltipPos] = React.useState({ top: 0, left: 0 });
  const priceRef = React.useRef<HTMLDivElement>(null);
  const trend = dolar.variation.trend;
  const spread = dolar.venta - dolar.compra;
  const spreadPercent = ((spread / dolar.compra) * 100).toFixed(2);

  const handleMouseEnter = () => {
    if (priceRef.current) {
      const rect = priceRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top - 10, // Arriba del elemento
        left: rect.right - 180, // Alineado a la derecha (180px es el ancho del tooltip)
      });
    }
    setShowTooltip(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ scale: 1.02, x: 4 }}
        className="relative flex items-center gap-4 p-4 rounded-xl bg-panel/50 border border-white/5 hover:border-brand/30 hover:bg-panel/80 transition-all group"
      >
        {/* Nombre */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-foreground group-hover:text-brand transition-colors">
            {dolar.nombre}
          </div>
        </div>

        {/* Precio con Tooltip */}
        <div
          ref={priceRef}
          className="text-right relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="text-xl font-black text-foreground cursor-help">
            ${dolar.venta.toFixed(2)}
          </div>
          <div
            className={`text-xs font-semibold ${
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}{' '}
            {Math.abs(dolar.variation.percentage).toFixed(2)}%
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="flex-shrink-0">
            <CryptoSparkline data={sparklineData} trend={trend} isCrypto={false} />
          </div>
        )}
      </motion.div>

      {/* Tooltip renderizado en Portal (fuera del overflow-hidden) */}
      {showTooltip &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] px-4 py-3 bg-background-dark border border-brand/30 rounded-lg shadow-2xl shadow-brand/20 pointer-events-none min-w-[180px]"
            style={{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Compra:</span>
                <span className="text-foreground font-bold">${dolar.compra.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Venta:</span>
                <span className="text-foreground font-bold">${dolar.venta.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary font-semibold">Spread:</span>
                  <span className="text-brand font-bold">
                    ${spread.toFixed(2)} ({spreadPercent}%)
                  </span>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full right-4 -mt-1">
              <div className="w-3 h-3 bg-background-dark border-r border-b border-brand/30 rotate-45"></div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}

// Mini tabla de cotizaciones con sparklines
function DolarMiniTable() {
  // Obtener datos actuales de dólares
  const { data: dolares, isLoading: loadingDolares } = useDolarVariations();

  // Tipos de dólar a mostrar (top 6)
  const casasToShow = ['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta', 'cripto'];

  // Obtener datos históricos para sparklines (últimos 7 días)
  const { data: historicalData } = useMultipleDolarHistoricoRange(casasToShow, 7, !loadingDolares);

  // Filtrar y ordenar dólares
  const topDolares = React.useMemo(() => {
    if (!dolares) return [];
    return dolares
      .filter((d) => casasToShow.includes(d.casa))
      .sort((a, b) => casasToShow.indexOf(a.casa) - casasToShow.indexOf(b.casa));
  }, [dolares]);

  if (loadingDolares) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topDolares.map((dolar, index) => {
        const sparklineData = historicalData?.[dolar.casa]?.data.map((d) => d.valor) || [];
        return (
          <DolarRow key={dolar.casa} dolar={dolar} sparklineData={sparklineData} index={index} />
        );
      })}
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-brand/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-light/30 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SpotlightCard
            className="bg-gradient-to-br from-panel/80 via-panel to-panel/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 overflow-hidden"
            spotlightColor="rgba(0, 71, 255, 0.3)"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy + CTA */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/20 border border-brand/40 mb-6"
                >
                  <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-brand uppercase tracking-wider">
                    100% Gratuito • Sin Tarjeta
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight mb-6"
                >
                  Empezá a tomar mejores decisiones{' '}
                  <GradientText className="font-black">financieras</GradientText>
                  <br />
                  hoy mismo
                </motion.h2>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-secondary mb-8 max-w-xl"
                >
                  Creá tu cuenta gratis y accedé al dashboard completo. Datos actualizados,
                  herramientas profesionales y todo lo que necesitás para estar informado.
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <LinkButton
                    variant="primary"
                    size="xl"
                    href="/register"
                    rightIcon={<FaArrowRight />}
                    showStars
                    shimmer
                  >
                    Comenzar Gratis
                  </LinkButton>
                </motion.div>
              </div>

              {/* Right: Live Cotizaciones con Sparklines */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {/* Mini tabla con sparklines */}
                <DolarMiniTable />
              </motion.div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
