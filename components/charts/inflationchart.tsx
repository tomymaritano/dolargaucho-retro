import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaSpinner, FaChartLine } from 'react-icons/fa';

interface InflacionData {
  fecha: string;
  valor: number;
}

const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

const InflacionChart: React.FC = () => {
  const [inflacionData, setInflacionData] = useState<InflacionData[]>([]);
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inflacionType, setInflacionType] = useState<'mensual' | 'interanual'>('mensual');

  useEffect(() => {
    const fetchInflacionData = async () => {
      setLoading(true);
      try {
        const url =
          inflacionType === 'mensual'
            ? 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion'
            : 'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual';

        const response = await fetch(url);
        const data: InflacionData[] = await response.json();

        const sortedData = data
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .map((d) => ({ ...d, fecha: formatFecha(d.fecha) }));

        setInflacionData(sortedData);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchInflacionData();
  }, [inflacionType]);

  const availableYears = Array.from(
    new Set(inflacionData.map((d) => new Date(d.fecha).getFullYear().toString()))
  ).sort((a, b) => Number(b) - Number(a));

  const filteredData = inflacionData
    .filter((d) =>
      selectedYear ? new Date(d.fecha).getFullYear().toString() === selectedYear : true
    )
    .slice(0, selectedMonths)
    .reverse();

  return (
    <div className="p-6 md:p-10 glass-strong rounded-2xl border border-white/5 mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaChartLine className="text-accent-emerald text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Análisis
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Evolución de la <span className="gradient-text">Inflación</span>
        </h2>
        <p className="text-secondary text-sm max-w-2xl mx-auto">
          Datos históricos del mercado argentino
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Type selector */}
        <div className="flex gap-2">
          <button
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
              inflacionType === 'mensual'
                ? 'bg-accent-emerald text-dark'
                : 'glass border border-white/5 text-secondary hover:text-white hover:border-accent-emerald/20'
            }`}
            onClick={() => setInflacionType('mensual')}
          >
            Mensual
          </button>

          <button
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
              inflacionType === 'interanual'
                ? 'bg-accent-emerald text-dark'
                : 'glass border border-white/5 text-secondary hover:text-white hover:border-accent-emerald/20'
            }`}
            onClick={() => setInflacionType('interanual')}
          >
            Interanual
          </button>
        </div>

        {/* Months selector */}
        <div className="flex gap-2">
          {[3, 6, 12].map((months) => (
            <button
              key={months}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedMonths === months
                  ? 'bg-accent-emerald text-dark'
                  : 'glass border border-white/5 text-secondary hover:text-white hover:border-accent-emerald/20'
              }`}
              onClick={() => setSelectedMonths(months)}
            >
              {months}m
            </button>
          ))}
        </div>

        {/* Year selector */}
        <div>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value || null)}
            className="w-full glass border border-white/5 text-white px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent-emerald transition-all bg-dark-light"
          >
            <option value="">Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="text-center p-12 glass rounded-xl border border-white/5">
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="animate-spin text-accent-emerald text-3xl" />
            <p className="text-sm text-secondary">Cargando datos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-12 glass rounded-xl border border-error/30">
          <p className="text-error text-sm">{error}</p>
        </div>
      ) : (
        <div className="p-4 glass rounded-xl border border-white/5 bg-dark-light/30">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredData}>
              <XAxis
                dataKey="fecha"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(18, 23, 46, 0.95)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10B981' }}
                activeDot={{ r: 5, fill: '#14B8A6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default InflacionChart;
