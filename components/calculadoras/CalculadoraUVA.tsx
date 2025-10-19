import React, { useState, useMemo } from 'react';
import { useUltimoUVA } from '@/hooks/useFinanzas';
import { FaDollarSign, FaCalendarAlt, FaCalculator } from 'react-icons/fa';
import {
  CalculatorLayout,
  CalculatorInput,
  CalculatorResultCard,
  CalculatorInfoBanner,
} from './CalculatorLayout';

interface CalculadoraUVAProps {
  showHeader?: boolean;
}

export function CalculadoraUVA({ showHeader = true }: CalculadoraUVAProps) {
  const [montoCredito, setMontoCredito] = useState<string>('50000000'); // 50M ARS
  const [plazoMeses, setPlazoMeses] = useState<number>(240); // 20 años
  const [tasaAnual, setTasaAnual] = useState<string>('8'); // 8% TNA típico para UVA
  const [variacionUVAAnual, setVariacionUVAAnual] = useState<string>('90'); // 90% anual estimado

  const { data: ultimoUVA } = useUltimoUVA();

  // Calcular cuota y evolución
  const resultado = useMemo(() => {
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

    // Convertir crédito a UVAs
    const valorUVAActual = ultimoUVA.valor;
    const creditoEnUVAs = creditoNum / valorUVAActual;

    // Calcular cuota en UVAs (sistema francés)
    const tasaMensual = tasaNum / 100 / 12;
    const cuotaEnUVAs =
      (creditoEnUVAs * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) /
      (Math.pow(1 + tasaMensual, plazoMeses) - 1);

    // Cuota inicial en pesos
    const cuotaInicialPesos = cuotaEnUVAs * valorUVAActual;

    // Proyección de cuota a diferentes plazos
    const variacionMensualUVA = variacionNum / 100 / 12;

    const proyecciones = [
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

    // Total a pagar (simplificado - sin considerar amortización)
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

  const handleMontoChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setMontoCredito(cleaned);
  };

  const plazosComunes = [
    { meses: 120, label: '10 años' },
    { meses: 180, label: '15 años' },
    { meses: 240, label: '20 años' },
    { meses: 300, label: '25 años' },
    { meses: 360, label: '30 años' },
  ];

  return (
    <CalculatorLayout
      title={
        <>
          Calculadora de <span className="gradient-text">Crédito UVA</span>
        </>
      }
      description="Simulá tu crédito hipotecario en UVAs y proyectá la evolución de tu cuota"
      showHeader={showHeader}
    >
      {/* UVA Actual Banner */}
      {ultimoUVA && (
        <CalculatorInfoBanner
          title="Valor UVA Actual"
          subtitle={new Date(ultimoUVA.fecha).toLocaleDateString('es-AR')}
          value={formatCurrency(ultimoUVA.valor)}
          loading={false}
        />
      )}

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monto del Crédito */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Monto del Crédito
          </label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={formatNumber(montoCredito)}
              onChange={(e) => handleMontoChange(e.target.value)}
              placeholder="50.000.000"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
          <p className="text-xs text-secondary mt-1">Monto total del crédito en pesos</p>
        </div>

        {/* Plazo */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Plazo del Crédito
          </label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {plazosComunes.map((plazo) => (
              <button
                key={plazo.meses}
                onClick={() => setPlazoMeses(plazo.meses)}
                className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all ${
                  plazoMeses === plazo.meses
                    ? 'bg-brand text-background-dark'
                    : 'glass border border-border text-foreground hover:border-brand/30'
                }`}
              >
                {plazo.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="number"
              value={plazoMeses}
              onChange={(e) => setPlazoMeses(parseInt(e.target.value) || 120)}
              min="12"
              max="480"
              className="w-full pl-10 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
            />
          </div>
          <p className="text-xs text-secondary mt-1">Meses de duración del crédito</p>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tasa de Interés */}
        <CalculatorInput
          label="Tasa de Interés (TNA)"
          value={tasaAnual}
          onChange={setTasaAnual}
          type="number"
          prefix="%"
          placeholder="8"
        />

        {/* Variación UVA Estimada */}
        <CalculatorInput
          label="Variación UVA Anual Estimada"
          value={variacionUVAAnual}
          onChange={setVariacionUVAAnual}
          type="number"
          prefix="%"
          placeholder="90"
        />
      </div>

      {/* Resultados */}
      {resultado && (
        <>
          {/* Main Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CalculatorResultCard
              label="Crédito en UVAs"
              value={`${resultado.creditoEnUVAs.toLocaleString('es-AR', { maximumFractionDigits: 0 })} UVAs`}
              sublabel={`Equivalente a ${formatCurrency(resultado.creditoEnPesos)} hoy`}
              variant="info"
            />

            <CalculatorResultCard
              label="Cuota Inicial (Mes 1)"
              value={formatCurrency(resultado.cuotaInicialPesos)}
              sublabel={`${resultado.cuotaEnUVAs.toLocaleString('es-AR', { maximumFractionDigits: 2 })} UVAs × $${resultado.valorUVAActual.toFixed(2)}`}
              variant="success"
            />
          </div>

          {/* Proyección de Cuotas */}
          <div className="p-6 rounded-xl bg-panel/50 border border-border mb-8">
            <h5 className="text-sm font-semibold text-foreground mb-4">
              Proyección de Cuota en el Tiempo
            </h5>
            <div className="space-y-2">
              {resultado.proyecciones.map((proj, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-background-dark/30 rounded-lg border border-border/50"
                >
                  <span className="text-xs text-secondary font-medium">
                    Mes {proj.mes} ({(proj.mes / 12).toFixed(1)} años)
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {formatCurrency(proj.cuota)}
                    </div>
                    <div className="text-xs text-secondary">UVA: ${proj.uva.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <CalculatorResultCard
              label="Tasa Mensual"
              value={`${resultado.tasaMensual.toFixed(3)}%`}
              variant="info"
            />

            <CalculatorResultCard
              label="Plazo Total"
              value={`${resultado.plazoMeses} meses`}
              sublabel={`${(resultado.plazoMeses / 12).toFixed(1)} años`}
              variant="info"
            />
          </div>

          {/* Advertencia */}
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <div className="flex items-start gap-2">
              <span className="text-warning text-lg">⚠️</span>
              <div className="flex-1 text-xs text-secondary">
                <p className="font-semibold mb-1 text-foreground">Importante</p>
                <p>
                  Esta simulación es aproximada. La cuota UVA aumenta con la inflación (índice CER).
                  Los valores reales pueden variar según las condiciones del banco y la evolución de
                  la UVA.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!resultado && (
        <div className="text-center py-12 text-secondary">
          <FaCalculator className="text-4xl mx-auto mb-3 opacity-50" />
          <p className="text-sm">Ingresá los valores para simular tu crédito UVA</p>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-secondary">
          <span>ℹ️</span>
          <p>
            <strong className="text-foreground">UVA</strong> (Unidad de Valor Adquisitivo): índice
            que se ajusta diariamente según el CER (inflación). Los créditos UVA mantienen el valor
            real de la deuda pero las cuotas aumentan con la inflación.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
