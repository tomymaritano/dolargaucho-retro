import React, { useState, useEffect } from "react";
import { FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";

const CountryRisk: React.FC = () => {
  const [riskToday, setRiskToday] = useState<number | null>(null);
  const [risk7Days, setRisk7Days] = useState<number | null>(null);
  const [risk30Days, setRisk30Days] = useState<number | null>(null);
  const [percentChange7, setPercentChange7] = useState<string | null>(null);
  const [percentChange30, setPercentChange30] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiskHistorical = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais");
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setError("No disponible");
          return;
        }

        // Ordenar datos por fecha (más reciente primero)
        const sortedData = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Obtener el valor más reciente (hoy)
        const latestValue = sortedData[0]?.valor ?? null;
        setRiskToday(latestValue);

        // Buscar los valores exactos de 7 y 30 días atrás
        const getPastValue = (daysAgo: number): number | null => {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - daysAgo);
          const formattedDate = pastDate.toISOString().split("T")[0];

          const pastValue = sortedData.find((item) => item.fecha.startsWith(formattedDate));
          return pastValue ? pastValue.valor : null;
        };

        const past7Days = getPastValue(7);
        const past30Days = getPastValue(30);

        setRisk7Days(past7Days);
        setRisk30Days(past30Days);

        // Calcular cambio porcentual
        const calculatePercentage = (current: number | null, past: number | null) => {
          if (current === null || past === null || past === 0) return null;
          const change = ((current - past) / past) * 100;
          return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
        };

        setPercentChange7(calculatePercentage(latestValue, past7Days));
        setPercentChange30(calculatePercentage(latestValue, past30Days));
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskHistorical();
  }, []);

  // 🔹 Determinar Tendencia y Color para los porcentajes
  const getTrend = (percentChange: string | null) => {
    if (!percentChange) return { color: "text-gray-400", icon: null };
    return percentChange.startsWith("+")
      ? { color: "text-red-500", icon: <FaArrowUp /> }
      : { color: "text-green-400", icon: <FaArrowDown /> };
  };

  const trend7Days = getTrend(percentChange7);
  const trend30Days = getTrend(percentChange30);

  return (
    <div className="bg-[#1e2336] border border-gray-800 rounded-xl p-5 text-center shadow-lg w-full max-w-[320px] transition-all hover:scale-105 hover:border-purple-500">
      <h2 className="text-xs font-medium text-gray-400 flex items-center justify-center gap-1 uppercase tracking-wide">
        <FaChartLine className="text-blue-400 text-sm" /> Riesgo País Argentina
      </h2>

      {loading ? (
        <p className="text-gray-400 mt-3 text-sm">Cargando...</p>
      ) : error ? (
        <p className="text-red-400 mt-3 text-sm">{error}</p>
      ) : (
        <>
          {/* 🔹 Valor de Hoy */}
          <p className="text-4xl font-extrabold text-[#A78BFA] mt-3 drop-shadow-md">
            {riskToday !== null ? riskToday.toFixed(2) : "N/A"}
          </p>
          <p className="text-gray-400 text-xs mt-2">Hoy</p>

          {/* 🔹 Últimos 7 días */}
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-gray-300">Hace 7 días:</span>
            <span className={`font-semibold ${trend7Days.color} flex items-center gap-1`}>
              {risk7Days !== null ? risk7Days.toFixed(2) : "Sin datos"} ({percentChange7 ?? "N/A"}) {trend7Days.icon}
            </span>
          </div>

          {/* 🔹 Últimos 30 días */}
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-300">Hace 30 días:</span>
            <span className={`font-semibold ${trend30Days.color} flex items-center gap-1`}>
              {risk30Days !== null ? risk30Days.toFixed(2) : "Sin datos"} ({percentChange30 ?? "N/A"}) {trend30Days.icon}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CountryRisk;