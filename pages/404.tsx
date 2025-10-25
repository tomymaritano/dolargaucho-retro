import React from 'react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { LinkButton } from '@/components/ui/Button';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import Aurora from '@/components/ui/Aurora/Aurora';

export default function Custom404() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden bg-background">
      {/* Aurora animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <Aurora
          colorStops={['#0047FF', '#8B5CF6', '#6366F1']}
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>

      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <AnimatedLogo className="w-20 h-20" />
        </motion.div>

        {/* 404 Number */}
        <motion.h1
          className="text-8xl md:text-9xl font-display font-black leading-none mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GradientText>404</GradientText>
        </motion.h1>

        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Página no encontrada
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-secondary leading-relaxed mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          La página que estás buscando no existe o fue movida. Volvé al inicio para continuar.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <LinkButton href="/" variant="primary" size="xl" leftIcon={<FaHome />} shimmer>
            Ir al Inicio
          </LinkButton>

          <LinkButton href="/dashboard" variant="secondary" size="xl" shimmer>
            Ver Dashboard
          </LinkButton>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-border/5"
        >
          <p className="text-sm text-secondary mb-3">Enlaces útiles:</p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <LinkButton href="/dashboard" variant="link" size="sm">
              Dashboard
            </LinkButton>
            <span className="text-white/20">•</span>
            <LinkButton href="/dashboard/herramientas" variant="link" size="sm">
              Herramientas
            </LinkButton>
            <span className="text-white/20">•</span>
            <LinkButton href="/help" variant="link" size="sm">
              Ayuda
            </LinkButton>
            <span className="text-white/20">•</span>
            <LinkButton href="/roadmap" variant="link" size="sm">
              Roadmap
            </LinkButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
