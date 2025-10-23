/**
 * useUVACalculation Hook
 *
 * Single Responsibility: Handle UVA credit calculation logic
 * Extracted from CalculadoraUVA.tsx
 */

import { useState, useMemo } from 'react';
import { useUltimoUVA } from '@/hooks/useFinanzas';

export interface UVAProyeccion {
  mes: number;
  uva: number;
  cuota: number;
}

export interface UVAResult {
  creditoEnPesos: number;
  creditoEnUVAs: number;
  valorUVAActual: number;
  cuotaEnUVAs: number;
  cuotaInicialPesos: number;
  tasaMensual: number;
  proyecciones: UVAProyeccion[];
  totalAPagar: number;
  plazoMeses: number;
  tasaAnual: number;
}

export function useUVACalculation() {
  const [montoCredito, setMontoCredito] = useState<string>('50000000');
  const [plazoMeses, setPlazoMeses] = useState<number>(240);
  const [tasaAnual, setTasaAnual] = useState<string>('8');
  const [variacionUVAAnual, setVariacionUVAAnual] = useState<string>('90');

  const { data: ultimoUVA } = useUltimoUVA();

  const handleMontoChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setMontoCredito(cleaned);
  };

  const resultado = useMemo((): UVAResult | null => {
    const creditoNum = parseFloat(montoCredito.replace(/\./g, ''));
    const tasaNum = parseFloat(tasaAnual);
    const variacionNum = parseFloat(variacionUVAAnual);

    if (
      isNaN(creditoNum) ||
      creditoNum <= 0 ||
      isNaN(tasaNum) ||
      tasaNum <= 0 ||
      isNaN(variacionNum) ||
      plazoMeses <= 0 ||
      !ultimoUVA
    ) {
      return null;
    }

    const valorUVAActual = ultimoUVA.valor;
    const creditoEnUVAs = creditoNum / valorUVAActual;

    // Calcular cuota en UVAs (sistema francés)
    const tasaMensual = tasaNum / 100 / 12;
    const cuotaEnUVAs =
      (creditoEnUVAs * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) /
      (Math.pow(1 + tasaMensual, plazoMeses) - 1);

    const cuotaInicialPesos = cuotaEnUVAs * valorUVAActual;
    const variacionMensualUVA = variacionNum / 100 / 12;

    const proyecciones: UVAProyeccion[] = [
      { mes: 1, uva: valorUVAActual, cuota: cuotaInicialPesos },
      {
        mes: 12,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 12),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 12),
      },
      {
        mes: 60,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 60),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 60),
      },
      {
        mes: 120,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 120),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 120),
      },
      {
        mes: plazoMeses,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, plazoMeses),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, plazoMeses),
      },
    ];

    const totalAPagar =
      cuotaInicialPesos * plazoMeses * Math.pow(1 + variacionMensualUVA, plazoMeses / 2);

    return {
      creditoEnPesos: creditoNum,
      creditoEnUVAs,
      valorUVAActual,
      cuotaEnUVAs,
      cuotaInicialPesos,
      tasaMensual: tasaMensual * 100,
      proyecciones,
      totalAPagar,
      plazoMeses,
      tasaAnual: tasaNum,
    };
  }, [montoCredito, plazoMeses, tasaAnual, variacionUVAAnual, ultimoUVA]);

  return {
    // State
    montoCredito,
    plazoMeses,
    tasaAnual,
    variacionUVAAnual,
    ultimoUVA,
    // Handlers
    setMontoCredito: handleMontoChange,
    setPlazoMeses,
    setTasaAnual,
    setVariacionUVAAnual,
    // Result
    resultado,
  };
}
