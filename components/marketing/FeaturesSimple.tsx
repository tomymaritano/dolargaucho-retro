'use client';

/**
 * FeaturesSimple - Animaciones interactivas con GSAP
 *
 * Dashboard con parallax + features animadas con ScrollTrigger
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { FaRocket } from 'react-icons/fa';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function FeaturesSimple() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !dashboardRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on dashboard
      gsap.to(dashboardRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          markers: false,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 sm:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6">
            <FaRocket className="text-brand" />
            <span className="text-sm font-semibold text-brand uppercase tracking-wider">
              Funcionalidades
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Todo lo que necesitás.</span>
            <br />
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              En un solo dashboard.
            </span>
          </h2>

          <p className="text-secondary text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Herramientas profesionales para tomar decisiones financieras informadas
          </p>
        </motion.div>

        {/* Dashboard GIF - Top with Parallax & Tilt */}
        <div ref={dashboardRef} className="relative max-w-5xl mx-auto will-change-transform">
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={1000}
            scale={1.02}
            transitionSpeed={2000}
            gyroscope={true}
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/record.gif"
                alt="Dashboard de Dólar Gaucho en acción"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
