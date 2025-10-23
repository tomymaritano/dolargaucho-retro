/**
 * Dolar Service
 *
 * Business logic for dollar quotations
 * Pure functions - no side effects, no API calls
 * Use this for calculations, transformations, and business rules
 */

import type { DolarQuotation } from '@/types/api/dolar';

export class DolarService {
  /**
   * Calculate spread (difference between buy and sell)
   *
   * @param compra - Buy price
   * @param venta - Sell price
   * @returns Spread value
   *
   * @example
   * const spread = DolarService.calculateSpread(1000, 1050); // 50
   */
  static calculateSpread(compra: number, venta: number): number {
    return venta - compra;
  }

  /**
   * Calculate spread as percentage
   *
   * @param compra - Buy price
   * @param venta - Sell price
   * @returns Spread percentage
   *
   * @example
   * const spreadPct = DolarService.calculateSpreadPercentage(1000, 1050); // 5%
   */
  static calculateSpreadPercentage(compra: number, venta: number): number {
    if (compra === 0) return 0;
    const spread = this.calculateSpread(compra, venta);
    return (spread / compra) * 100;
  }

  /**
   * Check if quotation is stale (outdated)
   *
   * @param fechaActualizacion - Last update date string
   * @param maxAgeMinutes - Maximum age in minutes (default: 30)
   * @returns True if quotation is stale
   *
   * @example
   * const isStale = DolarService.isStale('2025-01-01T10:00:00Z', 30);
   */
  static isStale(fechaActualizacion: string, maxAgeMinutes: number = 30): boolean {
    try {
      const lastUpdate = new Date(fechaActualizacion);
      const now = new Date();
      const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
      return diffMinutes > maxAgeMinutes;
    } catch {
      return true; // If date parsing fails, consider it stale
    }
  }

