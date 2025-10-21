#!/usr/bin/env node

/**
 * Sync Changelog Script
 *
 * Convierte CHANGELOG.md (generado por semantic-release) al formato
 * TypeScript de lib/changelog.ts para el modal WhatsNew
 *
 * Flujo:
 * 1. Lee CHANGELOG.md
 * 2. Parsea cada versión y sus secciones
 * 3. Convierte a formato ChangelogEntry
 * 4. Escribe lib/changelog.ts con el formato correcto
 */

const fs = require('fs');
const path = require('path');

// Emoji mapping por tipo de cambio
const EMOJI_MAP = {
  '✨ Nuevas Funcionalidades': '✨',
  '🐛 Correcciones': '🐛',
  '⚡ Mejoras de Performance': '⚡',
  '📝 Documentación': '📝',
  '♻️ Refactorización': '♻️',
  '✅ Tests': '✅',
  '📦 Build': '📦',
  '👷 CI/CD': '👷',
  '⏪ Reversiones': '⏪',
};

// Default emoji si no se encuentra match
const DEFAULT_EMOJI = '🚀';

/**
 * Parsea CHANGELOG.md y extrae versiones
 */
function parseChangelog(changelogContent) {
  const versions = [];
  const versionRegex = /## \[(\d+\.\d+\.\d+)\]\(.*\) \(([\d-]+)\)/g;

  let match;
  const versionMatches = [];

  // Find all version headers
  while ((match = versionRegex.exec(changelogContent)) !== null) {
    versionMatches.push({
      version: match[1],
      date: match[2],
      index: match.index,
    });
  }

  // Extract content for each version
  for (let i = 0; i < versionMatches.length; i++) {
    const current = versionMatches[i];
    const next = versionMatches[i + 1];

    const contentStart = current.index;
    const contentEnd = next ? next.index : changelogContent.length;
    const versionContent = changelogContent.substring(contentStart, contentEnd);

    const entry = parseVersionContent(current.version, current.date, versionContent);
    if (entry) {
      versions.push(entry);
    }
  }

  return versions;
}

/**
 * Parsea el contenido de una versión específica
 */
function parseVersionContent(version, date, content) {
  // Extract sections
  const features = extractSection(content, '✨ Nuevas Funcionalidades');
  const improvements = extractSection(content, '⚡ Mejoras de Performance');
  const fixes = extractSection(content, '🐛 Correcciones');
  const docs = extractSection(content, '📝 Documentación');

  // Determine emoji and highlight
  let emoji = DEFAULT_EMOJI;
  const highlight = features.length > 0 || improvements.length > 0;

  // Choose emoji based on content
  if (features.length > 0) {
    emoji = '✨';
  } else if (fixes.length > 0) {
    emoji = '🐛';
  } else if (improvements.length > 0) {
    emoji = '⚡';
  }

  // Generate title from first feature or fix
  let title = `Versión ${version}`;
  if (features.length > 0) {
    title = extractTitleFromItem(features[0]);
  } else if (fixes.length > 0) {
    title = extractTitleFromItem(fixes[0]);
  }

  // Generate description
  const description = generateDescription(features, improvements, fixes, docs);

  return {
    version,
    date,
    title,
    emoji,
    highlight,
    description,
    features: features.length > 0 ? features : undefined,
    improvements: improvements.length > 0 ? improvements : undefined,
    fixes: fixes.length > 0 ? fixes : undefined,
  };
}

/**
 * Extrae items de una sección
 */
function extractSection(content, sectionTitle) {
  const sectionRegex = new RegExp(`### ${sectionTitle}\\s+([\\s\\S]*?)(?=###|$)`, 'i');
  const match = content.match(sectionRegex);

  if (!match) return [];

  const sectionContent = match[1];
  const items = sectionContent
    .split('\n')
    .filter((line) => line.trim().startsWith('*'))
    .map((line) => line.replace(/^\* /, '').trim())
    .filter(Boolean);

  return items;
}

/**
 * Extrae título de un item de changelog
 */
function extractTitleFromItem(item) {
  // Remove scope if present: "**crypto:** add sparklines" -> "Add sparklines"
  const withoutScope = item.replace(/^\*\*[^*]+\*\*:\s*/, '');

  // Capitalize first letter
  return withoutScope.charAt(0).toUpperCase() + withoutScope.slice(1);
}

/**
 * Genera descripción a partir de los cambios
 */
function generateDescription(features, improvements, fixes, docs) {
  const parts = [];

  if (features.length > 0) {
    parts.push(
      `${features.length} nueva${features.length > 1 ? 's' : ''} funcionalidad${features.length > 1 ? 'es' : ''}`
    );
  }

  if (improvements.length > 0) {
    parts.push(`${improvements.length} mejora${improvements.length > 1 ? 's' : ''}`);
  }

  if (fixes.length > 0) {
    parts.push(`${fixes.length} corrección${fixes.length > 1 ? 'es' : ''}`);
  }

  if (parts.length === 0) {
    return 'Actualización del sistema';
  }

  return 'Esta versión incluye ' + parts.join(', ') + '.';
}

/**
 * Convierte array de ChangelogEntry a string TypeScript
 */
