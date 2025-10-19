'use client';

/**
 * ProductShowcase - Muestra funcionalidades con diseño side-by-side
 *
 * Diseño alternado izquierda/derecha con imágenes grandes
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaChartLine, FaChartBar, FaExchangeAlt } from 'react-icons/fa';

const features = [
  {
    icon: <FaChartLine className="text-2xl" />,
    title: 'Dashboard completo de mercados',
    description:
      'Seguí todas las cotizaciones en un solo lugar. Dólar oficial, blue, MEP, CCL, crypto, inflación y riesgo país. Todo actualizado en tiempo real.',
    highlights: [
      'Gráficos interactivos con históricos',
      'Comparativas entre diferentes tipos de cambio',
      'Sparklines para ver tendencias rápidas',
    ],
    image: '/thumbnail.png',
    imageAlt: 'Dashboard de mercados',
  },
  {
    icon: <FaChartBar className="text-2xl" />,
    title: 'Análisis político y económico',
    description:
      'Accedé a datos del Congreso argentino. Votaciones, actas de sesiones, estadísticas por bloques y mucho más para entender el contexto político.',
    highlights: [
      'Actas de Diputados y Senado',
      'Estadísticas por bloques políticos',
      'Calendario de eventos económicos',
    ],
    image: '/thumbnail.png',
    imageAlt: 'Análisis político',
  },
  {
    icon: <FaExchangeAlt className="text-2xl" />,
    title: 'Calculadoras financieras avanzadas',
    description:
      'Herramientas profesionales para simular inversiones. Plazo fijo, UVA, inflación, conversores de moneda y crypto. Todo con datos reales actualizados.',
    highlights: [
      'Calculadora de plazo fijo con proyecciones',
      'Simulador de créditos UVA',
      'Conversor multi-moneda en tiempo real',
    ],
    image: '/thumbnail.png',
    imageAlt: 'Calculadoras financieras',
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
            Todo lo que necesitás en un solo lugar
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Herramientas profesionales para tomar decisiones informadas
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Image - Izquierda en odd, derecha en even */}
              <motion.div
                className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 bg-panel">
                  {/* Image */}
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </motion.div>

              {/* Content - Derecha en odd, izquierda en even */}
              <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-light/20 border border-brand/20 text-brand mb-6">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-secondary leading-relaxed mb-6">{feature.description}</p>

                {/* Highlights */}
                <ul className="space-y-3 mb-8">
                  {feature.highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center mt-0.5">
                        <svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          className="text-brand"
                        >
                          <path
                            d="M1 4.5L4 7.5L11 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-foreground font-medium">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Optional CTA */}
                {index === 0 && (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-brand hover:text-brand-light font-medium transition-colors group"
                  >
                    Ver dashboard completo
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transform group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        d="M6 3L11 8L6 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
