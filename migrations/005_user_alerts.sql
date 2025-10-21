-- ============================================================================
-- USER ALERTS TABLE
-- Migration 005: Add user alerts for price notifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Alert configuration
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('dolar', 'inflacion', 'riesgo-pais', 'uva', 'tasa')),
  nombre VARCHAR(255) NOT NULL,
  condicion VARCHAR(10) NOT NULL CHECK (condicion IN ('mayor', 'menor', 'igual')),
  valor_objetivo DECIMAL(12, 2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'disparada', 'pausada')),

  -- Metadata específica por tipo (almacenado como JSONB para flexibilidad)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_ultima_verificacion TIMESTAMP WITH TIME ZONE,
  fecha_disparada TIMESTAMP WITH TIME ZONE,

  -- Notificaciones
  notificacion_enviada BOOLEAN DEFAULT false,
  mensaje TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_alerts_user_id ON user_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_estado ON user_alerts(estado);
CREATE INDEX IF NOT EXISTS idx_user_alerts_tipo ON user_alerts(tipo);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_user_alerts_updated_at
BEFORE UPDATE ON user_alerts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run after migration:
-- SELECT * FROM user_alerts;
-- \d user_alerts
