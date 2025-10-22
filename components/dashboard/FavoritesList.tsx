/**
 * FavoritesList Component
 *
 * Unified favorites table for dolares, currencies, and cryptos
 * Refactored for better separation of concerns
 */

import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell } from '@/components/ui/Table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useMultipleDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import { useMultipleCotizacionesHistoricoRange } from '@/hooks/useCotizacionesHistoricoRange';
import { useFavoritesSorting, type SortField } from '@/hooks/useFavoritesSorting';
import type { DolarWithVariation } from '@/hooks/useDolarVariations';
import type { CotizacionWithVariation } from '@/hooks/useCotizaciones';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';
import { FavoriteDolarRow } from './favorites/FavoriteDolarRow';
import { FavoriteCurrencyRow } from './favorites/FavoriteCurrencyRow';
import { FavoriteCryptoRow } from './favorites/FavoriteCryptoRow';

interface FavoritesListProps {
  items: Array<DolarWithVariation | CotizacionWithVariation | CryptoData>;
  selectedDolar: Quotation | undefined;
  onToggleDolar: (casa: string) => void;
  onToggleCurrency: (moneda: string) => void;
  onToggleCrypto: (id: string) => void;
  onSelectItem?: (id: string) => void;
}

export function FavoritesList({
  items,
  selectedDolar,
  onToggleDolar,
  onToggleCurrency,
  onToggleCrypto,
}: FavoritesListProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Use sorting hook
  const { sortedItems, sortField, sortDirection, handleSort } = useFavoritesSorting({
    items,
    selectedDolar,
  });

  // Extract dolar casas for historical data
  const dolarCasas = items
    .filter(
      (item): item is DolarWithVariation =>
        'casa' in item && 'moneda' in item && item.moneda === 'USD'
    )
    .map((d) => d.casa);

  // Extract currency monedas for historical data
  const currencyMonedas = items
    .filter(
      (item): item is CotizacionWithVariation =>
        'casa' in item && 'moneda' in item && item.moneda !== 'USD'
    )
    .map((c) => c.moneda.toLowerCase());

  // Fetch 30-day historical data for dolares
  const { data: dolarHistorical, isLoading: loadingDolarHistorical } =
    useMultipleDolarHistoricoRange(dolarCasas, 30);

  // Fetch 30-day historical data for currencies
  const { data: currencyHistorical, isLoading: loadingCurrencyHistorical } =
    useMultipleCotizacionesHistoricoRange(currencyMonedas, 30);

  const handleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
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
            onSort={() => handleSort('precioUSD')}
            width="14%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio USD
              <SortIcon field="precioUSD" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('precioARS')}
            width="14%"
          >
            <div className="flex items-center justify-end gap-2">
              Precio ARS
              <SortIcon field="precioARS" />
            </div>
          </TableHeaderCell>
          <TableHeaderCell
            align="right"
            sortable
            onSort={() => handleSort('variacion')}
            width="10%"
          >
            <div className="flex items-center justify-end gap-2">
              24h %
              <SortIcon field="variacion" />
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
        {sortedItems.map((item) => {
          // Type guards
          const isDolar = 'casa' in item && 'moneda' in item && item.moneda === 'USD';
          const isCrypto = 'symbol' in item && 'market_cap' in item;

          if (isDolar) {
            const dolar = item as DolarWithVariation;
            return (
              <FavoriteDolarRow
                key={`dolar-${dolar.casa}`}
                dolar={dolar}
                dolarHistorical={dolarHistorical || {}}
                loadingHistorical={loadingDolarHistorical}
                isExpanded={expandedRow === `dolar-${dolar.casa}`}
                onToggle={onToggleDolar}
                onExpand={handleExpand}
              />
            );
          } else if (isCrypto) {
            const crypto = item as CryptoData;
            return (
              <FavoriteCryptoRow
                key={`crypto-${crypto.id}`}
                crypto={crypto}
                selectedDolar={selectedDolar}
                isExpanded={expandedRow === `crypto-${crypto.id}`}
                onToggle={onToggleCrypto}
                onExpand={handleExpand}
              />
            );
          } else {
            const cotizacion = item as CotizacionWithVariation;
            return (
              <FavoriteCurrencyRow
                key={`currency-${cotizacion.moneda}`}
                cotizacion={cotizacion}
                currencyHistorical={currencyHistorical || {}}
                loadingHistorical={loadingCurrencyHistorical}
                isExpanded={expandedRow === `currency-${cotizacion.moneda}`}
                onToggle={onToggleCurrency}
                onExpand={handleExpand}
              />
            );
          }
        })}
      </TableBody>
    </Table>
  );
}
