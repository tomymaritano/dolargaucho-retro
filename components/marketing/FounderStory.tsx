'use client';

/**
 * FounderStory - Sección sobre el origen y propósito de Dólar Gaucho
 *
 * Rediseñado con BingX-style y microinteracciones ReactBits
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRocket } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function FounderStory() {
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-background via-background-secondary/30 to-background">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6"
          >
            <FaRocket className="text-brand" />
            <span className="text-sm font-bold text-brand uppercase tracking-wider">Misión</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Creado para argentinos que necesitan{' '}
            <GradientText className="font-black">claridad</GradientText>
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto">
            Democratizar el acceso a información financiera de calidad para todos los argentinos
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left: Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-panel border border-white/5 rounded-2xl p-8 hover:border-error/30 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">El Desafío</h3>
                  <p className="text-sm text-secondary">Fragmentación de datos críticos</p>
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed text-base">
                La información financiera en Argentina está fragmentada entre múltiples fuentes no
                centralizadas. Inversores y ciudadanos deben consultar manualmente DolarAPI, BCRA,
                INDEC, CoinGecko y el Congreso para tomar decisiones informadas.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-sm text-secondary italic">
                  "Necesitar 5+ pestañas para ver cotizaciones, inflación y política no es eficiente
                  en 2025"
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-gradient-to-br from-success/5 via-panel to-panel border border-success/20 rounded-2xl p-8 hover:border-success/40 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Nuestra Solución</h3>
                  <p className="text-sm text-success">Centralización y automatización</p>
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed mb-6 text-base">
                Dashboard unificado con arquitectura escalable (Next.js 14, TypeScript, TanStack
                Query) que integra 6 APIs oficiales. Actualizaciones automáticas diarias para
                dólares, tiempo real para cryptos, y experiencia mobile-first optimizada.
              </p>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <FaCheckCircle className="text-success flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">15+ Tipos de Dólar</div>
                    <div className="text-xs text-secondary">Oficial, Blue, MEP, CCL, Crypto</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <FaCheckCircle className="text-success flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">100+ Criptomonedas</div>
                    <div className="text-xs text-secondary">
                      Precios en tiempo real con conversión ARS
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <FaCheckCircle className="text-success flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Datos Macro & Políticos
                    </div>
                    <div className="text-xs text-secondary">INDEC, BCRA, FRED, ECB, Congreso</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Impact & Tech */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-8 hover:border-brand/40 transition-all"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Roadmap 2025</h3>
                  <p className="text-sm text-brand">En desarrollo activo</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-brand/10"
                >
                  <span className="text-success text-lg mt-0.5">✓</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Dashboard Core</div>
                    <div className="text-xs text-secondary mt-1">
                      Cotizaciones, crypto, calculadoras y política
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-brand/10"
                >
                  <span className="text-warning text-lg mt-0.5">⏳</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">PWA Instalable</div>
                    <div className="text-xs text-secondary mt-1">
                      App móvil sin app store (Q2 2025)
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-brand/10"
                >
                  <span className="text-secondary text-lg mt-0.5">○</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">API Pública</div>
                    <div className="text-xs text-secondary mt-1">Para developers (Q3 2025)</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-panel border border-white/5 rounded-2xl p-8 hover:border-brand/20 transition-all"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Stack Tecnológico</h3>
                  <p className="text-sm text-secondary">Arquitectura moderna y escalable</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Next.js 14', desc: 'App Router & SSR', icon: '▲' },
                  { name: 'TypeScript', desc: 'Type Safety', icon: 'TS' },
                  { name: 'TanStack Query', desc: 'Data Fetching', icon: '🔄' },
                  { name: 'Tailwind CSS', desc: 'Utility-First', icon: '🎨' },
                ].map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(0, 71, 255, 0.3)' }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{tech.icon}</span>
                      <div className="font-bold text-sm text-foreground">{tech.name}</div>
                    </div>
                    <div className="text-xs text-secondary">{tech.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Built By Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-panel border border-white/5 rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-40 h-40 rounded-2xl overflow-hidden ring-2 ring-brand/30 shadow-2xl shadow-brand/20 group-hover:ring-brand/60 transition-all"
                >
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D4D03AQEu5NIu30rq2A/profile-displayphoto-crop_800_800/B4DZl90YXrGgAI-/0/1758752508392?e=1762387200&v=beta&t=_xDJIYoc2zPt1mF05CP_iWcTVk3ueawBLjUy1udaar0"
                    alt="Tomás Maritano"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-brand to-brand-light rounded-xl flex items-center justify-center ring-4 ring-panel shadow-xl cursor-pointer"
                >
                  <span className="text-2xl">🇦🇷</span>
                </motion.div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-brand mb-1">Founder & CEO</p>
              <h4 className="text-2xl font-black text-foreground mb-2">Tomás Maritano</h4>
              <p className="text-sm text-secondary mb-6 max-w-xl">
                Emprendedor tecnológico y Full-Stack Developer. Apasionado por construir productos
                que resuelven problemas reales y democratizan el acceso a información financiera en
                Argentina.
              </p>

              {/* Social Links - Centralized Component */}
              <SocialLinks size="md" showStars className="justify-center md:justify-start mb-8" />

              {/* Credits - Avatar Stack */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-xs font-bold text-foreground/70 mb-4 uppercase tracking-wider">
                  Agradecimientos Especiales
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-3">
                    {[
                      {
                        name: 'Eric Maritano',
                        emoji: '👨‍💼',
                        color: 'from-blue-500/20 to-cyan-500/20',
                      },
                      {
                        name: 'Carla Mendoza',
                        emoji: '👩‍💻',
                        color: 'from-purple-500/20 to-pink-500/20',
                      },
                      {
                        name: 'Maty Maritano',
                        emoji: '🧑‍🎨',
                        color: 'from-orange-500/20 to-yellow-500/20',
                      },
                    ].map((person, index) => (
                      <motion.div
                        key={person.name}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{
                          scale: 1.15,
                          zIndex: 10,
                          y: -8,
                          transition: { type: 'spring', stiffness: 400 },
                        }}
                        className="relative group cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${person.color} border-2 border-panel flex items-center justify-center shadow-lg group-hover:border-brand transition-all`}
                        >
                          <span className="text-2xl">{person.emoji}</span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background-dark border border-brand/30 rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                          <p className="text-xs font-semibold text-foreground">{person.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs text-secondary leading-relaxed">
                      Por su invaluable ayuda con feedback, testing y difusión en la comunidad
                      argentina
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
