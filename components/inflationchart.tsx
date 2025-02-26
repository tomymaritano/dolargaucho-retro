import { useState, useEffect } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";

interface InflationData {
  fecha: string;
  valor: number;
}

export default function InflationChart() {
  const [inflationType, setInflationType] = useState<"mensual" | "interanual">("mensual");
  const [inflationData, setInflationData] = useState<InflationData[]>([]);

  useEffect(() => {
    async function fetchInflation() {
      try {
        const url =
          inflationType === "mensual"
            ? "https://api.argentinadatos.com/v1/finanzas/indices/inflacion"
            : "https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual";

        const response = await axios.get<InflationData[]>(url);
        const sortedData = response.data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setInflationData(sortedData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    }
    fetchInflation();
  }, [inflationType]);

  // Configuración del gráfico profesional
  const chartOptions = {
    backgroundColor: "#0a0f1a",
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: inflationData.map((d) => d.fecha),
      axisLabel: { color: "#00ffcc", rotate: 30 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#00ffcc" },
      splitLine: { lineStyle: { color: "rgba(0, 255, 255, 0.2)" } },
    },
    series: [
      {
        name: "Inflación",
        type: "line",
        data: inflationData.map((d) => d.valor),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: { color: "#00ffcc" },
        areaStyle: { color: "rgba(0, 255, 204, 0.2)" },
      },
    ],
    dataZoom: [
      { type: "inside", start: 90, end: 100 }, // Zoom interactivo
      { type: "slider", start: 90, end: 100, bottom: 10, textStyle: { color: "#00ffcc" } },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 rounded-2xl shadow-xl text-white"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-400 flex items-center justify-center gap-2">
        <FaChartLine className="text-blue-300" /> Inflación Histórica
      </h2>

      {/* Selector de Tipo */}
      <div className="flex justify-center space-x-4 mb-6">
        {["mensual", "interanual"].map((type) => (
          <button
            key={type}
            onClick={() => setInflationType(type as "mensual" | "interanual")}
            className={`px-5 py-3 text-lg font-semibold rounded-xl transition-all shadow-md flex items-center gap-2
              ${
                inflationType === type
                  ? "bg-blue-500 text-white scale-105 border border-blue-300"
                  : "bg-gray-800 text-gray-300 hover:bg-blue-500"
              }`}
          >
            {type === "mensual" ? "📅 Mensual" : "📈 Interanual"}
          </button>
        ))}
      </div>

      {/* Gráfico Profesional */}
      <div className="rounded-xl shadow-md">
        <ReactECharts option={chartOptions} style={{ height: "600px", width: "100%" }} />
      </div>
    </motion.div>
  );
}