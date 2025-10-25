import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

interface AvailableCurrenciesSectionProps {
  currencies: CotizacionWithVariation[];
  favoriteCurrencies: string[];
  onToggleFavorite: (moneda: string) => void;
}

export function AvailableCurrenciesSection({
  currencies,
  favoriteCurrencies,
  onToggleFavorite,
}: AvailableCurrenciesSectionProps) {
  if (!currencies) return null;

  return (
    <Card variant="elevated" padding="none" className="mt-8">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-foreground">Monedas Internacionales</h2>
        <p className="text-sm text-secondary mt-1">Agregá o quitá monedas de tus favoritos</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHeaderCell align="center" width="48px">
              <FaStar className="inline-block text-brand" />
            </TableHeaderCell>
            <TableHeaderCell align="left">Moneda</TableHeaderCell>
            <TableHeaderCell align="right">Compra</TableHeaderCell>
            <TableHeaderCell align="right">Venta</TableHeaderCell>
            <TableHeaderCell align="right">Variación</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((cotizacion) => {
            const isFavorite = favoriteCurrencies.includes(cotizacion.moneda);
            const { trend, percentage } = cotizacion.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <TableRow key={cotizacion.moneda} className={isFavorite ? 'bg-brand/5' : ''}>
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(cotizacion.moneda)}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorite
                        ? 'text-brand bg-brand/10 hover:bg-brand/20'
                        : 'text-secondary bg-secondary/10 hover:bg-secondary/20 hover:text-brand'
                    }`}
                    aria-label={
                      isFavorite
                        ? `Quitar ${cotizacion.nombre} de favoritos`
                        : `Agregar ${cotizacion.nombre} a favoritos`
                    }
                    aria-pressed={isFavorite}
                  >
                    {isFavorite ? (
                      <FaStar className="text-base" />
                    ) : (
                      <FaRegStar className="text-base" />
                    )}
                  </button>
                </TableCell>

                <TableCell align="left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand font-bold text-sm">{cotizacion.moneda}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cotizacion.nombre}</p>
                      <p className="text-xs text-secondary">{cotizacion.casa}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${cotizacion.compra.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <span className="text-sm font-semibold text-brand tabular-nums">
                    ${cotizacion.venta.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="text-xs" />
                    <span className="text-sm font-bold tabular-nums">{percentage.toFixed(2)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