  /**
   * Format price with Argentine Peso formatting
   *
   * @param price - Price to format
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted price string
   *
   * @example
   * DolarService.formatPrice(1234.56); // "$1.234,56"
   */
  static formatPrice(price: number, decimals: number = 2): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  /**
   * Format price without currency symbol
   *
   * @param price - Price to format
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted number string
   *
   * @example
   * DolarService.formatNumber(1234.56); // "1.234,56"
   */
  static formatNumber(price: number, decimals: number = 2): string {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  /**
   * Get best buy rate from multiple quotations
   *
   * @param quotations - Array of dollar quotations
   * @returns Quotation with lowest buy price
   *
   * @example
   * const best = DolarService.getBestBuyRate(dolares);
   */
  static getBestBuyRate(quotations: DolarQuotation[]): DolarQuotation | null {
    if (quotations.length === 0) return null;

    return quotations.reduce((best, current) => {
      return current.compra < best.compra ? current : best;
    });
  }

  /**
   * Get best sell rate from multiple quotations
   *
   * @param quotations - Array of dollar quotations
   * @returns Quotation with highest sell price
   *
   * @example
   * const best = DolarService.getBestSellRate(dolares);
   */
  static getBestSellRate(quotations: DolarQuotation[]): DolarQuotation | null {
    if (quotations.length === 0) return null;

    return quotations.reduce((best, current) => {
      return current.venta > best.venta ? current : best;
    });
  }

  /**
   * Calculate variation between two prices
   *
   * @param previousPrice - Previous price
   * @param currentPrice - Current price
   * @returns Variation object with absolute and percentage change
   *
   * @example
   * const variation = DolarService.calculateVariation(1000, 1050);
   * // { absolute: 50, percentage: 5, isPositive: true }
   */
  static calculateVariation(
    previousPrice: number,
    currentPrice: number
  ): {
    absolute: number;
    percentage: number;
    isPositive: boolean;
  } {
    const absolute = currentPrice - previousPrice;
    const percentage = previousPrice === 0 ? 0 : (absolute / previousPrice) * 100;

    return {
      absolute,
      percentage,
      isPositive: absolute >= 0,
    };
  }

  /**
   * Calculate implied exchange rate (e.g., for MEP or CCL)
   *
   * @param arsPrice - Price in ARS
   * @param usdPrice - Price in USD
   * @returns Implied exchange rate
   *
   * @example
   * const impliedRate = DolarService.calculateImpliedRate(10000, 10); // 1000
   */
  static calculateImpliedRate(arsPrice: number, usdPrice: number): number {
    if (usdPrice === 0) return 0;
    return arsPrice / usdPrice;
  }

  /**
   * Calculate blue chip swap (CCL) premium over official rate
   *
   * @param oficialRate - Official dollar rate
   * @param cclRate - CCL (blue chip swap) rate
   * @returns Premium percentage
   *
   * @example
   * const premium = DolarService.calculateCCLPremium(350, 1050); // 200%
   */
  static calculateCCLPremium(oficialRate: number, cclRate: number): number {
    if (oficialRate === 0) return 0;
    return ((cclRate - oficialRate) / oficialRate) * 100;
  }

  /**
   * Convert USD to ARS
   *
   * @param usdAmount - Amount in USD
   * @param exchangeRate - Exchange rate to use
   * @returns Amount in ARS
   *
   * @example
   * const ars = DolarService.convertUSDtoARS(100, 1050); // 105000
   */
  static convertUSDtoARS(usdAmount: number, exchangeRate: number): number {
    return usdAmount * exchangeRate;
  }

  /**
   * Convert ARS to USD
   *
   * @param arsAmount - Amount in ARS
   * @param exchangeRate - Exchange rate to use
   * @returns Amount in USD
   *
   * @example
   * const usd = DolarService.convertARStoUSD(105000, 1050); // 100
   */
  static convertARStoUSD(arsAmount: number, exchangeRate: number): number {
    if (exchangeRate === 0) return 0;
    return arsAmount / exchangeRate;
  }

  /**
   * Sort quotations by sell price (high to low)
   *
   * @param quotations - Array of dollar quotations
   * @returns Sorted array (does not mutate original)
   *
   * @example
   * const sorted = DolarService.sortByPrice(dolares);
   */
  static sortByPrice(quotations: DolarQuotation[]): DolarQuotation[] {
    return [...quotations].sort((a, b) => b.venta - a.venta);
  }

  /**
   * Filter quotations by minimum spread
   *
   * @param quotations - Array of dollar quotations
   * @param minSpread - Minimum spread value
   * @returns Filtered array
   *
   * @example
   * const highSpread = DolarService.filterBySpread(dolares, 50);
   */
  static filterBySpread(quotations: DolarQuotation[], minSpread: number): DolarQuotation[] {
    return quotations.filter((q) => {
      const spread = this.calculateSpread(q.compra, q.venta);
      return spread >= minSpread;
    });
  }

  /**
   * Get quotation statistics (avg, min, max)
   *
   * @param quotations - Array of dollar quotations
   * @returns Statistics object
   *
   * @example
   * const stats = DolarService.getStatistics(dolares);
   */
  static getStatistics(quotations: DolarQuotation[]): {
    avgCompra: number;
    avgVenta: number;
    minCompra: number;
    maxVenta: number;
    avgSpread: number;
  } {
    if (quotations.length === 0) {
      return {
        avgCompra: 0,
        avgVenta: 0,
        minCompra: 0,
        maxVenta: 0,
        avgSpread: 0,
      };
    }

    const compras = quotations.map((q) => q.compra);
    const ventas = quotations.map((q) => q.venta);
    const spreads = quotations.map((q) => this.calculateSpread(q.compra, q.venta));

    return {
      avgCompra: compras.reduce((sum, v) => sum + v, 0) / compras.length,
      avgVenta: ventas.reduce((sum, v) => sum + v, 0) / ventas.length,
      minCompra: Math.min(...compras),
      maxVenta: Math.max(...ventas),
      avgSpread: spreads.reduce((sum, v) => sum + v, 0) / spreads.length,
    };
  }
}

export default DolarService;
