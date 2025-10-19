/**
 * CryptoTableHeader Component
 *
 * Single Responsibility: Render cryptocurrency table header with sorting controls
 */

import React from 'react';
import { TableHeader, TableRow, TableHeaderCell } from '@/components/ui/Table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import type { SortField, SortDirection } from '@/hooks/useCryptoSorting';

interface CryptoTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
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

export function CryptoTableHeader({ sortField, sortDirection, onSort }: CryptoTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow hoverable={false}>
        {/* Nombre */}
        <TableHeaderCell align="left" sortable onSort={() => onSort('nombre')}>
          <div className="flex items-center gap-2 group">
            <span className="group-hover:text-brand transition-colors duration-200">Nombre</span>
            <SortIcon field="nombre" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* Precio USD */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('precio_usd')}>
          <div className="flex items-center justify-end gap-2 group">
            <span className="group-hover:text-brand transition-colors duration-200">
              Precio USD
            </span>
            <SortIcon field="precio_usd" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* Precio ARS */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('precio_ars')}>
          <div className="flex items-center justify-end gap-2 group">
            <span className="group-hover:text-brand transition-colors duration-200">
              Precio ARS
            </span>
            <SortIcon field="precio_ars" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* 24h % */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('24h')}>
          <div className="flex items-center justify-end gap-2 group">
            <span className="group-hover:text-brand transition-colors duration-200">24h %</span>
            <SortIcon field="24h" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* 7d % */}
        <TableHeaderCell align="right" sortable onSort={() => onSort('7d')}>
          <div className="flex items-center justify-end gap-2 group">
            <span className="group-hover:text-brand transition-colors duration-200">7d %</span>
            <SortIcon field="7d" sortField={sortField} sortDirection={sortDirection} />
          </div>
        </TableHeaderCell>

        {/* 7D Trend */}
        <TableHeaderCell align="center">
          <div className="flex items-center justify-center gap-2">7D Trend</div>
        </TableHeaderCell>

        {/* Acciones */}
        <TableHeaderCell align="center">
          <div className="flex items-center justify-center gap-2">Acciones</div>
        </TableHeaderCell>
      </TableRow>
    </TableHeader>
  );
}
