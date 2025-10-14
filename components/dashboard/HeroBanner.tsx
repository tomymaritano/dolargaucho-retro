/**
 * HeroBanner Component
 *
 * Single Responsibility: Display promotional hero banner
 * No business logic, purely presentational
 */

import React from 'react';
import Link from 'next/link';
import { FaRocket } from 'react-icons/fa';

export function HeroBanner() {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-emerald/10 via-background to-accent-teal/10 border border-accent-emerald/20 hover:border-accent-emerald/40 transition-all group">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/5 to-accent-teal/5 opacity-50" />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-accent-emerald/30 to-accent-teal/30 backdrop-blur-sm border border-accent-emerald/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FaRocket className="text-5xl md:text-6xl text-accent-emerald" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
              Contenido Destacado
            </h2>
            <span className="px-2 py-1 text-xs bg-accent-emerald text-background-dark rounded-full font-bold uppercase">
              Nuevo
            </span>
          </div>
          <p className="text-secondary text-sm md:text-base mb-4">
            Este es un espacio destacado para promocionar contenido, funcionalidades nuevas o
            anuncios importantes. Podés personalizarlo con imágenes y enlaces a cualquier sección.
          </p>
          <Link
            href="/dashboard/calculadoras"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-emerald/20 hover:bg-accent-emerald/30 text-accent-emerald font-semibold transition-all group-hover:gap-3"
          >
            Ver más
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-emerald/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-teal/5 rounded-full blur-3xl -z-0" />
    </div>
  );
}
