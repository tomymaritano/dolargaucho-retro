import React, { useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(1000);
  const [exchangeRate] = useState(800); // Suponiendo un valor fijo por ahora
  const [conversionType, setConversionType] = useState<'buy' | 'sell'>('buy');

  const conversion =
    conversionType === 'buy'
      ? (amount / exchangeRate).toFixed(2)
      : (amount * exchangeRate).toFixed(2);

  return (
    <div className="mx-auto text-white p-6 md:p-10 rounded-2xl max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaExchangeAlt className="text-accent-emerald text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Conversor de <span className="gradient-text">Moneda</span>
        </h2>
        <p className="text-secondary text-sm max-w-2xl mx-auto">
          Convierte entre pesos argentinos y dólares
        </p>
      </div>

      <div className="glass-strong p-5 rounded-xl border border-white/5 mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
          Monto en {conversionType === 'buy' ? 'ARS' : 'USD'}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
          placeholder="1000"
        />
      </div>

      <button
        onClick={() => setConversionType(conversionType === 'buy' ? 'sell' : 'buy')}
        className="w-full mb-6 bg-accent-emerald hover:bg-accent-teal text-dark py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm"
      >
        <FaExchangeAlt /> Invertir Conversión
      </button>

      <div className="p-6 glass-strong rounded-xl border border-accent-emerald/20 text-center">
        <p className="text-xs uppercase tracking-wider text-secondary mb-2">
          Resultado en {conversionType === 'buy' ? 'USD' : 'ARS'}
        </p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-accent-emerald">
          {conversionType === 'buy' ? 'USD' : 'ARS'} {conversion}
        </p>
      </div>
    </div>
  );
}
