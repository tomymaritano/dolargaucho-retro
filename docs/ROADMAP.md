# 🗺️ Roadmap - Dólar Gaucho

**Última actualización:** 2025-10-08
**Versión actual:** 1.0.0

---

## 📊 Estado Actual

### ✅ Completado (v1.0.0)

- ✅ Dashboard profesional con datos en tiempo real
- ✅ 8 páginas funcionales (Dashboard, Favoritos, Análisis, Política, Finanzas, Calculadoras, Alertas, Calendario)
- ✅ Integración con APIs (DolarAPI + ArgentinaData)
- ✅ 21 endpoints validados y funcionando
- ✅ 3 Calculadoras financieras (Plazo Fijo, Inflación, Crédito UVA)
- ✅ Sistema de alertas (estructura base)
- ✅ Calendario de feriados y eventos
- ✅ Navbar profesional con sidebar
- ✅ Tests unitarios (32 tests, 9 suites)
- ✅ CI/CD Pipeline con GitHub Actions
- ✅ Pre-commit hooks (Husky + Lint-staged)
- ✅ ESLint + Prettier configurados
- ✅ TypeScript strict mode

---

## 🎯 Roadmap por Fases

---

## 📅 FASE 1 - Q1 2025 (CORTO PLAZO - 1-3 meses)

### 🔴 **Prioridad ALTA**

#### 1.1 Comunidad y Engagement

- [ ] **Implementar Discord Server** (1-2 semanas)
  - Crear servidor Discord oficial
  - Configurar canales (general, dolar, politica, finanzas, ayuda)
  - Bot básico de moderación
  - Agregar link en navbar
  - **Objetivo:** Validar demanda de comunidad
  - **Métrica:** 500+ usuarios activos en 3 meses

#### 1.2 Autenticación y Usuarios

- [ ] **Completar Auth con Supabase** (2-3 semanas)
  - Fix error de tipos en `auth-context.tsx`
  - Implementar login/signup flow completo
  - Perfil de usuario básico
  - Persistencia de preferencias
  - **Dependencia:** Bloquea sistema de alertas personalizado

#### 1.3 Sistema de Alertas

- [ ] **Alertas Funcionales** (2 semanas)
  - Backend: Guardar alertas en Supabase
  - Notificaciones por email (SendGrid/Resend)
  - Notificaciones web push (opcional)
  - Dashboard de alertas activas
  - **Requiere:** Auth completado

#### 1.4 Calidad y Estabilidad

- [ ] **Error Boundaries Globales** (1 semana)
  - Error boundary en layout principal
  - Página de error custom
  - Logging de errores (Sentry opcional)

- [ ] **Accessibility Básico** (1 semana)
  - ARIA labels en componentes interactivos
  - Keyboard navigation
  - Focus management
  - Contrast ratio check

### 🟡 **Prioridad MEDIA**

#### 1.5 Features Adicionales

- [ ] **Más Calculadoras** (2 semanas)
  - Calculadora de inversión
  - Calculadora de devaluación
  - Calculadora de rendimiento cripto (opcional)

- [ ] **Favoritos Funcionales** (1 semana)
  - Persistir favoritos en localStorage primero
  - Migrar a Supabase cuando Auth esté listo
  - UI para gestionar favoritos

#### 1.6 Performance

- [ ] **Performance Audit** (1 semana)
  - Lighthouse score > 90
  - Lazy loading de componentes pesados
  - Image optimization
  - Bundle size analysis
  - Code splitting estratégico

---

## 📅 FASE 2 - Q2 2025 (MEDIANO PLAZO - 3-6 meses)

### 🔴 **Prioridad ALTA**

#### 2.1 Comunidad Avanzada

- [ ] **Migrar a Discourse** (si Discord tiene >500 usuarios activos)
  - Setup en DigitalOcean ($20/mes)
  - SSO desde app Next.js
  - Categorías por tema
  - Moderación automática
  - **Costo estimado:** $20-50/mes

#### 2.2 Análisis Avanzado

- [ ] **Gráficos Interactivos Mejorados**
  - Zoom en charts
  - Comparar múltiples cotizaciones
  - Exportar datos a CSV/Excel
  - Indicadores técnicos básicos (SMA, EMA)

- [ ] **Predicciones y Tendencias** (experimental)
  - Modelo básico de predicción (regresión lineal)
  - Alertas de tendencias
  - Disclaimer claro sobre limitaciones

#### 2.3 Política - Features Avanzadas

- [ ] **Sesiones en Vivo**
  - Stream de sesiones del Congreso
  - Resúmenes con IA (OpenAI API)
  - Votaciones en tiempo real

- [ ] **Perfiles de Legisladores**
  - Historial de votos
  - Proyectos presentados
  - Estadísticas de asistencia

### 🟡 **Prioridad MEDIA**

#### 2.4 Monetización (Opcional)

- [ ] **Plan Premium** (si hay >5000 usuarios activos)
  - Alertas ilimitadas
  - Datos históricos extendidos
  - API access
  - Sin ads
  - **Precio sugerido:** $5-10 USD/mes

#### 2.5 Testing Expandido

- [ ] **Expandir Tests Unitarios**
  - Cobertura > 70%
  - Tests para todos los hooks críticos
  - Tests para calculadoras

