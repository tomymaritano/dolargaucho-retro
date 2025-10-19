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
    <div className="mb-8 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 group">
      {/* Icon */}
      <div className="flex-shrink-0">
        <FaRocket className="text-4xl md:text-5xl text-brand" />
      </div>

      {/* Text */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Contenido Destacado
          </h2>
          <span className="px-2 py-0.5 text-[10px] bg-brand/10 text-brand rounded font-bold uppercase">
            Nuevo
          </span>
        </div>
        <p className="text-secondary text-sm md:text-base mb-4">
          Este es un espacio destacado para promocionar contenido, funcionalidades nuevas o anuncios
          importantes. Podés personalizarlo con imágenes y enlaces a cualquier sección.
        </p>
        <Link
          href="/dashboard/calculadoras"
          className="inline-flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all"
        >
          Ver más
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
