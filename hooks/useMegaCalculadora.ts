/**
 * Hook para cálculos de la Mega Calculadora Financiera
 * Contiene toda la lógica de análisis de inversiones, TIR, VAN, Sharpe Ratio
 */

import { useMemo } from 'react';
import type { DolarData } from '@/types/api/dolar';
import type { TasaPlazoFijo } from '@/types/api/finanzas';

export interface PortfolioAllocation {
  plazoFijo: number; // %
  dolarBlue: number; // %
  dolarMEP: number; // %
}

export interface Estrategia {
  nombre: string;
  rendimiento: number;
  rendimientoReal: number;
  van: number;
  tir: number;
  sharpe: number;
  riesgo: number;
  total: number;
}

export interface AnalisisCompleto {
  capital: number;
  dias: number;
  meses: number;
  tna: number;
  dolarInicio: number;
  dolarFinal: number;
  inflacionAcumulada: number;
  estrategias: Estrategia[];
  mejorPorRendimiento: Estrategia;
  mejorPorSharpe: Estrategia;
  mejorPorVAN: Estrategia;
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      tension: number;
      borderDash?: number[];
    }>;
  };
}

interface UseMegaCalculadoraParams {
  capital: string;
  dias: number;
  allocation: PortfolioAllocation;
  devaluacionMensualAuto: number;
  inflacionMensualAuto: number;
  spreadMEPAuto: number;
  dolarBlue: DolarData | null | undefined;
  dolarMEP: DolarData | null | undefined;
  tasas: TasaPlazoFijo[] | null | undefined;
}

