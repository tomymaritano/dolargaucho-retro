/**
 * Type definitions for DolarAPI.com
 * Documentation: https://dolarapi.com/docs
 */

// Base quotation structure for all currencies
export interface Quotation {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

// Dollar specific type
export interface DolarQuotation extends Quotation {
  moneda: 'USD';
}

// Other currencies
export interface CurrencyQuotation extends Quotation {
  moneda: 'EUR' | 'BRL' | 'CLP' | 'UYU';
}

// Dollar types available
export type DolarType =
  | 'oficial'
  | 'blue'
  | 'bolsa' // MEP
  | 'contadoconliqui' // CCL
  | 'tarjeta'
  | 'mayorista'
  | 'cripto';

// Currency types available
export type CurrencyType = 'eur' | 'brl' | 'clp' | 'uyu';

// API Response wrapper
export interface DolarAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Historical data (for future use)
export interface HistoricalData {
  fecha: string;
  compra: number;
  venta: number;
}

// Inflation data
export interface InflacionData {
  fecha: string;
  valor: number;
}

// Country risk data
export interface RiesgoPaisData {
  fecha: string;
  valor: number;
}
