import { IconType } from 'react-icons';
import {
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaChartLine,
  FaBell,
  FaCalculator,
  FaRobot,
  FaMobileAlt,
  FaGlobe,
  FaLock,
  FaCode,
  FaSearch,
  FaUsers,
  FaFileExport,
  FaComments,
  FaEnvelope,
  FaShieldAlt,
  FaFlask,
  FaDiscord,
  FaChartBar,
  FaWallet,
  FaThumbsUp,
} from 'react-icons/fa';

export type RoadmapStatus = 'completed' | 'in-progress' | 'planned';

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  icon: IconType;
  category: string;
  /** For completed features */
  completedDate?: string;
  /** For in-progress features (0-100) */
  progress?: number;
  /** For planned features (high, medium, low) */
  priority?: 'high' | 'medium' | 'low';
  /** User votes (future feature) */
  votes?: number;
  /** Estimated effort (in weeks) */
  effort?: string;
  /** Target quarter (Q1 2025, Q2 2025, etc.) */
  quarter?: string;
}

export const ROADMAP_FEATURES: RoadmapFeature[] = [
  // ========== COMPLETED - Q1 2025 ==========
  {
    id: 'dashboard-v1',
    title: 'Dashboard Unificado',
    description:
      'Dashboard principal con cotizaciones de dólar, crypto, y datos macro en tiempo real',
    status: 'completed',
    icon: FaChartLine,
    category: 'Core',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'calculators',
    title: 'Calculadoras Financieras',
    description: 'Plazo fijo, UVA, inflación, comparativas de activos y conversión de monedas',
    status: 'completed',
    icon: FaCalculator,
    category: 'Herramientas',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'alerts-system',
    title: 'Sistema de Alertas Frontend',
    description: 'UI para crear y gestionar alertas personalizadas de cotizaciones',
    status: 'completed',
    icon: FaBell,
    category: 'Features',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'calendar',
    title: 'Calendario Económico',
    description: 'Eventos económicos relevantes y próximos indicadores',
    status: 'completed',
    icon: FaClock,
    category: 'Features',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'favorites',
    title: 'Sistema de Favoritos',
    description: 'Guardar y organizar cotizaciones favoritas con visualización personalizada',
    status: 'completed',
    icon: FaCheckCircle,
    category: 'UX',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'auth-system',
    title: 'Sistema de Autenticación',
    description:
      'Login, registro, perfiles con JWT, cookies HTTP-only y recuperación de contraseña',
    status: 'completed',
    icon: FaLock,
    category: 'Core',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'email-service',
    title: 'Servicio de Email',
    description:
      'Integración con Resend para welcome emails, password reset y notificaciones de alertas',
    status: 'completed',
    icon: FaEnvelope,
    category: 'Core',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'alerts-backend',
    title: 'Alertas Backend Funcional',
    description: 'Verificación automática cada 5min con Vercel Cron y notificaciones por email',
    status: 'completed',
    icon: FaBell,
    category: 'Features',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'changelog-system',
    title: "Sistema de Changelog 'What's New'",
    description: 'Modal elegante mostrando las últimas actualizaciones y mejoras del producto',
    status: 'completed',
    icon: FaCheckCircle,
    category: 'UX',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },
  {
    id: 'roadmap-interactive',
    title: 'Roadmap Público Interactivo',
    description: 'Timeline dinámico por quarters con filtrado, tooltips y sistema de votación',
    status: 'completed',
    icon: FaCheckCircle,
    category: 'Platform',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },

  // ========== IN PROGRESS - Q4 2025 (Actual) ==========
  {
    id: 'user-analytics',
    title: 'Analytics de Usuario',
    description: 'Dashboard de métricas: usuarios activos, engagement, retención y uso de features',
    status: 'in-progress',
    icon: FaChartBar,
    category: 'DevOps',
    progress: 40,
    quarter: 'Q4 2025',
    effort: '3 semanas',
  },
  {
    id: 'ux-improvements',
    title: 'Mejoras de UX',
    description: 'Pulir detalles de interfaz, microinteracciones y feedback visual',
    status: 'in-progress',
    icon: FaCheckCircle,
    category: 'UX',
    progress: 60,
    quarter: 'Q4 2025',
    effort: '2 semanas',
  },
  {
    id: 'voting-period',
    title: 'Período de Votación Activa',
    description: 'Permitir a usuarios votar features prioritarias para 2026',
    status: 'in-progress',
    icon: FaThumbsUp,
    category: 'Platform',
    progress: 80,
    quarter: 'Q4 2025',
    effort: '1 semana',
  },

  // ========== PLANNED - Q1 2026 (Próximo Trimestre) ==========
  {
    id: 'mobile-app',
    title: 'App Mobile (PWA)',
    description: 'Progressive Web App con notificaciones push y modo offline',
    status: 'planned',
    icon: FaMobileAlt,
    category: 'Platform',
    priority: 'high',
    quarter: 'Q1 2026',
    effort: '2 semanas',
  },
  {
    id: 'voting-system',
    title: 'Sistema de Votación de Features',
    description:
      'Permitir a usuarios autenticados votar por features del roadmap con actualización en tiempo real',
    status: 'completed',
    icon: FaCheckCircle,
    category: 'Platform',
    completedDate: '2025-01',
    quarter: 'Q1 2025',
  },

  // ========== PLANNED - Q2 2026 (3-6 meses) ==========
  {
    id: 'api-public',
    title: 'API Pública',
    description: 'REST API con autenticación para desarrolladores externos',
    status: 'planned',
    icon: FaCode,
    category: 'Platform',
    priority: 'high',
    quarter: 'Q2 2026',
    effort: '3-4 semanas',
  },
  {
    id: 'discord-community',
    title: 'Discord Server',
    description: 'Comunidad en Discord para usuarios activos, discusiones y soporte',
    status: 'planned',
    icon: FaDiscord,
    category: 'Social',
    priority: 'high',
    quarter: 'Q1 2026',
    effort: '1-2 semanas',
  },
  {
    id: 'testing-suite',
    title: 'Testing Suite (60% Coverage)',
    description: 'Tests unitarios, integración y E2E con Jest, Testing Library y Playwright',
    status: 'planned',
    icon: FaFlask,
    category: 'DevOps',
    priority: 'high',
    quarter: 'Q1 2026',
    effort: '3 semanas',
  },
  {
    id: 'security-improvements',
    title: 'Mejoras de Seguridad',
    description: 'Refresh tokens, CSP headers, rate limiting global y auditoría de seguridad',
    status: 'planned',
    icon: FaShieldAlt,
    category: 'Core',
    priority: 'high',
    quarter: 'Q1 2026',
    effort: '2 semanas',
  },
  {
    id: 'ai-insights',
    title: 'Insights con IA',
    description: 'Análisis predictivo y recomendaciones personalizadas usando OpenAI GPT-4',
    status: 'planned',
    icon: FaRobot,
    category: 'AI',
    priority: 'high',
    quarter: 'Q2 2026',
    effort: '4 semanas',
  },
  {
    id: 'advanced-search',
    title: 'Búsqueda Avanzada',
    description: 'Búsqueda global con filtros avanzados, fuzzy search y búsqueda semántica',
    status: 'planned',
    icon: FaSearch,
    category: 'UX',
    priority: 'high',
    quarter: 'Q2 2026',
    effort: '2 semanas',
  },
  {
    id: 'export-data',
    title: 'Exportar Datos',
    description: 'Exportar históricos a CSV, Excel, PDF con gráficos personalizados',
    status: 'planned',
    icon: FaFileExport,
    category: 'Features',
    priority: 'medium',
    quarter: 'Q2 2026',
    effort: '2 semanas',
  },
  {
    id: 'interactive-charts',
    title: 'Gráficos Interactivos Mejorados',
    description: 'Charts con zoom, pan, anotaciones y comparación de múltiples indicadores',
    status: 'planned',
    icon: FaChartBar,
    category: 'Features',
    priority: 'medium',
    quarter: 'Q2 2026',
    effort: '3 semanas',
  },
  {
    id: 'wallet-integration',
    title: 'Integración con Billeteras',
    description:
      'Conectar Mercado Pago, Ualá, MetaMask para mostrar saldos reales y hacer simulaciones',
    status: 'planned',
    icon: FaWallet,
    category: 'Features',
    priority: 'high',
    quarter: 'Q2 2026',
    effort: '6 semanas',
  },

  // ========== PLANNED - Q3 2026 (6-9 meses) ==========
  {
    id: 'multi-language',
    title: 'Multiidioma',
    description: 'Soporte para inglés y portugués además de español',
    status: 'planned',
    icon: FaGlobe,
    category: 'Platform',
    priority: 'medium',
    quarter: 'Q3 2026',
    effort: '3 semanas',
  },
  {
    id: 'community',
    title: 'Comunidad y Foros',
    description: 'Migración a Discourse para foros avanzados y comunidad escalable',
    status: 'planned',
    icon: FaComments,
    category: 'Social',
    priority: 'low',
    quarter: 'Q3 2026',
    effort: '4 semanas',
  },
  {
    id: 'social-features',
    title: 'Features Sociales',
    description: 'Compartir portfolios, seguir a otros usuarios, rankings públicos',
    status: 'planned',
    icon: FaUsers,
    category: 'Social',
    priority: 'low',
    quarter: 'Q3 2026',
    effort: '3 semanas',
  },
];

export const ROADMAP_CATEGORIES = [
  'Todos',
  'Core',
  'Features',
  'Herramientas',
  'Platform',
  'UX',
  'AI',
  'Social',
  'DevOps',
];
