import React, { useState } from 'react';
import { FaSearch, FaShareAlt, FaCopy, FaCheckCircle, FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { Card } from '@/components/ui/Card';
import { logger } from '@/lib/utils/logger';

const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return `${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

const DolarTable: React.FC = () => {
  const { data, isLoading, error } = useDolarVariations();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredData = data
    ? [...data].filter((tipo) => tipo.nombre.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleCopy = async (tipo: typeof data[0]) => {
    try {
      await navigator.clipboard.writeText(
        `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`
      );
      setCopiedId(tipo.nombre);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      logger.error('Error al copiar cotización', error, { component: 'DolarTable', tipoDolar: tipo.nombre });
    }
  };

  const handleShare = async (tipo: typeof data[0]) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Cotización ${tipo.nombre}`,
          text: `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        logger.error('Error al compartir cotización', error, { component: 'DolarTable', tipoDolar: tipo.nombre });
      }
    }
  };

  const toggleFavorite = (nombre: string) => {
    setFavorites((prev) =>
      prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
    );
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
    <div id="cotizaciones">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-8 glass px-4 py-3 rounded-xl border border-border hover:border-accent-emerald/30 transition-colors focus-within:border-accent-emerald/50 focus-within:ring-2 focus-within:ring-accent-emerald/20">
        <FaSearch className="text-secondary text-sm" />
        <input
          type="text"
          placeholder="Buscar tipo de dólar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-secondary"
        />
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="text-center py-12 glass-strong rounded-xl border border-border">
          <p className="text-secondary text-sm">No se encontraron resultados</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((tipo) => {
          const isFavorite = favorites.includes(tipo.nombre);
          const spread = tipo.venta - tipo.compra;
          const isSpreadPositive = spread > 0;

          const { trend, percentage, previousValue } = tipo.variation;
          const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
          const trendColor = trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';
          const trendBg = trend === 'up' ? 'bg-error/10' : trend === 'down' ? 'bg-success/10' : 'bg-warning/10';

          return (
            <Card key={tipo.nombre} variant="elevated" padding="lg" hover="glow">
              {/* Header: Name + Favorite */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    {tipo.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
                    <span className="text-[10px] text-secondary">{formatFecha(tipo.fechaActualizacion)}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(tipo.nombre)}
                  className={`p-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-accent-emerald/20 text-accent-emerald'
                      : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                  }`}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
                </button>
              </div>

              {/* Main Price - Venta destacado + Variation */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">Precio de Venta</p>
                  {previousValue && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendBg} ${trendColor}`}
                      title={`Ayer: $${previousValue.toFixed(2)}`}
                    >
                      <TrendIcon className="text-[10px]" />
                      <span className="text-[10px] font-bold tabular-nums">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-4xl font-bold text-accent-emerald tabular-nums">
                  ${tipo.venta.toFixed(2)}
                </p>
              </div>

              {/* Secondary Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-panel/50 border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Compra</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">
                    ${tipo.compra.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-panel/50 border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Diferencia</p>
                  <div className="flex items-center gap-1">
                    {isSpreadPositive ? (
                      <FaArrowUp className="text-xs text-accent-emerald" />
                    ) : (
                      <FaArrowDown className="text-xs text-error" />
                    )}
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      ${Math.abs(spread).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => handleCopy(tipo)}
                  className="flex-1 px-3 py-2 rounded-lg glass hover:bg-accent-emerald/10 transition-all text-secondary hover:text-accent-emerald flex items-center justify-center gap-2 text-xs font-medium"
                  title="Copiar cotización"
                >
                  {copiedId === tipo.nombre ? (
                    <>
                      <FaCheckCircle className="text-accent-emerald" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      Copiar
                    </>
                  )}
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={() => handleShare(tipo)}
                    className="px-3 py-2 rounded-lg glass hover:bg-accent-emerald/10 transition-all text-secondary hover:text-accent-emerald"
                    title="Compartir cotización"
                  >
                    <FaShareAlt className="text-sm" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DolarTable;
