'use client';

/**
 * ElectionHero - Hero section for elections page
 *
 * Styled like landing page Hero with Aurora background
 * Grid 2 columns: Content + Live preview
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';
import Aurora from '@/components/ui/Aurora/Aurora';

interface ElectionHeroProps {
  /** Is election day today */
  isLive: boolean;
  /** Right side content (countdown or live preview) */
  rightContent: React.ReactNode;
}

export const ElectionHero = React.memo(function ElectionHero({
  isLive,
  rightContent,
}: ElectionHeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-foreground overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16 bg-background">
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
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Live Badge (only if election day) */}
            {isLive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    Resultados en Vivo
                  </span>
                </div>
              </motion.div>
            )}

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Elecciones <GradientText className="font-black">Argentina</GradientText>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isLive
                ? 'Seguí los resultados en tiempo real de las elecciones presidenciales 2025. Datos oficiales del Ministerio del Interior con actualización cada 10 segundos.'
                : 'Resultados históricos y en tiempo real de las elecciones presidenciales argentinas. Datos oficiales de la Dirección Nacional Electoral.'}
            </motion.p>
          </motion.div>

          {/* Right: Live Preview / Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">{rightContent}</div>

            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-3xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
});
