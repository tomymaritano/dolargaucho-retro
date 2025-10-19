import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import type { CryptoData } from '@/types/api/crypto';
import type { DolarQuotation } from '@/types/api/dolar';

interface CryptoTableRowProps {
  crypto: CryptoData;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  selectedDolar: DolarQuotation | null | undefined;
}

export function CryptoTableRow({
  crypto,
  index,
  isFavorite,
  onToggleFavorite,
  selectedDolar,
}: CryptoTableRowProps) {
  const getTrendData = (percentage: number) => {
    if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
    if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
    return { icon: FaMinus, color: 'text-warning' };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const TrendIcon = trend24h.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    return `$${(value / 1_000_000).toFixed(2)}M`;
  };

  return (
    <React.Fragment>
      <TableRow className="group">
        {/* Favorito */}
        <TableCell align="center">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-brand bg-brand/10' : 'text-secondary hover:text-brand hover:bg-white/5'}`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? <FaStar className="text-base" /> : <FaRegStar className="text-base" />}
          </button>
        </TableCell>

        {/* Ranking */}
        <TableCell align="left">
          <span className="text-sm text-secondary font-medium">{index + 1}</span>
        </TableCell>

        {/* Logo + Nombre */}
        <TableCell align="left">
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
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

        {/* 24h Change */}
        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* Market Cap */}
        <TableCell align="right">
          <span className="text-sm text-foreground tabular-nums">
            {formatMarketCap(crypto.market_cap)}
          </span>
        </TableCell>
      </TableRow>

      {/* Fila expandible con detalles (visible al hover) */}
      <TableRow hoverable={false} className="hidden group-hover:table-row bg-brand/5">
        <TableCell colSpan={7} className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h High</p>
              <p className="font-semibold text-success text-xs">{formatPrice(crypto.high_24h)}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
              <p className="font-semibold text-error text-xs">{formatPrice(crypto.low_24h)}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
              <p className="font-semibold text-foreground text-xs">
                {formatMarketCap(crypto.total_volume)}
              </p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Suministro</p>
              <p className="font-semibold text-foreground text-xs">
                {formatMarketCap(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
