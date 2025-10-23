/**
 * ArgentinaData API Type Definitions
 * https://argentinadatos.com/
 */

// ===================
// POLÍTICA - Senado
// ===================

export interface Senador {
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  provincia: string;
  bloque: string;
  partido?: string;
  mandato_inicio?: string;
  mandato_fin?: string;
  fecha_nacimiento?: string;
  email?: string;
  foto_url?: string;
}

export interface ActaSenado {
  id: number;
  fecha: string;
  numero_reunion: number;
  periodo: string;
  tipo: string;
  orden_dia?: string;
  asistentes?: number;
  ausentes?: number;
  url_pdf?: string;
}

// ===================
// POLÍTICA - Diputados
// ===================

export interface Diputado {
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  provincia: string;
  bloque: string;
  partido?: string;
  mandato_inicio?: string;
  mandato_fin?: string;
  fecha_nacimiento?: string;
  email?: string;
  foto_url?: string;
}

export interface ActaDiputados {
  id: number;
  fecha: string;
  numero_reunion: number;
  periodo: string;
  tipo: string;
  orden_dia?: string;
  asistentes?: number;
  ausentes?: number;
  url_pdf?: string;
}

// ===================
// FINANZAS - Índices
// ===================

export interface InflacionMensual {
  fecha: string;
  valor: number;
}

export interface InflacionInteranual {
  fecha: string;
  valor: number;
}

export interface IndiceUVA {
  fecha: string;
  valor: number;
}

export interface RiesgoPais {
  fecha: string;
  valor: number;
}

// ===================
// FINANZAS - Tasas
// ===================

export interface TasaPlazoFijo {
  entidad: string;
  logo?: string;
  tnaClientes: number | null;
  tnaNoClientes: number | null;
  enlace?: string | null;
}

export interface TasaDepositos {
  fecha: string;
  tasa: number;
  plazo_dias: number;
}

// ===================
// FINANZAS - FCI
// ===================

export interface FondoComun {
  fecha: string;
  nombre: string;
  codigo?: string;
  clase: 'A' | 'B' | 'C';
  vcp: number; // Valor Cuota Parte
  horizonte: string;
  tipo: 'Mercado de Dinero' | 'Renta Variable' | 'Renta Fija' | 'Renta Mixta' | 'Otros';
  moneda: 'ARS' | 'USD' | 'EUR';
  variacion_diaria?: number;
  variacion_semanal?: number;
  variacion_mensual?: number;
  patrimonio?: number;
  administradora?: string;
}

// ===================
// EVENTOS
// ===================

export interface Feriado {
  fecha: string;
  tipo: 'inamovible' | 'trasladable' | 'puente';
  nombre: string;
  info?: string;
}

export interface EventoPresidencial {
  fecha: string;
  tipo: string;
  presidente: string;
  descripcion: string;
  ubicacion?: string;
}

// ===================
// QUERY PARAMS
// ===================

export interface SenadoActasParams {
  año?: number;
  tipo?: string;
  periodo?: string;
}

export interface DiputadosActasParams {
  año?: number;
  tipo?: string;
  periodo?: string;
}

export interface FCIParams {
  fecha?: string;
  clase?: 'A' | 'B' | 'C';
  moneda?: 'ARS' | 'USD' | 'EUR';
}

// ===================
// API RESPONSE TYPES
// ===================

export type SenadoresResponse = Senador[];
export type ActasSenadoResponse = ActaSenado[];
export type DiputadosResponse = Diputado[];
export type ActasDiputadosResponse = ActaDiputados[];

export type InflacionMensualResponse = InflacionMensual[];
export type InflacionInteranualResponse = InflacionInteranual[];
export type IndiceUVAResponse = IndiceUVA[];
export type RiesgoPaisResponse = RiesgoPais[];

export type TasaPlazoFijoResponse = TasaPlazoFijo[];
export type TasaDepositosResponse = TasaDepositos[];

export type FondosComunesResponse = FondoComun[];

export type FeriadosResponse = Feriado[];
export type EventosPresidencialesResponse = EventoPresidencial[];

// ===================
// UTILITIES
// ===================

export interface BloqueStats {
  bloque: string;
  senadores: number;
  diputados: number;
  total: number;
}
