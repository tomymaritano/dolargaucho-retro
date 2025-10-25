import React, { useState } from 'react';
import { FaBitcoin } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';

export default function CryptoCalculator() {
  const [btcAmount, setBtcAmount] = useState(0.1);
  const btcPrice = 20000; // Precio de referencia

  const convertedAmount = (btcAmount * btcPrice).toFixed(2);

  return (
    <div className="mx-auto text-foreground p-6 md:p-10 rounded-2xl max-w-7xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaBitcoin className="text-brand text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Conversión <span className="gradient-text">Cripto</span>
        </h2>
        <p className="text-secondary text-sm max-w-7xl mx-auto">
          Convierte Bitcoin a pesos argentinos
        </p>
      </div>

      <Card
        variant="elevated"
        padding="md"
        className="border border-border/5 mb-6 hover:border-brand/40 transition-all duration-300"
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
          Cantidad en BTC
        </label>
        <input
          type="number"
          value={btcAmount}
          onChange={(e) => setBtcAmount(Number(e.target.value))}
          className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border/5 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
          step="0.001"
          placeholder="0.1"
        />
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        className="border border-brand/20 bg-brand/5 text-center hover:border-brand/40 transition-all duration-300"
      >
        <p className="text-xs uppercase tracking-wider text-secondary mb-2">Valor en ARS</p>
        <p className="text-3xl md:text-4xl font-bold font-mono text-brand">ARS {convertedAmount}</p>
      </Card>
    </div>
  );
}
