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
import { Loader2 } from "lucide-react"; // Ícono de carga

// Registrar módulos de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Crypto = "BTC" | "ETH";
const cryptos: Crypto[] = ["BTC", "ETH"];

export default function CryptoInvestmentCalculator() {
  const [amountUSD, setAmountUSD] = useState<number>(1000);
  const [crypto, setCrypto] = useState<Crypto>("BTC");
  const [cryptoPrice, setCryptoPrice] = useState<{ BTC: number; ETH: number } | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchCryptoPrices() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        setCryptoPrice({
          BTC: response.data.bitcoin.usd,
          ETH: response.data.ethereum.usd,
        });
      } catch (err) {
        setError("No se pudieron obtener los precios de las criptomonedas.");
      } finally {
        setLoading(false);
      }
    }
    fetchCryptoPrices();
  }, []);

  useEffect(() => {
    if (cryptoPrice) {
      const calculatedCrypto = parseFloat((amountUSD / cryptoPrice[crypto]).toFixed(6));
      setCryptoAmount(calculatedCrypto);
      generateChart(calculatedCrypto);
    }
  }, [amountUSD, crypto, cryptoPrice]);

  const generateChart = (initialAmount: number) => {
    let dataPoints = [];
    let currentAmount = initialAmount;

    for (let year = 0; year <= 5; year++) {
      dataPoints.push({ year, value: parseFloat(currentAmount.toFixed(6)) });
      currentAmount *= 1.3; // Simula un crecimiento anual del 30%
    }

    setChartData({
      labels: dataPoints.map((d) => `${d.year} años`),
      datasets: [
        {
          label: "Evolución de la Inversión (Cripto)",
          data: dataPoints.map((d) => d.value),
          borderColor: "#ffcc00",
          backgroundColor: "rgba(255, 204, 0, 0.2)",
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#ffcc00",
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

      {loading ? (
        <div className="flex justify-center items-center text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando precios...
        </div>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Entrada de Monto en USD */}
            <div>
              <label className="block text-gray-300 font-semibold">💵 Inversión en USD:</label>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-yellow-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-yellow-400 transition text-center"
              />
            </div>

            {/* Selección de Criptomoneda */}
            <div>
              <label className="block text-gray-300 font-semibold">🪙 Criptomoneda:</label>
              <select
                value={crypto}
                onChange={(e) => setCrypto(e.target.value as Crypto)}
                className="w-full p-3 border border-yellow-500 bg-black text-white rounded-md outline-none 
                focus:ring-2 focus:ring-yellow-400 transition text-center"
              >
                {cryptos.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultado de la Conversión */}
          <div className="mt-6 p-6 bg-black/60 rounded-xl text-center border border-yellow-500 shadow-md">
            <p className="text-gray-300 text-xl">Cantidad Aproximada</p>
            <p className="text-white text-4xl font-bold mt-2">
              {cryptoAmount} {crypto}
            </p>
          </div>

          {/* Gráfico de Crecimiento */}
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
        </>
      )}
    </motion.div>
  );
}