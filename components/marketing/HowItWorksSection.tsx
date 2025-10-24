'use client';

/**
 * HowItWorksSection - Explicación visual paso a paso
 *
 * Diseño side-by-side con texto + mockups visuales
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaBell, FaCalculator, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { DashboardPreview } from './DashboardPreview';

const steps = [
  {
    id: 1,
    icon: <FaRocket className="text-3xl" />,
    title: 'Creá tu cuenta gratis',
    description:
      'Registrate en segundos. Sin tarjeta de crédito, sin compromisos. Acceso inmediato al dashboard completo.',
    visual: 'signup',
  },
  {
    id: 2,
    icon: <FaChartLine className="text-3xl" />,
    title: 'Explorá datos en tiempo real',
    description:
      'Cotizaciones del dólar, crypto, inflación, riesgo país y más. Todo actualizado en tiempo real desde fuentes oficiales.',
    visual: 'dashboard',
  },
  {
    id: 3,
    icon: <FaCalculator className="text-3xl" />,
    title: 'Usá herramientas financieras',
    description:
      'Calculadoras de plazo fijo, UVA, inflación y más. Tomá decisiones informadas con proyecciones precisas.',
    visual: 'calculator',
  },
  {
    id: 4,
    icon: <FaBell className="text-3xl" />,
    title: 'Configurá alertas personalizadas',
    description:
      'Recibí notificaciones cuando el dólar alcance tu precio objetivo. Nunca te pierdas una oportunidad.',
    visual: 'alerts',
  },
];

export const HowItWorksSection = React.memo(function HowItWorksSection() {
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

              {/* Visual/Mockup */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {step.visual === 'signup' ? (
                    // Signup mockup
                    <div className="bg-gradient-to-br from-background via-background to-background-secondary rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/20">
                      <div className="max-w-sm mx-auto">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 mb-4">
                            <FaRocket className="text-brand text-2xl" />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-2">Crear cuenta</h4>
                          <p className="text-sm text-secondary">Acceso gratis e instantáneo</p>
                        </div>
                        <div className="space-y-3">
                          {['Nombre completo', 'Email', 'Contraseña'].map((field, i) => (
                            <motion.div
                              key={field}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-panel border border-white/5 rounded-lg p-3"
                            >
                              <div className="text-xs text-secondary mb-1">{field}</div>
                              <div className="h-4 bg-white/5 rounded w-3/4"></div>
                            </motion.div>
                          ))}
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-full bg-gradient-to-r from-brand to-brand-light text-white font-semibold py-3 rounded-lg mt-4 flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle />
                            Crear cuenta gratis
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : step.visual === 'dashboard' || step.visual === 'calculator' ? (
                    <DashboardPreview />
                  ) : (
                    // Alerts mockup
                    <div className="bg-gradient-to-br from-background via-background to-background-secondary rounded-2xl p-6 border border-white/10 shadow-2xl shadow-black/20">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-foreground mb-2">Mis Alertas</h4>
                        <p className="text-sm text-secondary">Te notificamos cuando se cumplan</p>
                      </div>
                      <div className="space-y-3">
                        {[
                          { coin: 'Dólar Blue', price: '$1,200', status: 'active' },
                          { coin: 'Bitcoin', price: 'US$95,000', status: 'active' },
                          { coin: 'MEP', price: '$1,150', status: 'triggered' },
                        ].map((alert, i) => (
                          <motion.div
                            key={alert.coin}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-panel border border-white/5 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {alert.coin}
                              </div>
                              <div className="text-xs text-secondary">Objetivo: {alert.price}</div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                alert.status === 'active'
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-brand/10 text-brand'
                              }`}
                            >
                              {alert.status === 'active' ? 'Activa' : '¡Alcanzado!'}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
