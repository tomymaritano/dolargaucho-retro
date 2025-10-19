/**
 * CotizacionesTableHeader Component
 *
 * Single Responsibility: Render sortable table headers for CotizacionesTable
 * Extracted from CotizacionesTable.tsx (322 → 80 lines)
 */

import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { TableHeader, TableRow, TableHeaderCell } from '@/components/ui/Table';
import type { CotizacionSortField, SortDirection } from '@/hooks/useCotizacionesSorting';

interface CotizacionesTableHeaderProps {
  sortField: CotizacionSortField;
  sortDirection: SortDirection;
  onSort: (field: CotizacionSortField) => void;
}

interface SortIconProps {
  field: CotizacionSortField;
  sortField: CotizacionSortField;
  sortDirection: SortDirection;
}

const SortIcon = ({ field, sortField, sortDirection }: SortIconProps) => {
  if (sortField !== field) {
    return (
      <FaSort className="text-xs text-secondary/50 group-hover:text-secondary transition-colors duration-200" />
    );
  }
  return sortDirection === 'asc' ? (
    <FaSortUp className="text-xs text-brand" />
  ) : (
    <FaSortDown className="text-xs text-brand" />
  );
};

export function CotizacionesTableHeader({
  sortField,
  sortDirection,
  onSort,
}: CotizacionesTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow hoverable={false}>
        {/* Moneda */}
        <TableHeaderCell align="left" sortable onSort={() => onSort('nombre')}>
          <div className="flex items-center gap-2 group">
            Nombre
            <SortIcon field="nombre" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* Compra */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('compra')}>
          <div className="flex items-center justify-end gap-2 group">
            Compra
            <SortIcon field="compra" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* Venta */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('venta')}>
          <div className="flex items-center justify-end gap-2 group">
            Venta
            <SortIcon field="venta" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* 24h % */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('variation')}>
          <div className="flex items-center justify-end gap-2 group">
            24h %
            <SortIcon field="variation" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* 7D Trend */}
        <TableHeaderCell align="center" sortable onSort={() => onSort('sparkline')}>
          <div className="flex items-center justify-center gap-2 group">
            7D Trend
            <SortIcon field="sparkline" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* Acciones */}
        <TableHeaderCell align="center">
          <div className="flex items-center justify-center gap-2">Acciones</div>
        </TableHeaderCell>
      </TableRow>
    </TableHeader>
  );
}
