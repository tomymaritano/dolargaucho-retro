# Documentación - Dólar Gaucho

Índice central de toda la documentación del proyecto.

## 🚀 Inicio Rápido

**Nuevo en el proyecto?** Empieza aquí:

1. **[FAQ.md](./FAQ.md)** - Preguntas frecuentes y guías técnicas consolidadas
2. **[Roadmap 2025](./ROADMAP_Q1_Q2_2025.md)** - Plan de desarrollo Q1-Q2 2025
3. **Setup de .env.local** - Ver comentarios en `.env.local` para configuración

## 📁 Estructura de Documentación

### Auditorías y Análisis (2025)

Documentos de revisión y mejoras realizadas en 2025:

- **[AUDIT_ARCHITECTURE_2025.md](./AUDIT_ARCHITECTURE_2025.md)** - Auditoría de arquitectura técnica
- **[AUDIT_UX_2025.md](./AUDIT_UX_2025.md)** - Auditoría de experiencia de usuario
- **[DASHBOARD_ANALYSIS_2025.md](./DASHBOARD_ANALYSIS_2025.md)** - Análisis del dashboard
- **[DESIGN_SYSTEM_2025.md](./DESIGN_SYSTEM_2025.md)** - Sistema de diseño y componentes
- **[UX_PATTERNS_2025.md](./UX_PATTERNS_2025.md)** - Patrones de UX implementados

### Guías de Setup

Configuración de features y servicios:

- **[FAQ.md](./FAQ.md)** - ⭐ **RECOMENDADO** - Guía consolidada para desarrolladores
- **[CUSTOM_AUTH_DEPLOYMENT.md](./CUSTOM_AUTH_DEPLOYMENT.md)** - Deployment de autenticación custom
- **[PWA_SETUP.md](./PWA_SETUP.md)** - Configuración de Progressive Web App

### Guides Técnicas

Implementación de features específicas:

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guía de migraciones
- **[STATE_MANAGEMENT_GUIDE.md](./STATE_MANAGEMENT_GUIDE.md)** - Manejo de estado en la app
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing y QA
- **[TESTING_SETUP.md](./TESTING_SETUP.md)** - Setup de ambiente de testing

### Diseño y UI/UX

- **[DESIGN_SYSTEM_2025.md](./DESIGN_SYSTEM_2025.md)** - Sistema de diseño completo
- **[FINTECH_UI_GUIDE.md](./FINTECH_UI_GUIDE.md)** - Guía de UI estilo fintech
- **[BINGX_COLOR_SYSTEM.md](./BINGX_COLOR_SYSTEM.md)** - Sistema de colores
- **[CHART_DESIGN_SYSTEM.md](./CHART_DESIGN_SYSTEM.md)** - Diseño de gráficos
- **[COLOR_MIGRATION_COMPLETE.md](./COLOR_MIGRATION_COMPLETE.md)** - Migración de colores

### Arquitectura

- **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** - Diagramas de arquitectura
- **[COMPONENT_AUDIT.md](./COMPONENT_AUDIT.md)** - Auditoría de componentes
- **[COMPONENTES_AUDITORIA.md](./COMPONENTES_AUDITORIA.md)** - Auditoría de componentes (ES)
- **[DASHBOARD_REFACTOR.md](./DASHBOARD_REFACTOR.md)** - Refactor del dashboard

### Features y Fixes

- **[FEATURE_CALCULADORA_ACTIVOS.md](./FEATURE_CALCULADORA_ACTIVOS.md)** - Calculadora de activos
- **[CALCULADORA_USD_FIX.md](./CALCULADORA_USD_FIX.md)** - Fix de calculadora USD

### Transformaciones y Resúmenes

- **[FINTECH_TRANSFORMATION_SUMMARY.md](./FINTECH_TRANSFORMATION_SUMMARY.md)** - Resumen de transformación fintech

### Otros

- **[FORUM_OPTIONS.md](./FORUM_OPTIONS.md)** - Opciones de foro/comunidad
- **[GITHUB_PROJECTS_SETUP.md](./GITHUB_PROJECTS_SETUP.md)** - Setup de GitHub Projects

## 📋 Docs Deprecados

Los siguientes documentos están **deprecados** y serán movidos a `archive/`:

### Sobre Supabase (Ya no usamos Supabase)

- ~~AUTH_SETUP.md~~ → Sistema custom con Neon Postgres (ver FAQ.md)
- ~~AUTH_MODO_DEMO.md~~ → Ya no existe modo demo
- ~~QUICK_START_AUTH.md~~ → Ver FAQ.md sección "Autenticación"

