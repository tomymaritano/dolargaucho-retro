# 🗺️ Roadmap + GitHub Projects Integration

Sistema completo para trackear el roadmap Q1-Q2 2025 usando GitHub Issues, Projects y Actions.

---

## 🚀 Quick Start

### 1. Generar Issues desde Roadmap

```bash
# Ver qué se va a crear (dry run)
node scripts/generate-roadmap-issues.js --dry-run

# Crear issues reales en GitHub
node scripts/generate-roadmap-issues.js
```

Esto crea **8 issues** principales:

1. `[ROADMAP] Discord Server` (Q1, 1-2 semanas)
2. `[ROADMAP] Servicio de Email` (Q1, 1 semana)
3. `[ROADMAP] Alertas Backend Funcional` (Q1, 2 semanas)
4. `[ROADMAP] Testing Suite (60% Coverage)` (Q1, 3 semanas)
5. `[ROADMAP] Mejoras de Seguridad` (Q1, 2 semanas)
6. `[ROADMAP] Insights con IA` (Q2, 4 semanas)
7. `[ROADMAP] Búsqueda Avanzada` (Q2, 2 semanas)
8. `[ROADMAP] Integración con Billeteras` (Q2, 6 semanas)

### 2. Crear GitHub Project

1. Ve a: https://github.com/tomymaritano/dolargaucho-retro/projects
2. Click **"New project"** → **"Board"**
3. Nombre: **"Roadmap Q1-Q2 2025"**
4. Configura columnas:
   - Backlog (🟡 Planned)
   - In Progress (🟠 In Progress)
   - In Review (🔵 Under Review)
   - Done (✅ Completed)

### 3. Agregar Issues al Project

Opción A - Manual:

- Arrastra issues al project desde la UI

Opción B - GitHub CLI:

```bash
gh project item-add 1 --owner tomymaritano --url <issue-url>
```

### 4. Configurar Automatizaciones

En Project Settings → Workflows, habilita:

- Auto-close issues when moved to "Done"
- Auto-move to "Done" when issue closes
- Auto-assign labels basado en Project fields

---

## 📁 Estructura de Archivos

```
.github/
├── ISSUE_TEMPLATE/
│   └── roadmap-feature.md          # Template para roadmap issues
└── workflows/
    ├── sync-roadmap.yml             # Detecta cambios en roadmap
    └── roadmap-weekly-digest.yml    # Reporte semanal automático

scripts/
├── generate-roadmap-issues.js       # Crea issues desde roadmap.ts
└── roadmap-progress.js              # Genera reporte de progreso

docs/
├── ROADMAP_Q1_Q2_2025.md           # Roadmap detallado
├── GITHUB_PROJECTS_SETUP.md        # Guía completa de setup
└── ROADMAP_GITHUB_INTEGRATION.md   # Este archivo

constants/
└── roadmap.ts                       # Source of truth del roadmap
```

---

## 🤖 Automatizaciones

### 1. Sync Roadmap Changes

**Trigger**: Push a `constants/roadmap.ts` o `docs/ROADMAP_Q1_Q2_2025.md`

**Qué hace**:

- Detecta cambios en el roadmap
- Notifica en el commit
- Sugiere actualizar issues si hay cambios

### 2. Weekly Digest

**Trigger**: Cada lunes a las 9 AM (cron: `0 9 * * 1`)

**Qué hace**:

- Genera reporte de progreso
- Lista issues en progreso
- Lista issues bloqueados
- Lista próximos issues
- Crea issue con el digest completo

Puedes ejecutarlo manualmente:

```bash
gh workflow run roadmap-weekly-digest.yml
```

---

## 📊 Reportes y Métricas

### Progreso General

```bash
node scripts/roadmap-progress.js
```

Output:

```
📊 Roadmap Progress Report - Q1-Q2 2025

Overall Progress: 28%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: 5/18 features
🟠 In Progress: 3/18 features
🟡 Planned: 10/18 features

By Quarter:
  Q1 2025: 5 features
  Q2 2025: 13 features

By Priority:
  High: 10 features
  Medium: 6 features
  Low: 2 features
```

### Ver Issues en GitHub

```bash
# Todos los issues del roadmap
gh issue list --label "roadmap"

# Solo los en progreso
gh issue list --label "in-progress"

# Solo los bloqueados
gh issue list --label "blocked"

# Por quarter
gh issue list --label "Q1-2025"
gh issue list --label "Q2-2025"
```

---

## 🏷️ Sistema de Labels

### Roadmap

- `roadmap` - Todas las features del roadmap oficial
- `Q1-2025` - Target Q1 2025 (Enero-Marzo)
- `Q2-2025` - Target Q2 2025 (Abril-Junio)

### Priority

- `priority-high` 🔴 - Crítico, hacer primero
- `priority-medium` 🟡 - Importante
- `priority-low` 🟢 - Nice to have

### Status

