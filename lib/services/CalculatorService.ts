/**
 * Calculator Service
 *
 * Business logic for financial calculators
 * Includes: Inflation, Fixed Term Deposits, UVA, Currency Conversion
 */

export interface InflacionResult {
  valorInicial: number;
  valorFinal: number;
  porcentajeInflacion: number;
  perdidaPoderAdquisitivo: number;
  mesesCalculados: number;
}

export interface PlazoFijoResult {
  capitalInicial: number;
  capitalFinal: number;
  interesesGanados: number;
  tasaNominalAnual: number;
  tasaEfectivaAnual: number;
  dias: number;
  rendimientoNeto: number;
  impuestos: number;
}

export interface UVAResult {
  capitalInicial: number;
  capitalFinalPesos: number;
  capitalFinalUVA: number;
  valorUVAInicial: number;
  valorUVAFinal: number;
  variacionUVA: number;
  rendimientoTotal: number;
  meses: number;
}

export class CalculatorService {
  // ============================================================================
  // INFLACIÓN
  // ============================================================================

  /**
   * Calculate inflation impact on purchasing power
   *
   * @param valorInicial - Initial value
   * @param inflacionMensual - Monthly inflation rate (as percentage)
   * @param meses - Number of months
   * @returns Inflation calculation result
   *
   * @example
   * const result = CalculatorService.calculateInflacion(100000, 5, 12);
   * // Shows value after 12 months of 5% monthly inflation
   */
  static calculateInflacion(
    valorInicial: number,
    inflacionMensual: number,
    meses: number
  ): InflacionResult {
    // Convert percentage to decimal
    const tasaDecimal = inflacionMensual / 100;

    // Calculate accumulated inflation
    const factorInflacion = Math.pow(1 + tasaDecimal, meses);
    const valorFinal = valorInicial * factorInflacion;

    // Calculate purchasing power loss
    const perdidaPoderAdquisitivo = ((valorFinal - valorInicial) / valorInicial) * 100;

    return {
      valorInicial,
      valorFinal,
      porcentajeInflacion: (factorInflacion - 1) * 100,
      perdidaPoderAdquisitivo,
      mesesCalculados: meses,
    };
  }

  /**
   * Calculate real value adjusted for inflation
   *
   * @param valorNominal - Nominal value
   * @param inflacionAcumulada - Accumulated inflation percentage
   * @returns Real value (purchasing power)
   *
   * @example
   * const realValue = CalculatorService.calculateRealValue(100000, 50);
   * // 66666.67 (purchasing power after 50% inflation)
   */
  static calculateRealValue(valorNominal: number, inflacionAcumulada: number): number {
    return valorNominal / (1 + inflacionAcumulada / 100);
  }

  /**
   * Calculate inflation rate needed to reach target value
   *
   * @param valorInicial - Initial value
   * @param valorFinal - Target final value
   * @param meses - Number of months
   * @returns Required monthly inflation rate
   *
   * @example
   * const rate = CalculatorService.calculateRequiredInflation(100, 150, 12);
   * // Returns monthly rate needed to reach 150 from 100 in 12 months
   */
  static calculateRequiredInflation(
    valorInicial: number,
    valorFinal: number,
    meses: number
  ): number {
    if (valorInicial === 0 || meses === 0) return 0;

    const ratio = valorFinal / valorInicial;
    const monthlyRate = Math.pow(ratio, 1 / meses) - 1;

    return monthlyRate * 100; // Return as percentage
  }

  // ============================================================================
  // PLAZO FIJO (Fixed Term Deposits)
  // ============================================================================

  /**
   * Calculate fixed term deposit returns
   *
   * @param capital - Initial capital
   * @param tasaNominalAnual - Annual nominal rate (percentage)
   * @param dias - Days of investment
   * @param aplicaImpuesto - Apply 15% tax on earnings
   * @returns Fixed term calculation result
   *
   * @example
   * const result = CalculatorService.calculatePlazoFijo(100000, 90, 30, true);
   */
  static calculatePlazoFijo(
    capital: number,
    tasaNominalAnual: number,
    dias: number,
    aplicaImpuesto: boolean = true
  ): PlazoFijoResult {
    // Convert annual rate to decimal
    const tasaAnualDecimal = tasaNominalAnual / 100;

    // Calculate daily rate
    const tasaDiaria = tasaAnualDecimal / 365;

    // Calculate final capital
    const capitalFinal = capital * Math.pow(1 + tasaDiaria, dias);
    const interesesGanados = capitalFinal - capital;

    // Apply 15% tax if applicable (only on earnings)
    const impuestos = aplicaImpuesto ? interesesGanados * 0.15 : 0;
    const rendimientoNeto = interesesGanados - impuestos;

    // Calculate effective annual rate
    const tasaEfectivaAnual = (Math.pow(1 + tasaDiaria, 365) - 1) * 100;

    return {
      capitalInicial: capital,
      capitalFinal: capital + rendimientoNeto,
      interesesGanados,
      tasaNominalAnual,
      tasaEfectivaAnual,
      dias,
      rendimientoNeto,
      impuestos,
    };
  }

