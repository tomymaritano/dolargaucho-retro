import { useState } from "react";
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

export default function PurchasingPowerCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [oldRate, setOldRate] = useState<number>(50);
  const [newRate, setNewRate] = useState<number>(1000);
  const [purchasingPower, setPurchasingPower] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);

  const calculatePurchasingPower = () => {
    let oldUSD = amount / oldRate;
    let newUSD = amount / newRate;
    let powerLoss = parseFloat((newUSD / oldUSD).toFixed(4));
    setPurchasingPower(powerLoss);

    // Simular pérdida del poder adquisitivo en el tiempo
    let dataPoints = [];
    let simulatedRate = oldRate;
    for (let year = 0; year <= 5; year++) {
      simulatedRate *= 2; // Simulación de devaluación acelerada
      dataPoints.push({ year, value: parseFloat((amount / simulatedRate).toFixed(2)) });
    }

    setChartData({
      labels: dataPoints.map((d) => `${d.year} años`),
      datasets: [
        {
          label: "Poder Adquisitivo (USD)",
          data: dataPoints.map((d) => d.value),
          borderColor: "#ff4444",
          backgroundColor: "rgba(255, 68, 68, 0.2)",
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#ff4444",
          pointHoverRadius: 8,
        },
      ],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 rounded-2xl text-white"
    >

      <div className="grid grid-cols-2 gap-4">
        {/* Monto en ARS */}
        <div>
          <label className="block text-gray-300 font-semibold">💵 Monto en ARS:</label>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full p-3 border border-red-500 bg-black text-white rounded-md outline-none 
            focus:ring-2 focus:ring-red-400 transition text-center"
          />
        </div>

        {/* Tipo de Cambio Anterior */}
        <div>
          <label className="block text-gray-300 font-semibold">📅 Tipo de Cambio Pasado:</label>
          <input
            type="number"
            value={oldRate}
            min="1"
            onChange={(e) => setOldRate(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full p-3 border border-red-500 bg-black text-white rounded-md outline-none 
            focus:ring-2 focus:ring-red-400 transition text-center"
          />
        </div>

        {/* Tipo de Cambio Actual */}
        <div>
          <label className="block text-gray-300 font-semibold">🚀 Tipo de Cambio Actual:</label>
          <input
            type="number"
            value={newRate}
            min="1"
            onChange={(e) => setNewRate(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full p-3 border border-red-500 bg-black text-white rounded-md outline-none 
            focus:ring-2 focus:ring-red-400 transition text-center"
          />
        </div>
      </div>

      {/* Botón Calcular */}
      <button
        onClick={calculatePurchasingPower}
        className="mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg 
        hover:from-red-600 hover:to-orange-600 transition-all shadow-md font-bold text-lg uppercase"
      >
        Calcular Poder Adquisitivo
      </button>

      {/* Resultado */}
      <div className="mt-6 p-6 bg-black/60 rounded-xl text-center border border-red-500 shadow-md">
        <p className="text-gray-300 text-xl">Poder Adquisitivo Actual:</p>
        <p className="text-white text-4xl font-bold mt-2">
          {purchasingPower}x menos 💸
        </p>
      </div>

      {/* Gráfico de Devaluación */}
      <div className="mt-6">
        {chartData ? (
          <Line
            data={chartData}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        ) : (
          <p className="text-center text-gray-500">📉 Cargando gráfico...</p>
        )}
      </div>
    </motion.div>
  );
}