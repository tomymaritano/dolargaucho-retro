import React, { useState } from "react";
import useDolar from "../hooks/useDolar";
import { FaExchangeAlt, FaChevronDown, FaShareAlt } from "react-icons/fa";

const CurrencyConverter: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [amount, setAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("Oficial");
  const [conversionType, setConversionType] = useState<"buy" | "sell">("buy");

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);

  // Función para formatear números con separadores de miles
  const formatCurrency = (value: number, currency: "ARS" | "USD") => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calcular conversión con formato adecuado
  let conversion = "0,00";
  if (selectedDolar) {
    conversion =
      conversionType === "buy"
        ? formatCurrency(amount / selectedDolar.venta, "USD") // ARS a USD
        : formatCurrency(amount * selectedDolar.compra, "ARS"); // USD a ARS
  }

  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: "Consulta el dólar con Dólar Gaucho 💰",
          text: `El ${selectedCurrency} hoy: Compra ${formatCurrency(
            selectedDolar?.compra || 0,
            "ARS"
          )} | Venta ${formatCurrency(
            selectedDolar?.venta || 0,
            "ARS"
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
    <div className="p-6 m-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl max-w-lg w-full font-sans transition-all duration-300 hover:shadow-2xl dark:bg-black/30">
      {loading && (
        <p className="text-gray-500 text-center animate-pulse">
          Cargando cotizaciones...
        </p>
      )}
      {error && <p className="text-red-500 text-center">Error al cargar datos</p>}

      <div className="flex flex-col space-y-6">
        {/* Input de Monto */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-right text-black dark:text-white dark:bg-gray-900"
            placeholder={`Ingrese monto en ${
              conversionType === "buy" ? "ARS" : "USD"
            }`}
          />
          <span className="absolute left-4 top-5 text-gray-500 font-semibold">
            {conversionType === "buy" ? "ARS" : "USD"}
          </span>
        </div>

        {/* Botón de conversión */}
        <button
          onClick={() =>
            setConversionType(conversionType === "buy" ? "sell" : "buy")
          }
          className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-400 flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>

        {/* Selector de tipo de dólar */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-4 text-lg bg-gray-800 text-white border border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {dolar.map((tipo) => (
              <option key={tipo.nombre} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-5 text-gray-500 pointer-events-none" />
        </div>

        {/* Resultado de la conversión con formato correcto */}
        <div className="text-center text-2xl font-bold text-gray-100 p-4 border border-gray-700 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 transition-all duration-300">
          {conversion}
        </div>

        {/* Botón para compartir */}
        <button
          onClick={handleShare}
          className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg hover:from-green-600 hover:to-teal-400 flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
        >
          <FaShareAlt /> Compartir
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;