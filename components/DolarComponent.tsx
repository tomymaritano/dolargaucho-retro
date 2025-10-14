import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type DolarData = {
  casa: string;
  fecha: string;
  compra: number;
  venta: number;
  moneda: string;
};

const DolarComponent: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<DolarData[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('oficial');
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [rate7DaysAgo, setRate7DaysAgo] = useState<number | null>(null);
  const [rate30DaysAgo, setRate30DaysAgo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDolarData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.argentinadatos.com/v1/cotizaciones/dolares');
        const data: DolarData[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const latestRates = getLastRatesByCasa(data);
          setExchangeRates(latestRates);

          const selected = latestRates.find((d) => d.casa === selectedCurrency);
          setCurrentRate(selected ? selected.venta : null);

          setRate7DaysAgo(getHistoricalRate(data, selectedCurrency, 7));
          setRate30DaysAgo(getHistoricalRate(data, selectedCurrency, 30));
        } else {
          setError('No disponible');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };

    fetchDolarData();
  }, [selectedCurrency]);

  const getLastRatesByCasa = (data: DolarData[]): DolarData[] => {
    const lastRates: Record<string, DolarData> = {};

    data.forEach((d) => {
      if (!lastRates[d.casa] || new Date(d.fecha) > new Date(lastRates[d.casa].fecha)) {
        lastRates[d.casa] = d;
      }
    });

    return Object.values(lastRates);
  };

  const getHistoricalRate = (data: DolarData[], casa: string, daysAgo: number): number | null => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysAgo);

    const historicalData = data.filter((d) => d.casa === casa);
    if (historicalData.length === 0) return null;

    const closestRate = historicalData.reduce((closest, current) => {
      const currentDateDiff = Math.abs(new Date(current.fecha).getTime() - pastDate.getTime());
      const closestDateDiff = Math.abs(new Date(closest.fecha).getTime() - pastDate.getTime());
      return currentDateDiff < closestDateDiff ? current : closest;
    }, historicalData[0]);

    return closestRate?.venta || null;
  };

  const getPercentageChange = (current: number | null, past: number | null): string | null => {
    if (current === null || past === null || past === 0) return null;
    const change = ((current - past) / past) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const getTrend = (current: number | null, past: number | null) => {
    if (current === null || past === null)
      return { label: 'N/A', color: 'text-secondary', icon: null };
    if (current > past) return { label: 'Subió', color: 'text-error', icon: <FaArrowUp /> };
    if (current < past) return { label: 'Bajó', color: 'text-success', icon: <FaArrowDown /> };
    return { label: 'Estable', color: 'text-accent-emerald', icon: null };
  };

  const trend7Days = getTrend(currentRate, rate7DaysAgo);
  const trend30Days = getTrend(currentRate, rate30DaysAgo);

  const casaMap: Record<string, string> = {
    contadoconliqui: 'CCL',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glass-strong border border-white/5 rounded-xl p-5 text-center w-full max-w-7xl transition-all hover:border-accent-emerald/20"
    >
      {/* Botones */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4"
      >
        {exchangeRates.map((tipo) => (
          <motion.button
            key={tipo.casa}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={`text-xs md:text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
              selectedCurrency === tipo.casa
                ? 'bg-accent-emerald text-dark shadow-md'
                : 'glass border border-white/5 text-secondary hover:text-white hover:border-accent-emerald/20'
            }`}
            onClick={() => setSelectedCurrency(tipo.casa)}
          >
            {casaMap[tipo.casa] || tipo.casa.toUpperCase()}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-secondary mt-3 text-sm"
        >
          Cargando...
        </motion.p>
      ) : error ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-error mt-3 text-sm"
        >
          {error}
        </motion.p>
      ) : (
        <>
          <motion.p className="text-3xl md:text-4xl font-extrabold font-mono text-accent-emerald mt-3">
            ${currentRate?.toFixed(2)}
          </motion.p>

          {/* Variaciones con Porcentaje */}
          <motion.div className="mt-4 flex justify-between items-center text-xs md:text-sm glass p-2 rounded-lg">
            <span className="text-secondary">Hace 7 días:</span>
            <span className={`font-semibold font-mono ${trend7Days.color} flex items-center gap-1`}>
              {rate7DaysAgo !== null ? `$${rate7DaysAgo.toFixed(2)}` : 'Sin datos'} (
              {getPercentageChange(currentRate, rate7DaysAgo)}){trend7Days.icon}
            </span>
          </motion.div>

          <motion.div className="mt-2 flex justify-between items-center text-xs md:text-sm glass p-2 rounded-lg">
            <span className="text-secondary">Hace 30 días:</span>
            <span
              className={`font-semibold font-mono ${trend30Days.color} flex items-center gap-1`}
            >
              {rate30DaysAgo !== null ? `$${rate30DaysAgo.toFixed(2)}` : 'Sin datos'} (
              {getPercentageChange(currentRate, rate30DaysAgo)}){trend30Days.icon}
            </span>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default DolarComponent;
