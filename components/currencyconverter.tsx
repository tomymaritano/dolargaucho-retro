import React, { useState } from "react";
import useDolar from "@/hooks/useDolar";
import {
  FaExchangeAlt,
  FaChevronDown,
  FaShareAlt,
} from "react-icons/fa";

const CurrencyConverter: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [amount, setAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("Oficial");
  const [conversionType, setConversionType] = useState<"buy" | "sell">("buy");

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);
  const conversion = selectedDolar
    ? conversionType === "buy"
      ? (amount / selectedDolar.venta).toFixed(2)
      : (amount * selectedDolar.compra).toFixed(2)
    : "0.00";

  // Función para compartir
  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: "Consulta el dólar con Dólar Gaucho 💰",
          text: `El ${selectedCurrency} hoy: Compra $${selectedDolar?.compra.toFixed(
            2
          )} | Venta $${selectedDolar?.venta.toFixed(
            2
          )}\n💸 Convierte tu dinero y consulta cotizaciones en tiempo real gratis en Dólar Gaucho.\n👉 Visítanos: ${window.location.href}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  };

  return (
    <div className="p-6 m-6 bg-[#1c1f2e] border border-gray-800 shadow-xl rounded-2xl max-w-lg w-full font-sans text-white">
      {loading && <p className="text-gray-400 text-center">Cargando cotizaciones...</p>}
      {error && <p className="text-red-400 text-center">Error al cargar datos</p>}

      <div className="flex flex-col space-y-6">
        {/* Input de Monto */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 text-2xl font-semibold border border-gray-600 rounded-lg bg-[#121826] focus:ring-2 focus:ring-[#A78BFA] focus:outline-none text-right text-white"
            placeholder={`Ingrese monto en ${conversionType === "buy" ? "ARS" : "USD"}`}
          />
          <span className="absolute left-4 top-5 text-gray-400 font-semibold">
            {conversionType === "buy" ? "ARS" : "USD"}
          </span>
        </div>

        {/* Botón de conversión */}
        <button
          onClick={() => setConversionType(conversionType === "buy" ? "sell" : "buy")}
          className="w-full py-3 text-lg font-bold text-white bg-[#6D28D9] rounded-lg hover:bg-[#5B21B6] flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>

        {/* Selector de tipo de dólar */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-4 text-lg bg-[#121826] border border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-[#A78BFA] focus:outline-none text-white"
          >
            {dolar.map((tipo) => (
              <option key={tipo.nombre} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Resultado de la conversión */}
        <div className="text-center text-2xl font-bold text-[#A78BFA] p-4 border border-gray-700 rounded-lg bg-[#25273C]">
          {conversionType === "buy" ? "USD" : "ARS"} {conversion}
        </div>

        {/* Botón para compartir */}
        <button
          onClick={handleShare}
          className="w-full py-3 text-lg font-bold text-white bg-gray-950 rounded-lg hover:bg-gray-900 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <FaShareAlt /> Compartir
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;