### Información Desactualizada

- ~~FRED_API_SETUP.md~~ → Ver FAQ.md sección "APIs Externas"

**Nota:** Para información actualizada sobre autenticación, base de datos, y setup general, consultar **[FAQ.md](./FAQ.md)**.

## 🗺️ Roadmap

Consulta el plan de desarrollo:

- **[ROADMAP_Q1_Q2_2025.md](./ROADMAP_Q1_Q2_2025.md)** - Roadmap oficial Q1-Q2 2025
- **Roadmap público**: https://dolargaucho.com/roadmap

## 🏗️ Arquitectura Actual (Resumen)

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js 15)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pages   │  │Components│  │  Hooks   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│         API Routes (Next.js API)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │  Leads   │  │  Stats   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│     Database (Neon Postgres)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │  Prefs   │  │ Alerts   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘

Autenticación: Custom JWT + HTTP-only Cookies
Base de datos: Neon Postgres (serverless)
Cliente DB: @vercel/postgres
Deployment: Vercel
```

## 📚 Stack Tecnológico

### Core

- **Framework**: Next.js 15 (App Router + Pages Router híbrido)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion

### Backend

- **Database**: Neon Postgres (Serverless PostgreSQL)
- **ORM/Query**: @vercel/postgres (SQL template literals)
- **Auth**: Custom JWT + bcrypt
- **Session**: HTTP-only cookies

### External APIs

- **DolarAPI** - Cotizaciones ARG (gratis, sin key)
- **FRED API** - Datos económicos USA (gratis, requiere key)
- **ECB API** - Tipos de cambio EUR (gratis, sin key)
- **CoinGecko** - Precios crypto (gratis, sin key)

### Dev Tools

- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Version Control**: Git + GitHub

## 🎯 Convenciones

### Nombres de Archivos

```
components/
  ├── ui/                  # Componentes reutilizables
  │   └── Button/
  │       ├── Button.tsx   # Componente principal
  │       └── index.ts     # Export limpio
  ├── layouts/             # Layouts (Dashboard, Auth)
  ├── charts/              # Gráficos (Lightweight Charts)
  ├── tables/              # Tablas de datos
  └── marketing/           # Landing page sections

pages/
  ├── index.tsx            # Landing page
  ├── auth.tsx             # Login/Signup unificado
  ├── roadmap.tsx          # Roadmap público
  └── dashboard/           # App protegida
      ├── index.tsx        # Dashboard principal
      └── [feature].tsx    # Features del dashboard

hooks/
  └── use[Feature].ts      # Custom hooks (camelCase)

lib/
  ├── contexts/            # React Contexts
  ├── db/                  # Database queries
  └── utils/               # Utilidades
```

### Commits

```bash
feat: add nickname field to user signup
fix: prevent page refresh on input change
docs: update FAQ with Neon Postgres setup
refactor: extract NavbarSearch to separate component
perf: optimize CommunityThanks rendering
style: apply consistent spacing in dashboard
test: add tests for auth context
chore: remove obsolete navbar components
```

## 🤝 Contribuir

### Antes de commitear

```bash
# 1. Linter
npm run lint

# 2. Build local
npm run build

# 3. Tests (si existen)
npm test
```

### Crear nueva feature

```bash
# 1. Branch desde main
git checkout main
git pull origin main
git checkout -b feat/mi-nueva-feature

# 2. Desarrollar + commits frecuentes
git add .
git commit -m "feat: implement feature X"

# 3. Push y crear PR
git push origin feat/mi-nueva-feature
```

### Documentar cambios importantes

Si tu feature incluye:

- Nueva API externa → Actualizar FAQ.md sección "APIs Externas"
- Cambio en DB → Crear migración en `migrations/`
- Nueva página → Agregar a NavbarSearch.tsx
- Breaking change → Actualizar este README

## 📞 Soporte

**¿Encontraste un bug?** [Crear issue en GitHub](https://github.com/tu-usuario/dolargaucho-retro/issues)

**¿Tienes una pregunta?** Consulta [FAQ.md](./FAQ.md)

**¿Quieres sugerir una feature?** Ve al [Roadmap público](https://dolargaucho.com/roadmap)

**Contacto directo:** tomymaritano@gmail.com

---

**Última actualización:** 20 de octubre, 2025
**Versión de docs:** 2.0 (Post-migración a Neon Postgres + Custom Auth)
