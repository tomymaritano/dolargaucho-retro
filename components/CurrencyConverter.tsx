import React, { useState } from 'react';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { FaExchangeAlt, FaChevronDown, FaShareAlt } from 'react-icons/fa';
import { logger } from '@/lib/utils/logger';

const CurrencyConverter: React.FC = () => {
  const { data: dolar = [], isLoading: loading, error } = useDolarQuery();
  const [amount, setAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('Oficial');
  const [conversionType, setConversionType] = useState<'buy' | 'sell'>('buy');

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);
  const conversion = selectedDolar
    ? conversionType === 'buy'
      ? (amount / selectedDolar.venta).toFixed(2)
      : (amount * selectedDolar.compra).toFixed(2)
    : '0.00';

  // Función para compartir
  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: 'Consulta el dólar con Dólar Gaucho',
          text: `El ${selectedCurrency} hoy: Compra $${selectedDolar?.compra.toFixed(
            2
          )} | Venta $${selectedDolar?.venta.toFixed(
            2
          )}\nConvierte tu dinero y consulta cotizaciones en tiempo real gratis en Dólar Gaucho.\nVisítanos: ${window.location.href}`,
          url: window.location.href,
        });
      } catch (error) {
        logger.error('Error al compartir conversión', error, {
          component: 'CurrencyConverter',
          currency: selectedCurrency,
        });
      }
    } else {
      alert('Tu navegador no soporta la función de compartir.');
    }
  };

  return (
    <div className="p-6 m-6 glass-strong border border-white/5 shadow-xl rounded-2xl max-w-7xl w-full font-sans text-white">
      {loading && <p className="text-secondary text-center text-sm">Cargando cotizaciones...</p>}
      {error && <p className="text-error text-center text-sm">Error al cargar datos</p>}

      <div className="flex flex-col space-y-4">
        {/* Input de Monto */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 text-2xl font-mono font-semibold border border-white/5 rounded-lg bg-dark-light focus:ring-1 focus:ring-brand focus:outline-none text-right text-white"
            placeholder={`Monto en ${conversionType === 'buy' ? 'ARS' : 'USD'}`}
          />
          <span className="absolute left-4 top-5 text-secondary font-semibold text-sm uppercase tracking-wider">
            {conversionType === 'buy' ? 'ARS' : 'USD'}
          </span>
        </div>

        {/* Botón de conversión */}
        <button
          onClick={() => setConversionType(conversionType === 'buy' ? 'sell' : 'buy')}
          className="w-full py-3 text-sm font-semibold text-dark bg-brand rounded-lg hover:bg-brand-light flex items-center justify-center gap-2 transition-all"
        >
          <FaExchangeAlt /> Invertir Conversión
        </button>

        {/* Selector de tipo de dólar */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full p-4 text-sm bg-dark-light border border-white/5 rounded-lg appearance-none focus:ring-1 focus:ring-brand focus:outline-none text-white font-semibold"
          >
            {dolar.map((tipo) => (
              <option key={tipo.nombre} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-4 top-5 text-secondary pointer-events-none" />
        </div>

        {/* Resultado de la conversión */}
        <div className="text-center text-2xl font-bold font-mono text-brand p-5 border border-brand/20 rounded-lg glass-strong">
          {conversionType === 'buy' ? 'USD' : 'ARS'} {conversion}
        </div>

        {/* Botón para compartir */}
        <button
          onClick={handleShare}
          className="w-full py-3 text-sm font-semibold text-white glass border border-white/5 rounded-lg hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
        >
          <FaShareAlt /> Compartir
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;
