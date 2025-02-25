import { useState, useEffect } from "react";
import axios from "axios";

type Currency = "ARS" | "USD" | "EUR" | "BTC" | "ETH";
type DollarType = "oficial" | "blue" | "mep" | "ccb" | "cripto"; // Tipos de dólar

const currencies: Currency[] = ["ARS", "USD", "EUR", "BTC", "ETH"];
const dollarTypes: DollarType[] = ["oficial", "blue", "mep", "ccb", "cripto"];

export default function SalaryConverter() {
  const [salary, setSalary] = useState<number>(100000);
  const [fromCurrency, setFromCurrency] = useState<Currency>("ARS");
  const [toCurrency, setToCurrency] = useState<Currency>("BTC");
  const [dollarType, setDollarType] = useState<DollarType>("blue"); // Default: dólar blue
  const [rates, setRates] = useState<{ USD: number; EUR: number; BTC: number; ETH: number } | null>(null);
  const [convertedSalary, setConvertedSalary] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const dolarResponse = await axios.get("https://dolarapi.com/v1/dolares");
        const forexResponse = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        const cryptoResponse = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");

        // Buscar el tipo de cambio de DolarAPI según la opción seleccionada
        const selectedDollar = dolarResponse.data.find((d: any) => d.nombre === dollarType)?.venta || 1;

        setRates({
          USD: selectedDollar, // Tipo de cambio USD basado en el dólar seleccionado
          EUR: forexResponse.data.rates.EUR, // Conversión USD ↔ EUR
          BTC: cryptoResponse.data.bitcoin.usd, // Precio de 1 BTC en USD
          ETH: cryptoResponse.data.ethereum.usd, // Precio de 1 ETH en USD
        });
      } catch (error) {
        console.error("Error obteniendo tasas de cambio:", error);
      }
    }
    fetchRates();
  }, [dollarType]); // Se actualiza cuando cambia el tipo de dólar seleccionado

  useEffect(() => {
    if (rates) {
      let conversionRate = 1;

      if (fromCurrency === "ARS") {
        // Convertimos ARS a USD usando el tipo de cambio seleccionado
        conversionRate = 1 / rates.USD;
      } else if (fromCurrency === "USD") {
        conversionRate = 1; // No se necesita conversión
      } else {
        conversionRate = 1 / rates[fromCurrency]; // Convertimos de otra moneda a USD
      }

      // Convertimos USD a la moneda de destino
      if (toCurrency === "BTC" || toCurrency === "ETH") {
        conversionRate *= 1 / rates[toCurrency]; // USD → BTC o USD → ETH
      } else if (toCurrency === "ARS") {
        conversionRate *= rates.USD; // USD → ARS
      } else {
        conversionRate *= rates[toCurrency]; // USD → EUR u otra moneda
      }

      setConvertedSalary(parseFloat((salary * conversionRate).toFixed(8)));
    }
  }, [salary, fromCurrency, toCurrency, rates]);

  return (
    <div className="p-6 bg-black/50 backdrop-blur-lg rounded-2xl border border-blue-500 shadow-xl max-w-lg mx-auto">
      <h3 className="text-3xl font-bold text-white text-center mb-6">💼 Conversor de Salarios</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-300 text-lg font-semibold">Salario:</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
          />
        </div>

        {/* Selección de Tipo de Dólar SOLO si la moneda es ARS */}
        {fromCurrency === "ARS" ? (
          <div>
            <label className="text-gray-300 text-lg font-semibold">Tipo de Dólar:</label>
            <select
              value={dollarType}
              onChange={(e) => setDollarType(e.target.value as DollarType)}
              className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
            >
              {dollarTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="text-gray-300 text-lg font-semibold">De:</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as Currency)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-lg font-semibold">A:</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as Currency)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-center text-white font-bold text-2xl mt-6">
        💰 {salary} {fromCurrency} ≈ {convertedSalary} {toCurrency}
      </p>
    </div>
  );
}