- [ ] **Tests de Integración**
  - Testing Library + MSW
  - User flows completos
  - API mocking

---

## 📅 FASE 3 - Q3-Q4 2025 (LARGO PLAZO - 6-12 meses)

### 🔴 **Prioridad ALTA**

#### 3.1 Mobile App

- [ ] **React Native App** (3-4 meses)
  - Compartir lógica con web (hooks, utils)
  - Push notifications nativas
  - Widget de home screen
  - **Plataformas:** iOS + Android

#### 3.2 SEO y Contenido

- [ ] **Blog de Análisis**
  - CMS (Contentful/Sanity)
  - Artículos de análisis económico
  - SEO optimizado
  - Newsletter semanal

- [ ] **Landing Pages Específicas**
  - /dolar-hoy
  - /riesgo-pais
  - /inflacion-argentina
  - SEO targeting

### 🟡 **Prioridad MEDIA**

#### 3.3 E2E Testing

- [ ] **Playwright Tests**
  - Critical user journeys
  - Visual regression tests
  - Cross-browser testing
  - CI/CD integration

#### 3.4 Observability

- [ ] **Monitoring y Analytics**
  - Sentry para error tracking
  - Google Analytics 4
  - Posthog (analytics privado)
  - Performance monitoring (Web Vitals)

#### 3.5 Infrastructure

- [ ] **Optimizaciones Avanzadas**
  - CDN (Cloudflare)
  - Redis caching
  - GraphQL API (opcional)
  - Serverless functions

---

## 🔮 FUTURO (12+ meses)

### Ideas en Investigación

- 🤔 AI Chatbot financiero
- 🤔 Portfolio tracker
- 🤔 Integración con brokers
- 🤔 Marketplace de señales de trading
- 🤔 Educación financiera (cursos)
- 🤔 API pública para developers

---

## 📈 Métricas de Éxito

### KPIs Principales

#### Fase 1 (3 meses)

- **Usuarios:** 1,000 usuarios mensuales
- **Retention:** 30% usuarios retornan en 7 días
- **Performance:** Lighthouse > 85
- **Uptime:** 99%+

#### Fase 2 (6 meses)

- **Usuarios:** 5,000 usuarios mensuales
- **Retention:** 40% usuarios retornan en 7 días
- **Performance:** Lighthouse > 90
- **Engagement:** 20% usuarios con cuenta
- **Community:** 500+ usuarios en Discord/Discourse

#### Fase 3 (12 meses)

- **Usuarios:** 20,000 usuarios mensuales
- **Mobile:** 5,000 instalaciones app
- **Paid:** 100 usuarios premium (si implementado)
- **SEO:** Top 3 en "dolar hoy argentina"

---

## 💰 Costos Estimados

### Actual (v1.0.0)

- **Hosting:** Vercel Free Tier ($0/mes)
- **Database:** Supabase Free Tier ($0/mes)
- **APIs:** Gratis (DolarAPI + ArgentinaData)
- **Total:** $0/mes 🎉

### Fase 1 (Q1 2025)

- **Discord:** $0/mes
- **Email (SendGrid):** $0-15/mes
- **Total:** $0-15/mes

### Fase 2 (Q2 2025)

- **Discourse hosting:** $20-50/mes
- **Email:** $15-30/mes
- **Total:** $35-80/mes

### Fase 3 (Q3-Q4 2025)

- **Hosting (upgraded):** $20/mes
- **Database (upgraded):** $25/mes
- **Discourse:** $50/mes
- **Sentry:** $26/mes
- **Email:** $30/mes
- **Total:** $151/mes

**Monetización necesaria a partir de Fase 3** para sostenibilidad.

---

## 🚨 Dependencias Críticas

### Bloquean otras features:

1. **Auth completo** → Bloquea: Alertas, Favoritos persistentes, Premium
2. **Discord validado** → Bloquea: Migración a Discourse
3. **5K usuarios** → Bloquea: Plan Premium, Mobile App

---

## 🎯 Próximos Pasos Inmediatos (Esta Semana)

### Esta Semana:

- [x] Fix calculadoras onClick
- [ ] Setup Discord server
- [ ] Fix Supabase auth types
- [ ] Implementar error boundaries

### Próxima Semana:

- [ ] Alertas funcionales (backend)
- [ ] Email notifications setup
- [ ] Accessibility audit básico

---

## 📝 Notas

### Principios de Desarrollo:

1. **Ship fast, iterate faster** - Lanzar features MVP y mejorar basado en feedback
2. **User-driven** - Priorizar features que usuarios piden
3. **Sustainable** - No crecer costos sin ingresos
4. **Open-source friendly** - Considerar abrir código en futuro

### Decisiones Pendientes:

- ❓ ¿Monetizar o mantener 100% gratis con ads?
- ❓ ¿Open source el proyecto?
- ❓ ¿Agregar crypto/DeFi tracking?
- ❓ ¿Partnering con brokers/bancos?

---

## 🔄 Revisión del Roadmap

Este roadmap se revisa y actualiza:

- **Mensual:** Ajustar prioridades según feedback
- **Trimestral:** Evaluar métricas y pivotar si necesario

**Última revisión:** 2025-10-08
**Próxima revisión:** 2025-11-01

---

**¿Preguntas o sugerencias?** Abrí un issue o unite al Discord 💬
