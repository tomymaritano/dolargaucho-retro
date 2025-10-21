-- ============================================================================
-- Migration 001: Add nickname field to users table
-- Date: 2025-10-20
-- ============================================================================

-- 1. Agregar columna nickname (VARCHAR 50, permite NULL inicialmente)
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);

-- 2. Crear index único en nickname (solo para valores no-NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname_unique ON users(nickname) WHERE nickname IS NOT NULL;

-- 3. Crear index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- 4. MIGRACIÓN DE DATOS: Copiar name → nickname para usuarios existentes
-- Esto asegura que usuarios actuales tengan su nombre y apellido como nickname
UPDATE users
SET nickname = name
WHERE nickname IS NULL
  AND name IS NOT NULL
  AND name != '';

-- 5. Para usuarios sin name ni nickname, usar parte del email como fallback
UPDATE users
SET nickname = SPLIT_PART(email, '@', 1)
WHERE nickname IS NULL;

-- 6. Verificación: Mostrar estadísticas de la migración
SELECT
  COUNT(*) as total_users,
  COUNT(nickname) as users_with_nickname,
  COUNT(*) - COUNT(nickname) as users_without_nickname
FROM users;

-- Expected result: users_without_nickname = 0 (todos los usuarios tienen nickname)

-- 7. Comentarios de verificación
-- Para verificar la migración manualmente:
-- SELECT id, email, name, nickname FROM users LIMIT 10;
