/**
 * Financial calculations hook for investment strategies
 * Contains all calculation logic for plazo fijo, dólar, and portfolio strategies
 */

import { useMemo } from 'react';
import type { ChartData } from 'chart.js';
import type { StrategyMetrics } from '@/lib/utils/financialMetrics';
import {
  calcularVAN,
  calcularTIR,
  calcularSharpeRatio,
  calcularVolatilidadPortfolio,
  VOLATILIDADES,
} from '@/lib/utils/financialMetrics';
import { generateStrategyChartData } from '@/lib/utils/chartDataGenerator';

export interface PortfolioAllocation {
  plazoFijo: number;
  dolarBlue: number;
  dolarMEP: number;
}

export interface CalculationResults {
  capital: number;
  dias: number;
  meses: number;
  tna: number;
  dolarInicio: number;
  dolarFinal: number;
  inflacionAcumulada: number;
  estrategias: StrategyMetrics[];
  mejorPorRendimiento: StrategyMetrics;
  mejorPorSharpe: StrategyMetrics;
  mejorPorVAN: StrategyMetrics;
  chartData: ChartData<'line'>;
}

export function useFinancialCalculations(
  capital: string,
  dias: number,
  allocation: PortfolioAllocation,
  devaluacionMensualAuto: number,
  inflacionMensualAuto: number,
  spreadMEPAuto: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dolarBlue: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dolarMEP: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasas: any[]
): CalculationResults | null {
  return useMemo(() => {
    const capitalNum = parseFloat(capital.replace(/\./g, ''));
    if (isNaN(capitalNum) || capitalNum <= 0 || !dolarBlue || !tasas || tasas.length === 0) {
      return null;
    }

    const mejorTasa = tasas.reduce((max, current) => {
      if (!current.tnaClientes) return max;
      if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
        return current;
      }
      return max;
    }, tasas[0]);
    const tna = (mejorTasa.tnaClientes || 0) * 100;

    const meses = Math.floor(dias / 30);
    const devaluacion = devaluacionMensualAuto / 100;
    const inflacion = inflacionMensualAuto / 100;
    const spreadMEPNum = spreadMEPAuto / 100;

    const dolarInicio = dolarBlue.venta;
    const dolarFinal = dolarInicio * Math.pow(1 + devaluacion, meses);
    const dolarMEPInicio = dolarMEP?.venta || dolarInicio * (1 - spreadMEPNum);
    const dolarMEPFinal = dolarMEPInicio * Math.pow(1 + devaluacion, meses);

    const inflacionAcumulada = (Math.pow(1 + inflacion, meses) - 1) * 100;

    // Strategy 1: Plazo Fijo
    const interesPF = (capitalNum * tna * (dias / 365)) / 100;
    const totalPF = capitalNum + interesPF;
    const rendimientoPF = ((totalPF - capitalNum) / capitalNum) * 100;
    const rendimientoRealPF = (totalPF / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // Strategy 2: Dólar Blue
    const usdInicio = capitalNum / dolarInicio;
    const totalBlue = usdInicio * dolarFinal;
    const rendimientoBlue = ((totalBlue - capitalNum) / capitalNum) * 100;
    const rendimientoRealBlue = (totalBlue / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // Strategy 3: Dólar MEP
    const usdMEPInicio = capitalNum / dolarMEPInicio;
    const totalMEP = usdMEPInicio * dolarMEPFinal;
    const rendimientoMEP = ((totalMEP - capitalNum) / capitalNum) * 100;
    const rendimientoRealMEP = (totalMEP / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // Strategy 4: Diversified Portfolio
    const capitalPF = capitalNum * (allocation.plazoFijo / 100);
    const capitalBlue = capitalNum * (allocation.dolarBlue / 100);
    const capitalMEP = capitalNum * (allocation.dolarMEP / 100);

    const retornoPF = capitalPF * (1 + rendimientoPF / 100);
    const retornoBlue = capitalBlue * (1 + rendimientoBlue / 100);
    const retornoMEP = capitalMEP * (1 + rendimientoMEP / 100);

    const totalDiversificado = retornoPF + retornoBlue + retornoMEP;
    const rendimientoDiversificado = ((totalDiversificado - capitalNum) / capitalNum) * 100;
    const rendimientoRealDiversificado =
      (totalDiversificado / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // VAN calculations
    const tasaDescuento = inflacion;
    const vanPF = calcularVAN(capitalNum, totalPF, tasaDescuento, meses);
    const vanBlue = calcularVAN(capitalNum, totalBlue, tasaDescuento, meses);
    const vanMEP = calcularVAN(capitalNum, totalMEP, tasaDescuento, meses);
    const vanDiversificado = calcularVAN(capitalNum, totalDiversificado, tasaDescuento, meses);

    // TIR calculations
    const tirPF = calcularTIR(capitalNum, totalPF, meses);
    const tirBlue = calcularTIR(capitalNum, totalBlue, meses);
    const tirMEP = calcularTIR(capitalNum, totalMEP, meses);
    const tirDiversificado = calcularTIR(capitalNum, totalDiversificado, meses);

    // Volatility calculations
    const volatilidadDiversificado = calcularVolatilidadPortfolio(
      [allocation.plazoFijo, allocation.dolarBlue, allocation.dolarMEP],
      [VOLATILIDADES.PLAZO_FIJO, VOLATILIDADES.DOLAR_BLUE, VOLATILIDADES.DOLAR_MEP]
    );

    // Sharpe Ratio calculations
    const sharpeRatioPF = calcularSharpeRatio(rendimientoRealPF, VOLATILIDADES.PLAZO_FIJO);
    const sharpeRatioBlue = calcularSharpeRatio(rendimientoRealBlue, VOLATILIDADES.DOLAR_BLUE);
    const sharpeRatioMEP = calcularSharpeRatio(rendimientoRealMEP, VOLATILIDADES.DOLAR_MEP);
    const sharpeRatioDiversificado = calcularSharpeRatio(
      rendimientoRealDiversificado,
      volatilidadDiversificado
    );

    const estrategias: StrategyMetrics[] = [
      {
        nombre: 'Plazo Fijo',
        rendimiento: rendimientoPF,
        rendimientoReal: rendimientoRealPF,
        van: vanPF,
        tir: tirPF,
        sharpe: sharpeRatioPF,
        riesgo: VOLATILIDADES.PLAZO_FIJO,
        total: totalPF,
      },
      {
        nombre: 'Dólar Blue',
        rendimiento: rendimientoBlue,
        rendimientoReal: rendimientoRealBlue,
        van: vanBlue,
        tir: tirBlue,
        sharpe: sharpeRatioBlue,
        riesgo: VOLATILIDADES.DOLAR_BLUE,
        total: totalBlue,
      },
      {
        nombre: 'Dólar MEP',
        rendimiento: rendimientoMEP,
        rendimientoReal: rendimientoRealMEP,
        van: vanMEP,
        tir: tirMEP,
        sharpe: sharpeRatioMEP,
        riesgo: VOLATILIDADES.DOLAR_MEP,
        total: totalMEP,
      },
      {
        nombre: 'Diversificado',
        rendimiento: rendimientoDiversificado,
        rendimientoReal: rendimientoRealDiversificado,
        van: vanDiversificado,
        tir: tirDiversificado,
        sharpe: sharpeRatioDiversificado,
        riesgo: volatilidadDiversificado,
        total: totalDiversificado,
      },
    ];

    const mejorPorRendimiento = [...estrategias].sort(
      (a, b) => b.rendimientoReal - a.rendimientoReal
    )[0];
    const mejorPorSharpe = [...estrategias].sort((a, b) => b.sharpe - a.sharpe)[0];
    const mejorPorVAN = [...estrategias].sort((a, b) => b.van - a.van)[0];

    const chartData = generateStrategyChartData({
      capital: capitalNum,
      dias,
      tna,
      dolarInicio,
      dolarMEPInicio,
      devaluacion,
      inflacion,
      allocation,
    });

    return {
      capital: capitalNum,
      dias,
      meses,
      tna,
      dolarInicio,
      dolarFinal,
      inflacionAcumulada,
      estrategias,
      mejorPorRendimiento,
      mejorPorSharpe,
      mejorPorVAN,
      chartData,
    };
  }, [
    capital,
    dias,
    allocation,
    devaluacionMensualAuto,
    inflacionMensualAuto,
    spreadMEPAuto,
    dolarBlue,
    dolarMEP,
    tasas,
  ]);
}
