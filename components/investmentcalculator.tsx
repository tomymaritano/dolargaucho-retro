import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion"; // Animaciones suaves
import { FaRedoAlt } from "react-icons/fa";

// Registrar módulos de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [investmentYears, setInvestmentYears] = useState<number>(5);
  const [annualReturn, setAnnualReturn] = useState<number>(10);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await axios.get("https://api.bluelytics.com.ar/v2/latest");
        setExchangeRate(response.data.blue?.value_sell ?? 1);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        setExchangeRate(1);
      }
    }
    fetchExchangeRate();
  }, []);

  const calculateInvestment = () => {
    if (exchangeRate === null) return;
    setLoading(true);

    setTimeout(() => {
      let currentAmount = amount / exchangeRate;
      let dataPoints = [];

      for (let year = 0; year <= investmentYears; year++) {
        dataPoints.push({ year, value: parseFloat(currentAmount.toFixed(2)) });
        currentAmount = (currentAmount + (monthlyContribution * 12) / exchangeRate) * (1 + annualReturn / 100);
      }

      setFutureValue(parseFloat(currentAmount.toFixed(2)));

      setChartData({
        labels: dataPoints.map((d) => `${d.year} años`),
        datasets: [
          {
            label: "Crecimiento de la Inversión (USD)",
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

      setLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 rounded-2xl  text-white"
    >

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 font-semibold">💰 Monto Inicial (ARS):</label>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full p-3 border border-blue-500 bg-black/80 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-semibold">📥 Aportes Mensuales (ARS):</label>
          <input
            type="number"
            value={monthlyContribution}
            min="0"
            onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full p-3 border border-blue-500 bg-black/80 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-semibold">📆 Años de Inversión:</label>
          <input
            type="number"
            value={investmentYears}
            min="1"
            onChange={(e) => setInvestmentYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 border border-blue-500 bg-black/80 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-semibold">📊 Retorno Anual (%):</label>
          <input
            type="number"
            value={annualReturn}
            min="0"
            max="100"
            onChange={(e) => setAnnualReturn(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
            className="w-full p-3 border border-blue-500 bg-black/80 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {exchangeRate && (
        <p className="text-gray-400 text-center mt-4">
          🔹 Tipo de Cambio Blue: <span className="text-blue-400">{exchangeRate} ARS/USD</span>
        </p>
      )}

      <p className="text-white font-bold text-lg text-center mt-4">
        💰 Valor futuro estimado: <span className="text-green-400">${futureValue} USD</span>
      </p>

      {/* Botón de cálculo */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={calculateInvestment}
        className={`w-full mt-4 p-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-md  flex items-center justify-center gap-3 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        <FaRedoAlt />
        {loading ? "⏳ Calculando..." : "🔄 Recalcular Inversión"}
      </motion.button>

      {/* Gráfico */}
      <div className="mt-6">
        {chartData ? (
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        ) : (
          <p className="text-center text-gray-500">📉 Cargando gráfico...</p>
        )}
      </div>
    </motion.div>
  );
}