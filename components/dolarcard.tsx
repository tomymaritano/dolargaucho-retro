import React, { useState } from "react";
import { DolarType } from "../hooks/useDolar";
import { FaShareAlt, FaCopy, FaCheck } from "react-icons/fa";
import { LuClock } from "react-icons/lu";

interface DolarCardProps {
  data: DolarType;
}

// Formato de moneda ARS
const formatCurrency = (value?: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

// Formato de fecha
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Fecha no disponible";
  return new Date(dateString).toLocaleString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DolarCard: React.FC<DolarCardProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const dolarInfo = `💰 ${data.nombre}\n🟢 Compra: ${formatCurrency(data.compra)} | 🔴 Venta: ${formatCurrency(data.venta)}\n📅 Última actualización: ${formatDate(data.fechaActualizacion)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dolarInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: `Cotización ${data.nombre}`,
          text: dolarInfo,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      alert("Tu navegador no soporta compartir.");
    }
  };

  return (
    <div className="bg-[#121212] text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col gap-4">
      {/* Título y fecha */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h3 className="text-xl font-bold">{data.nombre}</h3>
        <p className="text-gray-400 text-sm flex items-center gap-1">
          <LuClock /> {formatDate(data.fechaActualizacion)}
        </p>
      </div>

      {/* Valores de compra/venta */}
      <div className="flex justify-between items-center text-2xl font-semibold">
        <p className="text-green-400">{formatCurrency(data.compra)}</p>
        <p className="text-red-400">{formatCurrency(data.venta)}</p>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleShare}
          className={`text-white transition-all hover:scale-110 ${
            shared ? "text-green-400" : "hover:text-gray-300"
          }`}
        >
          {shared ? <FaCheck /> : <FaShareAlt />}
        </button>

        <button
          onClick={handleCopy}
          className={`text-white transition-all hover:scale-110 ${
            copied ? "text-green-400" : "hover:text-gray-300"
          }`}
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
    </div>
  );
};

export default DolarCard;