/**
 * Financial metrics calculation utilities
 * Provides VAN, TIR, Sharpe Ratio, and volatility calculations
 */

/**
 * Strategy financial metrics
 */
export interface StrategyMetrics {
  nombre: string;
  rendimiento: number;
  rendimientoReal: number;
  van: number;
  tir: number;
  sharpe: number;
  riesgo: number;
  total: number;
}

/**
 * Calculate VAN (Valor Actual Neto / Net Present Value)
 */
export function calcularVAN(
  capitalInicial: number,
  totalFinal: number,
  tasaDescuento: number,
  meses: number
): number {
  return -capitalInicial + totalFinal / Math.pow(1 + tasaDescuento, meses);
}

/**
 * Calculate TIR (Tasa Interna de Retorno / Internal Rate of Return)
 */
export function calcularTIR(capitalInicial: number, totalFinal: number, meses: number): number {
  return (Math.pow(totalFinal / capitalInicial, 1 / meses) - 1) * 100;
}

/**
 * Calculate Sharpe Ratio (risk-adjusted return)
 */
export function calcularSharpeRatio(rendimientoReal: number, volatilidad: number): number {
  return rendimientoReal / volatilidad;
}

/**
 * Calculate portfolio volatility using weighted variance
 */
export function calcularVolatilidadPortfolio(pesos: number[], volatilidades: number[]): number {
  const varianzaPonderada = pesos.reduce((sum, peso, idx) => {
    return sum + Math.pow((peso / 100) * volatilidades[idx], 2);
  }, 0);
  return Math.sqrt(varianzaPonderada);
}

/**
 * Fixed volatilities for each strategy
 */
export const VOLATILIDADES = {
  PLAZO_FIJO: 2,
  DOLAR_BLUE: 15,
  DOLAR_MEP: 12,
} as const;
