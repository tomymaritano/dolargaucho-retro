import React, { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaShareAlt, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { DolarQuotation } from '@/types/api/dolar';
import { Card } from '@/components/ui/Card';

const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return `${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} -
          ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

const DolarTable: React.FC = () => {
  // Use TanStack Query hook instead of prop drilling
  const { data, isLoading, error } = useDolarQuery();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<
    'nombre' | 'compra' | 'venta' | 'fechaActualizacion'
  >('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedData = data
    ? [...data]
        .filter((tipo) => tipo.nombre.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          const aValue = a[sortColumn] ?? 0;
          const bValue = b[sortColumn] ?? 0;
          return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
        })
    : [];

  const toggleSort = (column: 'nombre' | 'compra' | 'venta' | 'fechaActualizacion') => {
    setSortColumn(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleCopy = async (tipo: DolarQuotation) => {
    try {
      await navigator.clipboard.writeText(
        `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`
      );
      setCopiedId(tipo.nombre);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleShare = async (tipo: DolarQuotation) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cotización ${tipo.nombre}`,
          text: `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-emerald border-t-transparent" />
          <p className="text-sm text-secondary">Cargando cotizaciones...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-8">
          <p className="text-error">Error: {error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <div id="cotizaciones" className="glass-strong rounded-2xl p-6 border border-accent-emerald/10">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6 glass bg-dark-light/50 px-4 py-3 rounded-xl border border-white/5">
        <FaSearch className="text-secondary text-sm" />
        <input
          type="text"
          placeholder="Buscar cotización..."
          className="bg-transparent text-white outline-none w-full placeholder-secondary text-sm font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop table view */}
      {!isMobile ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th
                  className="py-3 px-4 cursor-pointer font-semibold text-secondary text-xs uppercase tracking-wider hover:text-accent-emerald transition-colors"
                  onClick={() => toggleSort('nombre')}
                >
                  <span className="flex items-center gap-2">
                    Tipo <FaSort className="text-[10px]" />
                  </span>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer font-semibold text-secondary text-xs uppercase tracking-wider hover:text-accent-emerald transition-colors"
                  onClick={() => toggleSort('compra')}
                >
                  <span className="flex items-center justify-end gap-2">
                    Compra <FaSort className="text-[10px]" />
                  </span>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer font-semibold text-secondary text-xs uppercase tracking-wider hover:text-accent-emerald transition-colors"
                  onClick={() => toggleSort('venta')}
                >
                  <span className="flex items-center justify-end gap-2">
                    Venta <FaSort className="text-[10px]" />
                  </span>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer font-semibold text-secondary text-xs uppercase tracking-wider hover:text-accent-emerald transition-colors"
                  onClick={() => toggleSort('fechaActualizacion')}
                >
                  <span className="flex items-center justify-end gap-2">
                    Actualización <FaSort className="text-[10px]" />
                  </span>
                </th>
                <th className="py-3 px-4 text-center font-semibold text-secondary text-xs uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((tipo) => (
                <tr
                  key={tipo.nombre}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-4 font-medium text-sm">{tipo.nombre}</td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-accent-emerald">
                    ${tipo.compra.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-accent-teal">
                    ${tipo.venta.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right text-secondary text-xs">
                    {formatFecha(tipo.fechaActualizacion)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleCopy(tipo)}
                        className="p-2 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-accent-emerald"
                        aria-label="Copiar cotización"
                      >
                        {copiedId === tipo.nombre ? (
                          <FaCheckCircle className="text-sm" />
                        ) : (
                          <FaCopy className="text-sm" />
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(tipo)}
                        className="p-2 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-accent-emerald"
                        aria-label="Compartir cotización"
                      >
                        <FaShareAlt className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile card view
        <div className="flex flex-col gap-3">
          {sortedData.map((tipo) => (
            <div
              key={tipo.nombre}
              className="glass p-4 rounded-xl border border-white/5 hover:border-accent-emerald/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{tipo.nombre}</h3>
                  <p className="text-[10px] text-secondary">
                    {formatFecha(tipo.fechaActualizacion)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="glass bg-accent-emerald/5 p-3 rounded-lg border border-accent-emerald/10">
                  <p className="text-[10px] text-secondary mb-1 uppercase tracking-wider">Compra</p>
                  <p className="font-mono font-bold text-accent-emerald text-lg">
                    ${tipo.compra.toFixed(2)}
                  </p>
                </div>
                <div className="glass bg-accent-teal/5 p-3 rounded-lg border border-accent-teal/10">
                  <p className="text-[10px] text-secondary mb-1 uppercase tracking-wider">Venta</p>
                  <p className="font-mono font-bold text-accent-teal text-lg">
                    ${tipo.venta.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(tipo)}
                  className="flex-1 glass py-2 px-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm text-secondary hover:text-accent-emerald"
                >
                  {copiedId === tipo.nombre ? (
                    <>
                      <FaCheckCircle className="text-xs" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-xs" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleShare(tipo)}
                  className="flex-1 glass py-2 px-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm text-secondary hover:text-accent-emerald"
                >
                  <FaShareAlt className="text-xs" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DolarTable;
