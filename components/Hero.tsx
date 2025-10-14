import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';
import Aurora from '@/components/ui/Aurora/Aurora';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden pt-20 pb-28 bg-background">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 opacity-30">
        <Aurora
          colorStops={['#10b981', '#14b8a6', '#10b981']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-7xl px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-emerald/20 mb-8"
        >
          <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-secondary-light">Datos en tiempo real</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Cotizaciones del Dólar
          <br />
          <span className="gradient-text">para Profesionales</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-secondary-light mt-6 max-w-7xl mx-auto leading-relaxed font-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Cotizaciones, inflación, política, calculadoras y más. Una plataforma completa de datos
          argentinos en tiempo real.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#cotizaciones"
            className="group relative glass-strong px-8 py-4 rounded-xl font-semibold text-base transition-all border border-accent-emerald/30 hover:border-accent-emerald/60 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
              <FaChartLine />
              Ver Cotizaciones
            </span>
            <div className="absolute inset-0 bg-accent-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl font-semibold text-base transition-all bg-accent-emerald hover:bg-accent-teal text-background-dark"
          >
            Ir al Dashboard
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - subtle */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border border-accent-emerald/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-accent-emerald/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
