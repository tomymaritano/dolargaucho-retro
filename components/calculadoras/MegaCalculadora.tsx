'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useTasaPlazoFijo, useInflacionInteranual, useUltimaInflacion } from '@/hooks/useFinanzas';
import { useDolarByType } from '@/hooks/useDolarQuery';
import { useDolarHistorico } from '@/hooks/useDolarHistorico';
import {
  FaChartLine,
  FaDollarSign,
  FaPercent,
  FaArrowUp,
  FaArrowDown,
  FaTrophy,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  CalculatorLayout,
  CalculatorInput,
  CalculatorResultCard,
  CalculatorInfoBanner,
  CalculatorChartContainer,
} from './CalculatorLayout';

Chart.register(...registerables);

interface PortfolioAllocation {
  plazoFijo: number; // %
  dolarBlue: number; // %
  dolarMEP: number; // %
}

export function MegaCalculadora() {
  // Inputs principales
  const [capital, setCapital] = useState<string>('1000000');
  const [dias, setDias] = useState<number>(180);

  // Allocation para estrategia diversificada
  const [allocation, setAllocation] = useState<PortfolioAllocation>({
    plazoFijo: 40,
    dolarBlue: 30,
    dolarMEP: 30,
  });

  // Dates for plazo fijo
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 180);
    return date.toISOString().split('T')[0];
  });

  // Data hooks
  const { data: tasas } = useTasaPlazoFijo();
  const { data: dolarBlue } = useDolarByType('blue');
  const { data: dolarMEP } = useDolarByType('bolsa'); // MEP = Dólar Bolsa
  const { data: inflacionData } = useInflacionInteranual();
  const { data: ultimaInflacion } = useUltimaInflacion();

  // Historical data for devaluation calculation (1 month ago)
  const fechaMesAnterior = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }, []);
  const { data: dolarHistorico } = useDolarHistorico(fechaMesAnterior);

  // Automatic calculations from API data
  const inflacionMensualAuto = ultimaInflacion?.valor ?? 7; // Default 7% if not available
  const devaluacionMensualAuto = useMemo(() => {
    if (!dolarBlue || !dolarHistorico) return 8; // Default 8%

    const blueHistorico = dolarHistorico.find(d => d.nombre === 'Blue');
    if (!blueHistorico) return 8;

    const devaluacion = ((dolarBlue.venta - blueHistorico.venta) / blueHistorico.venta) * 100;
    return Math.max(0, devaluacion); // No negative devaluations
  }, [dolarBlue, dolarHistorico]);

  const spreadMEPAuto = useMemo(() => {
    if (!dolarBlue || !dolarMEP) return 5; // Default 5%

    // Spread: % que el MEP es más barato que el blue
    const spread = ((dolarBlue.venta - dolarMEP.venta) / dolarBlue.venta) * 100;
    return Math.max(0, spread); // Can be negative but we show 0 minimum
  }, [dolarBlue, dolarMEP]);

  // Auto-calculate dias from date range
  useEffect(() => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays !== dias) {
      setDias(diffDays);
    }
  }, [fechaInicio, fechaFin, dias]);

  // Cálculos avanzados
  const analisisCompleto = useMemo(() => {
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
    const dolarMEPInicio = dolarMEP?.venta || dolarInicio * (1 - spreadMEPNum); // Use real MEP or calculate
    const dolarMEPFinal = dolarMEPInicio * Math.pow(1 + devaluacion, meses);

    // Inflación acumulada
    const inflacionAcumulada = (Math.pow(1 + inflacion, meses) - 1) * 100;

    // ========== ESTRATEGIAS ==========

    // 1. PLAZO FIJO
    const interesPF = (capitalNum * tna * (dias / 365)) / 100;
    const totalPF = capitalNum + interesPF;
    const rendimientoPF = ((totalPF - capitalNum) / capitalNum) * 100;
    const rendimientoRealPF = ((totalPF / capitalNum) / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 2. DÓLAR BLUE
    const usdInicio = capitalNum / dolarInicio;
    const totalBlue = usdInicio * dolarFinal;
    const rendimientoBlue = ((totalBlue - capitalNum) / capitalNum) * 100;
    const rendimientoRealBlue = ((totalBlue / capitalNum) / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 3. DÓLAR MEP
    const usdMEPInicio = capitalNum / dolarMEPInicio;
    const totalMEP = usdMEPInicio * dolarMEPFinal;
    const rendimientoMEP = ((totalMEP - capitalNum) / capitalNum) * 100;
    const rendimientoRealMEP = ((totalMEP / capitalNum) / (1 + inflacionAcumulada / 100) - 1) * 100;

    // 4. PORTAFOLIO DIVERSIFICADO
    const capitalPF = capitalNum * (allocation.plazoFijo / 100);
    const capitalBlue = capitalNum * (allocation.dolarBlue / 100);
    const capitalMEP = capitalNum * (allocation.dolarMEP / 100);

    const retornoPF = capitalPF * (1 + rendimientoPF / 100);
    const retornoBlue = capitalBlue * (1 + rendimientoBlue / 100);
    const retornoMEP = capitalMEP * (1 + rendimientoMEP / 100);

    const totalDiversificado = retornoPF + retornoBlue + retornoMEP;
    const rendimientoDiversificado = ((totalDiversificado - capitalNum) / capitalNum) * 100;
    const rendimientoRealDiversificado = ((totalDiversificado / capitalNum) / (1 + inflacionAcumulada / 100) - 1) * 100;

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
      Math.pow(allocation.plazoFijo / 100 * volatilidadPF, 2) +
      Math.pow(allocation.dolarBlue / 100 * volatilidadBlue, 2) +
      Math.pow(allocation.dolarMEP / 100 * volatilidadMEP, 2)
    );

    // Sharpe Ratio (rendimiento / volatilidad)
    const sharpeRatioPF = rendimientoRealPF / volatilidadPF;
    const sharpeRatioBlue = rendimientoRealBlue / volatilidadBlue;
    const sharpeRatioMEP = rendimientoRealMEP / volatilidadMEP;
    const sharpeRatioDiversificado = rendimientoRealDiversificado / volatilidadDiversificado;

    // ========== MEJOR ESTRATEGIA ==========

    const estrategias = [
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

    const mejorPorRendimiento = [...estrategias].sort((a, b) => b.rendimientoReal - a.rendimientoReal)[0];
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
      const pfParcial = capitalPF * (1 + (interesParcial / capitalNum) * (allocation.plazoFijo / 100));
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
  }, [capital, dias, allocation, devaluacionMensualAuto, inflacionMensualAuto, spreadMEPAuto, dolarBlue, dolarMEP, tasas]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(18, 23, 46, 0.95)',
        titleColor: '#fff',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number;
            return `${context.dataset.label}: $${value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: (value: number | string) => `$${Number(value).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
  };

  const handleCapitalChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setCapital(cleaned);
  };

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora <span className="gradient-text">Financiera Avanzada</span>
        </>
      }
      description="Análisis completo de inversiones con TIR, VAN, Sharpe Ratio y comparación de estrategias"
      maxWidth="7xl"
    >
      {/* Banners informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {dolarBlue && (
          <CalculatorInfoBanner
            title="Dólar Blue Actual"
            subtitle="Cotización de venta"
            value={`$${dolarBlue.venta.toFixed(2)}`}
          />
        )}
        {tasas && tasas.length > 0 && (
          <CalculatorInfoBanner
            title="TNA Mercado"
            subtitle="Tasa Nominal Anual"
            value={`${((tasas[0]?.tnaClientes || 0) * 100).toFixed(2)}%`}
          />
        )}
        {inflacionData && inflacionData.length > 0 && (
          <CalculatorInfoBanner
            title="Inflación Interanual"
            subtitle="Índice actual"
            value={`${inflacionData[inflacionData.length - 1].valor.toFixed(1)}%`}
          />
        )}
      </div>

      {/* Inputs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Capital Inicial</label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={formatNumber(capital)}
              onChange={(e) => handleCapitalChange(e.target.value)}
              placeholder="1.000.000"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald/50 focus:outline-none transition-all text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-3 bg-panel border border-border rounded-xl focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald/50 focus:outline-none transition-all text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-4 py-3 bg-panel border border-border rounded-xl focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald/50 focus:outline-none transition-all text-foreground"
          />
        </div>

        <CalculatorInput
          label="Plazo (días)"
          value={dias}
          onChange={(value) => setDias(Number(value))}
          type="number"
          min="30"
          max="730"
        />
      </div>

      {/* Parámetros económicos automáticos desde API */}
      <div className="mb-8 p-6 rounded-xl bg-panel/50 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <FaChartLine className="text-accent-emerald" />
          Parámetros Económicos (Automáticos desde API)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-secondary uppercase mb-2">Inflación Mensual</label>
            <div className="relative">
              <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={`${inflacionMensualAuto.toFixed(2)}%`}
                readOnly
                className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-border rounded-xl text-foreground cursor-not-allowed"
                title={ultimaInflacion ? `Dato del ${ultimaInflacion.fecha}` : 'Valor estimado'}
              />
            </div>
            <p className="text-xs text-secondary mt-1">
              {ultimaInflacion ? `📊 Dato oficial del ${ultimaInflacion.fecha}` : '⚠️ Usando valor estimado'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary uppercase mb-2">Devaluación Mensual</label>
            <div className="relative">
              <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={`${devaluacionMensualAuto.toFixed(2)}%`}
                readOnly
                className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-border rounded-xl text-foreground cursor-not-allowed"
                title="Calculado desde dólar blue del último mes"
              />
            </div>
            <p className="text-xs text-secondary mt-1">
              {dolarHistorico && dolarBlue ? '📈 Calculado desde dato histórico' : '⚠️ Usando valor estimado'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary uppercase mb-2">Spread MEP vs Blue</label>
            <div className="relative">
              <FaPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={`${spreadMEPAuto.toFixed(2)}%`}
                readOnly
                className="w-full pl-10 pr-4 py-3 font-mono font-bold bg-dark-light border border-border rounded-xl text-foreground cursor-not-allowed"
                title={dolarMEP ? `Blue: $${dolarBlue?.venta.toFixed(2)} | MEP: $${dolarMEP.venta.toFixed(2)}` : 'Calculado estimado'}
              />
            </div>
            <p className="text-xs text-secondary mt-1">
              {dolarMEP ? `💵 Blue $${dolarBlue?.venta.toFixed(2)} | MEP $${dolarMEP.venta.toFixed(2)}` : '⚠️ Usando valor estimado'}
            </p>
          </div>
        </div>
      </div>

      {/* Allocation para estrategia diversificada */}
      <div className="mb-8 p-6 rounded-xl bg-panel/50 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
          Portafolio Diversificado - Asignación de Capital
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CalculatorInput
            label="Plazo Fijo (%)"
            value={allocation.plazoFijo}
            onChange={(v) => setAllocation({ ...allocation, plazoFijo: Number(v) })}
            type="number"
            min="0"
            max="100"
            prefix="%"
          />
          <CalculatorInput
            label="Dólar Blue (%)"
            value={allocation.dolarBlue}
            onChange={(v) => setAllocation({ ...allocation, dolarBlue: Number(v) })}
            type="number"
            min="0"
            max="100"
            prefix="%"
          />
          <CalculatorInput
            label="Dólar MEP (%)"
            value={allocation.dolarMEP}
            onChange={(v) => setAllocation({ ...allocation, dolarMEP: Number(v) })}
            type="number"
            min="0"
            max="100"
            prefix="%"
          />
        </div>
        <div className="mt-3 text-xs text-secondary">
          Total asignado: {allocation.plazoFijo + allocation.dolarBlue + allocation.dolarMEP}%
          {allocation.plazoFijo + allocation.dolarBlue + allocation.dolarMEP !== 100 && (
            <span className="text-warning ml-2">⚠️ Debe sumar 100%</span>
          )}
        </div>
      </div>

      {/* Resultados */}
      {analisisCompleto && (
        <>
          {/* Mejor estrategia - Destacado */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent-emerald/20 via-accent-teal/20 to-accent-emerald/20 border border-accent-emerald/30">
            <div className="flex items-start gap-4">
              <FaTrophy className="text-3xl text-accent-emerald" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Mejor Estrategia (por Rendimiento Real)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-secondary uppercase mb-1">Estrategia</p>
                    <p className="text-xl font-bold text-accent-emerald">{analisisCompleto.mejorPorRendimiento.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase mb-1">Rendimiento Real</p>
                    <p className="text-xl font-bold text-foreground">{analisisCompleto.mejorPorRendimiento.rendimientoReal.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase mb-1">Total Final</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(analisisCompleto.mejorPorRendimiento.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase mb-1">Sharpe Ratio</p>
                    <p className="text-xl font-bold text-foreground">{analisisCompleto.mejorPorRendimiento.sharpe.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparación de todas las estrategias */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Comparación Completa de Estrategias
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analisisCompleto.estrategias.map((est, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-border glass-strong">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-foreground">{est.nombre}</h4>
                    {est.rendimientoReal > 0 ? (
                      <FaArrowUp className="text-success text-lg" />
                    ) : (
                      <FaArrowDown className="text-error text-lg" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-secondary uppercase">Rend. Nominal</p>
                      <p className={`font-semibold ${est.rendimiento > 0 ? 'text-success' : 'text-error'}`}>
                        {est.rendimiento.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary uppercase">Rend. Real</p>
                      <p className={`font-semibold ${est.rendimientoReal > 0 ? 'text-success' : 'text-error'}`}>
                        {est.rendimientoReal.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary uppercase">VAN</p>
                      <p className="font-semibold text-foreground">{formatCurrency(est.van)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary uppercase">TIR Mensual</p>
                      <p className="font-semibold text-foreground">{est.tir.toFixed(3)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary uppercase">Sharpe Ratio</p>
                      <p className="font-semibold text-foreground">{est.sharpe.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary uppercase">Volatilidad</p>
                      <p className="font-semibold text-warning">{est.riesgo.toFixed(1)}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-secondary uppercase">Total Final</p>
                      <p className="font-bold text-foreground text-lg">{formatCurrency(est.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de evolución */}
          <CalculatorChartContainer title="Evolución Comparativa de Estrategias" height="h-96">
            <Line data={analisisCompleto.chartData} options={chartOptions} />
          </CalculatorChartContainer>

          {/* Métricas adicionales */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <CalculatorResultCard
              label="Capital Inicial"
              value={formatCurrency(analisisCompleto.capital)}
              variant="info"
            />
            <CalculatorResultCard
              label="Plazo"
              value={`${analisisCompleto.meses} meses`}
              sublabel={`${analisisCompleto.dias} días`}
              variant="info"
            />
            <CalculatorResultCard
              label="Inflación Proyectada"
              value={`${analisisCompleto.inflacionAcumulada.toFixed(1)}%`}
              sublabel="Acumulada"
              variant="warning"
            />
            <CalculatorResultCard
              label="Devaluación Proyectada"
              value={`$${analisisCompleto.dolarFinal.toFixed(2)}`}
              sublabel={`Desde $${analisisCompleto.dolarInicio.toFixed(2)}`}
              variant="info"
            />
          </div>

          {/* Advertencias */}
          <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="text-warning text-lg flex-shrink-0 mt-0.5" />
              <div className="text-xs text-secondary">
                <p className="font-semibold text-foreground mb-2">Consideraciones importantes:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong className="text-foreground">VAN (Valor Actual Neto):</strong> Valor presente del flujo futuro descontado por inflación. VAN positivo indica ganancia real.</li>
                  <li><strong className="text-foreground">TIR (Tasa Interna de Retorno):</strong> Rentabilidad mensual efectiva. Compará con la inflación mensual ({analisisCompleto.inflacionAcumulada.toFixed(1)}% / {analisisCompleto.meses} = {(analisisCompleto.inflacionAcumulada / analisisCompleto.meses).toFixed(2)}%).</li>
                  <li><strong className="text-foreground">Sharpe Ratio:</strong> Rendimiento ajustado por riesgo. Mayor valor = mejor relación riesgo/retorno.</li>
                  <li><strong className="text-foreground">Rendimiento Real:</strong> Ya descontada la inflación. Este es tu ganancia/pérdida de poder adquisitivo real.</li>
                  <li>Las proyecciones asumen tasas constantes. La realidad puede variar significativamente.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}
