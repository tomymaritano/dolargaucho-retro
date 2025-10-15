/**
 * CryptoTable Component
 *
 * Single Responsibility: Render cryptocurrency table with favorites
 * Pure presentation component
 */

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface CryptoTableProps {
  cryptos: CryptoData[];
  selectedDolar: Quotation | undefined;
  favoriteCryptoIds: string[];
  cryptoPage: number;
  cryptoPerPage: number;
  onToggleFavorite: (id: string) => void;
}

export function CryptoTable({
  cryptos,
  selectedDolar,
  favoriteCryptoIds,
  cryptoPage,
  cryptoPerPage,
  onToggleFavorite,
}: CryptoTableProps) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHeaderCell align="left">Nombre</TableHeaderCell>
          <TableHeaderCell align="right">Precio USD</TableHeaderCell>
          <TableHeaderCell align="right">Precio ARS</TableHeaderCell>
          <TableHeaderCell align="right">24h %</TableHeaderCell>
          <TableHeaderCell align="right">7d %</TableHeaderCell>
          <TableHeaderCell align="center">7D Trend</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cryptos.map((crypto, index) => {
          const isFavorite = favoriteCryptoIds.includes(crypto.id);
          const trend24h = getTrendData(crypto.price_change_percentage_24h);
          const trend7d = getTrendData(crypto.price_change_percentage_7d_in_currency || 0);
          const TrendIcon24h = trend24h.icon;
          const TrendIcon7d = trend7d.icon;

          return (
            <React.Fragment key={crypto.id}>
              <TableRow className="group">
                {/* Nombre con badge de favorito y botón hover */}
                <TableCell align="left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isFavorite && (
                        <FaStar className="text-accent-emerald text-xs flex-shrink-0" />
                      )}
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                        <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFavorite(crypto.id)}
                      className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                        isFavorite
                          ? 'text-accent-emerald hover:bg-accent-emerald/10'
                          : 'text-secondary hover:text-accent-emerald hover:bg-white/5'
                      }`}
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      {isFavorite ? (
                        <FaStar className="text-sm" />
                      ) : (
                        <FaRegStar className="text-sm" />
                      )}
                    </button>
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
                    <span className="text-sm font-semibold text-accent-emerald tabular-nums">
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

                {/* 7d % */}
                <TableCell align="right">
                  <div className={`inline-flex items-center gap-1 ${trend7d.color}`}>
                    <TrendIcon7d className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">
                      {(crypto.price_change_percentage_7d_in_currency || 0) > 0 ? '+' : ''}
                      {(crypto.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                    </span>
                  </div>
                </TableCell>

                {/* 7D Trend Sparkline */}
                <TableCell align="center">
                  {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
                    <CryptoSparkline
                      data={crypto.sparkline_in_7d.price}
                      trend={
                        (crypto.price_change_percentage_7d_in_currency || 0) > 0
                          ? 'up'
                          : (crypto.price_change_percentage_7d_in_currency || 0) < 0
                            ? 'down'
                            : 'neutral'
                      }
                      isCrypto={true}
                    />
                  ) : (
                    <span className="text-xs text-secondary">-</span>
                  )}
                </TableCell>
              </TableRow>

              {/* Expandable Row */}
              <TableRow
                hoverable={false}
                className="hidden group-hover:table-row bg-accent-emerald/5"
              >
                <TableCell colSpan={6} className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Ranking</p>
                      <p className="font-semibold text-foreground text-xs">
                        #{(cryptoPage - 1) * cryptoPerPage + index + 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">Market Cap</p>
                      <p className="font-semibold text-foreground text-xs">
                        {formatMarketCap(crypto.market_cap)}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">24h High</p>
                      <p className="font-semibold text-success text-xs">
                        {formatPrice(crypto.high_24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
                      <p className="font-semibold text-error text-xs">
                        {formatPrice(crypto.low_24h)}
                      </p>
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
        })}
      </TableBody>
    </Table>
  );
}
