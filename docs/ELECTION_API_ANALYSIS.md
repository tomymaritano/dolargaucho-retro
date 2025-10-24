# Análisis de la API de Resultados Electorales

## 🔍 Comparación: Estructura Real vs Tipos Actuales

### ✅ Estructura REAL de la API (Observada)

```json
{
  "fechaTotalizacion": "2025-10-23T20:39:07.583Z",

  "estadoRecuento": {
    "mesasEsperadas": 0,
    "mesasTotalizadas": 0,
    "mesasTotalizadasPorcentaje": 0,
    "cantidadElectores": 0,
    "cantidadVotantes": 0,
    "participacionPorcentaje": null
  },

  "valoresTotalizadosPositivos": [
    {
      "agrupacionId": 1,
      "agrupacionNombre": "LA LIBERTAD AVANZA",
      "votos": 7828107,
      "votosPorcentaje": 55.69,
      "listas": [
        {
          "listaNumero": "135",
          "listaNombre": "LA LIBERTAD AVANZA",
          "candidatos": [
            {
              "candidatoId": 1,
              "candidatoNombre": "Javier",
              "candidatoApellido": "Milei",
              "tipoCandidato": "PRESIDENTE",
              "orden": 1
            },
            {
              "candidatoId": 2,
              "candidatoNombre": "Victoria",
              "candidatoApellido": "Villarruel",
              "tipoCandidato": "VICEPRESIDENTE",
              "orden": 2
            }
          ]
        }
      ]
    }
  ],

  "valoresTotalizadosOtros": {
    "votosNulos": 450000,
    "votosNulosPorcentaje": 3.2,
    "votosEnBlanco": 350000,
    "votosEnBlancoPorcentaje": 2.5,
    "votosRecurridosComandoImpugnados": 150000,
    "votosRecurridosComandoImpugnadosPorcentaje": 1.1
  }
}
```

### ❌ Tipos ACTUALES (Incorrectos)

```typescript
export interface ElectionAPIResponse {
  // Metadata
  anioEleccion: number;
  tipoEleccion: string;
  tipoEleccionNombre: string;
  categoria: string;
  categoriaNombre: string;
  distrito?: string;
  distritoNombre?: string;
  fechaTotalizacion: string;

  // Totales - ❌ INCORRECTO: No están en la raíz
  mesasTotales: number;
  mesasTotalizadas: number;
  mesasTotalizadasPorcentaje: number;
  electoresMesa: number;

  // Resultados
  valoresTotalizadosPositivos: Agrupacion[];

  // Votos - ❌ INCORRECTO: Están en valoresTotalizadosOtros
  votosNulos: number;
  votosRecurridos: number;
  votosImpugnados: number;
  votosBlanco: number;
  votosComando: number;
  votosIdentidadImpugnada: number;
}
```

## 🚨 Problemas Detectados

### 1. **Campos Faltantes**

#### `estadoRecuento` (Objeto completo ausente)

- ✅ `mesasEsperadas` - Total de mesas esperadas
- ✅ `mesasTotalizadas` - Mesas ya contadas
- ✅ `mesasTotalizadasPorcentaje` - % de progreso
- ✅ `cantidadElectores` - Total de electores habilitados
- ✅ `cantidadVotantes` - **IMPORTANTE:** Cuántos votaron realmente
- ✅ `participacionPorcentaje` - **IMPORTANTE:** % de participación

#### `valoresTotalizadosOtros` (Estructura incorrecta)

- ✅ `votosNulos` + `votosNulosPorcentaje`
- ✅ `votosEnBlanco` + `votosEnBlancoPorcentaje`
- ✅ `votosRecurridosComandoImpugnados` + porcentaje (combinado, no separado)

### 2. **Campos en Lugar Incorrecto**

En nuestros tipos tenemos en la raíz:

```typescript
mesasTotales: number;
mesasTotalizadas: number;
mesasTotalizadasPorcentaje: number;
electoresMesa: number;
```

Pero en realidad están dentro de `estadoRecuento`:

```json
{
  "estadoRecuento": {
    "mesasEsperadas": ...,
    "mesasTotalizadas": ...,
    "mesasTotalizadasPorcentaje": ...,
    "cantidadElectores": ...
  }
}
```

### 3. **Metadata (Campos Opcionales)**

✅ **CORREGIDO:** Estos campos probablemente SÍ existen en la API cuando hay datos reales:

- `anioEleccion?` - Año de la elección
- `tipoEleccion?` / `tipoEleccionNombre?` - Tipo (Generales, PASO, etc.)
- `categoria?` / `categoriaNombre?` - Presidente, Diputados, Senadores
- `distrito?` / `distritoNombre?` - Nacional, Buenos Aires, etc.

**Razón por la cual no aparecen:** Las respuestas que probé estaban vacías (sin elecciones en esos años)

**Solución implementada:**

- Campos marcados como opcionales en el tipo
- Service usa datos reales cuando existen
- Fallback a constantes solo cuando la API no los retorna

## 📊 Datos Importantes que NO Estamos Usando

### 1. **Participación**

```json
"participacionPorcentaje": 76.5
```

**Uso:** Mostrar cuántos argentinos fueron a votar

### 2. **Cantidades Absolutas**

```json
"cantidadElectores": 35000000,
"cantidadVotantes": 26775000
```

**Uso:** "26.7M de 35M votaron (76.5%)"

### 3. **Porcentajes de Votos Especiales**

```json
"votosNulosPorcentaje": 3.2,
"votosEnBlancoPorcentaje": 2.5,
"votosRecurridosComandoImpugnadosPorcentaje": 1.1
```

**Uso:** Mostrar % en lugar de solo números absolutos

### 4. **Detalles de Candidatos**

```json
"candidatos": [
  {
    "candidatoId": 1,
    "candidatoNombre": "Javier",
    "candidatoApellido": "Milei",
    "tipoCandidato": "PRESIDENTE",
    "orden": 1
  }
]
```

**Uso:** Mostrar nombres completos y posiciones correctas

## 🔧 Acciones Requeridas

### 1. **Actualizar `ElectionAPIResponse`**

- Agregar objeto `estadoRecuento`
- Mover campos de mesas/electores a `estadoRecuento`
- Agregar objeto `valoresTotalizadosOtros` con porcentajes
- Verificar si metadata existe o no

### 2. **Actualizar `ProcessedElectionResults`**

- Agregar `participacionPorcentaje` en progress
- Agregar porcentajes a `otherVotes`
- Cambiar `totalVoters` a usar `cantidadElectores`

### 3. **Actualizar `ElectionService.processResults()`**

- Adaptar mapeo a nueva estructura
- Calcular participación
- Incluir porcentajes de votos especiales

## 📌 Resumen

**Faltan:**

1. Participación (%) - IMPORTANTE para análisis electoral
2. Cantidad de votantes vs electores
3. Porcentajes de votos nulos/blanco/impugnados
4. Estructura correcta: `estadoRecuento` y `valoresTotalizadosOtros`

**Estado Actual:** ⚠️ Tipos desactualizados, posible pérdida de datos importantes
**Prioridad:** 🔴 Alta - La participación es un dato crítico
