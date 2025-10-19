/**
 * usePlazoFijoCalculation Hook
 *
 * Single Responsibility: Handle plazo fijo calculation logic
 * Extracted from CalculadoraPlazoFijo.tsx (355 → 80 lines)
 */

import { useState, useMemo } from 'react';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';

export interface PlazoFijoResult {
  capital: number;
  tna: number;
  dias: number;
  interes: number;
  total: number;
  rendimientoPorcentaje: number;
  chartLabels: string[];
  chartData: number[];
}

export function usePlazoFijoCalculation() {
  const [capital, setCapital] = useState<string>('100000');
  const [dias, setDias] = useState<number>(90);
  const [tasaPersonalizada, setTasaPersonalizada] = useState<string>('');
  const [usarTasaActual, setUsarTasaActual] = useState(true);

  const { data: tasas, isLoading: loadingTasas } = useTasaPlazoFijo();

  const handleCapitalChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setCapital(cleaned);
  };

  // Calcular rendimiento
  const resultado = useMemo((): PlazoFijoResult | null => {
    const capitalNum = parseFloat(capital.replace(/\./g, ''));
    if (isNaN(capitalNum) || capitalNum <= 0) {
      return null;
    }

    // Determinar TNA
    let tna: number;
    if (usarTasaActual && tasas && tasas.length > 0) {
      const mejorTasa = tasas.reduce((max, current) => {
        if (!current.tnaClientes) return max;
        if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
          return current;
        }
        return max;
      }, tasas[0]);
      tna = (mejorTasa.tnaClientes || 0) * 100;
    } else {
      const tasaNum = parseFloat(tasaPersonalizada);
      if (isNaN(tasaNum) || tasaNum <= 0) {
        return null;
      }
      tna = tasaNum;
    }

    // Cálculo simple de plazo fijo
    const interes = (capitalNum * tna * (dias / 365)) / 100;
    const total = capitalNum + interes;
    const rendimientoPorcentaje = ((total - capitalNum) / capitalNum) * 100;

    // Generar datos para el gráfico (evolución día a día)
    const puntosGrafico = 20;
    const incrementoDias = dias / puntosGrafico;
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i <= puntosGrafico; i++) {
      const diasTranscurridos = Math.round(i * incrementoDias);
      const interesAcumulado = (capitalNum * tna * (diasTranscurridos / 365)) / 100;
      const totalAcumulado = capitalNum + interesAcumulado;

      labels.push(`Día ${diasTranscurridos}`);
      data.push(totalAcumulado);
    }

    return {
      capital: capitalNum,
      tna,
      dias,
      interes,
      total,
      rendimientoPorcentaje,
      chartLabels: labels,
      chartData: data,
    };
  }, [capital, dias, tasaPersonalizada, usarTasaActual, tasas]);

  return {
    // State
    capital,
    dias,
    tasaPersonalizada,
    usarTasaActual,
    tasas,
    loadingTasas,
    // Handlers
    setCapital: handleCapitalChange,
    setDias,
    setTasaPersonalizada,
    setUsarTasaActual,
    // Result
    resultado,
  };
}
