import React, { useEffect, useState } from 'react';
import { FaBuilding, FaMoneyBillWave, FaExchangeAlt, FaPiggyBank, FaDollarSign } from 'react-icons/fa';

// Tipado de la API
interface ExchangeRate {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  moneda: string;
  fechaActualizacion: string;
}

const exchangeIcons: Record<string, React.ReactNode> = {
  'Oficial': <FaBuilding className="text-blue-500" />,
  'Blue': <FaMoneyBillWave className="text-green-500" />,
  'MEP': <FaExchangeAlt className="text-purple-500" />,
  'CCL': <FaPiggyBank className="text-yellow-500" />,
  'Crypto': <FaDollarSign className="text-orange-500" />,
};

const ExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener las cotizaciones
    const fetchRates = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/cotizaciones');
        if (!response.ok) throw new Error('Error al obtener las cotizaciones');

        const data: ExchangeRate[] = await response.json();
        setRates(data);
      } catch (err) {
        setError('No se pudieron cargar las cotizaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="p-6 rounded-xl max-w-6xl flex w-full font-sans">

      {loading && <p className="text-gray-500 text-center">Cargando cotizaciones...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col space-y-2">
        {!loading && !error && rates.map((rate) => (
          <div key={rate.nombre} className="p-4 border border-gray-300 rounded-lg flex items-center justify-between bg-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              {exchangeIcons[rate.nombre] || <FaDollarSign className="text-gray-500" />}
              <span className="text-lg font-bold text-gray-900">{rate.nombre}</span>
            </div>
            <div className="text-right">
              <p className="text-green-700 font-semibold">Compra: ${rate.compra.toFixed(2)}</p>
              <p className="text-red-700 font-semibold">Venta: ${rate.venta.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeRates;