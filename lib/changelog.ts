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
    version: '1.4.0',
    date: '2025-10-21',
    title: 'Dashboard Navbar Rediseñado y Formularios Optimizados',
    emoji: '🚀',
    highlight: true,
    description:
      'Rediseñamos completamente el navbar del dashboard con marquesina de cotizaciones en vivo, menú hamburguesa mejorado y formularios de autenticación optimizados sin page refresh.',
    features: [
      'Navbar del Dashboard: Marquesina de cotizaciones arriba del todo con datos en tiempo real',
      'Menú Hamburguesa Premium: Organizado en secciones (Principal, Mercados, Herramientas)',
      'Glass Morphism Design: Panel del menú con transparencia y blur elegante',
      'Sistema de Nickname: Campo opcional para personalizar tu perfil de usuario',
      'Búsqueda Universal: NavbarSearch con fuzzy search para encontrar cualquier sección (⌘K)',
    ],
    improvements: [
      'Formularios sin refresh: Ahora podés escribir en login/signup sin que la página se recargue',
      'Validaciones extraídas: Lógica de validación modular y reutilizable',
      'Menú con estados activos: El item actual se destaca con color brand y sombra',
      'Avatar de usuario: Tarjeta con tu nombre y email en el menú',
      'Dropdown de perfil: Acceso rápido a "Mi Perfil" y "Cerrar Sesión" desde el navbar',
      'Accesibilidad mejorada: Aria-labels en todos los botones interactivos',
      'Performance optimizada: Todos los handlers memoizados con useCallback',
    ],
    fixes: [
      'Eliminado page refresh al escribir en formularios de auth',
      'Router.push en vez de window.location.href para navegación client-side',
      'Limpieza de estado al cambiar entre tabs de login/signup',
      'Console.logs solo en desarrollo (no en producción)',
      'Email validation mejorada con regex RFC 5322 compliant',
    ],
  },
  {
    version: '1.3.1',
    date: '2025-10-20',
    title: 'Landing Page Mejorada con Tema Adaptativo',
    emoji: '🎨',
    highlight: false,
    description:
      'Mejoramos completamente la landing page con detección de sesión inteligente, adaptación completa a light/dark mode, contador de usuarios en vivo con datos reales y sistema de notificación de cambios de auth.',
    features: [
      'Navbar inteligente: muestra "Iniciar Sesión" o "Ver Dashboard" según tu estado de sesión',
      'Logo adaptativo: cambia automáticamente entre light y dark mode',
      'Contador de usuarios: muestra usuarios registrados REALES en tiempo real (6 usuarios actuales)',
      'Mini tabla con sparklines: vista rápida de 6 tipos de dólar con gráficos inline',
      'Sistema de eventos: notificación instantánea de cambios de autenticación entre componentes',
    ],
    improvements: [
      'Hero mejorado con badge de usuarios registrados',
      'Detección automática de sesión con loading states',
      'Experiencia visual consistente en light y dark mode',
      'API endpoint con query real a PostgreSQL (ya no hardcoded)',
      'Navbar se actualiza automáticamente al login/logout sin recargar página',
      'Sistema de eventos localStorage para sincronización entre componentes',
    ],
    fixes: [
      'Logo ahora se adapta correctamente al cambiar de tema',
      'Eliminados elementos que no adaptaban a light mode',
      'Mejorada la navegación contextual según estado de autenticación',
      'Contador de usuarios ahora muestra datos reales (antes mostraba 1250 hardcoded)',
      'Navbar actualiza en tiempo real cuando el usuario hace login/logout',
      'Corrección de auth check: ahora usa custom JWT auth en vez de Supabase',
    ],
  },
  {
    version: '1.3.0',
    date: '2025-10-20',
    title: 'Optimización UX y Nuevas Herramientas Financieras',
    emoji: '✨',
    highlight: true,
    description:
      'Mejoramos significativamente la experiencia de usuario eliminando datos duplicados, organizando mejor las páginas y agregando herramientas útiles para inversores.',
    features: [
      'Calculadora de Rendimientos: Estimá cuánto ganás con Plazo Fijo, UVA y FCIs',
      'Comparador de Instrumentos: Compará 5 opciones de inversión (PF, UVA, FCIs, Stablecoins)',
      'Dashboard: Overview rápido con todos los indicadores principales',
      'Análisis: Visualización avanzada y análisis técnico exclusivo',
      'Finanzas: Ahora con 4 tabs (Tasas, Calculadora, Comparador, FCIs)',
    ],
    improvements: [
      'Página Análisis optimizada: de 642 a 494 líneas (23% reducción)',
      'Página Finanzas con herramientas prácticas para inversores',
      'Eliminados indicadores duplicados entre Dashboard y otras páginas',
      'Navegación más clara con botones de "Volver al Dashboard"',
      'Mejor separación de responsabilidades entre páginas',
      'Gráficos de análisis técnico sin bordes para look más profesional',
    ],
    fixes: [
      'Eliminada duplicación de gráficos de Inflación y Riesgo País',
      'Removidos quick stats redundantes en Finanzas',
      'Mejorada consistencia visual entre páginas',
      'Bordes transparentes en gráficos de análisis técnico',
    ],
  },
  {
    version: '1.2.1',
    date: '2025-10-20',
    title: 'Filtros de Tiempo Corregidos',
    emoji: '📊',
    description:
      'Arreglamos un problema importante en los gráficos históricos que impedía que los filtros de tiempo funcionaran correctamente.',
    fixes: [
      'Filtros de tiempo (6M, 12M, 24M, 5Y) ahora funcionan correctamente en todos los gráficos',
      'Gráficos de Argentina (IPC, UVA, Riesgo País) ahora respetan el período seleccionado',
      'Gráficos de FRED (Tasa FED, CPI, Desempleo, Treasury) ahora muestran datos correctos según el filtro',
    ],
    improvements: [
      'Mejor experiencia al explorar datos históricos en diferentes períodos',
      'Visualización más precisa de tendencias económicas',
    ],
  },
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

/**
 * Storage key for skipped versions
 */
const SKIPPED_VERSIONS_KEY = 'dg_skipped_versions';

/**
 * Obtener versiones que el usuario decidió no ver
 */
export function getSkippedVersions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const skipped = localStorage.getItem(SKIPPED_VERSIONS_KEY);
    return skipped ? JSON.parse(skipped) : [];
  } catch {
    return [];
  }
}

/**
 * Marcar una versión como "no mostrar"
 */
export function skipVersion(version: string): void {
  if (typeof window === 'undefined') return;
  try {
    const skipped = getSkippedVersions();
    if (!skipped.includes(version)) {
      skipped.push(version);
      localStorage.setItem(SKIPPED_VERSIONS_KEY, JSON.stringify(skipped));
    }
  } catch (error) {
    console.error('Error skipping version:', error);
  }
}

/**
 * Verificar si una versión fue marcada como "no mostrar"
 */
export function isVersionSkipped(version: string): boolean {
  return getSkippedVersions().includes(version);
}

/**
 * Contar versiones no vistas (nuevas y no skipped)
 */
export function getUnseenCount(lastSeenVersion: string | null): number {
  const skipped = getSkippedVersions();
  let count = 0;

  for (const entry of CHANGELOG) {
    // Si no hay última versión vista, todas son nuevas
    if (!lastSeenVersion) {
      if (!skipped.includes(entry.version)) count++;
      continue;
    }

    // Si llegamos a la última versión vista, paramos
    if (entry.version === lastSeenVersion) break;

    // Si esta versión no está skipped, contamos
    if (!skipped.includes(entry.version)) count++;
  }

  return count;
}
