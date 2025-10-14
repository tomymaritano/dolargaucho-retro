# 🇺🇸 Configuración de FRED API para Inflación USD

La calculadora de rentabilidad necesita datos de inflación estadounidense para calcular correctamente la rentabilidad real de inversiones en dólares.

## ¿Por qué FRED?

**FRED (Federal Reserve Economic Data)** es la fuente oficial de datos económicos de la Reserva Federal de EE.UU.:

- ✅ **Gratuita** - API key sin costo
- ✅ **Oficial** - Datos del gobierno estadounidense
- ✅ **Histórica** - Datos desde 1947
- ✅ **Actualizada** - Datos mensuales actualizados
- ✅ **Confiable** - Fuente de referencia mundial

## Opción 1: Usar con API Key (Recomendado)

### Paso 1: Crear Cuenta en FRED

1. Ir a https://fred.stlouisfed.org/
2. Click en "Sign In" (arriba derecha)
3. Click en "Create New Account"
4. Completar el formulario de registro

### Paso 2: Obtener API Key

1. Iniciar sesión en FRED
2. Ir a tu perfil (click en tu nombre)
3. Click en "API Keys" en el menú lateral
4. Click en "Request API Key"
5. Completar el formulario:
   - **Application Name**: "DolarGaucho Calculator"
   - **Application URL**: Tu URL o `http://localhost:3000`
   - **Brief Description**: "Calculate investment returns with US inflation data"
6. Aceptar los términos y enviar

### Paso 3: Configurar en el Proyecto

1. Copiar tu API key (ejemplo: `abcdef1234567890abcdef1234567890`)

2. Agregar a tu archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_FRED_API_KEY=tu_api_key_aqui
   ```

3. Reiniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Verificar que Funciona

Abre la consola del navegador en `/calculadoras` y busca:
- ✅ Si ves "Fetching US inflation from FRED API" → Está funcionando
- ⚠️ Si ves "FRED API key not found" → Usa fallback (ver Opción 2)

## Opción 2: Usar sin API Key (Fallback Automático)

Si no quieres configurar la API key, **la app funciona perfectamente con datos estimados**:

### Datos de Fallback Incluidos:

El sistema incluye inflación anual estimada de EE.UU. (2010-2025):

```typescript
2010: 1.6%    2018: 2.4%
2011: 3.1%    2019: 1.8%
2012: 2.1%    2020: 1.2%
2013: 1.5%    2021: 4.7%
2014: 1.6%    2022: 8.0%
2015: 0.1%    2023: 4.1%
2016: 1.3%    2024: 2.9%
2017: 2.1%    2025: 2.9% (estimado)
```

**Ventajas del fallback:**
- ✅ No requiere configuración
- ✅ Funciona offline
- ✅ Suficientemente preciso para cálculos generales

**Desventajas:**
- ⚠️ Datos mensuales aproximados (divide anual / 12)
- ⚠️ No se actualiza automáticamente

## Límites de la API

### Con API Key:
- 120 requests/minuto
- Ilimitadas por día
- Datos desde 1947 hasta hoy

### Sin API Key (Fallback):
- Sin límites (datos locales)
- Inflación 2010-2025

## Troubleshooting

### Error: "FRED API key not found"

**Causa**: No existe la variable de entorno

**Solución**:
1. Verificar que `.env.local` existe en la raíz del proyecto
2. Verificar que la línea es: `NEXT_PUBLIC_FRED_API_KEY=tu_key`
3. Reiniciar el servidor: `Ctrl+C` y luego `npm run dev`

### Error: "FRED API error: 403 Forbidden"

**Causa**: API key inválida

**Solución**:
1. Verificar que copiaste toda la API key (32 caracteres hexadecimales)
2. Regenerar la API key en FRED
3. Actualizar `.env.local`

### Error: "FRED API error: 429 Too Many Requests"

**Causa**: Excediste 120 requests/minuto

**Solución**:
- Esperar 1 minuto
- El sistema automáticamente usará el fallback

## Formato de los Datos

### Respuesta de FRED API:

```json
{
  "observations": [
    {
      "date": "2020-01-01",
      "value": "2.5",
      "realtime_start": "2020-01-01",
      "realtime_end": "9999-12-31"
    }
  ]
}
```

### Transformación Interna:

```typescript
{
  fecha: "2020-01-01",
  valor: 2.5  // Porcentaje de inflación mensual
}
```

## Más Información

- **FRED API Docs**: https://fred.stlouisfed.org/docs/api/
- **Serie CPIAUCSL**: https://fred.stlouisfed.org/series/CPIAUCSL
- **Términos de Uso**: https://fred.stlouisfed.org/legal/

## Ejemplo de Uso en la Calculadora

```typescript
// Inversión USD con inflación real
USD 10,000 → USD 12,000 (2020-2024)

Con FRED API:
- Inflación USD: 21.8% (datos reales mensuales)
- Rentabilidad real: -1.48%

Sin API (Fallback):
- Inflación USD: ~22% (datos anuales estimados)
- Rentabilidad real: -1.64%

Diferencia: ~0.16% (despreciable para la mayoría de casos)
```

## Recomendación

**Para producción**: Usar API key de FRED
**Para desarrollo/testing**: Fallback es suficiente

La precisión del fallback es más que aceptable para análisis generales de inversión.
