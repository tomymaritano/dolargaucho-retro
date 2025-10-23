/**
 * useInflacionCalculation Hook
 *
 * Single Responsibility: Handle inflation calculation logic and data fetching
 * Extracted from CalculadoraInflacion.tsx
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

export function useInflacionCalculation() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState<number>(84.5);
  const [years, setYears] = useState(5);
  const [futureValues, setFutureValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [historicalRate, setHistoricalRate] = useState<number | null>(null);

  // Fetch current inflation rate
  useEffect(() => {
    const fetchInflationRate = async () => {
      try {
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const lastValue = data[data.length - 1];
          setInflationRate(lastValue.valor);
        }
      } catch (error) {
        logger.error('Error al obtener la inflación', error, {
          component: 'useInflacionCalculation',
          endpoint: 'inflacionInteranual',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInflationRate();
  }, []);

  // Fetch historical inflation if custom date is used
  useEffect(() => {
    if (!useCustomDate || !startDate) {
      setHistoricalRate(null);
      return;
    }

    const fetchHistoricalRate = async () => {
      try {
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const selectedDate = new Date(startDate);
          const closest = data.reduce((prev: any, curr: any) => {
            const currDate = new Date(curr.fecha);
            const prevDate = new Date(prev.fecha);
            return Math.abs(currDate.getTime() - selectedDate.getTime()) <
              Math.abs(prevDate.getTime() - selectedDate.getTime())
              ? curr
              : prev;
          });
          setHistoricalRate(closest.valor);
        }
      } catch (error) {
        logger.error('Error al obtener inflación histórica', error, {
          component: 'useInflacionCalculation',
          startDate,
        });
      }
    };

    fetchHistoricalRate();
  }, [useCustomDate, startDate]);

  // Calculate future values based on inflation
  useEffect(() => {
    const activeRate = useCustomDate && historicalRate !== null ? historicalRate : inflationRate;
    const values: number[] = [];
    for (let i = 0; i <= years; i++) {
      values.push(initialAmount / Math.pow(1 + activeRate / 100, i));
    }
    setFutureValues(values);
  }, [initialAmount, inflationRate, historicalRate, years, useCustomDate]);

  const activeRate = useCustomDate && historicalRate !== null ? historicalRate : inflationRate;

  return {
    // State
    initialAmount,
    inflationRate,
    years,
    futureValues,
    loading,
    useCustomDate,
    startDate,
    historicalRate,
    activeRate,
    // Setters
    setInitialAmount,
    setInflationRate,
    setYears,
    setUseCustomDate,
    setStartDate,
  };
}
