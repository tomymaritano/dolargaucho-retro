-- Migration: Actualizar constraint único para permitir múltiples categorías por año
-- Fecha: 2025-10-24
-- Razón: Necesitamos almacenar tanto Diputados como Senadores para el mismo año

-- Eliminar el constraint único de year
ALTER TABLE elecciones_legislativas
  DROP CONSTRAINT IF EXISTS elecciones_legislativas_year_key;

-- Agregar constraint único compuesto (year, category)
ALTER TABLE elecciones_legislativas
  ADD CONSTRAINT elecciones_legislativas_year_category_key
  UNIQUE (year, category);

-- Actualizar comentario de la tabla
COMMENT ON TABLE elecciones_legislativas IS 'Datos generales de elecciones legislativas nacionales (Diputados y Senadores) - Fuente: DINE';

-- Crear índice compuesto para optimizar queries por year y category
CREATE INDEX IF NOT EXISTS idx_elecciones_year_category ON elecciones_legislativas(year DESC, category);
