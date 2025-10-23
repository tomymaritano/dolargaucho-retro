'use client';

/**
 * ProblemSolution - De Caos a Claridad
 *
 * Rediseñado con ReactBits: ShimmerBorder, GradientText y animaciones suaves
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { ShimmerBorder } from '@/components/ui/ShimmerBorder';

const beforeItems = [
  '5+ pestañas abiertas buscando cotizaciones',
  'Refresh manual constante para ver cambios',
  'Datos dispersos sin contexto ni históricos',
  'Sin alertas ni notificaciones configurables',
];

const afterItems = [
  'Dashboard unificado con 6 fuentes oficiales',
  'Actualización automática diaria (dólares) y real-time (cryptos)',
  'Gráficos interactivos con históricos y comparativas',
  'Alertas ilimitadas configurables por precio',
];

export const ProblemSolution = React.memo(function ProblemSolution() {
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/10 to-background" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 bg-brand/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-96 h-96 bg-brand-light/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight">
            De Caos a <GradientText className="font-black">Claridad</GradientText>
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto">
            El problema no es la falta de información, sino tenerla dispersa. Acá consolidamos lo
            que antes requería navegar docenas de sitios.
          </p>
        </motion.div>

        {/* Comparison - Horizontal Flow */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-8 items-start">
            {/* BEFORE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              {/* Subtle shadow on hover */}
              <div className="absolute -inset-4 bg-white/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-gradient-to-br from-panel/50 to-panel border border-white/[0.08] rounded-2xl p-10 backdrop-blur-sm">
                <div className="mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <span className="text-xs font-bold text-secondary/80 uppercase tracking-widest">
                      Problema
                    </span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground/50 leading-tight">
                    Información
                    <br />
                    fragmentada
                  </h3>
                </div>

                <ul className="space-y-4">
                  {beforeItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 text-sm text-secondary/70 leading-relaxed group/item"
                    >
                      <span className="text-secondary/30 mt-0.5 flex-shrink-0 group-hover/item:text-secondary/60 transition-colors">
                        ●
                      </span>
                      <span className="group-hover/item:text-secondary transition-colors">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* ARROW - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
              className="hidden lg:flex items-center justify-center pt-20"
            >
              <motion.div
                animate={{
                  x: [0, 12, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.5,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-light rounded-full blur-xl opacity-50" />
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-light flex items-center justify-center shadow-2xl shadow-brand/40">
                  <FaArrowRight className="text-background-dark text-2xl" />
                </div>
              </motion.div>
            </motion.div>

            {/* AFTER - Enhanced with ShimmerBorder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group"
            >
              <ShimmerBorder shimmerColor="#0047FF" duration={3.5}>
                <div className="bg-gradient-to-br from-brand/[0.03] via-panel to-panel/80 p-10 backdrop-blur-sm">
                  <div className="mb-8">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30 mb-4 shadow-lg shadow-brand/10"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <span className="text-xs font-bold text-brand uppercase tracking-widest">
                        Solución
                      </span>
                    </motion.div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                      Todo en una
                      <br />
                      <GradientText className="font-black text-3xl">plataforma</GradientText>
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {afterItems.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.08 }}
                        whileHover={{ x: 4, scale: 1.02 }}
                        className="flex items-start gap-3 text-sm leading-relaxed group/item cursor-default"
                      >
                        <motion.span
                          className="text-brand mt-0.5 flex-shrink-0 text-lg"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          ✓
                        </motion.span>
                        <span className="font-semibold text-foreground group-hover/item:text-brand transition-colors">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </ShimmerBorder>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});
