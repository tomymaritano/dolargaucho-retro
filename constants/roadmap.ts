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
  // ========== COMPLETED ==========
  {
    id: 'dashboard-v1',
    title: 'Dashboard Unificado',
    description:
      'Dashboard principal con cotizaciones de dólar, crypto, y datos macro en tiempo real',
    status: 'completed',
    icon: FaChartLine,
    category: 'Core',
    completedDate: '2025-01',
  },
  {
    id: 'calculators',
    title: 'Calculadoras Financieras',
    description: 'Plazo fijo, UVA, inflación, comparativas de activos y conversión de monedas',
    status: 'completed',
    icon: FaCalculator,
    category: 'Herramientas',
    completedDate: '2025-01',
  },
  {
    id: 'alerts-system',
    title: 'Sistema de Alertas',
    description: 'Alertas personalizadas para cotizaciones de dólar y crypto',
    status: 'completed',
    icon: FaBell,
    category: 'Features',
    completedDate: '2025-01',
  },
  {
    id: 'calendar',
    title: 'Calendario Económico',
    description: 'Eventos económicos relevantes y próximos indicadores',
    status: 'completed',
    icon: FaClock,
    category: 'Features',
    completedDate: '2025-01',
  },
  {
    id: 'favorites',
    title: 'Sistema de Favoritos',
    description: 'Guardar y organizar cotizaciones favoritas con visualización personalizada',
    status: 'completed',
    icon: FaCheckCircle,
    category: 'UX',
    completedDate: '2025-01',
  },

  // ========== IN PROGRESS ==========
  {
    id: 'mobile-app',
    title: 'App Mobile (PWA)',
    description: 'Progressive Web App con notificaciones push y modo offline',
    status: 'in-progress',
    icon: FaMobileAlt,
    category: 'Platform',
    progress: 75,
    quarter: 'Q1 2025',
    effort: '2 semanas',
  },
  {
    id: 'api-public',
    title: 'API Pública',
    description: 'REST API con autenticación para desarrolladores externos',
    status: 'in-progress',
    icon: FaCode,
    category: 'Platform',
    progress: 50,
    quarter: 'Q2 2025',
    effort: '3-4 semanas',
  },
  {
    id: 'auth-system',
    title: 'Sistema de Autenticación',
    description: 'Login, registro, y perfiles de usuario con preferencias personalizadas',
    status: 'completed',
    icon: FaLock,
    category: 'Core',
    completedDate: '2025-01',
  },

  // ========== PLANNED - Q1 2025 (Próximos 3 meses) ==========
  {
    id: 'discord-community',
    title: 'Discord Server',
    description: 'Comunidad en Discord para usuarios activos, discusiones y soporte',
    status: 'planned',
    icon: FaDiscord,
    category: 'Social',
    priority: 'high',
    quarter: 'Q1 2025',
    effort: '1-2 semanas',
    votes: 178,
  },
  {
    id: 'email-service',
    title: 'Servicio de Email',
    description:
      'Integración con Resend/SendGrid para alertas, newsletter y recuperación de contraseña',
    status: 'planned',
    icon: FaEnvelope,
    category: 'Core',
    priority: 'high',
    quarter: 'Q1 2025',
    effort: '1 semana',
    votes: 156,
  },
  {
    id: 'alerts-backend',
    title: 'Alertas Backend Funcional',
    description: 'Backend completo con Supabase y notificaciones por email',
    status: 'planned',
    icon: FaBell,
    category: 'Features',
    priority: 'high',
    quarter: 'Q1 2025',
    effort: '2 semanas',
    votes: 198,
  },
  {
    id: 'testing-suite',
    title: 'Testing Suite (60% Coverage)',
    description: 'Tests unitarios, integración y E2E con Jest, Testing Library y Playwright',
    status: 'planned',
    icon: FaFlask,
    category: 'DevOps',
    priority: 'high',
    quarter: 'Q1 2025',
    effort: '3 semanas',
    votes: 134,
  },
  {
    id: 'security-improvements',
    title: 'Mejoras de Seguridad',
    description: 'Refresh tokens, CSP headers, rate limiting global y auditoría de seguridad',
    status: 'planned',
    icon: FaShieldAlt,
    category: 'Core',
    priority: 'high',
    quarter: 'Q1 2025',
    effort: '2 semanas',
    votes: 165,
  },

  // ========== PLANNED - Q2 2025 (3-6 meses) ==========
  {
    id: 'ai-insights',
    title: 'Insights con IA',
    description: 'Análisis predictivo y recomendaciones personalizadas usando OpenAI GPT-4',
    status: 'planned',
    icon: FaRobot,
    category: 'AI',
    priority: 'high',
    quarter: 'Q2 2025',
    effort: '4 semanas',
    votes: 245,
  },
  {
    id: 'advanced-search',
    title: 'Búsqueda Avanzada',
    description: 'Búsqueda global con filtros avanzados, fuzzy search y búsqueda semántica',
    status: 'planned',
    icon: FaSearch,
    category: 'UX',
    priority: 'high',
    quarter: 'Q2 2025',
    effort: '2 semanas',
    votes: 189,
  },
  {
    id: 'export-data',
    title: 'Exportar Datos',
    description: 'Exportar históricos a CSV, Excel, PDF con gráficos personalizados',
    status: 'planned',
    icon: FaFileExport,
    category: 'Features',
    priority: 'medium',
    quarter: 'Q2 2025',
    effort: '2 semanas',
    votes: 156,
  },
  {
    id: 'interactive-charts',
    title: 'Gráficos Interactivos Mejorados',
    description: 'Charts con zoom, pan, anotaciones y comparación de múltiples indicadores',
    status: 'planned',
    icon: FaChartBar,
    category: 'Features',
    priority: 'medium',
    quarter: 'Q2 2025',
    effort: '3 semanas',
    votes: 142,
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
    quarter: 'Q2 2025',
    effort: '6 semanas',
    votes: 223,
  },

  // ========== PLANNED - FUTURO (6+ meses) ==========
  {
    id: 'multi-language',
    title: 'Multiidioma',
    description: 'Soporte para inglés y portugués además de español',
    status: 'planned',
    icon: FaGlobe,
    category: 'Platform',
    priority: 'medium',
    quarter: 'Q3 2025',
    effort: '3 semanas',
    votes: 134,
  },
  {
    id: 'community',
    title: 'Comunidad y Foros',
    description: 'Migración a Discourse para foros avanzados y comunidad escalable',
    status: 'planned',
    icon: FaComments,
    category: 'Social',
    priority: 'low',
    quarter: 'Q3 2025',
    effort: '4 semanas',
    votes: 98,
  },
  {
    id: 'social-features',
    title: 'Features Sociales',
    description: 'Compartir portfolios, seguir a otros usuarios, rankings públicos',
    status: 'planned',
    icon: FaUsers,
    category: 'Social',
    priority: 'low',
    quarter: 'Q4 2025',
    effort: '3 semanas',
    votes: 87,
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
