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
    progress: 65,
  },
  {
    id: 'api-public',
    title: 'API Pública',
    description: 'REST API con autenticación para desarrolladores externos',
    status: 'in-progress',
    icon: FaCode,
    category: 'Platform',
    progress: 40,
  },
  {
    id: 'auth-system',
    title: 'Sistema de Autenticación',
    description: 'Login, registro, y perfiles de usuario con preferencias personalizadas',
    status: 'in-progress',
    icon: FaLock,
    category: 'Core',
    progress: 80,
  },

  // ========== PLANNED ==========
  {
    id: 'ai-insights',
    title: 'Insights con IA',
    description: 'Análisis predictivo y recomendaciones personalizadas usando AI/ML',
    status: 'planned',
    icon: FaRobot,
    category: 'AI',
    priority: 'high',
    votes: 245,
  },
  {
    id: 'advanced-search',
    title: 'Búsqueda Avanzada',
    description: 'Búsqueda global con filtros avanzados y búsqueda semántica',
    status: 'planned',
    icon: FaSearch,
    category: 'UX',
    priority: 'high',
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
    votes: 156,
  },
  {
    id: 'multi-language',
    title: 'Multiidioma',
    description: 'Soporte para inglés y portugués además de español',
    status: 'planned',
    icon: FaGlobe,
    category: 'Platform',
    priority: 'medium',
    votes: 134,
  },
  {
    id: 'community',
    title: 'Comunidad y Foros',
    description: 'Espacio para discutir economía, compartir análisis y hacer preguntas',
    status: 'planned',
    icon: FaComments,
    category: 'Social',
    priority: 'low',
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
];
