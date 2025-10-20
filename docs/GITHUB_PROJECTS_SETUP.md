# GitHub Projects Setup Guide

**Dólar Gaucho - Roadmap Tracking**

Este documento explica cómo configurar y usar GitHub Projects para trackear el roadmap Q1-Q2 2025.

---

## 📋 Tabla de Contenidos

1. [Overview](#overview)
2. [Setup Inicial](#setup-inicial)
3. [Crear Issues desde Roadmap](#crear-issues-desde-roadmap)
4. [Configurar GitHub Project](#configurar-github-project)
5. [Automatizaciones](#automatizaciones)
6. [Workflow Diario](#workflow-diario)
7. [Reportes y Métricas](#reportes-y-métricas)

---

## Overview

### ¿Qué vamos a trackear?

- **Roadmap Features**: Todas las features planificadas en `constants/roadmap.ts`
- **Bugs y Issues**: Problemas encontrados durante desarrollo
- **Technical Debt**: Refactorings y mejoras técnicas
- **Documentation**: Updates de docs y READMEs

### Estructura

```
GitHub Repository
├── Issues (todas las tareas)
│   ├── [ROADMAP] Features del roadmap oficial
│   ├── [BUG] Bugs reportados
│   ├── [TECH] Technical debt
│   └── [DOCS] Documentación
│
└── Projects
    └── Roadmap Q1-Q2 2025
        ├── Backlog (🟡 Planned)
        ├── In Progress (🟠 In Progress)
        ├── In Review (🔵 Under Review)
        └── Done (✅ Completed)
```

---

## Setup Inicial

### Paso 1: Instalar GitHub CLI

```bash
# macOS
brew install gh

# Login
gh auth login
```

### Paso 2: Configurar Labels

Crear labels estándar para organización:

```bash
# Ejecutar desde la raíz del proyecto
node scripts/setup-github-labels.js
```

O manualmente en GitHub:

| Label             | Color     | Descripción                    |
| ----------------- | --------- | ------------------------------ |
| `roadmap`         | `#0052CC` | Feature del roadmap oficial    |
| `priority-high`   | `#D73A4A` | Prioridad alta - hacer primero |
| `priority-medium` | `#FBCA04` | Prioridad media                |
| `priority-low`    | `#0E8A16` | Prioridad baja                 |
| `Q1-2025`         | `#5319E7` | Target Q1 2025                 |
| `Q2-2025`         | `#B60205` | Target Q2 2025                 |
| `blocked`         | `#D93F0B` | Bloqueado por dependencias     |
| `needs-review`    | `#1D76DB` | Necesita revisión              |

### Paso 3: Crear GitHub Project

1. Ve a: https://github.com/tomymaritano/dolargaucho-retro/projects
2. Click en **"New project"**
3. Selecciona **"Board"** template
4. Nombre: **"Roadmap Q1-Q2 2025"**
5. Description: **"Product roadmap tracking - Enero a Junio 2025"**

#### Configurar Columnas

Renombra las columnas por defecto:

- **Backlog** (🟡 Planned)
  - Description: "Features planificadas pero no iniciadas"

- **In Progress** (🟠 In Progress)
  - Description: "Features en desarrollo activo"

- **In Review** (🔵 Under Review)
  - Description: "Features completadas esperando review/testing"

- **Done** (✅ Completed)
  - Description: "Features deployed en producción"

#### Agregar Custom Fields

En Project Settings → Fields:

1. **Quarter** (Single select)
   - Options: Q1 2025, Q2 2025, Q3 2025, Q4 2025

2. **Effort** (Single select)
   - Options: 1 semana, 2 semanas, 3 semanas, 4 semanas, 6 semanas

3. **Priority** (Single select)
   - Options: High 🔴, Medium 🟡, Low 🟢

4. **Category** (Single select)
   - Options: Core, Features, Platform, UX, AI, Social, DevOps

5. **Progress** (Number, 0-100)
   - For tracking % completion

---

## Crear Issues desde Roadmap

### Opción 1: Script Automatizado (Recomendado)

```bash
# Dry run - ver qué issues se crearían
node scripts/generate-roadmap-issues.js --dry-run

# Crear issues reales
node scripts/generate-roadmap-issues.js
```

Esto crea un issue por cada feature en el roadmap con:

- ✅ Título con prefijo `[ROADMAP]`
- ✅ Descripción completa
- ✅ Tasks checklist
- ✅ Success metrics
- ✅ Dependencies
- ✅ Labels apropiados

### Opción 2: Manual

1. Ve a: https://github.com/tomymaritano/dolargaucho-retro/issues/new/choose
2. Selecciona **"Roadmap Feature"** template
3. Completa el formulario:
   - Title: `[ROADMAP] Nombre de la feature`
   - Description: Usa el template
   - Labels: `roadmap`, `priority-X`, `Q1-2025`, category
4. Click **"Submit new issue"**

---

## Configurar GitHub Project

### Agregar Issues al Project

#### Manualmente

1. Abre el Project: https://github.com/tomymaritano/dolargaucho-retro/projects/1
2. Click en **"+ Add item"**
3. Busca el issue por nombre o número
4. Arrastra a la columna apropiada (Backlog, In Progress, etc.)

#### Automáticamente con GitHub Actions

El archivo `.github/workflows/add-to-project.yml` automáticamente agrega issues con label `roadmap` al project.

```yaml
# Ya configurado en el repo
on:
  issues:
    types: [opened, labeled]
```

### Configurar Automation Rules

En Project Settings → Workflows:

#### 1. Auto-close on Done

```
When: Item moved to "Done"
Then: Close issue
```

#### 2. Auto-move on Issue Close

```
When: Issue closed
Then: Move to "Done"
```

#### 3. Auto-assign Quarter

```
When: Item added to project
If: Label contains "Q1-2025"
Then: Set Quarter field to "Q1 2025"
```

---

## Automatizaciones

### GitHub Actions

#### 1. Sync Roadmap Changes

`.github/workflows/sync-roadmap.yml` - Se ejecuta cuando cambias `constants/roadmap.ts`

```yaml
on:
  push:
    paths:
      - 'constants/roadmap.ts'
      - 'docs/ROADMAP_Q1_Q2_2025.md'
```

#### 2. Auto-label Issues

`.github/workflows/auto-label.yml` - Aplica labels basado en contenido

```yaml
# Detecta keywords y aplica labels
- "priority-high" si contiene "CRÍTICO" o "URGENT"
- "Q1-2025" si contiene "Q1 2025"
- Category labels basado en keywords
```

#### 3. Weekly Digest

`.github/workflows/weekly-digest.yml` - Reporte semanal de progreso

```yaml
# Corre cada lunes a las 9 AM
schedule:
  - cron: '0 9 * * 1'

# Genera:
- Completed issues last week
- In progress issues
- Blocked issues
- Upcoming deadlines
```

### Scripts Útiles

#### Generar Reporte de Progreso

```bash
node scripts/roadmap-progress.js
```

Output:

```
📊 Roadmap Progress Report - Q1 2025

Overall Progress: 45%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed: 5/18 features
In Progress: 3/18 features
Planned: 10/18 features

By Quarter:
  Q1 2025: 60% (3/5 completed)
  Q2 2025: 30% (2/13 in progress)

By Priority:
  High: 40% (4/10)
  Medium: 50% (3/6)
  Low: 50% (1/2)
```

#### Detectar Issues Bloqueados

```bash
node scripts/check-blockers.js
```

Identifica:

- Issues con label `blocked`
- Issues con dependencias no completadas
- Issues sin updates hace >7 días

---

## Workflow Diario

### Para Developers

#### Comenzar una Feature

1. **Mover a In Progress**
   - Arrastra el issue de "Backlog" → "In Progress"
   - O: Añade label `in-progress`

2. **Crear Branch**

   ```bash
   git checkout -b feature/roadmap-123-discord-server
   ```

3. **Linkear Commits**

   ```bash
   git commit -m "feat: setup Discord server (#123)"
   ```

4. **Actualizar Checklist**
   - En el issue, marca las tareas completadas
   - Actualiza el campo **Progress** (0-100%)

#### Completar una Feature

1. **Crear Pull Request**

   ```bash
   gh pr create --title "feat: Discord Community Server" \
                --body "Closes #123" \
                --label "roadmap"
   ```

2. **Mover a In Review**
   - Automático cuando abres el PR
   - O manualmente arrastra a "In Review"

3. **Merge PR**
   - El issue se cierra automáticamente
   - Se mueve a "Done" automáticamente

### Para Product Manager

#### Review Semanal (Lunes)

```bash
# Ver progreso general
node scripts/roadmap-progress.js

# Ver issues bloqueados
node scripts/check-blockers.js

# Ver issues sin updates
gh issue list --label "roadmap" --json updatedAt,title
```

#### Actualizar Prioridades

```bash
# Cambiar prioridad de un issue
gh issue edit 123 --remove-label "priority-medium" --add-label "priority-high"
```

#### Sync con Roadmap

Cuando actualizas `constants/roadmap.ts`:

1. GitHub Action se dispara automáticamente
2. Revisa los issues existentes
3. Crea issues nuevos si faltan
4. Actualiza labels/metadata si cambió

---

## Reportes y Métricas

### Dashboard Visual

GitHub Projects tiene dashboards built-in:

1. **Board View** - Kanban clásico
2. **Table View** - Tabla con todos los campos
3. **Roadmap View** - Timeline visual

#### Crear Vista Custom "Q1 Focus"

1. En el Project, click **"+"** junto a las vistas
2. Nombre: "Q1 Focus"
3. Group by: **Quarter**
4. Filter: `quarter:"Q1 2025" AND status:!Done`
5. Sort by: **Priority** (High → Low)

### Métricas de Éxito

#### Velocity

```bash
node scripts/calculate-velocity.js
```

Output:

```
📈 Team Velocity (last 4 weeks)

Week 1: 3 issues completed
Week 2: 5 issues completed
Week 3: 2 issues completed
Week 4: 4 issues completed

Average: 3.5 issues/week
Estimated completion: 5 weeks remaining
```

#### Burndown Chart

```bash
node scripts/burndown-chart.js --quarter Q1
```

Genera imagen `burndown-Q1.png` con:

- Total issues
- Completed over time
- Ideal pace line
- Projection

### Integración con Changelog

Cuando marcas un issue como "Done":

```bash
# Automáticamente actualiza
lib/changelog.ts

# Agrega entry:
{
  version: '1.4.0',
  features: [
    'Discord Community Server (#123)',
  ]
}
```

---

## Estructura de Labels

### Roadmap

| Label     | Uso                                    |
| --------- | -------------------------------------- |
| `roadmap` | Todas las features del roadmap oficial |
| `Q1-2025` | Features target Q1                     |
| `Q2-2025` | Features target Q2                     |

### Priority

| Label             | Uso                                  |
| ----------------- | ------------------------------------ |
| `priority-high`   | Hacer primero - bloqueador o crítico |
| `priority-medium` | Importante pero no urgente           |
| `priority-low`    | Nice to have                         |

### Status

| Label           | Uso                        |
| --------------- | -------------------------- |
| `in-progress`   | Desarrollo activo          |
| `needs-review`  | Esperando code review      |
| `blocked`       | Bloqueado por dependencias |
| `needs-testing` | Requiere QA testing        |

### Category

| Label      | Uso                             |
| ---------- | ------------------------------- |
| `core`     | Features core (auth, database)  |
| `features` | User-facing features            |
| `platform` | Infrastructure (CI/CD, hosting) |
| `ux`       | UX improvements                 |
| `ai`       | AI/ML features                  |
| `social`   | Community features              |
| `devops`   | DevOps tooling                  |

---

## Comandos Útiles

### GitHub CLI (gh)

```bash
# Ver todos los issues del roadmap
gh issue list --label "roadmap"

# Ver issues en progreso
gh issue list --label "in-progress"

# Ver issues bloqueados
gh issue list --label "blocked"

# Crear issue desde template
gh issue create --template roadmap-feature.md

# Cerrar issue
gh issue close 123

# Reabrir issue
gh issue reopen 123

# Asignar a ti mismo
gh issue edit 123 --add-assignee @me

# Ver detalles de un issue
gh issue view 123
```

### Scripts Personalizados

```bash
# Generar issues desde roadmap
node scripts/generate-roadmap-issues.js

# Ver progreso
node scripts/roadmap-progress.js

# Detectar blockers
node scripts/check-blockers.js

# Calcular velocity
node scripts/calculate-velocity.js

# Generar burndown chart
node scripts/burndown-chart.js

# Sync roadmap con project
node scripts/sync-roadmap-to-project.js
```

---

## Ejemplo Completo: Discord Feature

### 1. Crear Issue

```bash
node scripts/generate-roadmap-issues.js
# Creates: Issue #150 - [ROADMAP] Discord Server
```

### 2. Agregar al Project

```bash
gh project item-add 1 --owner tomymaritano --url https://github.com/tomymaritano/dolargaucho-retro/issues/150
```

### 3. Comenzar Trabajo

```bash
# Move to In Progress (manual en UI)
git checkout -b feature/roadmap-150-discord-server
```

### 4. Desarrollar

```bash
# Work on features...
git commit -m "feat: setup Discord server structure (#150)"
git commit -m "feat: add welcome bot (#150)"
git commit -m "feat: integrate with GitHub (#150)"

# Update checklist in issue #150
```

### 5. Pull Request

```bash
gh pr create \
  --title "feat: Discord Community Server" \
  --body "Closes #150

## Changes
- Setup Discord server with organized channels
- Created roles (Admin, Moderator, User, Beta Tester)
- Implemented welcome bot
- GitHub integration for release notifications
- API integration for /dolar commands

## Testing
- [x] Tested welcome bot
- [x] Verified GitHub integration
- [x] Tested all /dolar commands

## Screenshots
![Discord Server](https://...)
" \
  --label "roadmap" \
  --assignee @me
```

### 6. Review & Merge

- PR gets reviewed → merges
- Issue #150 closes automatically
- Moves to "Done" in Project
- Changelog updates automatically

---

## Troubleshooting

### "GitHub CLI not found"

```bash
brew install gh
gh auth login
```

### "Permission denied"

Asegúrate de tener permisos de escritura en el repo:

```bash
gh auth status
```

### "Issue template not found"

Verifica que existe:

```bash
ls .github/ISSUE_TEMPLATE/roadmap-feature.md
```

### "Project not found"

Crea el project primero en GitHub UI.

---

## Referencias

- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Roadmap Q1-Q2 2025](/docs/ROADMAP_Q1_Q2_2025.md)
- [Roadmap Constants](/constants/roadmap.ts)

---

## Próximos Pasos

1. ✅ Crear este documento
2. ⏳ Ejecutar `node scripts/generate-roadmap-issues.js --dry-run`
3. ⏳ Revisar issues generados
4. ⏳ Crear GitHub Project "Roadmap Q1-Q2 2025"
5. ⏳ Ejecutar script real para crear issues
6. ⏳ Agregar issues al project
7. ⏳ Configurar automation rules
8. ⏳ Comenzar primer sprint!

---

**Última actualización**: Octubre 20, 2025
**Mantenido por**: Product Team
