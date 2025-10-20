#!/usr/bin/env node

/**
 * Generate GitHub Issues from Roadmap
 *
 * This script reads the roadmap from constants/roadmap.ts and generates
 * GitHub issues for features that are planned or in-progress.
 *
 * Usage:
 *   node scripts/generate-roadmap-issues.js [--dry-run]
 *
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated
 *   - Run from project root
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Parse roadmap features from roadmap.ts
function parseRoadmap() {
  const roadmapPath = './constants/roadmap.ts';
  const content = fs.readFileSync(roadmapPath, 'utf-8');

  // Extract features array (simplified parsing - in production use proper TS parser)
  const featuresMatch = content.match(
    /export const ROADMAP_FEATURES: RoadmapFeature\[\] = \[([\s\S]*)\];/
  );
  if (!featuresMatch) {
    throw new Error('Could not parse ROADMAP_FEATURES');
  }

  // For this script, we'll manually define the features to create issues for
  // In production, you'd parse the TS file properly
  return [
    {
      id: 'discord-community',
      title: 'Discord Server',
      description: 'Comunidad en Discord para usuarios activos, discusiones y soporte',
      status: 'planned',
      category: 'Social',
      priority: 'high',
      quarter: 'Q1 2025',
      effort: '1-2 semanas',
      votes: 178,
      tasks: [
        'Setup Discord server con canales organizados',
        'Crear roles (Admin, Moderador, Usuario, Beta Tester)',
        'Bot de bienvenida automático',
        'Integración con GitHub (notificaciones de releases)',
        'Integración con API (comandos /dolar blue, /inflacion)',
        'Documentación de reglas y guidelines',
        'Campaña de lanzamiento (email, website, redes)',
      ],
      metrics: [
        '100 miembros en primer mes',
        '10 usuarios activos diarios',
        '< 2h response time en soporte',
      ],
      dependencies: [],
    },
    {
      id: 'email-service',
      title: 'Servicio de Email',
      description:
        'Integración con Resend/SendGrid para alertas, newsletter y recuperación de contraseña',
      status: 'planned',
      category: 'Core',
      priority: 'high',
      quarter: 'Q1 2025',
      effort: '1 semana',
      votes: 156,
      tasks: [
        'Evaluar Resend vs SendGrid (costo, features)',
        'Setup cuenta y API keys',
        'Implementar templates de email (welcome, password reset, alerts, newsletter)',
        'Testing en staging',
        'Monitoreo de deliverability (open rate, bounce rate)',
      ],
      metrics: ['95%+ delivery rate', '< 5% bounce rate', '25%+ open rate'],
      dependencies: [],
    },
    {
      id: 'alerts-backend',
      title: 'Alertas Backend Funcional',
      description: 'Backend completo con Supabase y notificaciones por email',
      status: 'planned',
      category: 'Features',
      priority: 'high',
      quarter: 'Q1 2025',
      effort: '2 semanas',
      votes: 198,
      tasks: [
        'Tabla alerts en PostgreSQL',
        'CRUD API endpoints',
        'Cron job para verificar alertas cada 30 segundos',
        'Lógica de trigger (mayor, menor, igual)',
        'Integración con email service',
        'Rate limiting (max 10 alertas por usuario)',
        'Conectar formulario frontend con backend',
        'Actualizar en tiempo real cuando se dispara',
      ],
      metrics: [
        '< 60s latencia en trigger',
        '99% accuracy en condiciones',
        '20% de usuarios crean al menos 1 alerta',
      ],
      dependencies: ['email-service'],
    },
    {
      id: 'testing-suite',
      title: 'Testing Suite (60% Coverage)',
      description: 'Tests unitarios, integración y E2E con Jest, Testing Library y Playwright',
      status: 'planned',
      category: 'DevOps',
      priority: 'high',
      quarter: 'Q1 2025',
      effort: '3 semanas',
      votes: 134,
      tasks: [
        'Unit tests para hooks (useDolarQuery, useCryptoQuery, etc.) - Target: 80% coverage',
        'Integration tests para auth flow (login, signup, forgot password, reset)',
        'API tests para endpoints /api/auth/*',
        'Setup CI/CD pipeline con GitHub Actions',
        'Coverage reporting con Codecov',
        'Pre-commit hooks con Husky',
      ],
      metrics: [
        '60%+ coverage general',
        '80%+ coverage en hooks',
        '90%+ coverage en auth',
        '0 failing tests en CI',
      ],
      dependencies: [],
    },
    {
      id: 'security-improvements',
      title: 'Mejoras de Seguridad',
      description: 'Refresh tokens, CSP headers, rate limiting global y auditoría de seguridad',
      status: 'planned',
      category: 'Core',
      priority: 'high',
      quarter: 'Q1 2025',
      effort: '2 semanas',
      votes: 165,
      tasks: [
        'Refresh Tokens (access: 15min, refresh: 7 días)',
        'Content Security Policy headers',
        'Rate Limiting Global (100 req/15min por IP)',
        'Audit de Dependencias (npm audit fix)',
        'Dependabot configurado',
      ],
      metrics: [
        '0 vulnerabilidades críticas',
        '0 ataques de fuerza bruta exitosos',
        'A+ en SecurityHeaders.com',
      ],
      dependencies: [],
    },
    {
      id: 'ai-insights',
      title: 'Insights con IA',
      description: 'Análisis predictivo y recomendaciones personalizadas usando OpenAI GPT-4',
      status: 'planned',
      category: 'AI',
      priority: 'high',
      quarter: 'Q2 2025',
      effort: '4 semanas',
      votes: 245,
      tasks: [
        'Scraping de noticias económicas',
        'Correlación noticias → cotizaciones con GPT-4',
        'Sentiment analysis',
        'Modelo ML para tendencias (ARIMA)',
        'Recomendaciones personalizadas',
        'Sistema de prompts con templates',
        'Cache de responses (Upstash Redis)',
        'Rate limiting (10 requests/hora por usuario)',
      ],
      metrics: [
        '30% de usuarios usan insights en primer mes',
        '15% engagement rate',
        '< 2s response time',
        '< $50/mes en costos de OpenAI',
      ],
      dependencies: ['email-service', 'auth-system'],
    },
    {
      id: 'advanced-search',
      title: 'Búsqueda Avanzada',
      description: 'Búsqueda global con filtros avanzados, fuzzy search y búsqueda semántica',
      status: 'planned',
      category: 'UX',
      priority: 'high',
      quarter: 'Q2 2025',
      effort: '2 semanas',
      votes: 189,
      tasks: [
        'Implementar Fuse.js para fuzzy search',
        'UI de búsqueda mejorada (dropdown con categorías)',
        'Keyboard shortcuts (Cmd+K)',
        'Búsqueda en tiempo real (debounced)',
        'Highlighting de resultados',
        'Analytics de búsquedas populares',
      ],
      metrics: ['50% de usuarios usan búsqueda', '< 100ms query time', '90%+ búsquedas exitosas'],
      dependencies: [],
    },
    {
      id: 'wallet-integration',
      title: 'Integración con Billeteras',
      description:
        'Conectar Mercado Pago, Ualá, MetaMask para mostrar saldos reales y hacer simulaciones',
      status: 'planned',
      category: 'Features',
      priority: 'high',
      quarter: 'Q2 2025',
      effort: '6 semanas',
      votes: 223,
      tasks: [
        'Research y partnerships (Mercado Pago, Ualá, Brubank)',
        'Legal review de términos de uso',
        'OAuth flows para cada billetera',
        'Endpoints de sincronización',
        'Encrypted storage de tokens',
        'Dashboard widgets',
        'Security audit',
      ],
      metrics: [
        '20% usuarios conectan al menos 1 billetera',
        '0 incidentes de seguridad',
        '5 estrellas en reviews',
      ],
      dependencies: ['auth-system', 'email-service'],
    },
  ];
}

function generateIssueBody(feature) {
  const statusEmoji = {
    completed: '✅',
    'in-progress': '🟠',
    planned: '🟡',
  };

  const dependenciesText = feature.dependencies.length
    ? feature.dependencies.map((dep) => `- #roadmap-${dep}`).join('\n')
    : '- No dependencies';

  return `## 📋 Feature Description

${feature.description}

**Category**: ${feature.category}
**Votes**: ${feature.votes} 👍

## 🎯 Objectives

Implementar ${feature.title} para mejorar la experiencia del usuario y cumplir con el roadmap Q1-Q2 2025.

## 📊 Success Metrics

${feature.metrics.map((m) => `- [ ] ${m}`).join('\n')}

## 🛠️ Technical Tasks

${feature.tasks.map((t) => `- [ ] ${t}`).join('\n')}

## 🔗 Dependencies

${dependenciesText}

## 📅 Timeline

- **Quarter**: ${feature.quarter}
- **Effort Estimate**: ${feature.effort}
- **Priority**: ${feature.priority}
- **Start Date**: TBD
- **Target Date**: TBD

## 📚 Resources

- [Roadmap Q1-Q2 2025](/docs/ROADMAP_Q1_Q2_2025.md)
- [Roadmap Constants](/constants/roadmap.ts)

## 💬 Notes

Esta feature es parte del roadmap oficial Q1-Q2 2025.

---

**Status**: ${statusEmoji[feature.status]} ${feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
**Related to**: Roadmap Q1-Q2 2025
`;
}

function createIssue(feature, dryRun = false) {
  const title = `[ROADMAP] ${feature.title}`;
  const body = generateIssueBody(feature);
  const labels = [
    'roadmap',
    'enhancement',
    feature.category.toLowerCase(),
    `priority-${feature.priority}`,
  ];

  if (dryRun) {
    console.log('\n' + '='.repeat(80));
    console.log(`Would create issue: ${title}`);
    console.log('Labels:', labels.join(', '));
    console.log('='.repeat(80));
    console.log(body);
    console.log('='.repeat(80));
    return;
  }

  try {
    // Create issue using GitHub CLI
    const labelsArg = labels.map((l) => `--label "${l}"`).join(' ');
    const command = `gh issue create --title "${title}" --body "${body.replace(/"/g, '\\"')}" ${labelsArg}`;

    const output = execSync(command, { encoding: 'utf-8' });
    console.log(`✅ Created: ${title}`);
    console.log(output);
  } catch (error) {
    console.error(`❌ Failed to create issue: ${title}`);
    console.error(error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  if (dryRun) {
    console.log('🏃 Running in DRY RUN mode - no issues will be created\n');
  } else {
    console.log('🚀 Creating roadmap issues on GitHub...\n');
  }

  try {
    const features = parseRoadmap();

    // Filter only planned and in-progress features
    const featuresToCreate = features.filter(
      (f) => f.status === 'planned' || f.status === 'in-progress'
    );

    console.log(`Found ${featuresToCreate.length} features to create issues for:\n`);

    featuresToCreate.forEach((feature) => {
      createIssue(feature, dryRun);
    });

    console.log('\n✅ Done!');

    if (dryRun) {
      console.log('\nTo create issues for real, run:');
      console.log('  node scripts/generate-roadmap-issues.js');
    } else {
      console.log('\nNext steps:');
      console.log(
        '1. Review created issues at: https://github.com/tomymaritano/dolargaucho-retro/issues'
      );
      console.log('2. Create GitHub Project and add issues to it');
      console.log('3. Configure automation rules');
      console.log('4. See docs/GITHUB_PROJECTS_SETUP.md for details');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
