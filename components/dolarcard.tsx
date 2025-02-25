import React, { useState } from "react";
import { DolarType } from "../hooks/useDolar";
import { FaShareAlt, FaCopy } from "react-icons/fa";
import { LuBuilding2, LuBanknote, LuTrendingUp, LuBitcoin, LuClock } from "react-icons/lu"; // ÍCONOS MEJORADOS

interface DolarCardProps {
  data: DolarType;
}

// Íconos para cada tipo de cambio
const dolarIcons: Record<string, React.ReactNode> = {
  Oficial: <LuBuilding2 className="text-cyan-400 text-3xl" />,
  Blue: <LuBanknote className="text-blue-500 text-3xl" />,
  MEP: <LuTrendingUp className="text-green-400 text-3xl" />,
  CCL: <LuTrendingUp className="text-purple-500 text-3xl" />,
  Crypto: <LuBitcoin className="text-yellow-400 text-3xl" />,
};

// Renombrar tipos de cambio
const formatName = (name?: string): string => {
  if (!name) return "Desconocido";
  if (name.toLowerCase().includes("contado con liquidación")) return "CCL";
  return name;
};

// Formatear moneda ARS
const formatCurrency = (value?: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
};

// Formatear fecha
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return date.toLocaleString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DolarCard: React.FC<DolarCardProps> = ({ data }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator?.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: `Cotización ${formatName(data.nombre)}`,
          text: `💰 ${formatName(data.nombre)} hoy:\n🟢 Compra: ${formatCurrency(
            data.compra
          )} | 🔴 Venta: ${formatCurrency(data.venta)}\n📅 Última actualización: ${formatDate(
            data.fechaActualizacion
          )}`,
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
    try {
      await navigator.clipboard.writeText(
        `💰 ${formatName(data.nombre)} hoy:\n🟢 Compra: ${formatCurrency(
          data.compra
        )} | 🔴 Venta: ${formatCurrency(data.venta)}\n📅 Última actualización: ${formatDate(
          data.fechaActualizacion
        )}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-700 transition-all hover:bg-white/10 hover:backdrop-blur-md hover:shadow-lg">
      {/* 🏛️ Ícono + Nombre */}
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-3">
          {dolarIcons[formatName(data.nombre)] || <LuBuilding2 className="text-gray-500 text-3xl" />}
          <h3 className="text-lg font-semibold text-white">{formatName(data.nombre)}</h3>
        </div>
        {/* 📅 Fecha de actualización debajo del nombre */}
        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
          <LuClock className="text-gray-400" />
          <span>{formatDate(data.fechaActualizacion)}</span>
        </div>
      </div>

      {/* 💵 Valores Compra/Venta */}
      <div className="flex flex-col text-right">
        <p className="text-green-400 text-base font-semibold tracking-wide flex items-center gap-1">
          🟢 {formatCurrency(data.compra)}
        </p>
        <p className="text-red-400 text-base font-semibold tracking-wide flex items-center gap-1">
          🔴 {formatCurrency(data.venta)}
        </p>
      </div>

      {/* 🔄 Botones */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`text-white text-base transition-all hover:scale-110 hover:text-blue-400 ${
            isSharing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaShareAlt />
        </button>

        <button
          onClick={handleCopy}
          className={`text-white text-base transition-all hover:scale-110 ${
            copied ? "text-green-400" : "hover:text-gray-300"
          }`}
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
};

export default DolarCard;