import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { LinkButton } from '@/components/ui/Button';
import Aurora from '@/components/ui/Aurora/Aurora';
import { ElectionCountdown } from '@/components/marketing/ElectionCountdown';
import { DolarLiveTable } from '@/components/marketing/DolarLiveTable';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden bg-background pt-24 md:pt-28 pb-12 md:pb-16">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Cotizaciones en vivo Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-success uppercase tracking-wider">
                  Cotizaciones en vivo
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Empezá a tomar mejores decisiones{' '}
              <GradientText className="font-black">financieras</GradientText> hoy mismo
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary leading-relaxed mb-6 md:mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Toda la economía Argentina en un solo lugar. Cotizaciones del dólar, crypto,
              inflación, riesgo país y más. Dashboard profesional con datos actualizados de fuentes
              oficiales.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              {/* Primary CTA - Registrarse */}
              <LinkButton
                href="/auth?tab=signup"
                variant="primary"
                size="xl"
                rightIcon={<FaArrowRight />}
                showStars
                shimmer
                className="w-full sm:w-auto"
              >
                Registrarse
              </LinkButton>

              {/* Secondary CTA - Iniciar Sesión */}
              <LinkButton
                href="/auth"
                variant="secondary"
                size="xl"
                shimmer
                className="w-full sm:w-auto"
              >
                Iniciar Sesión
              </LinkButton>
            </motion.div>
          </motion.div>

          {/* Right: Elections + Live Cotizaciones */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Election Countdown - PRIMERO (más prominente) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ElectionCountdown />
            </motion.div>

            {/* Live Table - SEGUNDO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <DolarLiveTable />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
