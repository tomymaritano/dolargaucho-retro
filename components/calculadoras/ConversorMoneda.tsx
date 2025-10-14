import React, { useState, useMemo } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import {
  CalculatorLayout,
  CalculatorResultCard,
  CalculatorModeToggle,
} from './CalculatorLayout';

type ConversionType = 'ars-to-usd' | 'usd-to-ars';
type DolarCasa = 'oficial' | 'blue' | 'bolsa' | 'cripto' | 'tarjeta';

const DOLAR_LABELS: Record<DolarCasa, string> = {
  oficial: 'Oficial',
  blue: 'Blue',
  bolsa: 'MEP/Bolsa',
  cripto: 'Cripto',
  tarjeta: 'Tarjeta',
};

interface ConversorMonedaProps {
  showHeader?: boolean;
}

export default function ConversorMoneda({ showHeader = true }: ConversorMonedaProps) {
  const [amount, setAmount] = useState<string>('1000');
  const [conversionType, setConversionType] = useState<ConversionType>('ars-to-usd');
  const [selectedCasa, setSelectedCasa] = useState<DolarCasa>('blue');

  const { data: dolarData, isLoading } = useDolarQuery();

  // Find the selected dollar type
  const selectedDolar = useMemo(() => {
    if (!dolarData) return null;
    return dolarData.find((d) => d.casa === selectedCasa);
  }, [dolarData, selectedCasa]);

  // Calculate conversion
  const conversion = useMemo(() => {
    const amountNum = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!selectedDolar || isNaN(amountNum) || amountNum <= 0) return null;

    if (conversionType === 'ars-to-usd') {
      // Use venta rate (what you pay to get USD)
      return {
        result: amountNum / selectedDolar.venta,
        rate: selectedDolar.venta,
        operation: 'venta',
      };
    } else {
      // Use compra rate (what you receive selling USD)
      return {
        result: amountNum * selectedDolar.compra,
        rate: selectedDolar.compra,
        operation: 'compra',
      };
    }
  }, [amount, selectedDolar, conversionType]);

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
  };

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setAmount(cleaned);
  };

  const swapConversion = () => {
    setConversionType(conversionType === 'ars-to-usd' ? 'usd-to-ars' : 'ars-to-usd');
  };

  return (
    <CalculatorLayout
      title={
        <>
          Conversor de <span className="gradient-text">Moneda</span>
        </>
      }
      description="Convertí entre pesos argentinos y dólares con cotizaciones en tiempo real"
      showHeader={showHeader}
    >
      {/* Mode Toggle - ARS to USD or USD to ARS */}
      <CalculatorModeToggle
        modes={[
          { label: 'ARS → USD', value: 'ars-to-usd' },
          { label: 'USD → ARS', value: 'usd-to-ars' },
        ]}
        activeMode={conversionType}
        onModeChange={(mode) => setConversionType(mode as ConversionType)}
      />

      {/* Dollar Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Tipo de Cotización
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {(Object.keys(DOLAR_LABELS) as DolarCasa[]).map((casa) => (
            <button
              key={casa}
              onClick={() => setSelectedCasa(casa)}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all border ${
                selectedCasa === casa
                  ? 'bg-accent-emerald text-background-dark border-accent-emerald'
                  : 'glass border-border text-secondary hover:text-foreground hover:border-accent-emerald/30'
              }`}
            >
              {DOLAR_LABELS[casa]}
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rate Info */}
      {selectedDolar && !isLoading && (
        <div className="mb-8 p-5 rounded-xl border border-accent-emerald/20 bg-accent-emerald/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-secondary mb-1">
                Dólar {DOLAR_LABELS[selectedCasa]}
              </p>
              <p className="text-sm text-secondary">
                Compra: ${selectedDolar.compra.toFixed(2)} | Venta: ${selectedDolar.venta.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-secondary mb-1">
                Usando tasa de {conversion?.operation}
              </p>
              <p className="text-2xl font-bold font-mono text-accent-emerald">
                ${conversion?.rate.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Monto en {conversionType === 'ars-to-usd' ? 'ARS' : 'USD'}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-mono">
            {conversionType === 'ars-to-usd' ? 'ARS' : 'USD'}
          </span>
          <input
            type="text"
            value={formatNumber(amount)}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={conversionType === 'ars-to-usd' ? '1.000' : '100'}
            className="w-full pl-16 pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald/50 focus:outline-none transition-all text-foreground"
          />
        </div>
      </div>

      {/* Swap Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={swapConversion}
          className="px-6 py-3 bg-accent-emerald hover:bg-accent-teal text-background-dark rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>
      </div>

      {/* Result */}
      {conversion && (
        <div className="mb-8">
          <CalculatorResultCard
            label={`Resultado en ${conversionType === 'ars-to-usd' ? 'USD' : 'ARS'}`}
            value={
              conversionType === 'ars-to-usd'
                ? `USD ${conversion.result.toFixed(2)}`
                : `ARS ${conversion.result.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
            }
            sublabel={`Cotización ${DOLAR_LABELS[selectedCasa]} - Tasa ${conversion.operation}: $${conversion.rate.toFixed(2)}`}
            variant="success"
          />
        </div>
      )}

      {/* Quick Reference - All Dollar Types */}
      {dolarData && !isLoading && (
        <div className="p-6 rounded-xl bg-panel/50 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Referencia Rápida - Todas las Cotizaciones
          </h3>
          <div className="space-y-2">
            {dolarData.slice(0, 5).map((dolar) => (
              <div
                key={dolar.casa}
                className="flex items-center justify-between p-3 bg-background-dark/30 rounded-lg border border-border/50"
              >
                <span className="text-sm font-medium text-foreground">{dolar.nombre}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-secondary">
                    C: <span className="font-mono font-semibold text-foreground">${dolar.compra.toFixed(2)}</span>
                  </span>
                  <span className="text-secondary">
                    V: <span className="font-mono font-semibold text-foreground">${dolar.venta.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-secondary">
          <p className="text-sm">Cargando cotizaciones...</p>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-secondary">
          <span>ℹ️</span>
          <p>
            <strong className="text-foreground">Compra:</strong> precio al que el banco/cueva te compra dólares.{' '}
            <strong className="text-foreground">Venta:</strong> precio al que te venden dólares.
            Las cotizaciones se actualizan automáticamente.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
