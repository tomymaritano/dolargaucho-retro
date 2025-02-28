import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(1000);
  const [exchangeRate, setExchangeRate] = useState(800); // Suponiendo un valor fijo por ahora
  const [conversionType, setConversionType] = useState<"buy" | "sell">("buy");

  const conversion =
    conversionType === "buy"
      ? (amount / exchangeRate).toFixed(2)
      : (amount * exchangeRate).toFixed(2);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">💵 Conversor de Moneda</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-3 text-xl text-black font-semibold rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() =>
          setConversionType(conversionType === "buy" ? "sell" : "buy")
        }
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg flex items-center gap-2"
      >
        <FaExchangeAlt /> Invertir Conversión
      </button>

      <p className="text-2xl font-bold mt-6">
        {conversionType === "buy" ? "USD" : "ARS"} {conversion}
      </p>
    </div>
  );
}