import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { LinkButton } from '@/components/ui/Button';
import { EconomicChartsCarousel } from '@/components/marketing/EconomicChartsCarousel';
import Aurora from '@/components/ui/Aurora/Aurora';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden pt-32 pb-16 bg-background">
      {/* Aurora animated background with fintech colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <Aurora
          colorStops={['#0047FF', '#8B5CF6', '#6366F1']} // Blue → Violet → Indigo
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>

      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-6"
            >
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                Datos en tiempo real
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Toda la economía Argentina en{' '}
              <GradientText className="font-black">un solo lugar</GradientText>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Cotizaciones del dólar, crypto, inflación, riesgo país y más. Dashboard profesional
              con datos actualizados de fuentes oficiales.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {/* Primary CTA - Registrarse */}
              <LinkButton
                href="/auth?tab=signup"
                variant="primary"
                size="xl"
                rightIcon={<FaArrowRight />}
                showStars
              >
                Registrarse
              </LinkButton>

              {/* Secondary CTA - Iniciar Sesión */}
              <LinkButton href="/auth" variant="secondary" size="xl">
                Iniciar Sesión
              </LinkButton>
            </motion.div>
          </motion.div>

          {/* Right: Economic Charts Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <EconomicChartsCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
