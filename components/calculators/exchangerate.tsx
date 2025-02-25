import { useState, useEffect } from "react";
import axios from "axios";

export default function ExchangeRateGap() {
  const [officialRate, setOfficialRate] = useState<number | null>(null);
  const [blueRate, setBlueRate] = useState<number | null>(null);
  const [gap, setGap] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await axios.get("https://api.bluelytics.com.ar/v2/latest");
        setOfficialRate(response.data.oficial.value_sell);
        setBlueRate(response.data.blue.value_sell);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (officialRate !== null && blueRate !== null) {
      setGap(parseFloat((((blueRate - officialRate) / officialRate) * 100).toFixed(2)));
    }
  }, [officialRate, blueRate]);

  return (
    <div className="p-6 bg-black/70 rounded-xl border border-blue-500">
      <h3 className="text-xl font-bold text-white mb-4">📊 Brecha Cambiaria</h3>

      {gap !== null ? (
        <p className="text-white font-bold">💸 La brecha entre el dólar oficial y el dólar blue es del {gap}%</p>
      ) : (
        <p className="text-gray-300">Cargando datos...</p>
      )}
    </div>
  );
}