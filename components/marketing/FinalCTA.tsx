'use client';

/**
 * FinalCTA - Sección de conversión final antes del footer
 *
 * Diseño impactante con cotizaciones en vivo y sparklines
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { LinkButton } from '@/components/ui/Button';
import { DolarAreaChart } from '@/components/charts/DolarAreaChart';

export function FinalCTA() {
  return (
    <section className="relative w-full py-12 sm:py-20 lg:py-28 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SpotlightCard
            className="bg-gradient-to-br from-panel/80 via-panel to-panel/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden"
            spotlightColor="rgba(0, 71, 255, 0.3)"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-black leading-tight mb-6"
                >
                  Empezá a tomar mejores decisiones{' '}
                  <GradientText className="font-black">financieras</GradientText> hoy mismo
                </motion.h2>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg text-secondary mb-8 max-w-xl mx-auto lg:mx-0"
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
                    className="w-full sm:w-auto"
                  >
                    Comenzar Gratis
                  </LinkButton>
                </motion.div>
              </div>

              {/* Right: Gráfico profesional de evolución */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <DolarAreaChart defaultCasa="blue" showCasaSelector={true} assetType="dolar" />
              </motion.div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
