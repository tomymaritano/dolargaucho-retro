'use client';

/**
 * DolarLiveTable - Mini tabla de cotizaciones con sparklines
 *
 * Muestra cotizaciones en vivo con gráficos y tooltips
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { DolarService } from '@/lib/services/DolarService';

// Tipos de dólar a mostrar (top 6)
const CASAS_TO_SHOW = ['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta', 'cripto'];

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
  const spread = DolarService.calculateSpread(dolar.compra, dolar.venta);
  const spreadPercent = DolarService.calculateSpreadPercentage(dolar.compra, dolar.venta).toFixed(
    2
  );

  const handleMouseEnter = () => {
    if (priceRef.current) {
      const rect = priceRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Si estamos cerca del borde derecho, mostrar tooltip a la izquierda
      const tooltipWidth = 180;
      const showOnLeft = rect.right + tooltipWidth > viewportWidth - 20;

      setTooltipPos({
        top: rect.top - 10,
        left: showOnLeft ? rect.left - tooltipWidth - 10 : rect.right + 10,
      });
    }
    setShowTooltip(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.02, x: 4 }}
        className="relative flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-panel/50 border border-white/5 hover:border-brand/30 hover:bg-panel/80 transition-all duration-300 group cursor-pointer"
      >
        {/* Nombre */}
        <div className="flex-1 min-w-0">
          <div className="text-sm md:text-base font-bold text-foreground group-hover:text-brand transition-colors truncate">
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
          <div className="text-lg md:text-xl font-black text-foreground cursor-help">
            {DolarService.formatPrice(dolar.venta)}
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

        {/* Sparkline - Hidden on small screens */}
        {sparklineData.length > 0 && (
          <div className="hidden sm:block flex-shrink-0">
            <CryptoSparkline data={sparklineData} trend={trend} isCrypto={false} />
          </div>
        )}
      </motion.div>

      {/* Tooltip renderizado en Portal */}
      {showTooltip &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed z-[9999] px-4 py-3 bg-panel/95 backdrop-blur-xl border border-brand/40 rounded-xl shadow-2xl shadow-brand/30 pointer-events-none min-w-[180px]"
            style={{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Compra:</span>
                <span className="text-foreground font-bold">
                  {DolarService.formatPrice(dolar.compra)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold">Venta:</span>
                <span className="text-foreground font-bold">
                  {DolarService.formatPrice(dolar.venta)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary font-semibold">Spread:</span>
                  <span className="text-brand font-bold">
                    {DolarService.formatPrice(spread)} ({spreadPercent}%)
                  </span>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-3 h-3 bg-panel/95 border-r border-b border-brand/40 rotate-45"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-brand-light/20 rounded-xl blur opacity-50 -z-10" />
          </motion.div>,
          document.body
        )}
    </>
  );
}

export const DolarLiveTable = React.memo(function DolarLiveTable() {
  const { data: dolares, isLoading: loadingDolares } = useDolarVariations();
  const { data: historicalData } = useMultipleDolarHistoricoRange(
    CASAS_TO_SHOW,
    7,
    !loadingDolares
  );

  const topDolares = React.useMemo(() => {
    if (!dolares) return [];
    return dolares
      .filter((d) => CASAS_TO_SHOW.includes(d.casa))
      .sort((a, b) => CASAS_TO_SHOW.indexOf(a.casa) - CASAS_TO_SHOW.indexOf(b.casa));
  }, [dolares]);

  if (loadingDolares) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-panel/30 border border-white/5"
          >
            <div className="flex-1">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2" />
            </div>
            <div className="text-right">
              <div className="h-6 w-20 bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-3 w-14 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="hidden sm:block w-16 h-12 bg-white/10 rounded animate-pulse" />
          </motion.div>
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
});
