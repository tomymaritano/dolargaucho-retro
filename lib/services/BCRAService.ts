/**
 * BCRA Service
 *
 * Business logic for BCRA (Banco Central de la República Argentina) data
 * Pure functions - no side effects, no API calls
 * Use this for calculations, transformations, and business rules
 */

export class BCRAService {
  /**
   * Format international reserves (USD millions)
   *
   * @param value - Reserves in millions of USD
   * @returns Formatted reserves string
   *
   * @example
   * const formatted = BCRAService.formatReservas(38928); // "USD 38.928 M"
   */
  static formatReservas(value: number): string {
    if (value >= 1000) {
      return `USD ${(value / 1000).toFixed(3)} B`;
    }
    return `USD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} M`;
  }

  /**
   * Format interest rate (percentage)
   *
   * @param value - Interest rate as number
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted rate string
   *
   * @example
   * const formatted = BCRAService.formatTasa(44.38); // "44.38%"
   */
  static formatTasa(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format monetary base (ARS millions/billions)
   *
   * @param value - Monetary base in millions of ARS
   * @returns Formatted monetary base string
   *
   * @example
   * const formatted = BCRAService.formatBaseMonetaria(40792969); // "$40,79 B"
   */
  static formatBaseMonetaria(value: number): string {
    if (value >= 1000000) {
      // Billones (trillions in English)
      return `$${(value / 1000000).toFixed(2)} B`;
    }
    if (value >= 1000) {
      // Miles de millones
      return `$${(value / 1000).toFixed(2)} B`;
    }
    return `$${value.toLocaleString('es-AR')} M`;
  }

  /**
   * Calculate percentage change between two values
   *
   * @param current - Current value
   * @param previous - Previous value
   * @returns Percentage change
   *
   * @example
   * const change = BCRAService.calculateChange(100, 90); // 11.11
   */
  static calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Format EMAE value (activity index)
   *
   * @param value - EMAE index value
   * @returns Formatted EMAE string
   *
   * @example
   * const formatted = BCRAService.formatEMAE(2.4); // "+2.4%"
   */
  static formatEMAE(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  }

  /**
   * Get trend indicator based on value
   *
   * @param value - Numeric value (can be positive or negative)
   * @returns Trend direction
   *
   * @example
   * const trend = BCRAService.getTrend(2.5); // "up"
   */
  static getTrend(value: number): 'up' | 'down' | 'neutral' {
    if (value > 0.1) return 'up';
    if (value < -0.1) return 'down';
    return 'neutral';
  }

  /**
   * Get trend color for UI
   *
   * @param value - Numeric value
   * @param invertColors - Invert color logic (for rates where high is bad)
   * @returns Tailwind color class
   *
   * @example
   * const color = BCRAService.getTrendColor(2.5); // "text-success"
   */
  static getTrendColor(value: number, invertColors: boolean = false): string {
    const trend = this.getTrend(value);

    if (invertColors) {
      if (trend === 'up') return 'text-error';
      if (trend === 'down') return 'text-success';
    } else {
      if (trend === 'up') return 'text-success';
      if (trend === 'down') return 'text-error';
    }

    return 'text-warning';
  }

  /**
   * Validate BCRA data point
   *
   * @param value - Value to validate
   * @returns True if valid
   *
   * @example
   * const isValid = BCRAService.isValidData(38928); // true
   */
  static isValidData(value: number | null | undefined): boolean {
    return value !== null && value !== undefined && !isNaN(value) && isFinite(value);
  }

  /**
   * Parse date from BCRA format (DD/MM/YYYY)
   *
   * @param dateString - Date string in BCRA format
   * @returns JavaScript Date object
   *
   * @example
   * const date = BCRAService.parseDate('24/10/2025'); // Date object
   */
  static parseDate(dateString: string): Date | null {
    try {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch {
      return null;
    }
  }

  /**
   * Format number with thousand separators (Argentine format)
   *
   * @param value - Number to format
   * @returns Formatted number string
   *
   * @example
   * const formatted = BCRAService.formatNumber(1234567); // "1.234.567"
   */
  static formatNumber(value: number): string {
    return value.toLocaleString('es-AR');
  }

  /**
   * Get TNA (Tasa Nominal Anual) display
   *
   * @param tna - TNA value
   * @returns Formatted TNA
   *
   * @example
   * const formatted = BCRAService.formatTNA(44.38); // "44.38% TNA"
   */
  static formatTNA(tna: number): string {
    return `${this.formatTasa(tna)} TNA`;
  }

  /**
   * Get TEA (Tasa Efectiva Anual) from TNA
   * TEA = (1 + TNA/100)^(365/días) - 1
   *
   * @param tna - Tasa Nominal Anual
   * @param days - Days of the period (default: 365)
   * @returns TEA percentage
   *
   * @example
   * const tea = BCRAService.calculateTEA(44.38, 365); // ~54.55
   */
  static calculateTEA(tna: number, days: number = 365): number {
    return (Math.pow(1 + tna / 100, 365 / days) - 1) * 100;
  }
}
