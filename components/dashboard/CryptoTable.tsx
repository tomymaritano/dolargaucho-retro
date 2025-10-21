/**
 * CryptoTable Component
 *
 * Single Responsibility: Render cryptocurrency table with favorites
 * Features: Sorting, sparklines, always-visible actions, hover effects
 */

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { useCryptoHistoricoRange } from '@/hooks/useCryptoHistoricalRange';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

type SortField = 'nombre' | 'precio_usd' | 'precio_ars' | '24h' | '30d';
type SortDirection = 'asc' | 'desc';

interface CryptoTableProps {
  cryptos: CryptoData[];
  selectedDolar: Quotation | undefined;
  favoriteCryptoIds: string[];
  cryptoPage: number;
  cryptoPerPage: number;
  onToggleFavorite: (id: string) => void;
  onSelectCrypto?: (id: string) => void;
}

/**
 * Expanded chart component for a specific cryptocurrency
 */
function ExpandedCryptoChart({ cryptoId, name }: { cryptoId: string; name: string }) {
  const { data: chartDataRange, isLoading } = useCryptoHistoricoRange(cryptoId, 365);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-secondary">Cargando gráfico...</div>
      </div>
    );
  }

  if (!chartDataRange || !chartDataRange.data || chartDataRange.data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-secondary text-sm">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-success' : 'text-error'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d) => ({ date: d.fecha, value: d.valor }))}
            title={name}
            color="#f59e0b"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

export function CryptoTable({
  cryptos,
  selectedDolar,
  favoriteCryptoIds,
  cryptoPage,
  cryptoPerPage,
  onToggleFavorite,
  onSelectCrypto,
}: CryptoTableProps) {
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    return `$${(value / 1_000_000).toFixed(2)}M`;
  };

  const getTrendData = (percentage: number) => {
    // Crypto: up=bueno (verde), down=malo (rojo) - perspectiva del holder
    if (percentage > 0) {
      return { icon: FaArrowUp, color: 'text-success' };
    }
    if (percentage < 0) {
      return { icon: FaArrowDown, color: 'text-error' };
    }
    return { icon: FaMinus, color: 'text-warning' };
  };

  // Sorting logic
  const sortedCryptos = useMemo(() => {
    const sorted = [...cryptos].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'nombre':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'precio_usd':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'precio_ars':
          aValue = selectedDolar ? a.current_price * selectedDolar.venta : a.current_price;
          bValue = selectedDolar ? b.current_price * selectedDolar.venta : b.current_price;
          break;
        case '24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case '30d':
          aValue = a.price_change_percentage_30d_in_currency || 0;
          bValue = b.price_change_percentage_30d_in_currency || 0;
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

    return sorted;
  }, [cryptos, sortField, sortDirection, selectedDolar]);

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
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHeaderCell align="left" sortable onSort={() => handleSort('nombre')} width="30%">
            <div className="flex items-center gap-2">
              Nombre
              <SortIcon field="nombre" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('precio_usd')}
            width="12%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio USD
              <SortIcon field="precio_usd" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('precio_ars')}
            width="12%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio ARS
              <SortIcon field="precio_ars" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell align="right" sortable onSort={() => handleSort('24h')} width="10%">
            <div className="flex items-center justify-end gap-2">
              24h %
              <SortIcon field="24h" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell align="right" sortable onSort={() => handleSort('30d')} width="10%">
            <div className="flex items-center justify-end gap-2">
              30d %
              <SortIcon field="30d" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell align="center" width="12%">
            30D Trend
          </TableHeaderCell>
          <TableHeaderCell align="right" width="14%">
            Acciones
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCryptos.map((crypto, index) => {
          const isFavorite = favoriteCryptoIds.includes(crypto.id);
          const trend24h = getTrendData(crypto.price_change_percentage_24h);
          const trend30d = getTrendData(crypto.price_change_percentage_30d_in_currency || 0);
          const TrendIcon24h = trend24h.icon;
          const TrendIcon30d = trend30d.icon;
          const isExpanded = expandedRow === crypto.id;

          return (
            <React.Fragment key={crypto.id}>
              <TableRow className="group hover:bg-background-secondary/30 transition-colors relative">
                {/* Nombre */}
                <TableCell align="left">
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                      <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Precio USD */}
                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatPrice(crypto.current_price)}
                  </span>
                </TableCell>

                {/* Precio ARS */}
                <TableCell align="right">
                  {selectedDolar ? (
                    <span className="text-sm font-semibold text-brand tabular-nums">
                      $
                      {(crypto.current_price * selectedDolar.venta).toLocaleString('es-AR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  ) : (
                    <span className="text-xs text-secondary">...</span>
                  )}
                </TableCell>

                {/* 24h % */}
                <TableCell align="right">
                  <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
                    <TrendIcon24h className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">
                      {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>

                {/* 30d % */}
                <TableCell align="right">
                  <div className={`inline-flex items-center gap-1 ${trend30d.color}`}>
                    <TrendIcon30d className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">
                      {(crypto.price_change_percentage_30d_in_currency || 0) > 0 ? '+' : ''}
                      {(crypto.price_change_percentage_30d_in_currency || 0).toFixed(2)}%
                    </span>
                  </div>
                </TableCell>

                {/* 30D Trend Sparkline */}
                <TableCell align="center">
                  <div className="flex items-center justify-center">
                    {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
                      <CryptoSparkline
                        data={crypto.sparkline_in_7d.price}
                        trend={
                          (crypto.price_change_percentage_30d_in_currency || 0) > 0
                            ? 'up'
                            : (crypto.price_change_percentage_30d_in_currency || 0) < 0
                              ? 'down'
                              : 'neutral'
                        }
                        isCrypto={true}
                      />
                    ) : (
                      <span className="text-xs text-secondary">-</span>
                    )}
                  </div>
                </TableCell>

                {/* Acciones - siempre visibles */}
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRow(isExpanded ? null : crypto.id);
                      }}
                      className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                        isExpanded
                          ? 'bg-brand/10 text-brand hover:bg-brand/20'
                          : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
                      }`}
                      aria-label={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
                      title={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
                    >
                      <FaChartLine className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(crypto.id);
                      }}
                      className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                        isFavorite
                          ? 'bg-brand/10 text-brand hover:bg-brand/20'
                          : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          `${crypto.name}: ${formatPrice(crypto.current_price)}`
                        );
                      }}
                      className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
                      aria-label="Copiar"
                      title="Copiar valor"
                    >
                      <FaCopy className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator.share({
                            title: crypto.name,
                            text: `${crypto.name}: ${formatPrice(crypto.current_price)}`,
                          });
                        }
                      }}
                      className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
                      aria-label="Compartir"
                      title="Compartir"
                    >
                      <FaShareAlt className="text-sm" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Expandable chart row */}
              {isExpanded && (
                <TableRow hoverable={false}>
                  <TableCell colSpan={7} className="py-6 bg-background-secondary/20">
                    <ExpandedCryptoChart cryptoId={crypto.id} name={crypto.name} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
