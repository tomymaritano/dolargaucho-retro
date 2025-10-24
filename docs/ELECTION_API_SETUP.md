# Configuración API de Elecciones - Ministerio del Interior

## 🎯 Objetivo

Conectar con la API oficial de resultados electorales del Ministerio del Interior de Argentina.

## ✅ IMPORTANTE: API Pública - No Requiere Autenticación

La API del Ministerio del Interior es **pública y no requiere JWT tokens ni autenticación**.

**Documentación oficial:** https://resultados.mininterior.gob.ar/api/docs

---

## 📋 Opciones de Configuración

### Opción 1: Modo Testing (Actual - Recomendado para Desarrollo)

**Estado:** ✅ ACTIVO

Usa datos históricos de 2023 como preview sin llamar a la API real.

**Configuración:**

```typescript
// pages/elecciones.tsx
const TESTING_MODE = true;

// hooks/useElectionResults.ts
const TESTING_MODE = true;
```

**Datos disponibles:**

- Presidente: Milei vs Massa (Ballotage 2023)
- Diputados: 4 listas principales
- Senadores: 4 listas principales

**Ventajas:**

- ✅ Sin dependencia de API externa
- ✅ Sin límites de rate
- ✅ Datos realistas
- ✅ Desarrollo sin conexión

---

### Opción 2: API Oficial en Vivo (Producción)

**Estado:** ✅ LISTO - API Pública

La API está lista para usar. **No requiere configuración de tokens.**

#### Paso 1: Desactivar Testing Mode

```typescript
// pages/elecciones.tsx
const TESTING_MODE = false;

// hooks/useElectionResults.ts
const TESTING_MODE = false;

// types/api/election.ts
ELECTION_YEAR: 2025,
```

#### Paso 2: Verificar

```bash
npm run dev
# Visitar http://localhost:3000/elecciones
# Debería ver datos reales si es 26 de octubre 2025
```

#### Paso 3: Probar API Manualmente (Opcional)

```bash
# Ejemplo con datos de 2019
curl -X 'GET' 'https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=2019&tipoRecuento=1&tipoEleccion=1&categoriaId=2&distritoId=1&seccionProvincialId=0&seccionId=3&circuitoId=000039&mesaId=1244' \
  -H 'accept: application/json'
```

**No se requiere header de Authorization.**

---

## 🔧 Configuración Técnica

### Archivo: `lib/config/election.ts`

```typescript
export const ELECTION_CONFIG = {
  // API Base URL - PUBLIC API (No authentication required)
  API_URL: 'https://resultados.mininterior.gob.ar/api/resultados/getResultados',

  DEFAULT_PARAMS: {
    anioEleccion: ELECTION_CONSTANTS.ELECTION_YEAR, // 2025 en producción
    tipoRecuento: ELECTION_CONSTANTS.RECUENTO_PROVISORIO, // 1
    tipoEleccion: ELECTION_CONSTANTS.TIPO_GENERALES, // 2
    categoriaId: ELECTION_CONSTANTS.CATEGORIA_PRESIDENTE, // 1, 2, o 3
  },

  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
```

**Nota:** No se requiere configuración de `.env.local` para la API de elecciones.

---

## 📊 Estructura de Datos de la API

### Request

```
GET https://resultados.mininterior.gob.ar/api/resultados/getResultados
Accept: application/json

Params:
- anioEleccion: 2025
- tipoRecuento: 1 (provisorio) | 2 (definitivo)
- tipoEleccion: 2 (generales)
- categoriaId: 1 (presidente) | 2 (diputados) | 3 (senadores)
- distritoId: 1 (nacional) o ID específico de provincia
- seccionProvincialId: 0 (todas) o ID específico
```

### Response

```json
{
  "anioEleccion": 2025,
  "tipoEleccion": "2",
  "tipoEleccionNombre": "Generales",
  "categoria": "1",
  "categoriaNombre": "Presidente y Vicepresidente",
  "fechaTotalizacion": "2025-10-26T20:30:00Z",
  "mesasTotales": 100000,
  "mesasTotalizadas": 45300,
  "mesasTotalizadasPorcentaje": 45.3,
  "electoresMesa": 25840234,
  "valoresTotalizadosPositivos": [
    {
      "agrupacionId": 1,
      "agrupacionNombre": "La Libertad Avanza",
      "agrupacionColor": "#6B4C9A",
      "votos": 7828107,
      "votosPorcentaje": 31.95,
      "listas": [...]
    }
  ],
  "votosNulos": 650000,
  "votosBlanco": 450000,
  "votosRecurridos": 150000,
  "votosImpugnados": 61033
}
```

---

## 🚀 Checklist para Go-Live (26 Oct 2025)

- [ ] **1 semana antes:** Testing con API real usando datos históricos
- [ ] **3 días antes:** Verificar rate limits y polling
- [ ] **1 día antes:**
  - [ ] Cambiar TESTING_MODE = false en `pages/elecciones.tsx`
  - [ ] Cambiar TESTING_MODE = false en `hooks/useElectionResults.ts`
  - [ ] Cambiar ELECTION_YEAR = 2025 en `types/api/election.ts`
  - [ ] Deploy a producción
  - [ ] Smoke test en producción
- [ ] **Día de elección:**
  - [ ] Monitorear logs
  - [ ] Verificar polling cada 10 segundos
  - [ ] Verificar que los datos se actualizan correctamente
  - [ ] Monitorear errores de API

---

## ❓ FAQs

### ¿La API requiere autenticación?

**No.** La API del Ministerio del Interior es completamente pública y no requiere JWT tokens ni autenticación.

### ¿Hay límite de requests?

La API puede tener rate limits, se recomienda:

- Polling moderado: 1 req cada 10 seg = 6 req/min ✅
- Implementar caching (ya implementado en nuestra API)
- Respetar los servidores especialmente el día de elección

### ¿Funciona con datos de 2023?

Sí! En testing mode usamos datos reales de 2023 para preview sin llamar a la API.

### ¿Cómo testeo antes del 26 de octubre?

1. Mantén TESTING_MODE = true para desarrollo local
2. Para probar la API real, puedes usar datos históricos de 2019 o 2023
3. Cambia ELECTION_YEAR a un año pasado (ej: 2019) temporalmente

### ¿Qué datos están disponibles?

- **Presidente y Vicepresidente** (categoriaId: 1)
- **Diputados Nacionales** (categoriaId: 2)
- **Senadores Nacionales** (categoriaId: 3)
- Resultados por provincia, sección, circuito, mesa
- Provisorio y definitivo

---

## 📞 Contacto y Recursos

**Dirección Nacional Electoral**

- Web: https://www.argentina.gob.ar/interior/dine
- Resultados: https://resultados.mininterior.gob.ar
- API Docs: https://resultados.mininterior.gob.ar/api/docs

**Documentación OpenAPI:**

- Swagger UI disponible en el endpoint de docs
- Especificación OpenAPI v3
- Exportación a CSV disponible
