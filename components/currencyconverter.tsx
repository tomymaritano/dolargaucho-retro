import React, { useState } from 'react';
import useDolar from '../hooks/useDolar';
import { FaCopy, FaExchangeAlt, FaChevronDown, FaShareAlt } from 'react-icons/fa';

const CurrencyConverter: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [amount, setAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('Oficial');
  const [conversionType, setConversionType] = useState<'buy' | 'sell'>('buy');

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);
  const conversion = selectedDolar 
    ? conversionType === 'buy'
      ? (amount / selectedDolar.venta).toFixed(2) 
      : (amount * selectedDolar.compra).toFixed(2) 
    : '0.00';

  // Nueva función para compartir con un mensaje de marketing
  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: "Consulta el dólar con Dólar Gaucho 💰",
          text: `El ${selectedCurrency} hoy: Compra $${selectedDolar?.compra.toFixed(2)} | Venta $${selectedDolar?.venta.toFixed(2)}\n💸 Convierte tu dinero y consulta cotizaciones en tiempo real gratis en Dólar Gaucho.\n👉 Visítanos: ${window.location.href}`,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  };

  return (
    <div className="p-6 m-6 bg-white border border-gray-200 shadow-lg rounded-2xl max-w-lg w-full font-sans">
      {loading && <p className="text-gray-500 text-center">Cargando cotizaciones...</p>}
      {error && <p className="text-red-500 text-center">Error al cargar datos</p>}
      
      <div className="flex flex-col space-y-4">
        {/* Input de Monto */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-right text-black"
            placeholder={`Ingrese monto en ${conversionType === 'buy' ? 'ARS' : 'USD'}`}
          />
          <span className="absolute left-4 top-5 text-gray-500 font-semibold">{conversionType === 'buy' ? 'ARS' : 'USD'}</span>
        </div>

        {/* Botón de conversión */}
        <button 
          onClick={() => setConversionType(conversionType === 'buy' ? 'sell' : 'buy')} 
          className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>

        {/* Selector de tipo de dólar */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-4 text-lg bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          >
            {dolar.map((tipo) => (
              <option key={tipo.nombre} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-5 text-gray-500 pointer-events-none" />
        </div>

        {/* Resultado de la conversión */}
        <div className="text-center text-2xl font-bold text-gray-900 p-4 border border-gray-300 rounded-lg bg-gray-100">
          {conversionType === 'buy' ? 'USD' : 'ARS'} {conversion}
        </div>

        {/* Botón para compartir */}
        <button 
          onClick={handleShare} 
          className="w-full py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-all"
        >
          <FaShareAlt /> Compartir
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;