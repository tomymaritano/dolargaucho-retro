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
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Tilt from 'react-parallax-tilt';
import {
  FaChartLine,
  FaBell,
  FaCalculator,
  FaChartBar,
  FaClock,
  FaShieldAlt,
  FaRocket,
} from 'react-icons/fa';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: FaChartLine,
    title: 'Datos en tiempo real',
    description: 'Cotizaciones del dólar, crypto, inflación y riesgo país actualizadas al instante',
  },
  {
    icon: FaChartBar,
    title: 'Gráficos interactivos',
    description: 'Visualizá tendencias históricas y analizá el comportamiento del mercado',
  },
  {
    icon: FaCalculator,
    title: 'Calculadoras financieras',
    description: 'Simulá inversiones en plazo fijo, UVA, inflación y más',
  },
  {
    icon: FaClock,
    title: 'Históricos completos',
    description: 'Accedé a datos históricos para análisis profundo',
  },
  {
    icon: FaShieldAlt,
    title: 'Fuentes verificadas',
    description: 'Datos de BCRA, INDEC, DolarAPI, CoinGecko y más',
  },
  {
    icon: FaBell,
    title: 'Alertas personalizadas',
    description: 'Recibí notificaciones cuando tus activos alcancen el precio objetivo',
  },
];

export function FeaturesSimple() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [parent] = useAutoAnimate();

  useEffect(() => {
    if (!sectionRef.current || !dashboardRef.current || !featuresRef.current) return;

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
          markers: false, // Set to true for debugging
        },
      });

      // Stagger animation for features
      const featureCards = featuresRef.current?.querySelectorAll('.feature-card');
      if (featureCards) {
        gsap.from(featureCards, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Hover effect with GSAP
        featureCards.forEach((card) => {
          const icon = card.querySelector('.feature-icon');

          card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
            gsap.to(icon, { scale: 1.1, rotation: 5, duration: 0.3, ease: 'back.out' });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
            gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out' });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
        <div ref={dashboardRef} className="relative max-w-5xl mx-auto mb-16 will-change-transform">
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

        {/* Features Grid - Bottom with GSAP Stagger */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-card">
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon with GSAP animation */}
                  <div className="feature-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-light/10 flex items-center justify-center text-brand mb-4 border border-brand/20">
                    <Icon className="text-2xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
