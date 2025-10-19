'use client';

/**
 * FeaturesSimple - Features grid simple sin mockups
 *
 * Diseño limpio con íconos, sin sobrecarga de información
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBell,
  FaCalculator,
  FaChartBar,
  FaClock,
  FaShieldAlt,
} from 'react-icons/fa';

const features = [
  {
    icon: FaChartLine,
    title: 'Datos en tiempo real',
    description:
      'Cotizaciones del dólar, crypto, inflación y riesgo país actualizadas al instante.',
  },
  {
    icon: FaCalculator,
    title: 'Calculadoras financieras',
    description: 'Simulá inversiones y proyectá rendimientos con datos reales.',
  },
  {
    icon: FaChartBar,
    title: 'Análisis político',
    description: 'Votaciones del Congreso y estadísticas para entender el contexto económico.',
  },
  {
    icon: FaBell,
    title: 'Alertas personalizadas',
    description: 'Configurá notificaciones cuando tus activos alcancen el precio objetivo.',
  },
  {
    icon: FaClock,
    title: 'Históricos completos',
    description: 'Gráficos interactivos para analizar tendencias y tomar mejores decisiones.',
  },
  {
    icon: FaShieldAlt,
    title: 'Fuentes oficiales',
    description: 'Datos verificables de BCRA, INDEC, DolarAPI, CoinGecko y más.',
  },
];

export function FeaturesSimple() {
  return (
    <section className="relative w-full py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Todo lo que necesitás
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Herramientas profesionales para tomar decisiones financieras informadas
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-panel border border-white/5 rounded-2xl p-6 hover:border-brand/30 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
