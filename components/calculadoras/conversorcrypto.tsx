import React, { useState } from "react";

export default function CryptoCalculator() {
  const [btcAmount, setBtcAmount] = useState(0.1);
  const btcPrice = 20000; // Precio de referencia

  const convertedAmount = (btcAmount * btcPrice).toFixed(2);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">🪙 Conversión Cripto</h2>

      <input
        type="number"
        value={btcAmount}
        onChange={(e) => setBtcAmount(Number(e.target.value))}
        className="w-full p-3 text-xl text-black font-semibold rounded-lg focus:ring-2 focus:ring-green-500"
      />

      <p className="text-2xl font-bold mt-6">ARS {convertedAmount}</p>
    </div>
  );
}