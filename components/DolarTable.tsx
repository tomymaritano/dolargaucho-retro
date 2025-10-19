import React, { useState, useMemo } from 'react';
import {
  FaSearch,
  FaShareAlt,
  FaCopy,
  FaCheckCircle,
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { logger } from '@/lib/utils/logger';

type SortField = 'nombre' | 'compra' | 'venta' | 'variation';
type SortDirection = 'asc' | 'desc';

const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return `${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

const DolarTable: React.FC = () => {
  const { data, isLoading, error } = useDolarVariations();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filtrado y ordenamiento
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    // Filtrado
    const filtered = data.filter((tipo) =>
      tipo.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenamiento
    return [...filtered].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
          break;
        case 'compra':
          aValue = a.compra;
          bValue = b.compra;
          break;
        case 'venta':
          aValue = a.venta;
          bValue = b.venta;
          break;
        case 'variation':
          aValue = a.variation.percentage;
          bValue = b.variation.percentage;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, search, sortField, sortDirection]);

  const handleCopy = async (tipo: (typeof data)[0]) => {
    try {
      await navigator.clipboard.writeText(
        `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`
      );
      setCopiedId(tipo.nombre);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      logger.error('Error al copiar cotización', error, {
        component: 'DolarTable',
        tipoDolar: tipo.nombre,
      });
    }
  };

  const handleShare = async (tipo: (typeof data)[0]) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Cotización ${tipo.nombre}`,
          text: `${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        logger.error('Error al compartir cotización', error, {
          component: 'DolarTable',
          tipoDolar: tipo.nombre,
        });
      }
    }
  };

  const toggleFavorite = (nombre: string) => {
    setFavorites((prev) =>
      prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="text-xs text-secondary/50" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-xs text-brand" />
    ) : (
      <FaSortDown className="text-xs text-brand" />
    );
  };

  return (
    <div id="cotizaciones">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6 bg-panel border border-white/5 px-4 py-3 rounded-xl hover:border-brand/30 transition-colors focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/20">
        <FaSearch className="text-secondary text-sm" />
        <input
          type="text"
          placeholder="Buscar tipo de dólar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-secondary"
        />
      </div>

      {/* Loading state */}
      {isLoading && <Table loading skeletonRows={8} skeletonCols={5} />}

      {/* Error state */}
      {error && (
        <div className="text-center py-12 bg-panel border border-white/5 rounded-xl">
          <p className="text-error">Error: {error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              {/* Tipo */}
              <TableHeaderCell
                align="left"
                sortable
                onSort={() => handleSort('nombre')}
                width="25%"
              >
                <div className="flex items-center gap-2">
                  Tipo
                  <SortIcon field="nombre" />
                </div>
              </TableHeaderCell>

              {/* Compra */}
              <TableHeaderCell
                align="right"
                sortable
                onSort={() => handleSort('compra')}
                width="15%"
              >
                <div className="flex items-center justify-end gap-2">
                  Compra
                  <SortIcon field="compra" />
                </div>
              </TableHeaderCell>

              {/* Venta */}
              <TableHeaderCell
                align="right"
                sortable
                onSort={() => handleSort('venta')}
                width="15%"
              >
                <div className="flex items-center justify-end gap-2">
                  Venta
                  <SortIcon field="venta" />
                </div>
              </TableHeaderCell>

              {/* 24h % */}
              <TableHeaderCell
                align="right"
                sortable
                onSort={() => handleSort('variation')}
                width="15%"
              >
                <div className="flex items-center justify-end gap-2">
                  24h %
                  <SortIcon field="variation" />
                </div>
              </TableHeaderCell>

              {/* Acciones */}
              <TableHeaderCell align="right" width="30%">
                Acciones
              </TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody empty={filteredAndSortedData.length === 0} emptyColSpan={5}>
            {filteredAndSortedData.map((tipo) => {
              const isFavorite = favorites.includes(tipo.nombre);
              const { trend, percentage } = tipo.variation;

              const TrendIcon =
                trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
              const trendColor =
                trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

              return (
                <React.Fragment key={tipo.nombre}>
                  <TableRow className="group hover:bg-white/5 transition-colors">
                    {/* Tipo */}
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{tipo.nombre}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                          <span className="text-[10px] text-secondary">
                            {formatFecha(tipo.fechaActualizacion)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Compra */}
                    <TableCell align="right">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        ${tipo.compra.toFixed(2)}
                      </span>
                    </TableCell>

                    {/* Venta */}
                    <TableCell align="right">
                      <span className="text-sm font-bold text-brand tabular-nums">
                        ${tipo.venta.toFixed(2)}
                      </span>
                    </TableCell>

                    {/* 24h % */}
                    <TableCell align="right">
                      <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon className="text-xs" />
                        <span className="text-sm font-bold tabular-nums">
                          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                          {percentage.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFavorite(tipo.nombre)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                            isFavorite
                              ? 'bg-brand/10 text-brand hover:bg-brand/20'
                              : 'bg-white/5 text-foreground/70 hover:text-brand hover:bg-brand/10'
                          }`}
                          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          {isFavorite ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(tipo)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                            copiedId === tipo.nombre
                              ? 'bg-brand/10 text-brand'
                              : 'bg-white/5 text-foreground/70 hover:text-brand hover:bg-brand/10'
                          }`}
                          aria-label="Copiar"
                          title="Copiar valor"
                        >
                          {copiedId === tipo.nombre ? (
                            <FaCheckCircle className="text-sm" />
                          ) : (
                            <FaCopy className="text-sm" />
                          )}
                        </button>
                        {typeof navigator !== 'undefined' &&
                          typeof navigator.share === 'function' && (
                            <button
                              onClick={() => handleShare(tipo)}
                              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-white/5 text-foreground/70 hover:text-brand hover:bg-brand/10"
                              aria-label="Compartir"
                              title="Compartir"
                            >
                              <FaShareAlt className="text-sm" />
                            </button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expandable row on hover */}
                  <TableRow hoverable={false} className="hidden group-hover:table-row">
                    <TableCell colSpan={5} className="py-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-secondary text-[10px] mb-0.5">Spread</p>
                          <p className="font-semibold text-foreground text-xs">
                            ${(tipo.venta - tipo.compra).toFixed(2)} (
                            {(((tipo.venta - tipo.compra) / tipo.compra) * 100).toFixed(2)}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary text-[10px] mb-0.5">Variación anterior</p>
                          <p className="font-semibold text-foreground text-xs">
                            {tipo.variation.previousValue
                              ? `$${tipo.variation.previousValue.toFixed(2)}`
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary text-[10px] mb-0.5">Última actualización</p>
                          <p className="font-semibold text-foreground text-xs">
                            {formatFecha(tipo.fechaActualizacion)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DolarTable;
