# Guía de Importación de Datos de Senadores

## ✅ Trabajo Completado

### 1. Descarga de CSV Oficiales

Se descargaron los datos oficiales de la DINE para senadores:

**2017:**

- Fuente: `https://www.argentina.gob.ar/sites/default/files/generales-2017definitivosndistrito_1.zip`
- Archivo: `generales-2017definitivosndistrito (1).csv`
- Formato: CSV separado por `;`
- Procesado: ✅

**2019:**

- Fuente: `https://www.argentina.gob.ar/sites/default/files/s.n_definitivo_x_distrito_grales_2019.xlsx`
- Formato: XLSX
- Procesado: ✅

**2021:**

- Fuente: `https://www.argentina.gob.ar/sites/default/files/2022/07/senadores_generales_2021.rar`
- Formato: RAR con múltiples archivos XLSX (uno por provincia)
- Provincias incluidas: Catamarca, Chubut, Córdoba, Corrientes, La Pampa, Mendoza, Santa Fe, Tucumán
- Procesado: ✅

### 2. Archivos JSON Generados

Se generaron los siguientes archivos en `/data/`:

- ✅ `senadores_2011_oficial.json` - Vacío (sin elecciones o datos no disponibles)
- ✅ `senadores_2013_oficial.json` - Datos completos
- ✅ `senadores_2015_oficial.json` - Vacío (sin elecciones o datos no disponibles)
- ✅ `senadores_2017_oficial.json` - **NUEVO** - Datos completos procesados
- ✅ `senadores_2019_oficial.json` - **NUEVO** - Datos completos procesados
- ✅ `senadores_2021_oficial.json` - **NUEVO** - Datos completos procesados
- ✅ `senadores_2023_oficial.json` - Datos completos

### 3. Resultados Principales

**Senadores 2017:**

- Participación: 78.72%
- Top 3:
  1. CAMBIEMOS BUENOS AIRES: 32.98%
  2. UNIDAD CIUDADANA: 29.76%
  3. 1PAIS: 9.02%

**Senadores 2019:**

- Participación: 76.48%
- Top 3:
  1. JUNTOS POR EL CAMBIO: 53.99%
  2. FRENTE DE TODOS: 34.08%
  3. CONSENSO FEDERAL: 5.76%

**Senadores 2021:**

- Participación: 70.83%
- Top 3:
  1. JUNTOS POR EL CAMBIO: 28.22%
  2. FRENTE DE TODOS: 27.61%
  3. HACEMOS POR CÓRDOBA: 7%

### 4. Scripts de Procesamiento

Se crearon los siguientes scripts en `/data/senadores_raw/`:

- `process_2017.js` - Procesa CSV de 2017
- `process_2019.js` - Procesa XLSX de 2019
- `process_2021.js` - Procesa múltiples XLSX de 2021 y los agrega

### 5. Actualizaciones al Sistema

**Script de Importación (`scripts/import-elections-data.ts`):**

- ✅ Actualizado para procesar tanto Diputados como Senadores
- ✅ Maneja archivos vacíos correctamente
- ✅ Usa la categoría del archivo JSON en lugar de hardcodear "Diputados Nacionales"
- ✅ ON CONFLICT actualizado a `(year, category)`

**Migración de Base de Datos (`migrations/010_update_elections_unique_constraint.sql`):**

- ✅ Elimina constraint único de `year`
- ✅ Agrega constraint único compuesto `(year, category)`
- ✅ Permite almacenar Diputados y Senadores del mismo año

## 📋 Pasos para Completar la Integración

### Paso 1: Ejecutar Migración de Base de Datos

```bash
# Opción 1: psql directo
psql $DATABASE_URL -f migrations/010_update_elections_unique_constraint.sql

# Opción 2: desde el script
cat migrations/010_update_elections_unique_constraint.sql | psql $DATABASE_URL
```

### Paso 2: Ejecutar Script de Importación

```bash
# Asegurarse de tener DATABASE_URL configurado
export DATABASE_URL="postgresql://..."

# Ejecutar importación
npx tsx scripts/import-elections-data.ts
```

El script ahora importará:

- 7 archivos de Diputados (2011-2023)
- 5 archivos de Senadores (2013, 2017, 2019, 2021, 2023)
  - 2011 y 2015 se omiten por estar vacíos

### Paso 3: Verificar Importación

```sql
-- Ver todas las elecciones importadas
SELECT year, category, total_votantes, participacion
FROM elecciones_legislativas
ORDER BY year DESC, category;

-- Contar elecciones por categoría
SELECT category, COUNT(*)
FROM elecciones_legislativas
GROUP BY category;

-- Ver agrupaciones de una elección específica
SELECT e.year, e.category, r.posicion, r.nombre, r.votos, r.porcentaje
FROM elecciones_legislativas e
JOIN resultados_agrupacion r ON e.id = r.eleccion_id
WHERE e.year = 2021 AND e.category = 'Senadores Nacionales'
ORDER BY r.posicion
LIMIT 5;
```

## 📊 Archivos de Datos Raw

Los archivos raw descargados están en `/data/senadores_raw/`:

- `senadores_2017_generales.zip` y su CSV extraído
- `senadores_2019_definitivo.xlsx`
- `senadores_2021_generales.rar` y su directorio extraído con 8 archivos XLSX

Estos archivos se pueden mantener para referencia o eliminar después de la importación exitosa.

## 🗑️ Limpieza (Opcional)

Después de verificar que la importación fue exitosa:

```bash
# Eliminar archivos raw y scripts de procesamiento
rm -rf data/senadores_raw/

# Mantener solo los archivos JSON oficiales en data/
```

## 📝 Notas

- Los datos de 2011 y 2015 están intencionalmente vacíos. En esos años no hubo renovación de senadores o los datos no están disponibles en DINE.
- Los datos de 2019 corresponden solo a algunas provincias (no es elección nacional completa).
- Los datos de 2021 corresponden a 8 provincias que renovaron senadores ese año.
- El sistema ahora soporta múltiples categorías por año, permitiendo futuras expansiones.

## 🔗 Referencias

- DINE: https://www.argentina.gob.ar/dine/resultados-electorales
- Datos Abiertos: https://datos.gob.ar/dataset?organization=dine
- API Resultados: https://resultados.mininterior.gob.ar/api/docs
