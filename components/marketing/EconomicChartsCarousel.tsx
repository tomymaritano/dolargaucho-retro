'use client';

/**
 * EconomicChartsCarousel - Carrusel de gráficos económicos
 *
 * Permite navegar entre diferentes gráficos con chevrones
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiesgoPaisChartSimple } from './RiesgoPaisChartSimple';
import { InflacionChartSimple } from './InflacionChartSimple';

const charts = [
  {
    id: 'riesgo-pais',
    component: <RiesgoPaisChartSimple limit={12} />,
  },
  {
    id: 'inflacion-mensual',
    component: <InflacionChartSimple limit={12} type="mensual" />,
  },
  {
    id: 'inflacion-interanual',
    component: <InflacionChartSimple limit={12} type="interanual" />,
  },
];

export function EconomicChartsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Auto-advance carousel every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === charts.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds delay

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Chart Container */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {charts[currentIndex].component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicators - centered */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {charts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Ir a gráfico ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
