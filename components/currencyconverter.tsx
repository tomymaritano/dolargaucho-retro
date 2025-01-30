// components/CurrencyConverter.tsx
import React, { useState } from 'react';
import useDolar from '../hooks/useDolar';
import { FaCopy, FaExchangeAlt, FaChevronDown } from 'react-icons/fa';

const CurrencyConverter: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [amount, setAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('Oficial');
  const [conversionType, setConversionType] = useState<'buy' | 'sell'>('buy');

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);
  const conversion = selectedDolar 
    ? conversionType === 'buy'
      ? (amount / selectedDolar.venta).toFixed(2) // Comprar dólares
      : (amount * selectedDolar.compra).toFixed(2) // Vender dólares
    : '0.00';

  const handleCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(`$${conversion} ${conversionType === 'buy' ? 'USD' : 'ARS'} (${selectedCurrency})`);
        alert('Copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar:', error);
        alert('No se pudo copiar al portapapeles.');
      }
    } else {
      alert('Tu navegador no soporta la función de copiar al portapapeles.');
    }
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900 to-pink-700 shadow-lg border border-yellow-500 text-yellow-300 transition-all hover:shadow-xl w-full max-w-lg flex flex-col items-center font-mono">
      {loading && <p className="text-yellow-400 text-center">Cargando cotizaciones...</p>}
      {error && <p className="text-red-500 text-center">Error al cargar datos</p>}
      
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-center bg-gray-900 p-4 rounded-lg relative border border-yellow-400">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-transparent text-xl font-extrabold text-yellow-300 focus:outline-none text-right"
            placeholder={`Ingrese monto en ${conversionType === 'buy' ? 'ARS' : 'USD'}`}
          />
          <span className="absolute left-4 text-yellow-400 font-semibold">{conversionType === 'buy' ? 'ARS' : 'USD'}</span>
        </div>
        <button 
          onClick={() => setConversionType(conversionType === 'buy' ? 'sell' : 'buy')} 
          className="w-full py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2 font-semibold transition-all shadow-md shadow-yellow-500"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>
        <div className="relative w-full">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-4 bg-gray-900 text-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none border border-yellow-400"
          >
            {dolar.map((tipo) => (
              <option key={tipo.nombre} value={tipo.nombre} className="bg-gray-900 text-white">
                {tipo.nombre}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-5 text-yellow-400 pointer-events-none" />
        </div>
        <div className="text-center text-2xl font-extrabold text-yellow-300 py-2 border-t border-yellow-500 w-full">
          {conversionType === 'buy' ? 'USD' : 'ARS'} {conversion}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;