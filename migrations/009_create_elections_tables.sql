-- Migration: Crear tablas para almacenar resultados electorales oficiales
-- Fecha: 2025-10-23
-- Fuente: Datos oficiales de DINE (Dirección Nacional Electoral)

-- Tabla principal: Elecciones Legislativas
CREATE TABLE IF NOT EXISTS elecciones_legislativas (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    date VARCHAR(50) NOT NULL, -- "22 de octubre 2023"
    category VARCHAR(50) DEFAULT 'Diputados Nacionales',
    total_electores INTEGER NOT NULL, -- Padrón electoral
    total_votantes INTEGER NOT NULL, -- Cantidad que votó
    mesas_totalizadas INTEGER NOT NULL,
    participacion NUMERIC(5,2) NOT NULL, -- Porcentaje de participación
    total_votos_positivos INTEGER NOT NULL,
    total_votos INTEGER NOT NULL,
    votos_nulos INTEGER DEFAULT 0,
    votos_blanco INTEGER DEFAULT 0,
    votos_otros INTEGER DEFAULT 0, -- Recurridos/impugnados/comando
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de resultados por agrupación política
CREATE TABLE IF NOT EXISTS resultados_agrupacion (
    id SERIAL PRIMARY KEY,
    eleccion_id INTEGER NOT NULL REFERENCES elecciones_legislativas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL, -- Nombre de la agrupación/coalición
    votos INTEGER NOT NULL,
    porcentaje NUMERIC(5,2) NOT NULL,
    posicion INTEGER, -- 1 = primera fuerza, 2 = segunda, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar queries
CREATE INDEX IF NOT EXISTS idx_elecciones_year ON elecciones_legislativas(year DESC);
CREATE INDEX IF NOT EXISTS idx_resultados_eleccion ON resultados_agrupacion(eleccion_id);
CREATE INDEX IF NOT EXISTS idx_resultados_posicion ON resultados_agrupacion(eleccion_id, posicion);
CREATE INDEX IF NOT EXISTS idx_resultados_votos ON resultados_agrupacion(eleccion_id, votos DESC);

-- Comentarios para documentar
COMMENT ON TABLE elecciones_legislativas IS 'Datos generales de elecciones legislativas nacionales (Diputados) - Fuente: DINE';
COMMENT ON TABLE resultados_agrupacion IS 'Resultados por agrupación política en cada elección - Fuente: DINE';

COMMENT ON COLUMN elecciones_legislativas.total_electores IS 'Total de electores habilitados (padrón)';
COMMENT ON COLUMN elecciones_legislativas.total_votantes IS 'Total de personas que efectivamente votaron';
COMMENT ON COLUMN elecciones_legislativas.participacion IS 'Porcentaje de participación (votantes/electores * 100)';
COMMENT ON COLUMN resultados_agrupacion.posicion IS 'Posición en el ranking (1 = más votada, 2 = segunda, etc.)';
