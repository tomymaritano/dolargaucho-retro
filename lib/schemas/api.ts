/**
 * Zod Schemas para validación de respuestas de API
 * Previene errores por cambios inesperados en APIs externas
 */

import { z } from 'zod';

// =====================
// DOLAR API SCHEMAS
// =====================

/**
 * Schema para una cotización de dólar individual
 */
export const DolarQuotationSchema = z.object({
  moneda: z.literal('USD'),
  casa: z.string(),
  nombre: z.string(),
  compra: z.number(),
  venta: z.number(),
  fechaActualizacion: z.string(),
});

/**
 * Schema para array de cotizaciones de dólar
 */
export const DolarQuotationsSchema = z.array(DolarQuotationSchema);

/**
 * Schema para cotización de moneda extranjera
 */
export const CurrencyQuotationSchema = z.object({
  moneda: z.enum(['EUR', 'BRL', 'CLP', 'UYU']),
  casa: z.string(),
  nombre: z.string(),
  compra: z.number(),
  venta: z.number(),
  fechaActualizacion: z.string(),
});

/**
 * Schema para array de cotizaciones de monedas
 */
export const CurrencyQuotationsSchema = z.array(CurrencyQuotationSchema);

// =====================
// ARGENTINA DATA SCHEMAS
// =====================

/**
 * Schema para inflación mensual
 */
export const InflacionMensualSchema = z.object({
  fecha: z.string(),
  valor: z.number(),
});

export const InflacionMensualResponseSchema = z.array(InflacionMensualSchema);

/**
 * Schema para inflación interanual
 */
export const InflacionInteranualSchema = z.object({
  fecha: z.string(),
  valor: z.number(),
});

export const InflacionInteranualResponseSchema = z.array(InflacionInteranualSchema);

/**
 * Schema para índice UVA
 */
export const IndiceUVASchema = z.object({
  fecha: z.string(),
  valor: z.number(),
});

export const IndiceUVAResponseSchema = z.array(IndiceUVASchema);

/**
 * Schema para riesgo país
 */
export const RiesgoPaisSchema = z.object({
  fecha: z.string(),
  valor: z.number(),
});

export const RiesgoPaisResponseSchema = z.array(RiesgoPaisSchema);

/**
 * Schema para tasa de plazo fijo
 */
export const TasaPlazoFijoSchema = z.object({
  entidad: z.string(),
  logo: z.string().optional(),
  tnaClientes: z.number().nullable(),
  tnaNoClientes: z.number().nullable(),
});

export const TasaPlazoFijoResponseSchema = z.array(TasaPlazoFijoSchema);

/**
 * Schema para senador
 */
export const SenadorSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  provincia: z.string(),
  bloque: z.string(),
});

export const SenadoresResponseSchema = z.array(SenadorSchema);

/**
 * Schema para diputado
 */
export const DiputadoSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  provincia: z.string(),
  bloque: z.string(),
});

export const DiputadosResponseSchema = z.array(DiputadoSchema);

/**
 * Schema para fondo común de inversión
 */
export const FondoComunSchema = z.object({
  nombre: z.string(),
  vcp: z.number(),
  cuentaPartesClases: z.number().optional(),
  horizonte: z.string().optional(),
  moneda: z.string().optional(),
  administradora: z.string().optional(),
});

export const FondosComunesResponseSchema = z.array(FondoComunSchema);

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Valida y parsea datos con un schema de Zod
 * Lanza error descriptivo si la validación falla
 *
 * @param schema - Schema de Zod a usar
 * @param data - Datos a validar
 * @param context - Contexto para mensajes de error (ej: "DolarAPI /dolares")
 */
export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');

    throw new Error(
      `Validación fallida en ${context}. Errores: ${errorMessages}`
    );
  }

  return result.data;
}

/**
 * Valida datos opcionalmente (no lanza error, retorna null si falla)
 *
 * @param schema - Schema de Zod a usar
 * @param data - Datos a validar
 */
export function validateOptional<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// =====================
// TYPE EXPORTS
// =====================

export type DolarQuotation = z.infer<typeof DolarQuotationSchema>;
export type CurrencyQuotation = z.infer<typeof CurrencyQuotationSchema>;
export type InflacionMensual = z.infer<typeof InflacionMensualSchema>;
export type InflacionInteranual = z.infer<typeof InflacionInteranualSchema>;
export type IndiceUVA = z.infer<typeof IndiceUVASchema>;
export type RiesgoPais = z.infer<typeof RiesgoPaisSchema>;
export type TasaPlazoFijo = z.infer<typeof TasaPlazoFijoSchema>;
export type Senador = z.infer<typeof SenadorSchema>;
export type Diputado = z.infer<typeof DiputadoSchema>;
export type FondoComun = z.infer<typeof FondoComunSchema>;
