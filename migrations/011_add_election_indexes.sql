-- Migration 011: Add indexes for election queries optimization
-- Optimizes JOIN queries between elecciones_legislativas and resultados_agrupacion

-- Index for filtering by year
CREATE INDEX IF NOT EXISTS idx_elecciones_year
ON elecciones_legislativas(year);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_elecciones_category
ON elecciones_legislativas(category);

-- Index for JOIN on eleccion_id (most important!)
CREATE INDEX IF NOT EXISTS idx_resultados_eleccion_id
ON resultados_agrupacion(eleccion_id);

-- Index for ORDER BY posicion
CREATE INDEX IF NOT EXISTS idx_resultados_posicion
ON resultados_agrupacion(posicion);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_elecciones_year_category
ON elecciones_legislativas(year, category);

-- Analyze tables to update statistics
ANALYZE elecciones_legislativas;
ANALYZE resultados_agrupacion;
