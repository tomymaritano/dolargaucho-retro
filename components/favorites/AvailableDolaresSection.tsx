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
import type { DolarWithVariation } from '@/hooks/useDolarVariations';

interface AvailableDolaresSectionProps {
  dolares: DolarWithVariation[];
  favoriteDolares: string[];
  onToggleFavorite: (casa: string) => void;
}

export function AvailableDolaresSection({
  dolares,
  favoriteDolares,
  onToggleFavorite,
}: AvailableDolaresSectionProps) {
  if (!dolares) return null;

  return (
    <Card variant="elevated" padding="none" className="mt-8">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Dólares Disponibles</h2>
        <p className="text-sm text-secondary mt-1">Agregá o quitá dólares de tus favoritos</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHeaderCell align="center" width="48px">
              <FaStar className="inline-block text-brand" />
            </TableHeaderCell>
            <TableHeaderCell align="left">Tipo</TableHeaderCell>
            <TableHeaderCell align="right">Compra</TableHeaderCell>
            <TableHeaderCell align="right">Venta</TableHeaderCell>
            <TableHeaderCell align="right">Variación</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dolares.map((dolar) => {
            const isFavorite = favoriteDolares.includes(dolar.casa);
            const { trend, percentage } = dolar.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <TableRow key={dolar.casa} className={isFavorite ? 'bg-brand/5' : ''}>
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(dolar.casa)}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorite
                        ? 'text-brand bg-brand/10 hover:bg-brand/20'
                        : 'text-secondary bg-secondary/10 hover:bg-secondary/20 hover:text-brand'
                    }`}
                    aria-label={
                      isFavorite
                        ? `Quitar ${dolar.nombre} de favoritos`
                        : `Agregar ${dolar.nombre} a favoritos`
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
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                    <p className="text-xs text-secondary">{dolar.casa}</p>
                  </div>
                </TableCell>

                <TableCell align="right">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${dolar.compra.toFixed(2)}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <span className="text-sm font-semibold text-brand tabular-nums">
                    ${dolar.venta.toFixed(2)}
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
