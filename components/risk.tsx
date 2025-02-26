import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaGlobeAmericas, FaClock } from "react-icons/fa";

interface RiskData {
  fecha: string;
  valor: number;
}

export default function CountryRisk() {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRiskData() {
      try {
        const response = await axios.get<RiskData>(
          "https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo"
        );
        setRiskData(response.data);
      } catch (err) {
        setError("No se pudo obtener el Riesgo País.");
        console.error(err);
      }
    }
    fetchRiskData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-md text-white text-center"
    >
      {/* 📌 Título */}
      <h2 className="text-2xl font-bold mb-3 text-white flex items-center justify-center gap-2">
        <FaGlobeAmericas className="text-[#007aff]" /> Riesgo País
      </h2>

      {/* 📊 Datos */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : riskData ? (
        <>
          <p className="text-5xl font-extrabold text-[#d90429]">
            {riskData.valor.toLocaleString()} pts
          </p>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2 mt-2">
            <FaClock /> Última actualización:{" "}
            {new Date(riskData.fecha).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </>
      ) : (
        <p className="text-gray-500 animate-pulse">Cargando datos...</p>
      )}
    </motion.div>
  );
}