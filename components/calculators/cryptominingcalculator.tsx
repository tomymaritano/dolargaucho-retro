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

export default function CryptoMiningCalculator() {
  const [power, setPower] = useState<number>(500); // Consumo en Watts
  const [electricityCost, setElectricityCost] = useState<number>(0.12); // Costo en USD/kWh
  const [hashrate, setHashrate] = useState<number>(50); // Hashrate en MH/s
  const [cryptoPrice, setCryptoPrice] = useState<number | null>(null); // Precio ETH en tiempo real
  const [profit, setProfit] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCryptoPrice() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setCryptoPrice(response.data.ethereum.usd);
      } catch (err) {
        setError("No se pudo obtener el precio de Ethereum.");
      } finally {
        setLoading(false);
      }
    }
    fetchCryptoPrice();
  }, []);

  const calculateMiningProfit = () => {
    if (!cryptoPrice) return;

    let revenue = hashrate * 0.0001 * cryptoPrice * 30; // Ganancia estimada mensual en USD
    let cost = (power / 1000) * 24 * 30 * electricityCost; // Costo mensual en electricidad
    let totalProfit = parseFloat((revenue - cost).toFixed(2));

    setProfit(totalProfit);

    // Datos del gráfico
    setChartData({
      labels: Array.from({ length: 12 }, (_, i) => `Mes ${i + 1}`),
      datasets: [
        {
          label: "Ingresos (USD)",
          data: Array.from({ length: 12 }, (_, i) => revenue * (i + 1)),
          borderColor: "#00ffcc",
          backgroundColor: "rgba(0, 255, 204, 0.2)",
          borderWidth: 3,
          tension: 0.3,
        },
        {
          label: "Costos de Electricidad (USD)",
          data: Array.from({ length: 12 }, (_, i) => cost * (i + 1)),
          borderColor: "#ff4444",
          backgroundColor: "rgba(255, 68, 68, 0.2)",
          borderWidth: 3,
          tension: 0.3,
        },
      ],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto p-8rounded-2xl text-white"
    >

      {loading ? (
        <div className="flex justify-center items-center text-gray-300">
          <span className="loader mr-2"></span> Cargando precio de Ethereum...
        </div>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Consumo de Energía */}
            <div>
              <label className="block text-gray-300 font-semibold">⚡ Consumo Energético (W):</label>
              <input
                type="number"
                value={power}
                min="0"
                onChange={(e) => setPower(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-3 border border-blue-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>

            {/* Costo de Electricidad */}
            <div>
              <label className="block text-gray-300 font-semibold">💡 Costo de Electricidad (USD/kWh):</label>
              <input
                type="number"
                value={electricityCost}
                min="0"
                onChange={(e) => setElectricityCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-3 border border-blue-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>

            {/* Hashrate */}
            <div>
              <label className="block text-gray-300 font-semibold">🔄 Hashrate (MH/s):</label>
              <input
                type="number"
                value={hashrate}
                min="0"
                onChange={(e) => setHashrate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-3 border border-blue-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>

            {/* Precio de Ethereum */}
            <div>
              <label className="block text-gray-300 font-semibold">📈 Precio ETH Actual:</label>
              <input
                type="number"
                value={cryptoPrice ?? ""}
                disabled
                className="w-full p-3 border border-blue-500 bg-gray-800 text-gray-400 rounded-md outline-none 
                focus:ring-2 focus:ring-blue-400 transition text-center"
              />
            </div>
          </div>

          {/* Botón Calcular */}
          <button
            onClick={calculateMiningProfit}
            className="mt-6 w-full py-3 text-lg font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
          >
            Calcular Ganancias
          </button>

          {/* Resultado */}
          <div className="mt-6 p-6 bg-black/60 rounded-xl text-center border border-blue-500 shadow-md">
            <p className="text-gray-300 text-xl">Ganancia Estimada Mensual:</p>
            <p className={`text-4xl font-bold mt-2 ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
              {profit >= 0 ? `$${profit} USD 💰` : `Pérdida de $${Math.abs(profit)} USD 😟`}
            </p>
          </div>

          {/* Gráfico de Rentabilidad */}
          <div className="mt-6">
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
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
              <p className="text-center text-gray-500">📊 Cargando gráfico...</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}