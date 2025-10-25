'use client';

/**
 * FeaturesSection - Características basadas en funcionalidad REAL del dashboard
 *
 * Mejorado con microinteracciones ReactBits style
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBitcoin,
  FaCalculator,
  FaLandmark,
  FaBell,
  FaChartBar,
  FaArrowRight,
} from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  metrics?: string;
  href: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <FaChartLine />,
    title: 'Cotizaciones del Dólar',
    description:
      'Dólar oficial, blue, MEP, CCL y más. Datos actualizados diariamente de DolarAPI y ArgentinaDatos.',
    metrics: '15+ tipos',
    href: '/dashboard',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <FaBitcoin />,
    title: 'Criptomonedas',
    description:
      'Precios en tiempo real de las principales criptomonedas con conversión a ARS. Datos de CoinGecko.',
    metrics: '100+ cryptos',
    href: '/dashboard/crypto',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: <FaChartBar />,
    title: 'Indicadores Económicos',
    description:
      'Inflación (INDEC), tasas (BCRA), riesgo país, y datos de FRED (USA) y ECB (Europa).',
    metrics: '20+ indicadores',
    href: '/dashboard',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <FaLandmark />,
    title: 'Seguimiento Político',
    description:
      'Actas del Congreso, votaciones de senadores y diputados, estadísticas por bloque.',
    metrics: 'Congreso completo',
    href: '/dashboard',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <FaCalculator />,
    title: 'Calculadoras Financieras',
    description:
      'Plazo fijo, inflación histórica, UVA, comparativas. Herramientas profesionales para decisiones.',
    metrics: '8+ calculadoras',
    href: '/dashboard/calculadoras',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: <FaBell />,
    title: 'Alertas Personalizadas',
    description:
      'Configurá alertas de precio para dólares y cryptos. Notificaciones cuando se cumplan tus condiciones.',
    metrics: 'Ilimitadas',
    href: '/dashboard/alertas',
    color: 'from-indigo-500 to-blue-500',
  },
];

export const FeaturesSection = React.memo(function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative w-full py-20 sm:py-28 bg-gradient-to-b from-background via-background-secondary/30 to-background"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Funcionalidades del <GradientText className="font-black">Dashboard</GradientText>
          </h2>
          <p className="text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Herramientas profesionales para tomar decisiones financieras informadas
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.a
              key={feature.title}
              href={feature.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-panel border border-border/5 rounded-2xl p-6 overflow-hidden"
            >
              {/* Gradient hover effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with gradient background on hover */}
                <motion.div
                  className="mb-4 inline-flex p-3 rounded-xl bg-brand/10 text-brand group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-brand-light group-hover:text-background-dark transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {React.cloneElement(feature.icon, { className: 'text-2xl' })}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-secondary leading-relaxed mb-4">{feature.description}</p>

                {/* Metrics Badge */}
                {feature.metrics && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 group-hover:bg-brand group-hover:border-brand transition-all">
                    <span className="text-xs font-bold text-brand group-hover:text-background-dark transition-colors">
                      {feature.metrics}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover Arrow with smooth animation */}
              <motion.div
                className="absolute top-6 right-6 text-brand"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaArrowRight className="text-lg" />
              </motion.div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-brand/0 group-hover:border-brand/30 transition-all duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
});
