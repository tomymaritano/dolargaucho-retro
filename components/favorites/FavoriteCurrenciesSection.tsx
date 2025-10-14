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
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';

interface FavoriteCurrenciesSectionProps {
  currencies: CotizacionWithVariation[];
  onToggleFavorite: (moneda: string) => void;
}

export function FavoriteCurrenciesSection({
  currencies,
  onToggleFavorite,
}: FavoriteCurrenciesSectionProps) {
  if (!currencies || currencies.length === 0) return null;

  return (
    <Card variant="elevated" padding="none">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Monedas Favoritas</h2>
        <p className="text-sm text-secondary mt-1">
          {currencies.length} {currencies.length === 1 ? 'favorito' : 'favoritos'}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHeaderCell align="center" width="48px">
              <FaStar className="inline-block text-accent-emerald" />
            </TableHeaderCell>
            <TableHeaderCell align="left">Moneda</TableHeaderCell>
            <TableHeaderCell align="right">Compra</TableHeaderCell>
            <TableHeaderCell align="right">Venta</TableHeaderCell>
            <TableHeaderCell align="right">Variación</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((cotizacion) => {
            const { trend, percentage } = cotizacion.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <TableRow key={cotizacion.moneda}>
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(cotizacion.moneda)}
                    className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                    aria-label={`Quitar ${cotizacion.nombre} de favoritos`}
                  >
                    <FaStar className="text-base" />
                  </button>
                </TableCell>

                <TableCell align="left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-emerald font-bold text-sm">
                        {cotizacion.moneda}
                      </span>
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
                  <span className="text-sm font-semibold text-accent-emerald tabular-nums">
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