function generateTypeScriptCode(versions) {
  const entries = versions.map((entry) => {
    const fields = [
      `version: '${entry.version}'`,
      `date: '${entry.date}'`,
      `title: '${escapeString(entry.title)}'`,
      `emoji: '${entry.emoji}'`,
      `highlight: ${entry.highlight}`,
      `description: '${escapeString(entry.description)}'`,
    ];

    if (entry.features) {
      fields.push(
        `features: ${JSON.stringify(entry.features, null, 6).replace(/"([^"]+)":/g, '$1:')}`
      );
    }

    if (entry.improvements) {
      fields.push(
        `improvements: ${JSON.stringify(entry.improvements, null, 6).replace(/"([^"]+)":/g, '$1:')}`
      );
    }

    if (entry.fixes) {
      fields.push(`fixes: ${JSON.stringify(entry.fixes, null, 6).replace(/"([^"]+)":/g, '$1:')}`);
    }

    return `  {\n    ${fields.join(',\n    ')}\n  }`;
  });

  return `/**
 * Changelog / What's New
 *
 * Este archivo es generado automáticamente por scripts/sync-changelog.js
 * desde CHANGELOG.md (generado por semantic-release).
 *
 * NO EDITAR MANUALMENTE - Los cambios serán sobrescritos.
 *
 * Para agregar una entrada al changelog, hacer commits con formato convencional:
 * - feat: nueva funcionalidad
 * - fix: corrección de bug
 * - perf: mejora de performance
 *
 * El sistema de releases automático creará las entradas correspondientes.
 */

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  features?: string[];
  improvements?: string[];
  fixes?: string[];
  emoji?: string;
  highlight?: boolean;
}

/**
 * Changelog completo (orden: más reciente primero)
 */
export const CHANGELOG: ChangelogEntry[] = [
${entries.join(',\n')}
];

/**
 * Obtener la versión actual (la más reciente)
 */
export function getCurrentVersion(): string {
  return CHANGELOG[0].version;
}

/**
 * Obtener el changelog desde una versión específica
 */
export function getChangelogSince(version: string): ChangelogEntry[] {
  const index = CHANGELOG.findIndex((entry) => entry.version === version);
  if (index === -1) return CHANGELOG;
  return CHANGELOG.slice(0, index);
}

/**
 * Verificar si hay nuevas actualizaciones
 */
export function hasNewUpdates(lastSeenVersion: string | null): boolean {
  if (!lastSeenVersion) return true;
  return lastSeenVersion !== getCurrentVersion();
}

/**
 * Storage key for skipped versions
 */
const SKIPPED_VERSIONS_KEY = 'dg_skipped_versions';

/**
 * Obtener versiones que el usuario decidió no ver
 */
export function getSkippedVersions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const skipped = localStorage.getItem(SKIPPED_VERSIONS_KEY);
    return skipped ? JSON.parse(skipped) : [];
  } catch {
    return [];
  }
}

/**
 * Marcar una versión como "no mostrar"
 */
export function skipVersion(version: string): void {
  if (typeof window === 'undefined') return;
  try {
    const skipped = getSkippedVersions();
    if (!skipped.includes(version)) {
      skipped.push(version);
      localStorage.setItem(SKIPPED_VERSIONS_KEY, JSON.stringify(skipped));
    }
  } catch (error) {
    console.error('Error skipping version:', error);
  }
}

/**
 * Verificar si una versión fue marcada como "no mostrar"
 */
export function isVersionSkipped(version: string): boolean {
  return getSkippedVersions().includes(version);
}

/**
 * Contar versiones no vistas (nuevas y no skipped)
 */
export function getUnseenCount(lastSeenVersion: string | null): number {
  const skipped = getSkippedVersions();
  let count = 0;

  for (const entry of CHANGELOG) {
    if (!lastSeenVersion) {
      if (!skipped.includes(entry.version)) count++;
      continue;
    }

    if (entry.version === lastSeenVersion) break;

    if (!skipped.includes(entry.version)) count++;
  }

  return count;
}
`;
}

/**
 * Escapa strings para TypeScript
 */
function escapeString(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/**
 * Main function
 */
function main() {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  const outputPath = path.join(__dirname, '..', 'lib', 'changelog.ts');

  // Check if CHANGELOG.md exists
  if (!fs.existsSync(changelogPath)) {
    console.log('⚠️  CHANGELOG.md not found. Skipping sync.');
    return;
  }

  console.log('📖 Reading CHANGELOG.md...');
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');

  console.log('🔍 Parsing versions...');
  const versions = parseChangelog(changelogContent);

  if (versions.length === 0) {
    console.log('⚠️  No versions found in CHANGELOG.md. Skipping sync.');
    return;
  }

  console.log(`✅ Found ${versions.length} version(s)`);

  console.log('📝 Generating TypeScript code...');
  const tsCode = generateTypeScriptCode(versions);

  console.log('💾 Writing lib/changelog.ts...');
  fs.writeFileSync(outputPath, tsCode, 'utf8');

  console.log('✨ Changelog synced successfully!');
  console.log(`   Latest version: ${versions[0].version}`);
}

// Run
main();
