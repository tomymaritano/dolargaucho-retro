/**
 * Changelog / What's New
 *
 * Mantené este archivo actualizado con cada release importante.
 * El sistema mostrará automáticamente las novedades a los usuarios.
 */

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  features?: string[];
  improvements?: string[];
  fixes?: string[];
  emoji?: string;
  highlight?: boolean; // Para marcar releases importantes
}

/**
 * Changelog completo (orden: más reciente primero)
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2025-10-19',
    title: 'Seguridad Mejorada y Password Reset',
    emoji: '🛡️',
    highlight: true,
    description:
      'Implementamos mejoras de seguridad importantes y arreglamos la funcionalidad de recuperación de contraseña.',
    features: [
      'Rate limiting para prevenir ataques de fuerza bruta',
      'Sistema de recuperación de contraseña completamente funcional',
      'Documentación completa de seguridad (SECURITY.md)',
    ],
    improvements: [
      'Diseño de página "Olvidé mi contraseña" renovado',
      'Validación de emails mejorada',
      'Logging de seguridad más robusto',
    ],
    fixes: [
      'Corrección de errores 500 al intentar recuperar contraseña',
      'Tabla password_reset_tokens agregada a la base de datos',
    ],
  },
  {
    version: '1.1.0',
    date: '2025-10-19',
    title: 'SEO y Favicons',
    emoji: '🔍',
    description: 'Optimizamos el sitio para motores de búsqueda y redes sociales.',
    features: [
      'Meta tags completos para SEO (Open Graph, Twitter Cards)',
      'Favicons en todos los tamaños para móviles y escritorio',
      'PWA manifest para instalar como app',
      'Structured Data (Schema.org)',
    ],
    improvements: [
      'Vercel Analytics integrado',
      'Background adaptado para light mode',
      'Idioma del sitio configurado a español (es-AR)',
    ],
  },
  {
    version: '1.0.0',
    date: '2025-10-18',
    title: 'Dashboard Rediseñado',
    emoji: '🎨',
    highlight: true,
    description: 'Rediseño completo del dashboard con mejoras visuales y de UX.',
    features: [
      'Tablas profesionales con sparklines integrados',
      'Sección de favoritos unificada',
      'Gráficos históricos comparativos',
      'Análisis económico detallado',
    ],
    improvements: [
      'Reducción del bundle size en 0.7 kB',
      'Diseño más limpio y profesional',
      'Mejor organización de indicadores',
      'UI consistente en toda la aplicación',
    ],
  },
];

/**
 * Obtener la versión actual (la más reciente)
 */
export function getCurrentVersion(): string {
  return CHANGELOG[0].version;
}

/**
 * Obtener el changelog desde una versión específica
 */
export function getChangelogSince(version: string): ChangelogEntry[] {
  const index = CHANGELOG.findIndex((entry) => entry.version === version);
  if (index === -1) return CHANGELOG;
  return CHANGELOG.slice(0, index);
}

/**
 * Verificar si hay nuevas actualizaciones
 */
export function hasNewUpdates(lastSeenVersion: string | null): boolean {
  if (!lastSeenVersion) return true;
  return lastSeenVersion !== getCurrentVersion();
}
