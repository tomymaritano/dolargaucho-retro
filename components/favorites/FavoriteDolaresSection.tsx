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
import type { DolarWithVariation } from '@/hooks/useDolarVariations';

interface FavoriteDolaresSectionProps {
  dolares: DolarWithVariation[];
  onToggleFavorite: (casa: string) => void;
}

export function FavoriteDolaresSection({ dolares, onToggleFavorite }: FavoriteDolaresSectionProps) {
  if (!dolares || dolares.length === 0) return null;

  return (
    <Card variant="elevated" padding="none">
      <div className="p-6 border-b border-border/10">
        <h2 className="text-xl font-bold text-foreground">Dólares Favoritos</h2>
        <p className="text-sm text-secondary mt-1">
          {dolares.length} {dolares.length === 1 ? 'favorito' : 'favoritos'}
        </p>
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
            const { trend, percentage } = dolar.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';

            return (
              <TableRow key={dolar.casa}>
                <TableCell align="center">
                  <button
                    onClick={() => onToggleFavorite(dolar.casa)}
                    className="p-2 rounded-lg text-brand bg-brand/10 hover:bg-brand/20 transition-all"
                    aria-label={`Quitar ${dolar.nombre} de favoritos`}
                  >
                    <FaStar className="text-base" />
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