  /**
   * Calculate best between fixed term and dollar investment
   *
   * @param capitalARS - Initial capital in ARS
   * @param tasaPlazoFijo - Fixed term annual rate
   * @param dolarCompra - Dollar buy price
   * @param dolarVentaFuturo - Expected dollar sell price
   * @param dias - Investment period in days
   * @returns Comparison result
   */
  static comparePlazoFijoVsDolar(
    capitalARS: number,
    tasaPlazoFijo: number,
    dolarCompra: number,
    dolarVentaFuturo: number,
    dias: number
  ): {
    plazoFijo: number;
    dolares: number;
    mejorOpcion: 'plazoFijo' | 'dolares';
    diferencia: number;
  } {
    // Calculate fixed term result
    const resultPF = this.calculatePlazoFijo(capitalARS, tasaPlazoFijo, dias, true);
    const gananciasPlazoFijo = resultPF.capitalFinal;

    // Calculate dollar investment
    const usdComprados = capitalARS / dolarCompra;
    const arsVentaDolares = usdComprados * dolarVentaFuturo;

    const mejorOpcion = gananciasPlazoFijo > arsVentaDolares ? 'plazoFijo' : 'dolares';
    const diferencia = Math.abs(gananciasPlazoFijo - arsVentaDolares);

    return {
      plazoFijo: gananciasPlazoFijo,
      dolares: arsVentaDolares,
      mejorOpcion,
      diferencia,
    };
  }

  // ============================================================================
  // UVA (Inflation-adjusted investments)
  // ============================================================================

  /**
   * Calculate UVA investment returns
   *
   * @param capitalInicial - Initial capital in ARS
   * @param valorUVAInicial - Initial UVA value
   * @param valorUVAFinal - Final UVA value
   * @param tasaInteresAnual - Annual interest rate (on top of UVA adjustment)
   * @param meses - Investment period in months
   * @returns UVA calculation result
   *
   * @example
   * const result = CalculatorService.calculateUVA(100000, 500, 600, 10, 12);
   */
  static calculateUVA(
    capitalInicial: number,
    valorUVAInicial: number,
    valorUVAFinal: number,
    tasaInteresAnual: number,
    meses: number
  ): UVAResult {
    // Convert capital to UVA units
    const capitalEnUVA = capitalInicial / valorUVAInicial;

    // Apply interest rate (monthly)
    const tasaMensual = tasaInteresAnual / 12 / 100;
    const capitalFinalUVA = capitalEnUVA * Math.pow(1 + tasaMensual, meses);

    // Convert back to pesos with final UVA value
    const capitalFinalPesos = capitalFinalUVA * valorUVAFinal;

    // Calculate variation
    const variacionUVA = ((valorUVAFinal - valorUVAInicial) / valorUVAInicial) * 100;
    const rendimientoTotal = ((capitalFinalPesos - capitalInicial) / capitalInicial) * 100;

    return {
      capitalInicial,
      capitalFinalPesos,
      capitalFinalUVA,
      valorUVAInicial,
      valorUVAFinal,
      variacionUVA,
      rendimientoTotal,
      meses,
    };
  }

  // ============================================================================
  // CURRENCY CONVERSION
  // ============================================================================

  /**
   * Convert between currencies with commission
   *
   * @param amount - Amount to convert
   * @param exchangeRate - Exchange rate
   * @param commission - Commission percentage (default: 0)
   * @returns Converted amount after commission
   *
   * @example
   * const converted = CalculatorService.convertWithCommission(100, 1050, 2);
   * // Returns 102900 (100 USD * 1050 ARS/USD - 2% commission)
   */
  static convertWithCommission(
    amount: number,
    exchangeRate: number,
    commission: number = 0
  ): number {
    const converted = amount * exchangeRate;
    const commissionAmount = converted * (commission / 100);
    return converted - commissionAmount;
  }

  /**
   * Calculate arbitrage opportunity between different dollar rates
   *
   * @param capitalARS - Initial capital in ARS
   * @param dolarCompra - Dollar buy rate
   * @param dolarVenta - Dollar sell rate
   * @returns Arbitrage result
   *
   * @example
   * const arbitrage = CalculatorService.calculateArbitrage(100000, 1000, 1100);
   */
  static calculateArbitrage(
    capitalARS: number,
    dolarCompra: number,
    dolarVenta: number
  ): {
    usdComprados: number;
    arsVenta: number;
    ganancia: number;
    rendimiento: number;
  } {
    const usdComprados = capitalARS / dolarCompra;
    const arsVenta = usdComprados * dolarVenta;
    const ganancia = arsVenta - capitalARS;
    const rendimiento = (ganancia / capitalARS) * 100;

    return {
      usdComprados,
      arsVenta,
      ganancia,
      rendimiento,
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Calculate compound annual growth rate (CAGR)
   *
   * @param valorInicial - Initial value
   * @param valorFinal - Final value
   * @param años - Number of years
   * @returns CAGR percentage
   *
   * @example
   * const cagr = CalculatorService.calculateCAGR(100000, 150000, 3);
   * // Returns ~14.47% annual growth rate
   */
  static calculateCAGR(valorInicial: number, valorFinal: number, años: number): number {
    if (valorInicial === 0 || años === 0) return 0;

    const ratio = valorFinal / valorInicial;
    const cagr = (Math.pow(ratio, 1 / años) - 1) * 100;

    return cagr;
  }

  /**
   * Calculate break-even exchange rate
   *
   * @param capitalInicial - Initial capital
   * @param tasaPlazoFijo - Fixed term rate
   * @param dolarCompra - Dollar buy rate
   * @param dias - Investment period
   * @returns Break-even dollar sell rate
   *
   * @example
   * const breakEven = CalculatorService.calculateBreakEvenRate(100000, 90, 1000, 30);
   * // Returns dollar rate needed to match fixed term returns
   */
  static calculateBreakEvenRate(
    capitalInicial: number,
    tasaPlazoFijo: number,
    dolarCompra: number,
    dias: number
  ): number {
    const resultPF = this.calculatePlazoFijo(capitalInicial, tasaPlazoFijo, dias, true);
    const usdComprados = capitalInicial / dolarCompra;

    // Calculate required dollar sell rate to match fixed term
    return resultPF.capitalFinal / usdComprados;
  }
}

export default CalculatorService;
