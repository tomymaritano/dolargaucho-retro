/**
 * Semantic Release Configuration
 *
 * Automatiza completamente el proceso de releases:
 * - Analiza commits convencionales (feat, fix, BREAKING CHANGE)
 * - Determina version bump (patch, minor, major)
 * - Genera CHANGELOG.md
 * - Actualiza package.json
 * - Crea git tag y GitHub Release
 * - Ejecuta script para sincronizar lib/changelog.ts
 */

module.exports = {
  branches: ['main'],
  plugins: [
    // 1. Analyze commits to determine version bump
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'revert', release: 'patch' },
          { type: 'docs', release: false },
          { type: 'style', release: false },
          { type: 'chore', release: false },
          { type: 'refactor', release: false },
          { type: 'test', release: false },
          { type: 'build', release: false },
          { type: 'ci', release: false },
          { breaking: true, release: 'major' },
        ],
      },
    ],

    // 2. Generate release notes
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Nuevas Funcionalidades' },
            { type: 'fix', section: '🐛 Correcciones' },
            { type: 'perf', section: '⚡ Mejoras de Performance' },
            { type: 'revert', section: '⏪ Reversiones' },
            { type: 'docs', section: '📝 Documentación', hidden: false },
            { type: 'style', section: '💄 Estilos', hidden: true },
            { type: 'chore', section: '🔧 Mantenimiento', hidden: true },
            { type: 'refactor', section: '♻️ Refactorización', hidden: true },
            { type: 'test', section: '✅ Tests', hidden: true },
            { type: 'build', section: '📦 Build', hidden: true },
            { type: 'ci', section: '👷 CI/CD', hidden: true },
          ],
        },
      },
    ],

    // 3. Generate CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle:
          '# Changelog\n\nTodos los cambios notables de este proyecto serán documentados en este archivo.\n\nEl formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),\ny este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).',
      },
    ],

    // 4. Update package.json version (done automatically by semantic-release)
    '@semantic-release/npm',

    // 5. Commit version bump and changelog
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'lib/changelog.ts'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],

    // 6. Create GitHub Release
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        releasedLabels: ['released'],
      },
    ],

    // 7. Execute custom script to sync lib/changelog.ts (via GitHub Actions)
    // This is handled in .github/workflows/release.yml
  ],
};
