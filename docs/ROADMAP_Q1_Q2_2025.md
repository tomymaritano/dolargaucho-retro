# Roadmap Product Q1-Q2 2025 - Dólar Gaucho

**Período**: Enero - Junio 2025 (6 meses)
**Última actualización**: 19 de Octubre, 2025
**Versión**: 1.0.0

---

## Resumen Ejecutivo

Este documento detalla el roadmap de producto para los próximos 6 meses (Q1-Q2 2025), con fechas específicas, responsables, métricas de éxito y dependencias técnicas.

**Objetivos Principales**:

1. **Consolidar calidad** - Tests, seguridad, performance
2. **Completar features core** - Email, alertas, auth
3. **Growth features** - IA, búsqueda avanzada, exportar datos
4. **Diferenciador único** - Integración con billeteras

**Métricas Globales del Período**:

- Usuarios mensuales: 1,000 → 5,000
- Retention D7: 25% → 40%
- Test coverage: 0% → 60%
- Lighthouse score: 85 → 92
- Uptime: 99.5%+

---

## Q1 2025 (Enero - Marzo)

**Theme**: Consolidación y Calidad

### Semana 1-2: Enero 2025

#### 1. Discord Community Server

**Responsable**: Product
**Prioridad**: Alta
**Esfuerzo**: 1-2 semanas
**Estado**: 🟡 Planned

**Descripción**:
Crear servidor de Discord para comunidad activa, soporte y engagement.

**Tareas**:

- [ ] Setup Discord server con canales organizados
- [ ] Crear roles (Admin, Moderador, Usuario, Beta Tester)
- [ ] Bot de bienvenida automático
- [ ] Integración con GitHub (notificaciones de releases)
- [ ] Integración con API (comandos `/dolar blue`, `/inflacion`)
- [ ] Documentación de reglas y guidelines
- [ ] Campaña de lanzamiento (email, website, redes)

**Métricas de Éxito**:

- 100 miembros en primer mes
- 10 usuarios activos diarios
- < 2h response time en soporte

**Dependencias**: Ninguna

---

#### 2. Email Service Integration

**Responsable**: Backend
**Prioridad**: Alta (CRÍTICO)
**Esfuerzo**: 1 semana
**Estado**: 🟡 Planned

**Descripción**:
Integrar Resend o SendGrid para emails transaccionales y marketing.

**Tareas**:

- [ ] Evaluar Resend vs SendGrid (costo, features)
- [ ] Setup cuenta y API keys
- [ ] Implementar templates de email:
  - Welcome email
  - Password reset
  - Alert notification
  - Newsletter
- [ ] Testing en staging
- [ ] Monitoreo de deliverability (open rate, bounce rate)

**Métricas de Éxito**:

- 95%+ delivery rate
- < 5% bounce rate
- 25%+ open rate

**Dependencias**: Ninguna

**Bloqueadores Actuales**:

- ❌ Forgot password no funciona sin esto

---

### Semana 3-4: Enero - Febrero 2025

#### 3. Alertas Backend Funcional

**Responsable**: Backend + Frontend
**Prioridad**: Alta
**Esfuerzo**: 2 semanas
**Estado**: 🟡 Planned

**Descripción**:
Backend completo para sistema de alertas con notificaciones por email.

**Tareas Backend**:

- [ ] Tabla `alerts` en PostgreSQL
- [ ] CRUD API endpoints
- [ ] Cron job para verificar alertas cada 30 segundos
- [ ] Lógica de trigger (mayor, menor, igual)
- [ ] Integración con email service
- [ ] Rate limiting (max 10 alertas por usuario)

**Tareas Frontend**:

- [ ] Conectar formulario con backend
- [ ] Mostrar alertas desde API
- [ ] Actualizar en tiempo real cuando se dispara

**Métricas de Éxito**:

- < 60s latencia en trigger
- 99% accuracy en condiciones
- 20% de usuarios crean al menos 1 alerta

**Dependencias**:

- Email Service Integration (tarea #2)

---

### Semana 5-7: Febrero 2025

#### 4. Testing Suite (60% Coverage)

**Responsable**: QA + Developers
**Prioridad**: Alta
**Esfuerzo**: 3 semanas
**Estado**: 🟡 Planned

**Descripción**:
Implementar suite completa de tests con coverage mínimo 60%.

**Tareas**:

- [ ] **Semana 1**: Unit tests para hooks (40 hooks)
  - useDolarQuery, useCryptoQuery, useInflacion, etc.
  - Target: 80% coverage en hooks
- [ ] **Semana 2**: Integration tests para auth flow
  - Login, signup, forgot password, reset password
  - Protección de rutas con middleware
- [ ] **Semana 3**: API tests
  - Todos los endpoints `/api/auth/*`
  - Validaciones y error handling
- [ ] Setup CI/CD pipeline con GitHub Actions
- [ ] Coverage reporting con Codecov
- [ ] Pre-commit hooks con Husky

**Métricas de Éxito**:

- 60%+ coverage general
- 80%+ coverage en hooks
- 90%+ coverage en auth
- 0 failing tests en CI

**Dependencias**: Ninguna

**Nota**: Esta es la tarea más larga pero más importante del Q1.

---

#### 5. Mejoras de Seguridad

**Responsable**: Backend + DevOps
**Prioridad**: Alta
**Esfuerzo**: 2 semanas
**Estado**: 🟡 Planned

**Descripción**:
Implementar mejoras críticas de seguridad.

**Tareas**:

- [ ] **Refresh Tokens** (1 semana)
  - Access token: 15 min (en memoria)
  - Refresh token: 7 días (HTTP-only cookie)
  - Endpoint `/api/auth/refresh`
  - Rotación de refresh tokens
- [ ] **Content Security Policy** (2 días)
  - CSP headers en `next.config.js`
  - Nonce para inline scripts
  - Reportar violaciones
- [ ] **Rate Limiting Global** (2 días)
  - Middleware de rate limit en todas las APIs
  - Redis opcional para distributed rate limiting
  - 100 requests / 15 min por IP
- [ ] **Audit de Dependencias** (1 día)
  - npm audit fix
  - Actualizar dependencias críticas
  - Dependabot configurado

**Métricas de Éxito**:

- 0 vulnerabilidades críticas
- 0 ataques de fuerza bruta exitosos
- A+ en SecurityHeaders.com

**Dependencias**: Ninguna

---

### Semana 8: Marzo 2025

#### 6. Performance Optimization

**Responsable**: Frontend + DevOps
**Prioridad**: Media
**Esfuerzo**: 1 semana
**Estado**: 🟡 Planned

**Descripción**:
Optimizaciones de performance para mejorar Lighthouse score.

**Tareas**:

- [ ] Bundle analysis con `@next/bundle-analyzer`
- [ ] Implementar `next/image` en todas las imágenes
- [ ] Lazy load componentes pesados
- [ ] Implementar `next/font` para Google Fonts
- [ ] Configurar ISR (Incremental Static Regeneration)
- [ ] Service Worker con cache strategies
- [ ] Prefetch de rutas críticas

**Métricas de Éxito**:

- Lighthouse score > 90
- FCP < 1.5s
- TTI < 3s
- Bundle size < 400KB

**Dependencias**: Ninguna

---

## Q2 2025 (Abril - Junio)

**Theme**: Growth y Diferenciación

### Semana 9-12: Abril 2025

#### 7. Insights con IA

**Responsable**: Backend + AI Engineer
**Prioridad**: Alta
**Esfuerzo**: 4 semanas
**Estado**: 🟡 Planned

**Descripción**:
Análisis predictivo y recomendaciones personalizadas usando OpenAI GPT-4.

**Features**:

1. **Análisis de Noticias** (Semana 1-2)
   - Scraping de noticias económicas (La Nación, Ámbito, Clarín)
   - RSS parsing con `rss-parser`
   - Correlación noticias → cotizaciones con GPT-4
   - Sentiment analysis
   - Timeline de eventos relevantes

2. **Predicciones** (Semana 3)
   - Modelo ML simple para tendencias (ARIMA)
   - Confianza en predicción (low, medium, high)
   - Disclaimer legal
   - Solo para usuarios premium (futuro)

3. **Recomendaciones Personalizadas** (Semana 4)
   - "Basado en tu perfil, te recomendamos..."
   - Alertas sugeridas
   - Estrategias de inversión
   - Contextual a situación económica

**Tareas Técnicas**:

- [ ] Integrar OpenAI API (GPT-4)
- [ ] Sistema de prompts con templates
- [ ] Cache de responses (Upstash Redis)
- [ ] Rate limiting (10 requests / hora por usuario)
- [ ] UI para mostrar insights
- [ ] A/B testing para validar engagement

**Métricas de Éxito**:

- 30% de usuarios usan insights en primer mes
- 15% engagement rate (clicks en recomendaciones)
- < 2s response time
- < $50/mes en costos de OpenAI

**Dependencias**:

- Email Service (para notificaciones)
- Auth System completo

**Riesgos**:

- Costos de OpenAI pueden escalar rápido
- Calidad de predicciones puede ser baja

---

### Semana 13-14: Mayo 2025

#### 8. Búsqueda Avanzada

**Responsable**: Frontend
**Prioridad**: Alta
**Esfuerzo**: 2 semanas
**Estado**: 🟡 Planned

**Descripción**:
Búsqueda global con filtros avanzados y fuzzy search.

**Features**:

- Búsqueda semántica (buscar "bitcoin" encuentra "BTC", "crypto")
- Filtros por: tipo, rango de precio, variación
- Búsqueda en: dólares, monedas, cryptos, páginas, análisis
- Historial de búsquedas
- Búsquedas guardadas

**Tareas**:

- [ ] Implementar Fuse.js para fuzzy search
- [ ] UI de búsqueda mejorada (dropdown con categorías)
- [ ] Keyboard shortcuts (Cmd+K ya implementado)
- [ ] Búsqueda en tiempo real (debounced)
- [ ] Highlighting de resultados
- [ ] Analytics de búsquedas populares

**Métricas de Éxito**:

- 50% de usuarios usan búsqueda
- < 100ms query time
- 90%+ de búsquedas exitosas

**Dependencias**: Ninguna

---

#### 9. Exportar Datos (CSV/Excel/PDF)

**Responsable**: Frontend + Backend
**Prioridad**: Media
**Esfuerzo**: 2 semanas
**Estado**: 🟡 Planned

**Descripción**:
Permitir exportar históricos y análisis en múltiples formatos.

**Features**:

- Exportar a CSV (cotizaciones históricas)
- Exportar a Excel con gráficos (usando SheetJS)
- Exportar a PDF con charts (usando jsPDF + html2canvas)
- Selección de rango de fechas
- Selección de indicadores

**Tareas**:

- [ ] Backend API para históricos (si no existe)
- [ ] Implementar exporters:
  - CSV: usando `papaparse`
  - Excel: usando `xlsx` (SheetJS)
  - PDF: usando `jspdf` + `html2canvas`
- [ ] UI con modal de export options
- [ ] Preview antes de exportar
- [ ] Límite de exportaciones (10 por día para free users)

**Métricas de Éxito**:

- 10% de usuarios exportan al menos 1 vez
- < 3s export time para 1 año de datos

**Dependencias**: Ninguna

---

### Semana 15-17: Mayo - Junio 2025

#### 10. Gráficos Interactivos Mejorados

**Responsable**: Frontend
**Prioridad**: Media
**Esfuerzo**: 3 semanas
**Estado**: 🟡 Planned

**Descripción**:
Charts avanzados con zoom, pan, anotaciones y comparación.

**Features**:

- Zoom in/out con rueda del mouse
- Pan con drag
- Anotaciones de eventos (ej: "Cambio de gobierno")
- Comparación de múltiples indicadores en 1 chart
- Tooltips mejorados con más info
- Export chart como imagen

**Tareas**:

- [ ] Migrar a Recharts 2.x o considerar LightweightCharts
- [ ] Implementar zoom/pan
- [ ] Sistema de anotaciones
- [ ] Multi-series comparison
- [ ] Mobile touch gestures
- [ ] Export to PNG

**Métricas de Éxito**:

- 40% de usuarios interactúan con charts
- < 16ms frame time (60 FPS)

**Dependencias**: Ninguna

---

### Semana 18-23: Junio 2025

#### 11. Integración con Billeteras (FEATURE ÚNICA)

**Responsable**: Backend + Frontend + Partnerships
**Prioridad**: Alta (Diferenciador clave)
**Esfuerzo**: 6 semanas
**Estado**: 🟡 Planned

**Descripción**:
Conectar con billeteras fiat y crypto para mostrar saldos reales y simulaciones.

**Billeteras Fiat** (Semana 1-3):

- Mercado Pago (API oficial disponible)
- Ualá (API privada - partnership requerido)
- Brubank (API privada)
- Personal Pay (considerar)

**Billeteras Crypto** (Semana 4-6):

- MetaMask (Web3 provider)
- WalletConnect (múltiples wallets)
- Ledger (opcional)

**Features**:

1. **Ver saldos reales**:
   - Dashboard widget con saldos
   - Actualización en tiempo real
   - Conversión ARS ↔ USD ↔ Crypto

2. **Calculadoras con datos reales**:
   - "¿Qué pasaría si muevo X ARS a dólar MEP?"
   - "¿Cuánto perdí/gané con inflación?"
   - Simulaciones contextuales

3. **Notificaciones inteligentes**:
   - "Tu saldo en Mercado Pago perdió X% con inflación este mes"
   - "Momento óptimo para comprar USD según tus patrones"

**Tareas Técnicas**:

- [ ] **Semana 1-2**: Research y partnerships
  - Contactar Mercado Pago para API access
  - Evaluar viabilidad de Ualá/Brubank
  - Legal review (términos de uso de APIs)
- [ ] **Semana 3-4**: Backend integration
  - OAuth flows para cada billetera
  - Endpoints de sincronización
  - Encrypted storage de tokens
  - Rate limiting por billetera
- [ ] **Semana 5**: Frontend UI
  - Onboarding flow ("Conectar billeteras")
  - Dashboard widgets
  - Settings para manage connections
- [ ] **Semana 6**: Testing y polish
  - Security audit
  - Performance testing
  - User testing con beta testers

**Métricas de Éxito**:

- 20% de usuarios conectan al menos 1 billetera
- 0 incidentes de seguridad
- 5 estrellas en reviews de privacidad

**Dependencias**:

- Auth System completo
- Email Service (para notificaciones)

**Riesgos**:

- APIs pueden no ser públicas (Ualá, Brubank)
- Partnerships pueden tomar meses
- Seguridad es crítica (manejo de tokens)

**Plan B**:

- Si partnerships fallan, enfocarse solo en MetaMask/Web3 (más fácil)
- Agregar Mercado Pago (API pública)

---

## Calendario Visual

```
Q1 2025 (Enero - Marzo)
======================
Enero:
Week 1-2: Discord + Email Service
Week 3-4: Alertas Backend

Febrero:
Week 5-7: Testing Suite (3 semanas)
Week 8: Mejoras Seguridad (parte 1)

Marzo:
Week 9: Mejoras Seguridad (parte 2) + Performance

Q2 2025 (Abril - Junio)
========================
Abril:
Week 10-13: Insights con IA (4 semanas)

Mayo:
Week 14-15: Búsqueda Avanzada
Week 16-17: Exportar Datos + Gráficos Mejorados (inicio)

Junio:
Week 18-23: Integración Billeteras (6 semanas) + Gráficos (fin)
```

---

## Recursos Necesarios

### Team

- 1 Product Manager (full-time)
- 2 Frontend Developers (full-time)
- 1 Backend Developer (full-time)
- 1 QA Engineer (part-time, Q1)
- 1 DevOps Engineer (part-time)
- 1 AI Engineer (part-time, Q2)

### Budget Estimado

| Item                     | Q1      | Q2       | Total    |
| ------------------------ | ------- | -------- | -------- |
| Email Service (Resend)   | $20     | $50      | $70      |
| Discord Nitro (optional) | $10     | $10      | $20      |
| OpenAI API               | $0      | $200     | $200     |
| Upstash Redis            | $0      | $10      | $10      |
| Sentry Monitoring        | $26     | $26      | $52      |
| **Total**                | **$56** | **$296** | **$352** |

---

## Riesgos y Mitigaciones

### Riesgos Técnicos

**1. Testing puede tomar más tiempo**

- **Impacto**: Alto
- **Probabilidad**: Media
- **Mitigación**: Priorizar hooks y auth (coverage suficiente)

**2. OpenAI costs pueden escalar**

- **Impacto**: Alto
- **Probabilidad**: Media
- **Mitigación**:
  - Aggressive caching
  - Rate limiting estricto
  - Monitoring de costos diarios

**3. Billeteras APIs pueden no estar disponibles**

- **Impacto**: Crítico (es feature diferenciador)
- **Probabilidad**: Media
- **Mitigación**:
  - Plan B: Solo MetaMask + Mercado Pago
  - Considerar scraping como último recurso
  - Partnerships tempranos

### Riesgos de Producto

**4. Features pueden no tener adoption**

- **Impacto**: Medio
- **Probabilidad**: Media
- **Mitigación**:
  - A/B testing
  - User research antes de build
  - MVP approach

**5. Scope creep**

- **Impacto**: Alto
- **Probabilidad**: Alta
- **Mitigación**:
  - Roadmap estricto
  - Weekly reviews
  - No agregar features mid-sprint

---

## Métricas de Éxito - KPIs

### Q1 Targets

| Métrica            | Baseline | Target | Stretch |
| ------------------ | -------- | ------ | ------- |
| Usuarios mensuales | 500      | 1,000  | 2,000   |
| Retention D7       | 25%      | 30%    | 35%     |
| Test Coverage      | 0%       | 60%    | 70%     |
| Lighthouse Score   | 85       | 90     | 95      |
| Discord members    | 0        | 100    | 200     |
| Alertas creadas    | 0        | 500    | 1,000   |

### Q2 Targets

| Métrica               | Baseline | Target | Stretch |
| --------------------- | -------- | ------ | ------- |
| Usuarios mensuales    | 1,000    | 5,000  | 10,000  |
| Retention D7          | 30%      | 40%    | 45%     |
| IA Insights usage     | 0%       | 30%    | 50%     |
| Búsquedas diarias     | 100      | 500    | 1,000   |
| Billeteras conectadas | 0        | 200    | 500     |
| Exports realizados    | 0        | 100    | 300     |

---

## Próximos Pasos Inmediatos (Esta Semana)

**Week of Jan 6-12, 2025**:

1. ✅ Crear este documento de roadmap
2. ⏳ Setup Discord server
3. ⏳ Evaluar Resend vs SendGrid
4. ⏳ Comenzar primeros tests (hooks)
5. ⏳ Reunión de kick-off con team

**Owner**: Product Manager
**Deadline**: Jan 12, 2025

---

## Apéndice

### Definiciones

- **MVP**: Minimum Viable Product
- **A/B testing**: Pruebas con variantes para validar features
- **Coverage**: Porcentaje de código cubierto por tests
- **CSP**: Content Security Policy
- **ISR**: Incremental Static Regeneration

### Referencias

- [ROADMAP.md](/docs/ROADMAP.md) - Roadmap general
- [AUDIT_UX_2025.md](/docs/AUDIT_UX_2025.md) - Auditoría UX
- [AUDIT_ARCHITECTURE_2025.md](/docs/AUDIT_ARCHITECTURE_2025.md) - Auditoría técnica
- [SECURITY.md](/SECURITY.md) - Documento de seguridad

---

**Documento aprobado por**: Product Team
**Fecha de aprobación**: 19 de Octubre, 2025
**Próxima revisión**: Marzo 2025 (fin de Q1)
