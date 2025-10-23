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

// All quotations (including USD from /cotizaciones endpoint)
export interface AllQuotations extends Quotation {
  moneda: 'USD' | 'EUR' | 'BRL' | 'CLP' | 'UYU';
}

// Other currencies (international only, excluding USD)
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

// Dolar data for calculators - can be either DolarQuotation or custom format
export type DolarData =
  | DolarQuotation
  | {
      tipo: string;
      compra: number;
      venta: number;
      promedio: number;
      fecha: string;
    };

// Dolar historical data - can be DolarQuotation or simple historical format
export type DolarHistorico =
  | DolarQuotation
  | {
      fecha: string;
      valor: number;
    };
