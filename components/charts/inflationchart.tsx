import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

// 📌 Tipos de datos de la API
interface InflacionData {
  fecha: string;
  valor: number;
}

// 📌 Formateo de Fecha
const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
};

const InflacionChart: React.FC = () => {
  const [inflacionData, setInflacionData] = useState<InflacionData[]>([]);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inflacionType, setInflacionType] = useState<"mensual" | "interanual">("mensual");

  useEffect(() => {
    const fetchInflacionData = async () => {
      setLoading(true);
      try {
        const url =
          inflacionType === "mensual"
            ? "https://api.argentinadatos.com/v1/finanzas/indices/inflacion"
            : "https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual";

        const response = await fetch(url);
        const data: InflacionData[] = await response.json();

        // 📌 Ordenar y formatear fechas
        const sortedData = data
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .map((d) => ({ ...d, fecha: formatFecha(d.fecha) }));

        setInflacionData(sortedData);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchInflacionData();
  }, [inflacionType]);

  // 📌 Extraer los años disponibles en los datos
  const availableYears = Array.from(
    new Set(inflacionData.map((d) => new Date(d.fecha).getFullYear().toString()))
  ).sort((a, b) => Number(b) - Number(a));

  // 📌 Filtrar datos según la selección
  const filteredData = inflacionData
    .filter((d) => (selectedYear ? new Date(d.fecha).getFullYear().toString() === selectedYear : true))
    .slice(0, selectedMonths)
    .reverse();

  return (
    <div className="p-6 bg-[#181B2B]/80 backdrop-blur-md rounded-xl">
      {/* 📌 Controles de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        {/* Selector de Tipo de Inflación */}
        <div className="flex justify-center md:justify-start space-x-2">
          <motion.button
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${inflacionType === "mensual" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            whileTap={{ scale: 0.9 }}
            onClick={() => setInflacionType("mensual")}
          >
            Inflacion Mensual
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${inflacionType === "interanual" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            whileTap={{ scale: 0.9 }}
            onClick={() => setInflacionType("interanual")}
          >
            Interanual
          </motion.button>
        </div>

        {/* Selector de Meses */}
        <div className="flex justify-center space-x-2">
          {[3, 6, 12].map((months) => (
            <motion.button
              key={months}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${selectedMonths === months ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              onClick={() => setSelectedMonths(months)}
            >
              Últimos {months} meses
            </motion.button>
          ))}
        </div>

        {/* Selector de Año */}
        <div className="flex justify-center md:justify-end">
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value || null)}
            className="bg-gray-700 text-white px-4 py-4 rounded-md text-sm font-semibold focus:outline-none"
          >
            <option value="">Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📌 Mensaje de carga */}
      {loading ? (
        <p className="text-blue-300 text-center animate-pulse flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" /> Cargando datos...
        </p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="p-4 bg-[#181B2B] rounded-lg">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <XAxis dataKey="fecha" tick={{ fill: "white", fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "white", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#252845", color: "white", borderRadius: 5 }} />
              <Line type="monotone" dataKey="valor" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default InflacionChart;