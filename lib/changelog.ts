/**
 * Changelog / What's New
 *
 * NOTA IMPORTANTE:
 * A partir del próximo release, este archivo será generado automáticamente
 * por scripts/sync-changelog.js desde CHANGELOG.md (generado por semantic-release).
 *
 * Para agregar entradas al changelog:
 * 1. Hacer commits con formato convencional (feat:, fix:, etc.)
 * 2. Mergear a main
 * 3. El sistema automático creará el release y actualizará este archivo
 *
 * NO EDITAR MANUALMENTE después del primer release automático.
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
    version: '1.7.0',
    date: '2025-10-23',
    title: 'Limpieza Masiva y Mejoras de UX',
    emoji: '🧹',
    highlight: true,
    description:
      'Gran limpieza del proyecto eliminando 44 archivos sin usar (4,159 líneas de código), mejoramos la página 404 con diseño profesional, agregamos loading screen al logout, y simplificamos el sistema de autenticación.',
    features: [
      'Página 404 Rediseñada: Ahora usa LinkButton, Aurora background y AnimatedLogo igual que la landing',
      'Loading Screen en Logout: "Cerrando sesión" con logo animado y spinner para evitar flash de 404',
      'UI Consistente: Todos los botones usan LinkButton/Button con variantes primary/secondary/link',
      'Tests Corregidos: useDolarQuery.test.tsx ahora usa mocks correctos de DolarAPIService',
    ],
    improvements: [
      'Eliminados 44 archivos sin usar (4,159 líneas de código)',
      '14 componentes UI sin usar eliminados (Badge, BottomSheet, LiquidButton, etc.)',
      '8 hooks sin usar eliminados (useActasFilters, useDemoAuth, useTableSorting, etc.)',
      '11 componentes raíz obsoletos eliminados (ChatBot, ContactForm, DolarComponent, etc.)',
      'Sistema de auth simplificado: eliminado modo demo, solo Supabase',
      'Página 404 con mismo diseño que landing page (Aurora, GradientText, botones shimmer)',
      'Mejor transición al cerrar sesión sin ver página 404',
    ],
    fixes: [
      'Corregido error de build: Module not found useDemoAuth',
      'Test useDolarQuery ahora mockea DolarAPIService correctamente',
      'Eliminado código de demo auth que ya no se usaba',
      'Página 404 ahora respeta el design system',
      'Logout ya no muestra flash de 404',
    ],
  },
  {
    version: '1.6.0',
    date: '2025-10-23',
    title: 'Arquitectura Pragmática y Optimizaciones',
    emoji: '🏗️',
    highlight: true,
    description:
      'Implementamos una arquitectura pragmática profesional con servicios centralizados, API clients con Axios interceptors, y migramos todos los hooks y componentes clave para mejorar la mantenibilidad, testabilidad y performance.',
    features: [
      'DolarService: 18 funciones de lógica de negocio centralizadas (formateo, cálculos, validaciones)',
      'CalculatorService: 15 funciones para calculadoras financieras (Plazo Fijo, UVA, Inflación)',
      'API Clients: DolarAPIService y ArgentinaDataService con Axios y interceptors',
      'Axios Interceptors: Logging automático, manejo de errores, refresh de tokens JWT',
      'Documentación Completa: ARCHITECTURE_GUIDE.md (500+ líneas) y MIGRATION_CHECKLIST.md',
    ],
    improvements: [
      'Migración de 9 hooks principales de fetch() a API clients (39 funciones totales)',
      'Migración de 5 componentes clave a usar DolarService (DolarTable, CotizacionesTable, etc.)',
      'Formateo consistente de precios en toda la app ($XX.XX)',
      'Cálculos de spread centralizados y reutilizables',
      'Código más mantenible y fácil de testear',
      'Performance mejorada con caché y retry logic',
      'ESLint al 100% (display names, dependencies optimizadas)',
    ],
    fixes: [
      'Eliminada duplicación de lógica de formateo en 43+ componentes',
      'Eliminada duplicación de cálculos de spread en 6+ componentes',
      'Corrección de dependencias innecesarias en useCallback',
      'Mejora de type safety con Zod schemas en todos los endpoints',
    ],
  },
  {
    version: '1.5.0',
    date: '2025-10-21',
    title: 'Rediseño Completo de Favoritos y Crypto',
    emoji: '✨',
    highlight: true,
    description:
      'Páginas de Favoritos y Criptomonedas completamente rediseñadas con el UI del dashboard principal. Ahora todas las páginas comparten el mismo diseño profesional y consistente.',
    features: [
      'Página Favoritos Unificada: Ahora usa el mismo componente FavoritesList del dashboard con todas las funcionalidades',
      'Sparklines Integrados: Gráficos de tendencia de 30 días en tabla de favoritos',
      'Gráficos Expandibles: Click en botón de gráfico para ver evolución histórica completa',
      'Acciones Completas: Botones de gráfico, favorito, copiar y compartir en todas las tablas',
      'Headers Consistentes: Breadcrumbs y botón de volver al dashboard en todas las páginas',
    ],
    improvements: [
      'UI Unificada: Diseño consistente entre Dashboard, Favoritos y Crypto',
      'Mejor Navegación: Breadcrumbs clicables y botón de volver con hover states',
      'Paginación Mejorada: Sistema de paginación uniforme en favoritos',
      'Componente Reutilizable: FavoritesList ahora se usa en dashboard y favoritos',
      'Empty States Mejorados: Estados vacíos más atractivos con CTAs claros',
      'Iconos en Headers: Iconos grandes en cards de colores brand en headers',
    ],
    fixes: [
      'Eliminados componentes viejos de favoritos (FavoriteDolaresSection, FavoriteCurrenciesSection)',
      'Card variant="outlined" consistente en todas las páginas',
      'Tipografía unificada entre páginas',
    ],
  },
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