export function useMegaCalculadora({
  capital,
  dias,
  allocation,
  devaluacionMensualAuto,
  inflacionMensualAuto,
  spreadMEPAuto,
  dolarBlue,
  dolarMEP,
  tasas,
}: UseMegaCalculadoraParams): AnalisisCompleto | null {
  return useMemo(() => {
    const capitalNum = parseFloat(capital.replace(/\./g, ''));
    if (isNaN(capitalNum) || capitalNum <= 0 || !dolarBlue || !tasas || tasas.length === 0) {
      return null;
    }

    // TNA Plazo Fijo
    const mejorTasa = tasas.reduce((max, current) => {
      if (!current.tnaClientes) return max;
      if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
        return current;
      }
      return max;
    }, tasas[0]);
    const tna = (mejorTasa.tnaClientes || 0) * 100;

    // Parámetros económicos
    const meses = Math.floor(dias / 30);
    const devaluacion = devaluacionMensualAuto / 100;
    const inflacion = inflacionMensualAuto / 100;
    const spreadMEPNum = spreadMEPAuto / 100;

    // Cotizaciones
    const dolarInicio = dolarBlue.venta;
    const dolarFinal = dolarInicio * Math.pow(1 + devaluacion, meses);
    const dolarMEPInicio = dolarMEP?.venta || dolarInicio * (1 - spreadMEPNum);
    const dolarMEPFinal = dolarMEPInicio * Math.pow(1 + devaluacion, meses);

    // Inflación acumulada
    const inflacionAcumulada = (Math.pow(1 + inflacion, meses) - 1) * 100;

    // ========== ESTRATEGIAS ==========

    // 1. PLAZO FIJO
    const interesPF = (capitalNum * tna * (dias / 365)) / 100;
    const totalPF = capitalNum + interesPF;
    const rendimientoPF = ((totalPF - capitalNum) / capitalNum) * 100;
    const rendimientoRealPF = (totalPF / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 2. DÓLAR BLUE
    const usdInicio = capitalNum / dolarInicio;
    const totalBlue = usdInicio * dolarFinal;
    const rendimientoBlue = ((totalBlue - capitalNum) / capitalNum) * 100;
    const rendimientoRealBlue = (totalBlue / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 3. DÓLAR MEP
    const usdMEPInicio = capitalNum / dolarMEPInicio;
    const totalMEP = usdMEPInicio * dolarMEPFinal;
    const rendimientoMEP = ((totalMEP - capitalNum) / capitalNum) * 100;
    const rendimientoRealMEP = (totalMEP / capitalNum / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 4. PORTAFOLIO DIVERSIFICADO
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

    // ========== TIR & VAN ==========

    // VAN (Valor Actual Neto) - descontando por inflación
    const tasaDescuento = inflacion;
    const vanPF = -capitalNum + totalPF / Math.pow(1 + tasaDescuento, meses);
    const vanBlue = -capitalNum + totalBlue / Math.pow(1 + tasaDescuento, meses);
    const vanMEP = -capitalNum + totalMEP / Math.pow(1 + tasaDescuento, meses);
    const vanDiversificado = -capitalNum + totalDiversificado / Math.pow(1 + tasaDescuento, meses);

    // TIR (Tasa Interna de Retorno) - aproximada
    const tirPF = (Math.pow(totalPF / capitalNum, 1 / meses) - 1) * 100;
    const tirBlue = (Math.pow(totalBlue / capitalNum, 1 / meses) - 1) * 100;
    const tirMEP = (Math.pow(totalMEP / capitalNum, 1 / meses) - 1) * 100;
    const tirDiversificado = (Math.pow(totalDiversificado / capitalNum, 1 / meses) - 1) * 100;

    // ========== ANÁLISIS DE RIESGO ==========

    // Volatilidad estimada (simplificada)
    const volatilidadPF = 2; // Muy baja
    const volatilidadBlue = 15; // Alta
    const volatilidadMEP = 12; // Media-Alta
    const volatilidadDiversificado = Math.sqrt(
      Math.pow((allocation.plazoFijo / 100) * volatilidadPF, 2) +
        Math.pow((allocation.dolarBlue / 100) * volatilidadBlue, 2) +
        Math.pow((allocation.dolarMEP / 100) * volatilidadMEP, 2)
    );

    // Sharpe Ratio (rendimiento / volatilidad)
    const sharpeRatioPF = rendimientoRealPF / volatilidadPF;
    const sharpeRatioBlue = rendimientoRealBlue / volatilidadBlue;
    const sharpeRatioMEP = rendimientoRealMEP / volatilidadMEP;
    const sharpeRatioDiversificado = rendimientoRealDiversificado / volatilidadDiversificado;

    // ========== MEJOR ESTRATEGIA ==========

    const estrategias: Estrategia[] = [
      {
        nombre: 'Plazo Fijo',
        rendimiento: rendimientoPF,
        rendimientoReal: rendimientoRealPF,
        van: vanPF,
        tir: tirPF,
        sharpe: sharpeRatioPF,
        riesgo: volatilidadPF,
        total: totalPF,
      },
      {
        nombre: 'Dólar Blue',
        rendimiento: rendimientoBlue,
        rendimientoReal: rendimientoRealBlue,
        van: vanBlue,
        tir: tirBlue,
        sharpe: sharpeRatioBlue,
        riesgo: volatilidadBlue,
        total: totalBlue,
      },
      {
        nombre: 'Dólar MEP',
        rendimiento: rendimientoMEP,
        rendimientoReal: rendimientoRealMEP,
        van: vanMEP,
        tir: tirMEP,
        sharpe: sharpeRatioMEP,
        riesgo: volatilidadMEP,
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

    // ========== DATOS PARA GRÁFICO ==========

    const puntosGrafico = 20;
    const labels: string[] = [];
    const dataPF: number[] = [];
    const dataBlue: number[] = [];
    const dataMEP: number[] = [];
    const dataDiversificado: number[] = [];
    const dataInflacion: number[] = [];

    for (let i = 0; i <= puntosGrafico; i++) {
      const diasTranscurridos = Math.round((i / puntosGrafico) * dias);
      const mesesTranscurridos = diasTranscurridos / 30;

      labels.push(`${Math.round(mesesTranscurridos)} m`);

      // Plazo Fijo
      const interesParcial = (capitalNum * tna * (diasTranscurridos / 365)) / 100;
      dataPF.push(capitalNum + interesParcial);

      // Dólar Blue
      const dolarParcial = dolarInicio * Math.pow(1 + devaluacion, mesesTranscurridos);
      dataBlue.push(usdInicio * dolarParcial);

      // Dólar MEP
      const dolarMEPParcial = dolarMEPInicio * Math.pow(1 + devaluacion, mesesTranscurridos);
      dataMEP.push(usdMEPInicio * dolarMEPParcial);

      // Diversificado
      const pfParcial =
        capitalPF * (1 + (interesParcial / capitalNum) * (allocation.plazoFijo / 100));
      const blueParcial = capitalBlue * (dolarParcial / dolarInicio);
      const mepParcial = capitalMEP * (dolarMEPParcial / dolarMEPInicio);
      dataDiversificado.push(pfParcial + blueParcial + mepParcial);

      // Línea de inflación
      const inflacionParcial = Math.pow(1 + inflacion, mesesTranscurridos);
      dataInflacion.push(capitalNum * inflacionParcial);
    }

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
      chartData: {
        labels,
        datasets: [
          {
            label: 'Plazo Fijo',
            data: dataPF,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: 'Dólar Blue',
            data: dataBlue,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: 'Dólar MEP',
            data: dataMEP,
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: 'Diversificado',
            data: dataDiversificado,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            tension: 0.4,
          },
          {
            label: 'Inflación',
            data: dataInflacion,
            borderColor: '#EF4444',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
          },
        ],
      },
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
