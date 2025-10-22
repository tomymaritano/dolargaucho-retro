'use client';

/**
 * LiveDemoSection - Video demo del dashboard
 *
 * Muestra un video del dashboard funcionando en vivo
 * Product-led growth: El usuario VE el producto antes de registrarse
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { LinkButton } from '@/components/ui/Button';

export function LiveDemoSection() {
  return (
    <section id="demo" className="relative w-full py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Dashboard <GradientText className="font-black">en Acción</GradientText>
          </h2>
          <p className="text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Mirá cómo funciona el dashboard con datos reales. Sin registro, sin compromisos.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary mb-8">
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <FaCheckCircle className="text-brand" />
              Datos en tiempo real
            </motion.span>
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <FaCheckCircle className="text-brand" />
              Sin registro requerido
            </motion.span>
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <FaCheckCircle className="text-brand" />
              100% gratuito
            </motion.span>
          </div>
        </motion.div>

        {/* Video Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Dashboard Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-panel/50 border border-white/5 hover:border-brand/30 transition-all group aspect-video">
            {/* Dashboard Screenshot */}
            <Image
              src="/thumbnail.png"
              alt="Vista previa del dashboard"
              fill
              className="object-cover"
              priority
            />

            {/* Badge "Dashboard Real" */}
            <div className="absolute top-4 left-4">
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-sm border border-brand shadow-lg shadow-brand/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Dashboard Real
                </span>
              </motion.div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* CTA Footer */}
          <div className="mt-8 text-center">
            <p className="text-secondary text-sm mb-6">
              Accedé al dashboard completo con{' '}
              <span className="text-foreground font-semibold">
                cotizaciones del dólar, crypto, gráficos interactivos, calculadoras financieras
              </span>{' '}
              y mucho más.
            </p>

            <LinkButton
              variant="primary"
              size="lg"
              href="/auth"
              rightIcon={<FaArrowRight />}
              showStars
            >
              Registrate Ahora
            </LinkButton>
          </div>
        </motion.div>

        {/* Key Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            className="text-center p-6 rounded-xl bg-panel border border-white/5 hover:border-brand/30 transition-all group"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/20 to-brand-light/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent mb-2">
                <NumberTicker value={24} suffix="/7" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Siempre Disponible</div>
              <div className="text-xs text-secondary">Datos actualizados automáticamente</div>
            </div>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-xl bg-panel border border-white/5 hover:border-brand/30 transition-all group"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/20 to-brand-light/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent mb-2">
                <NumberTicker value={15} suffix="+" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Tipos de Dólar</div>
              <div className="text-xs text-secondary">Oficial, Blue, MEP, CCL y más</div>
            </div>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-xl bg-panel border border-white/5 hover:border-brand/30 transition-all group"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/20 to-brand-light/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent mb-2">
                <NumberTicker value={6} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">Fuentes Oficiales</div>
              <div className="text-xs text-secondary">
                DolarAPI, ArgentinaDatos, CoinGecko y más
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
