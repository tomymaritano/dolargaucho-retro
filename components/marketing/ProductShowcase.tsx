'use client';

/**
 * ProductShowcase - Muestra funcionalidades con diseño side-by-side
 *
 * Diseño alternado izquierda/derecha con mockups visuales
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaExchangeAlt } from 'react-icons/fa';
import { DashboardPreview } from './DashboardPreview';

const features = [
  {
    icon: <FaChartLine className="text-2xl" />,
    title: 'Datos en tiempo real',
    description:
      'Dólar, crypto, inflación y riesgo país. Todo actualizado al instante desde fuentes oficiales.',
    variant: 'dashboard' as const,
  },
  {
    icon: <FaChartBar className="text-2xl" />,
    title: 'Análisis político',
    description:
      'Votaciones del Congreso, actas de sesiones y estadísticas para entender el contexto económico.',
    variant: 'politics' as const,
  },
  {
    icon: <FaExchangeAlt className="text-2xl" />,
    title: 'Calculadoras financieras',
    description: 'Simulá inversiones en plazo fijo, UVA y más. Proyecciones con datos reales.',
    variant: 'calculator' as const,
  },
];

export function ProductShowcase() {
  return (
    <section className="relative w-full py-20 sm:py-32 bg-background-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Herramientas profesionales
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Todo lo que necesitás para tomar decisiones financieras informadas
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Visual Mockup - Izquierda en odd, derecha en even */}
              <motion.div
                className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <DashboardPreview variant={feature.variant} />
              </motion.div>

              {/* Content - Derecha en odd, izquierda en even */}
              <div
                className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center`}
              >
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-light/20 border border-brand/20 text-brand mb-6">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xl text-secondary leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
