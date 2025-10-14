import React, { useState } from 'react';
import { FaBitcoin } from 'react-icons/fa';

export default function CryptoCalculator() {
  const [btcAmount, setBtcAmount] = useState(0.1);
  const btcPrice = 20000; // Precio de referencia

  const convertedAmount = (btcAmount * btcPrice).toFixed(2);

  return (
    <div className="mx-auto text-white p-6 md:p-10 rounded-2xl max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaBitcoin className="text-accent-emerald text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Conversión <span className="gradient-text">Cripto</span>
        </h2>
        <p className="text-secondary text-sm max-w-2xl mx-auto">
          Convierte Bitcoin a pesos argentinos
        </p>
      </div>

      <div className="glass-strong p-5 rounded-xl border border-white/5 mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
          Cantidad en BTC
        </label>
        <input
          type="number"
          value={btcAmount}
          onChange={(e) => setBtcAmount(Number(e.target.value))}
          className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
          step="0.001"
          placeholder="0.1"
        />
      </div>

      <div className="p-6 glass-strong rounded-xl border border-accent-emerald/20 text-center">
        <p className="text-xs uppercase tracking-wider text-secondary mb-2">Valor en ARS</p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-accent-emerald">
          ARS {convertedAmount}
        </p>
      </div>
    </div>
  );
}
