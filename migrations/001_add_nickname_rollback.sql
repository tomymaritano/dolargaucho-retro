-- ============================================================================
-- Rollback Migration 001: Remove nickname field from users table
-- Date: 2025-10-20
-- ============================================================================

-- 1. Eliminar indexes
DROP INDEX IF EXISTS idx_users_nickname_unique;
DROP INDEX IF EXISTS idx_users_nickname;

-- 2. Eliminar columna nickname
ALTER TABLE users DROP COLUMN IF EXISTS nickname;

-- 3. Verificación: Confirmar que la columna fue eliminada
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'nickname';

-- Expected result: 0 rows (columna eliminada exitosamente)
