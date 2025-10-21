/**
 * Commitlint Configuration
 *
 * Valida que todos los commits sigan el formato de Conventional Commits
 * Esto asegura que semantic-release pueda determinar correctamente la versión
 *
 * Formato esperado:
 * <tipo>(<scope>): <descripción>
 *
 * Ejemplos:
 * - feat(crypto): add sparklines to favorites table
 * - fix(auth): correct token expiration logic
 * - docs(readme): update installation instructions
 *
 * Tipos permitidos:
 * - feat: nueva funcionalidad (MINOR version)
 * - fix: corrección de bug (PATCH version)
 * - docs: cambios en documentación
 * - style: cambios de formato (no afectan código)
 * - refactor: refactorización de código
 * - perf: mejoras de performance (PATCH version)
 * - test: agregar o modificar tests
 * - build: cambios en build system
 * - ci: cambios en CI/CD
 * - chore: tareas de mantenimiento
 * - revert: reversión de commits
 *
 * Breaking changes:
 * - Agregar ! después del tipo: feat!: o
 * - Agregar BREAKING CHANGE: en el footer del commit
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enum
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Documentación
        'style', // Formato, punto y coma faltante, etc
        'refactor', // Refactorización de código
        'perf', // Mejora de performance
        'test', // Agregar tests faltantes
        'build', // Cambios en build system o dependencias
        'ci', // Cambios en CI/CD
        'chore', // Tareas de mantenimiento
        'revert', // Reversión de commits
      ],
    ],
    // Subject case
    'subject-case': [2, 'always', 'lower-case'],
    // Subject empty
    'subject-empty': [2, 'never'],
    // Type empty
    'type-empty': [2, 'never'],
    // Type case
    'type-case': [2, 'always', 'lower-case'],
    // Scope case
    'scope-case': [2, 'always', 'lower-case'],
    // Header max length
    'header-max-length': [2, 'always', 100],
  },
};
