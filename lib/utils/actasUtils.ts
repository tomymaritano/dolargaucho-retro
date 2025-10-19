/**
 * actasUtils.ts - Pure functions for Actas processing
 *
 * Single Responsibility: Provide utility functions for actas categorization,
 * formatting, and color coding
 */

import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';

/**
 * Categorize an acta based on its tipo or periodo field
 */
export function categorizarActa(acta: ActaSenado | ActaDiputados): string {
  if (!acta.tipo) {
    // Fallback: try to categorize by periodo
    if (acta.periodo?.toLowerCase().includes('extraordinaria')) return 'Extraordinaria';
    if (acta.periodo?.toLowerCase().includes('ordinaria')) return 'Ordinaria';
    return 'Sesión';
  }

  const tipo = acta.tipo.toLowerCase();
  if (tipo.includes('extraordinaria')) return 'Extraordinaria';
  if (tipo.includes('ordinaria')) return 'Ordinaria';
  if (tipo.includes('preparatoria')) return 'Preparatoria';
  if (tipo.includes('especial')) return 'Especial';
  return acta.tipo || 'Sesión';
}

/**
 * Get Tailwind color classes for acta category badge
 */
export function getCategoriaColor(categoria: string): string {
  switch (categoria) {
    case 'Ordinaria':
      return 'bg-brand/20 text-brand border-brand/30';
    case 'Extraordinaria':
      return 'bg-brand-light/20 text-brand-light border-brand-light/30';
    case 'Preparatoria':
      return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
    case 'Especial':
      return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
    default:
      return 'bg-secondary/20 text-secondary border-secondary/30';
  }
}

/**
 * Format date string to Spanish locale format
 */
export function formatearFecha(fechaStr: string): string {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Extract available years from actas list
 */
export function getAñosDisponibles(actas: (ActaSenado | ActaDiputados)[]): number[] {
  if (!actas || actas.length === 0) return [];
  const años = new Set(actas.map((acta) => new Date(acta.fecha).getFullYear()));
  return Array.from(años).sort((a, b) => b - a);
}
