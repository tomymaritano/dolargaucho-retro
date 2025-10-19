import React, { useEffect, useState } from 'react';
import {
  FaBuilding,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaPiggyBank,
  FaDollarSign,
} from 'react-icons/fa';

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
  Oficial: <FaBuilding className="text-brand" />,
  Blue: <FaMoneyBillWave className="text-brand-light" />,
  MEP: <FaExchangeAlt className="text-brand" />,
  CCL: <FaPiggyBank className="text-brand-light" />,
  Crypto: <FaDollarSign className="text-brand" />,
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
    <div className="p-6 rounded-xl max-w-7xl flex w-full font-sans">
      {loading && (
        <p className="text-secondary text-center glass-strong p-4 rounded-xl border border-white/5">
          Cargando cotizaciones...
        </p>
      )}
      {error && (
        <p className="text-error text-center glass-strong p-4 rounded-xl border border-error/30">
          {error}
        </p>
      )}

      <div className="flex flex-col space-y-3 w-full">
        {!loading &&
          !error &&
          rates.map((rate) => (
            <div
              key={rate.nombre}
              className="p-4 glass-strong border border-white/5 rounded-xl flex items-center justify-between hover:border-brand/20 transition-all"
            >
              <div className="flex items-center gap-3">
                {exchangeIcons[rate.nombre] || <FaDollarSign className="text-secondary" />}
                <span className="text-lg font-bold text-white">{rate.nombre}</span>
              </div>
              <div className="text-right">
                <p className="text-brand font-semibold font-mono text-sm">
                  Compra: ${rate.compra.toFixed(2)}
                </p>
                <p className="text-brand-light font-semibold font-mono text-sm">
                  Venta: ${rate.venta.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExchangeRates;