- `in-progress` 🟠 - Desarrollo activo
- `blocked` 🔴 - Bloqueado por dependencias
- `needs-review` 🔵 - Esperando code review
- `needs-testing` 🟣 - Requiere QA

### Categories

- `core` - Auth, database, backend
- `features` - User-facing features
- `platform` - Infrastructure, CI/CD
- `ux` - UX improvements
- `ai` - AI/ML features
- `social` - Community features
- `devops` - DevOps tooling

---

## 🔄 Workflow Típico

### Para Developers

#### 1. Seleccionar Feature

```bash
# Ver features disponibles
gh issue list --label "roadmap" --label "🟡planned"

# Asignarte un issue
gh issue edit 150 --add-assignee @me
```

#### 2. Comenzar Desarrollo

```bash
# Crear branch
git checkout -b feature/roadmap-150-discord-server

# Opcional: Mover a "In Progress" en Project
gh issue edit 150 --add-label "in-progress"
```

#### 3. Desarrollar

```bash
# Commits linkeados al issue
git commit -m "feat: setup Discord server structure (#150)"
git commit -m "feat: add welcome bot (#150)"

# Actualizar checklist en el issue manualmente en GitHub
```

#### 4. Pull Request

```bash
gh pr create \
  --title "feat: Discord Community Server" \
  --body "Closes #150" \
  --label "roadmap"
```

#### 5. Merge

- PR se mergea → Issue se cierra automáticamente
- Issue se mueve a "Done" en Project
- Changelog se actualiza (manual o automático)

### Para Product Manager

#### Review Semanal

```bash
# Ver progreso
node scripts/roadmap-progress.js

# Ver issues sin updates hace >7 días
gh issue list --label "roadmap" --json updatedAt,title,number \
  --jq '.[] | select((.updatedAt | fromdateiso8601) < (now - 604800)) | "\(.number): \(.title)"'
```

#### Actualizar Prioridades

```bash
# Subir prioridad
gh issue edit 150 --remove-label "priority-medium" --add-label "priority-high"

# Marcar como bloqueado
gh issue edit 150 --add-label "blocked"
gh issue comment 150 --body "Bloqueado por: #123 debe completarse primero"
```

---

## 📈 Métricas de Éxito

### Q1 2025 Targets

| Métrica              | Baseline | Target | Actual |
| -------------------- | -------- | ------ | ------ |
| Features completadas | 5        | 10     | TBD    |
| Test coverage        | 0%       | 60%    | TBD    |
| Lighthouse score     | 85       | 90     | TBD    |
| Discord members      | 0        | 100    | TBD    |
| Alertas creadas      | 0        | 500    | TBD    |

### Q2 2025 Targets

| Métrica               | Baseline | Target | Actual |
| --------------------- | -------- | ------ | ------ |
| Features completadas  | 10       | 18     | TBD    |
| IA Insights usage     | 0%       | 30%    | TBD    |
| Búsquedas diarias     | 100      | 500    | TBD    |
| Billeteras conectadas | 0        | 200    | TBD    |

---

## 🔗 Enlaces Útiles

- **Roadmap Completo**: [docs/ROADMAP_Q1_Q2_2025.md](/docs/ROADMAP_Q1_Q2_2025.md)
- **Setup Guide**: [docs/GITHUB_PROJECTS_SETUP.md](/docs/GITHUB_PROJECTS_SETUP.md)
- **Roadmap Source**: [constants/roadmap.ts](/constants/roadmap.ts)
- **GitHub Project**: https://github.com/tomymaritano/dolargaucho-retro/projects
- **All Issues**: https://github.com/tomymaritano/dolargaucho-retro/issues?q=label:roadmap

---

## 📝 Próximos Pasos

1. ✅ Crear documentación de integración
2. ⏳ Ejecutar `node scripts/generate-roadmap-issues.js` para crear issues
3. ⏳ Crear GitHub Project "Roadmap Q1-Q2 2025"
4. ⏳ Agregar issues al project
5. ⏳ Configurar automation rules
6. ⏳ Comenzar primer sprint!

---

## 💡 Tips

### Para mantener sincronizado

1. **Roadmap Source of Truth**: `constants/roadmap.ts`
   - Todas las features deben estar aquí primero
   - Este archivo se muestra en la página `/roadmap`

2. **GitHub Issues**: Para tracking de trabajo
   - Checklists detallados
   - Assignees, labels, milestones
   - Comments para discusión

3. **GitHub Project**: Para visualización
   - Board view para Kanban
   - Table view para reportes
   - Roadmap view para timeline

### Evitar duplicación

- Si cambias prioridad en `roadmap.ts`, actualiza el label en GitHub
- Si cambias estado en GitHub, actualiza `roadmap.ts`
- Usa el script `generate-roadmap-issues.js` para mantener sincronizado

### Comunicación

- Usa **issue comments** para updates técnicos
- Usa **PR descriptions** para contexto de cambios
- Usa **weekly digest** para reportes a stakeholders

---

**Mantenido por**: Product Team
**Última actualización**: Octubre 20, 2025
