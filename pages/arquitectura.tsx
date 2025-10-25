/**
 * Arquitectura Page - Technical Architecture & Stack Overview
 *
 * Shows the technical architecture, tech stack, diagrams, and scalability features
 * of Dólar Gaucho platform
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { GradientText } from '@/components/ui/GradientText';
import { AnimatedOrbs } from '@/components/ui/AnimatedOrbs';
import { LinkButton } from '@/components/ui/Button';
import { TechStackCard } from '@/components/architecture/TechStackCard';
import { MermaidDiagram } from '@/components/architecture/MermaidDiagram';
import { MetricsCard } from '@/components/architecture/MetricsCard';
import {
  FaReact,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaBolt,
  FaCode,
  FaLayerGroup,
  FaGithub,
  FaCog,
  FaPalette,
  FaChartBar,
  FaSync,
  FaClipboardCheck,
  FaGlobe,
} from 'react-icons/fa';

// Mermaid diagram codes
const DIAGRAMS = {
  architecture: `graph TB
    subgraph "🌐 Client - Browser"
        A[React Components]
        B[Zustand Stores]
        C[TanStack Query Cache]
        D[LocalStorage]
    end

    subgraph "⚡ Next.js 15.1.6"
        E[Pages Router]
        F[API Routes]
        G[Middleware]
    end

    subgraph "🔐 Auth Layer"
        I[JWT Verification]
        J[HTTP-only Cookies]
    end

    subgraph "🔄 Sync Engine"
        L[SyncQueue]
        M[Retry Logic]
        N[Exponential Backoff]
    end

    subgraph "💾 PostgreSQL"
        P[(Vercel Postgres)]
        Q[Users]
        R[Preferences]
    end

    subgraph "🌍 External APIs"
        T[DolarAPI]
        U[CoinGecko]
        V[FRED]
        W[ECB]
    end

    A --> E
    B --> C
    C --> F
    F --> I
    B --> L
    L --> M
    M --> N
    F --> P
    F --> T
    F --> U

    style A fill:#0047FF,color:#fff
    style B fill:#10B981,color:#fff
    style C fill:#F59E0B,color:#fff
    style P fill:#8B5CF6,color:#fff
    style L fill:#EF4444,color:#fff`,

  syncFlow: `sequenceDiagram
    participant U as User (Device A)
    participant UI as UI Component
    participant Store as Zustand Store
    participant Sync as Sync Engine
    participant API as API Route
    participant DB as PostgreSQL

    U->>UI: Clicks "Add Favorite"
    UI->>Store: toggleFavorite()
    Store->>Store: Update local state
    Store->>UI: Re-render instantly ⚡
    Store->>Sync: syncToBackend()
    Sync->>Sync: Debounce 500ms
    Sync->>API: PUT /api/auth/favorites
    API->>DB: UPDATE preferences
    DB-->>API: Success
    API-->>Sync: 200 OK
    Sync->>Store: syncStatus: 'synced'
    Note over U,DB: Cross-device sync complete!`,

  dataFlow: `graph LR
    subgraph "📡 External APIs"
        A1[DolarAPI]
        A2[CoinGecko]
        A3[FRED]
    end

    subgraph "⚡ API Proxy"
        B1[/api/proxy/dolar]
        B2[/api/crypto]
        B5[Cache 30s]
    end

    subgraph "🔄 TanStack Query"
        C1[useDolarQuery]
        C2[useCryptoQuery]
        C5[Cache 5min]
    end

    subgraph "📦 Zustand"
        D1[Favorites Store]
        D2[Alerts Store]
        D4[localStorage]
    end

    subgraph "🎨 UI"
        E1[Tables]
        E2[Charts]
    end

    A1 --> B1
    A2 --> B2
    B1 --> B5
    B5 --> C1
    C1 --> C5
    C5 --> E1
    D1 --> E1
    D1 <--> D4

    style C5 fill:#10B981,color:#fff
    style B5 fill:#F59E0B,color:#fff
    style D4 fill:#8B5CF6,color:#fff`,
};

export default function ArquitecturaPage() {
  const [activeTab, setActiveTab] = useState<'stack' | 'diagrams' | 'scalability'>('stack');

  return (
    <div className="text-foreground min-h-screen font-sans">
      <NavbarFloating />

      {/* Hero Section */}
      <section className="relative w-full bg-background text-foreground pt-32 pb-20 px-6">
        <AnimatedOrbs opacity={0.2} />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand/10 border border-brand/20"
          >
            <FaCode className="text-brand text-lg" />
            <span className="text-xs uppercase tracking-wider text-brand font-semibold">
              Technical Architecture
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight"
          >
            Arquitectura <GradientText className="font-black">Escalable y Moderna</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg sm:text-xl max-w-3xl mx-auto"
          >
            Infraestructura preparada para producción con Next.js 15, PostgreSQL, TanStack Query, y
            un sistema de sincronización custom de nivel enterprise
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <LinkButton
              variant="primary"
              size="lg"
              href="https://github.com/tomymaritano/dolargaucho-retro"
              external
            >
              <FaGithub className="text-lg" />
              Ver en GitHub
            </LinkButton>
            <LinkButton variant="outline" size="lg" href="/roadmap">
              Ver Roadmap
            </LinkButton>
          </motion.div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex items-center justify-center gap-2 bg-panel border border-white/10 rounded-xl p-2">
          {(['stack', 'diagrams', 'scalability'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-lg'
                  : 'text-secondary hover:bg-panel/10'
              }`}
            >
              {tab === 'stack' && '🛠️ Tech Stack'}
              {tab === 'diagrams' && '📊 Diagramas'}
              {tab === 'scalability' && '🚀 Escalabilidad'}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {/* Stack Tab */}
        {activeTab === 'stack' && (
          <motion.div
            key="stack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Frontend */}
            <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
              <FaReact className="text-brand" />
              Frontend Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <TechStackCard
                icon={FaReact}
                name="Next.js"
                version="15.1.6"
                description="Framework React con SSR, SSG, API Routes y Edge Functions"
                category="frontend"
                color="brand"
                link="https://nextjs.org"
              />
              <TechStackCard
                icon={FaCode}
                name="TypeScript"
                version="5"
                description="Type safety end-to-end con strict mode para prevenir bugs"
                category="frontend"
                color="brand"
              />
              <TechStackCard
                icon={FaPalette}
                name="TailwindCSS"
                version="3.4.1"
                description="Utility-first CSS framework con DaisyUI components"
                category="frontend"
                color="brand"
              />
              <TechStackCard
                icon={FaLayerGroup}
                name="Zustand"
                version="5.0.8"
                description="State management minimalista con persist middleware"
                category="frontend"
                color="brand"
              />
              <TechStackCard
                icon={FaSync}
                name="TanStack Query"
                version="5.90.2"
                description="Server state management con caching automático (SWR pattern)"
                category="frontend"
                color="brand"
              />
              <TechStackCard
                icon={FaChartBar}
                name="Lightweight Charts"
                version="5.0.9"
                description="Gráficos financieros de alto rendimiento (TradingView engine)"
                category="frontend"
                color="brand"
              />
            </div>

            {/* Backend */}
            <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
              <FaServer className="text-purple-400" />
              Backend Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <TechStackCard
                icon={FaDatabase}
                name="PostgreSQL"
                version="16"
                description="Base de datos relacional optimizada con Vercel Postgres"
                category="backend"
                color="purple-400"
              />
              <TechStackCard
                icon={FaShieldAlt}
                name="JWT Auth"
                version="6.1.0"
                description="Autenticación custom con HTTP-only cookies (jose library)"
                category="backend"
                color="purple-400"
              />
              <TechStackCard
                icon={FaBolt}
                name="Vercel Edge"
                description="Edge Functions para latencia mínima global (<50ms)"
                category="backend"
                color="purple-400"
              />
            </div>

            {/* DevOps */}
            <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
              <FaCog className="text-green-400" />
              DevOps & Quality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TechStackCard
                icon={FaGithub}
                name="GitHub Actions"
                description="CI/CD automatizado con semantic-release para versioning"
                category="devops"
                color="green-400"
              />
              <TechStackCard
                icon={FaClipboardCheck}
                name="Jest + Testing Library"
                version="30.2.0"
                description="Testing suite para unit e integration tests (en roadmap)"
                category="devops"
                color="green-400"
              />
              <TechStackCard
                icon={FaCode}
                name="ESLint + Prettier"
                description="Code quality con Husky pre-commit hooks y lint-staged"
                category="devops"
                color="green-400"
              />
            </div>
          </motion.div>
        )}

        {/* Diagrams Tab */}
        {activeTab === 'diagrams' && (
          <motion.div
            key="diagrams"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <MermaidDiagram
              title="1. Arquitectura General del Sistema"
              description="Vista completa de todos los layers: Frontend, Auth, Sync Engine, Database, y External APIs"
              code={DIAGRAMS.architecture}
              height="500px"
            />
            <MermaidDiagram
              title="2. Sync Engine Flow - Sincronización Cross-Device"
              description="Cómo funciona el Sync Engine con retry logic, debouncing y optimistic updates"
              code={DIAGRAMS.syncFlow}
              height="450px"
            />
            <MermaidDiagram
              title="3. Data Flow Architecture"
              description="Flujo de datos desde APIs externas hasta la UI con múltiples capas de caching"
              code={DIAGRAMS.dataFlow}
              height="400px"
            />
          </motion.div>
        )}

        {/* Scalability Tab */}
        {activeTab === 'scalability' && (
          <motion.div
            key="scalability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Metrics */}
            <h2 className="text-3xl font-display font-bold mb-6">Métricas de Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <MetricsCard
                icon={FaClock}
                title="First Contentful Paint"
                value="<1.2"
                unit="s"
                description="Tiempo hasta primer contenido visible"
                trend="up"
                color="brand"
              />
              <MetricsCard
                icon={FaBolt}
                title="Time to Interactive"
                value="<2.5"
                unit="s"
                description="Tiempo hasta interactividad completa"
                trend="up"
                color="success"
              />
              <MetricsCard
                icon={FaChartLine}
                title="Lighthouse Score"
                value="95+"
                description="Performance score en Lighthouse audits"
                trend="up"
                color="warning"
              />
              <MetricsCard
                icon={FaGlobe}
                title="Edge Latency"
                value="<50"
                unit="ms"
                description="Latencia global con Vercel Edge Network"
                trend="up"
                color="purple-500"
              />
            </div>

            {/* Why Scalable */}
            <h2 className="text-3xl font-display font-bold mb-6">¿Por Qué Es Escalable?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-panel border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-brand/10">
                    <FaRocket className="text-brand text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold">Edge Computing</h3>
                </div>
                <ul className="space-y-2 text-secondary">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Vercel Edge Functions distribuidas globalmente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>CDN para assets estáticos con cache infinito</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Auto-scaling según demanda sin configuración</span>
                  </li>
                </ul>
              </div>

              <div className="bg-panel border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-success/10">
                    <FaLayerGroup className="text-success text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold">Multi-Layer Caching</h3>
                </div>
                <ul className="space-y-2 text-secondary">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>TanStack Query con 5min stale time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>API cache de 30s para datos externos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>LocalStorage para datos de usuario</span>
                  </li>
                </ul>
              </div>

              <div className="bg-panel border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <FaSync className="text-purple-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Sync Engine</h3>
                </div>
                <ul className="space-y-2 text-secondary">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Debouncing (500ms) para evitar spam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Exponential backoff para retries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Optimistic UI con rollback automático</span>
                  </li>
                </ul>
              </div>

              <div className="bg-panel border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <FaDatabase className="text-orange-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold">Database Optimization</h3>
                </div>
                <ul className="space-y-2 text-secondary">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Índices en columnas críticas (user_id)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Connection pooling con pg library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>Path claro a PostgreSQL dedicado</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Architecture Principles */}
            <h2 className="text-3xl font-display font-bold mb-6">Principios de Diseño</h2>
            <div className="bg-gradient-to-br from-brand/5 to-transparent border border-brand/20 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold mb-3 text-brand">Type Safety</h4>
                  <p className="text-secondary">
                    TypeScript strict mode en frontend y backend. Zod para validación en runtime.
                    Interfaces compartidas end-to-end.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-3 text-brand">Separation of Concerns</h4>
                  <p className="text-secondary">
                    Layers bien definidos: UI → State → API → Database. Cada capa con
                    responsabilidad única y clara.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-3 text-brand">Reusability</h4>
                  <p className="text-secondary">
                    40+ custom hooks, componentes reutilizables con CVA, y utilities compartidos.
                    DRY principle aplicado religiosamente.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-3 text-brand">Security First</h4>
                  <p className="text-secondary">
                    HTTP-only cookies, JWT rotation, input validation, CORS, y CSP headers. Rate
                    limiting en roadmap.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            ¿Querés <GradientText className="font-black">contribuir</GradientText>?
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto text-base sm:text-lg">
            Dólar Gaucho es open source. Si te interesa la arquitectura o querés proponer mejoras,
            podés colaborar en GitHub o contactarnos
          </p>
          <div className="flex items-center justify-center gap-4">
            <LinkButton
              variant="primary"
              size="lg"
              href="https://github.com/tomymaritano/dolargaucho-retro"
              external
            >
              <FaGithub />
              Ver Código
            </LinkButton>
            <LinkButton variant="outline" size="lg" href="/roadmap">
              Ver Roadmap
            </LinkButton>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
