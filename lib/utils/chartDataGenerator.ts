/**
 * Chart data generation utilities for financial strategies visualization
 */

import type { ChartData } from 'chart.js';

/**
 * Generate chart data for strategy comparison over time
 */
export function generateStrategyChartData(params: {
  capital: number;
  dias: number;
  tna: number;
  dolarInicio: number;
  dolarMEPInicio: number;
  devaluacion: number;
  inflacion: number;
  allocation: { plazoFijo: number; dolarBlue: number; dolarMEP: number };
}): ChartData<'line'> {
  const { capital, dias, tna, dolarInicio, dolarMEPInicio, devaluacion, inflacion, allocation } =
    params;

  const puntosGrafico = 20;
  const labels: string[] = [];
  const dataPF: number[] = [];
  const dataBlue: number[] = [];
  const dataMEP: number[] = [];
  const dataDiversificado: number[] = [];
  const dataInflacion: number[] = [];

  const usdInicio = capital / dolarInicio;
  const usdMEPInicio = capital / dolarMEPInicio;
  const capitalPF = capital * (allocation.plazoFijo / 100);
  const capitalBlue = capital * (allocation.dolarBlue / 100);
  const capitalMEP = capital * (allocation.dolarMEP / 100);

  for (let i = 0; i <= puntosGrafico; i++) {
    const diasTranscurridos = Math.round((i / puntosGrafico) * dias);
    const mesesTranscurridos = diasTranscurridos / 30;

    labels.push(`${Math.round(mesesTranscurridos)} m`);

    // Plazo Fijo
    const interesParcial = (capital * tna * (diasTranscurridos / 365)) / 100;
    dataPF.push(capital + interesParcial);

    // Dólar Blue
    const dolarParcial = dolarInicio * Math.pow(1 + devaluacion, mesesTranscurridos);
    dataBlue.push(usdInicio * dolarParcial);

    // Dólar MEP
    const dolarMEPParcial = dolarMEPInicio * Math.pow(1 + devaluacion, mesesTranscurridos);
    dataMEP.push(usdMEPInicio * dolarMEPParcial);

    // Diversificado
    const pfParcial = capitalPF * (1 + (interesParcial / capital) * (allocation.plazoFijo / 100));
    const blueParcial = capitalBlue * (dolarParcial / dolarInicio);
    const mepParcial = capitalMEP * (dolarMEPParcial / dolarMEPInicio);
    dataDiversificado.push(pfParcial + blueParcial + mepParcial);

    // Inflación
    const inflacionParcial = Math.pow(1 + inflacion, mesesTranscurridos);
    dataInflacion.push(capital * inflacionParcial);
  }

  return {
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
  };
}
