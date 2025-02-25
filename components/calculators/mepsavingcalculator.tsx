import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

// Registrar módulos de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function MepSavingsCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [blueRate, setBlueRate] = useState<number | null>(null);
  const [mepRate, setMepRate] = useState<number | null>(null);
  const [savings, setSavings] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExchangeRates() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://dolarapi.com/v1/dolares");
        const dolarBlue = response.data.find((d: any) => d.casa === "blue")?.venta;
        const dolarMep = response.data.find((d: any) => d.casa === "bolsa")?.venta;

        setBlueRate(dolarBlue ?? null);
        setMepRate(dolarMep ?? null);
      } catch (err) {
        setError("No se pudieron obtener las cotizaciones actuales.");
      } finally {
        setLoading(false);
      }
    }
    fetchExchangeRates();
  }, []);

  const calculateSavings = () => {
    if (blueRate && mepRate) {
      const blueUSD = amount / blueRate;
      const mepUSD = amount / mepRate;
      const totalSavings = parseFloat((blueUSD - mepUSD).toFixed(2));
      setSavings(totalSavings);

      // Simular ahorros acumulados mensualmente durante un año
      const dataPoints = [];
      let totalAccumulated = 0;
      for (let month = 1; month <= 12; month++) {
        totalAccumulated += totalSavings;
        dataPoints.push({ month, value: parseFloat(totalAccumulated.toFixed(2)) });
      }

      setChartData({
        labels: dataPoints.map((d) => `Mes ${d.month}`),
        datasets: [
          {
            label: "Ahorro Acumulado (USD)",
            data: dataPoints.map((d) => d.value),
            borderColor: "#00ffcc",
            backgroundColor: "rgba(0, 255, 204, 0.2)",
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#00ffcc",
            pointHoverRadius: 8,
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (blueRate && mepRate) {
      calculateSavings();
    }
  }, [amount, blueRate, mepRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 rounded-2xl text-white"
    >

      {loading ? (
        <div className="flex justify-center items-center text-gray-300">
          <span className="loader mr-2"></span> Cargando cotizaciones...
        </div>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Monto en ARS */}
            <div>
              <label className="block text-gray-300 font-semibold">💰 Monto en ARS:</label>
              <input
                type="number"
                value={amount}
                min="0"
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-3 border border-blue-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>

            {/* Tipo de Cambio Blue */}
            <div>
              <label className="block text-gray-300 font-semibold">💸 Tipo de Cambio Blue:</label>
              <input
                type="number"
                value={blueRate ?? ""}
                disabled
                className="w-full p-3 border border-blue-500 bg-gray-800 text-gray-400 rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>

            {/* Tipo de Cambio MEP */}
            <div>
              <label className="block text-gray-300 font-semibold">🏦 Tipo de Cambio MEP:</label>
              <input
                type="number"
                value={mepRate ?? ""}
                disabled
                className="w-full p-3 border border-blue-500 bg-gray-800 text-gray-400 rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>
          </div>

          {/* Resultado */}
          <div className="mt-6 p-6 bg-black/60 rounded-xl text-center border border-blue-500 shadow-md">
            <p className="text-gray-300 text-xl">Ahorro Total:</p>
            <p className="text-white text-4xl font-bold mt-2">
              ${savings} USD 💰
            </p>
          </div>

          {/* Gráfico de Ahorros */}
          <div className="mt-6">
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#00ffcc" },
                    },
                    y: {
                      ticks: { color: "#00ffcc" },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">📈 Cargando gráfico...</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}