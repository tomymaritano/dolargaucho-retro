import React, { useState } from "react";
import { DolarType } from "../hooks/useDolar";
import {
  FaShareAlt,
  FaCopy,
  FaDollarSign,
  FaMoneyBillWave,
  FaBuilding,
  FaExchangeAlt,
  FaPiggyBank,
} from "react-icons/fa";

interface DolarCardProps {
  data: DolarType;
}

// Íconos para cada tipo de dólar
const dolarIcons: Record<string, React.ReactNode> = {
  Oficial: <FaBuilding className="text-cyan-400" />,
  Blue: <FaMoneyBillWave className="text-blue-500" />,
  MEP: <FaExchangeAlt className="text-green-400" />,
  CCL: <FaPiggyBank className="text-purple-500" />,
  Crypto: <FaDollarSign className="text-yellow-400" />,
};

// Formato de moneda para ARS
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
};

const DolarCard: React.FC<DolarCardProps> = ({ data }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator?.share) {
      if (isSharing) return;
      setIsSharing(true);
      try {
        await navigator.share({
          title: `Cotización ${data.nombre} - Dólar Gaucho`,
          text: `💰 ${data.nombre} hoy:\n\n🟢 Compra: ${formatCurrency(
            data.compra
          )}\n🔴 Venta: ${formatCurrency(
            data.venta
          )}\n\n📊 Consulta más en Dólar Gaucho: ${window.location.href}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      } finally {
        setIsSharing(false);
      }
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  };

  const handleCopy = async () => {
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(
          `💰 ${data.nombre} hoy:\n\n🟢 Compra: ${formatCurrency(
            data.compra
          )}\n🔴 Venta: ${formatCurrency(
            data.venta
          )}\n\n📊 Consulta más en Dólar Gaucho: ${window.location.href}`
        );
        alert("Copiado al portapapeles");
      } catch (error) {
        console.error("Error al copiar:", error);
        alert("No se pudo copiar al portapapeles.");
      }
    } else {
      alert("Tu navegador no soporta la función de copiar al portapapeles.");
    }
  };

  return (
    <div
      className="p-4 sm:p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl w-full sm:max-w-md lg:max-w-full
      transition-all duration-300 hover:shadow-2xl hover:scale-105 md:hover:scale-100 dark:bg-black/30"
    >
      {/* Ícono + Título */}
      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
        {dolarIcons[data.nombre] || <FaDollarSign className="text-gray-500" />}
        {data.nombre}
      </h2>

      {/* Valores de Compra y Venta */}
      <div className="flex justify-between items-center mt-4 py-2 text-base sm:text-lg font-semibold border-b border-gray-600">
        <p className="text-green-400">
          Compra: <span className="font-bold">{formatCurrency(data.compra)}</span>
        </p>
        <p className="text-red-400">
          Venta: <span className="font-bold">{formatCurrency(data.venta)}</span>
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 sm:mt-6 w-full">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`w-full sm:w-auto py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md ${
            isSharing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaShareAlt /> Compartir
        </button>

        <button
          onClick={handleCopy}
          className="w-full sm:w-auto py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium text-white bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:bg-gray-700"
        >
          <FaCopy /> Copiar
        </button>
      </div>
    </div>
  );
};

export default DolarCard;