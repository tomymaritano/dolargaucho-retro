# 🎯 Sistema de Roadmap - Quick Reference

**Sistema completo para gestionar el roadmap Q1-Q2 2025 con GitHub Projects**

---

## ⚡ Comandos Rápidos

```bash
# Ver progreso del roadmap
node scripts/roadmap-progress.js

# Generar issues en GitHub (dry run primero)
node scripts/generate-roadmap-issues.js --dry-run
node scripts/generate-roadmap-issues.js

# Ver issues del roadmap
gh issue list --label "roadmap"

# Ver issues en progreso
gh issue list --label "in-progress"
```

---

## 📚 Documentación

| Documento                                                        | Descripción                                  |
| ---------------------------------------------------------------- | -------------------------------------------- |
| [GITHUB_PROJECTS_SETUP.md](./GITHUB_PROJECTS_SETUP.md)           | Guía completa de configuración (600+ líneas) |
| [ROADMAP_GITHUB_INTEGRATION.md](./ROADMAP_GITHUB_INTEGRATION.md) | Quick start y workflows                      |
| [ROADMAP_Q1_Q2_2025.md](./ROADMAP_Q1_Q2_2025.md)                 | Roadmap detallado con fechas y métricas      |

---

## 🗂️ Archivos Clave

```
.github/
├── ISSUE_TEMPLATE/
│   └── roadmap-feature.md           # Template para issues
└── workflows/
    ├── sync-roadmap.yml             # Auto-sync cuando cambias roadmap.ts
    └── roadmap-weekly-digest.yml    # Reporte semanal (lunes 9AM)

scripts/
├── generate-roadmap-issues.js       # Genera issues desde roadmap.ts
└── roadmap-progress.js              # Reporte visual de progreso

constants/
└── roadmap.ts                       # ⭐ SOURCE OF TRUTH
```

---

## 🚀 Setup en 4 Pasos

### 1. Generar Issues

```bash
# Ver qué se va a crear
node scripts/generate-roadmap-issues.js --dry-run

# Crear issues reales (8 features principales)
node scripts/generate-roadmap-issues.js
```

### 2. Crear Project en GitHub

1. https://github.com/tomymaritano/dolargaucho-retro/projects
2. New Project → Board
3. Nombre: "Roadmap Q1-Q2 2025"
4. Columnas: Backlog | In Progress | In Review | Done

### 3. Agregar Issues al Project

Opción A - Automático:

```bash
# Los issues con label "roadmap" se agregan automáticamente
```

Opción B - Manual:

```bash
# Arrastra issues desde la UI de GitHub
```

### 4. Configurar Automation

En Project Settings → Workflows:

- ✅ Auto-close issues when moved to "Done"
- ✅ Auto-move to "Done" when issue closes
- ✅ Auto-assign quarter field basado en labels

---

## 📊 Features Trackeadas

### Q1 2025 (5 features)

1. **Discord Server** (1-2 semanas, High priority)
2. **Email Service** (1 semana, High priority)
3. **Alertas Backend** (2 semanas, High priority)
4. **Testing Suite 60%** (3 semanas, High priority)
5. **Security Improvements** (2 semanas, High priority)

### Q2 2025 (3 features principales)

6. **AI Insights** (4 semanas, High priority)
7. **Búsqueda Avanzada** (2 semanas, High priority)
8. **Wallet Integration** (6 semanas, High priority)

**Total**: 18 features (5 completed, 3 in-progress, 10 planned)

---

## 🤖 Automatizaciones

### Reporte Semanal Automático

Cada lunes a las 9 AM:

- 📊 Genera progress report
- 🟠 Lista issues en progreso
- 🔴 Alerta sobre issues bloqueados
- 🟡 Muestra próximos issues

Ejecutar manualmente:

```bash
gh workflow run roadmap-weekly-digest.yml
```

### Sync Automático

Cuando actualizas `constants/roadmap.ts`:

- ✅ GitHub Action detecta cambios
- ✅ Notifica en el commit
- ✅ Sugiere actualizar issues

---

## 🏷️ Labels

| Label           | Uso                            |
| --------------- | ------------------------------ |
| `roadmap`       | Todas las features del roadmap |
| `priority-high` | Crítico - hacer primero        |
| `Q1-2025`       | Target Q1 (Enero-Marzo)        |
| `Q2-2025`       | Target Q2 (Abril-Junio)        |
| `in-progress`   | Desarrollo activo              |
| `blocked`       | Bloqueado por dependencias     |

Crear labels automáticamente:

```bash
# TODO: Implementar script
node scripts/setup-github-labels.js
```

---

## 💡 Workflow Típico

### Developer: Comenzar una Feature

```bash
# 1. Asignar issue
gh issue edit 150 --add-assignee @me

# 2. Crear branch
git checkout -b feature/roadmap-150-discord-server

# 3. Desarrollar con commits linkeados
git commit -m "feat: setup Discord server (#150)"

# 4. Abrir PR
gh pr create --title "feat: Discord Server" --body "Closes #150"
```

### PM: Review Semanal

```bash
# Ver progreso general
node scripts/roadmap-progress.js

# Ver issues bloqueados
gh issue list --label "blocked"

# Ver velocity (TODO: implementar)
node scripts/calculate-velocity.js
```

---

## 🎯 Métricas de Éxito

### Q1 2025 Targets

| Métrica              | Target |
| -------------------- | ------ |
| Features completadas | 10/18  |
| Test coverage        | 60%+   |
| Lighthouse score     | 90+    |
| Discord members      | 100+   |
| Alertas creadas      | 500+   |

### Q2 2025 Targets

| Métrica               | Target |
| --------------------- | ------ |
| Features completadas  | 18/18  |
| AI Insights usage     | 30%+   |
| Búsquedas diarias     | 500+   |
| Billeteras conectadas | 200+   |

---

## 🔗 Enlaces Rápidos

- **Roadmap Visual**: `/roadmap` en la app
- **GitHub Project**: https://github.com/tomymaritano/dolargaucho-retro/projects
- **Issues**: https://github.com/tomymaritano/dolargaucho-retro/issues?q=label:roadmap
- **Source of Truth**: [constants/roadmap.ts](/constants/roadmap.ts)

---

## 🆘 Ayuda

### Ver todos los comandos disponibles

```bash
# GitHub CLI
gh issue --help
gh pr --help
gh workflow --help

# Scripts custom
node scripts/generate-roadmap-issues.js --help
node scripts/roadmap-progress.js --help
```

### Problemas comunes

**"GitHub CLI not found"**

```bash
brew install gh
gh auth login
```

**"Permission denied"**

```bash
gh auth status
# Verifica que tienes permisos de write
```

**"Issues no se crean"**

```bash
# Verifica que estás autenticado
gh auth status

# Prueba crear un issue manualmente
gh issue create --title "Test" --body "Testing"
```

---

## 📝 Próximos Pasos

1. ✅ Sistema de GitHub Projects configurado
2. ⏳ Ejecutar `generate-roadmap-issues.js` para crear 8 issues
3. ⏳ Crear GitHub Project "Roadmap Q1-Q2 2025"
4. ⏳ Configurar automation rules
5. ⏳ Comenzar primer sprint (Discord + Email Service)

---

**Mantenido por**: Product Team
**Última actualización**: Octubre 20, 2025
**Versión**: 1.0.0
