'use client';

/**
 * HowItWorksSection - Explicación visual paso a paso
 *
 * Diseño side-by-side con texto + visual multimedia
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaChartLine, FaBell, FaCalculator, FaRocket } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    icon: <FaRocket className="text-3xl" />,
    title: 'Creá tu cuenta gratis',
    description:
      'Registrate en segundos. Sin tarjeta de crédito, sin compromisos. Acceso inmediato al dashboard completo.',
    image: '/thumbnail.png', // Reemplazar con imagen real
    imageAlt: 'Dashboard preview',
  },
  {
    id: 2,
    icon: <FaChartLine className="text-3xl" />,
    title: 'Explorá datos en tiempo real',
    description:
      'Cotizaciones del dólar, crypto, inflación, riesgo país y más. Todo actualizado en tiempo real desde fuentes oficiales.',
    image: '/thumbnail.png',
    imageAlt: 'Real-time data',
  },
  {
    id: 3,
    icon: <FaCalculator className="text-3xl" />,
    title: 'Usá herramientas financieras',
    description:
      'Calculadoras de plazo fijo, UVA, inflación y más. Tomá decisiones informadas con proyecciones precisas.',
    image: '/thumbnail.png',
    imageAlt: 'Financial tools',
  },
  {
    id: 4,
    icon: <FaBell className="text-3xl" />,
    title: 'Configurá alertas personalizadas',
    description:
      'Recibí notificaciones cuando el dólar alcance tu precio objetivo. Nunca te pierdas una oportunidad.',
    image: '/thumbnail.png',
    imageAlt: 'Alerts',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative w-full py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Cómo funciona</h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Cuatro pasos simples para tomar el control de tus decisiones financieras
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                {/* Step Number */}
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-brand uppercase tracking-wider">
                    Paso {step.id}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-secondary leading-relaxed mb-6">{step.description}</p>

                {/* Optional: Feature bullets */}
                {step.id === 2 && (
                  <ul className="space-y-3">
                    {[
                      'Dólar oficial, blue, MEP, CCL',
                      'Bitcoin, Ethereum y más cryptos',
                      'IPC, riesgo país, tasas',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Visual/Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/20"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent pointer-events-none"></div>

                  {/* Image */}
                  <div className="relative aspect-video bg-panel/50">
                    <Image src={step.image} alt={step.imageAlt} fill className="object-cover" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-sm border border-brand shadow-lg shadow-brand/20">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        En vivo
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
