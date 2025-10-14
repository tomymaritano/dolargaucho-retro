/**
 * Table Component System
 *
 * Sistema unificado de tablas con principios de UX/UI consistentes:
 * - Jerarquía visual clara
 * - Espaciado óptimo para legibilidad
 * - Estados de loading, error y vacío
 * - Hover effects y transiciones suaves
 * - Responsivo con scroll horizontal
 * - Accesibilidad (semantic HTML, ARIA)
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHeaderCell>Nombre</TableHeaderCell>
 *       <TableHeaderCell align="right">Precio</TableHeaderCell>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Bitcoin</TableCell>
 *       <TableCell align="right">$50,000</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */

import React from 'react';

interface TableProps {
  children?: React.ReactNode;
  className?: string;
  /** Mostrar skeleton loader */
  loading?: boolean;
  /** Número de filas del skeleton */
  skeletonRows?: number;
  /** Número de columnas del skeleton */
  skeletonCols?: number;
}

export function Table({
  children,
  className = '',
  loading = false,
  skeletonRows = 5,
  skeletonCols = 4,
}: TableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className={`w-full ${className}`}>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border animate-pulse">
                {Array.from({ length: skeletonCols }).map((_, colIndex) => (
                  <td key={colIndex} className="py-4 px-4">
                    <div className="h-4 bg-white/10 rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return <thead className={`border-b border-border ${className}`}>{children}</thead>;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  /** Mostrar estado vacío */
  empty?: boolean;
  /** Mensaje del estado vacío */
  emptyMessage?: string;
  /** Número de columnas para colspan en estado vacío */
  emptyColSpan?: number;
}

export function TableBody({
  children,
  className = '',
  empty = false,
  emptyMessage = 'No hay datos disponibles',
  emptyColSpan = 1,
}: TableBodyProps) {
  if (empty) {
    return (
      <tbody>
        <tr>
          <td colSpan={emptyColSpan} className="py-12 px-4 text-center">
            <p className="text-secondary">{emptyMessage}</p>
          </td>
        </tr>
      </tbody>
    );
  }

  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  /** Hacer la fila hoverable */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function TableRow({ children, className = '', hoverable = true, onClick }: TableRowProps) {
  const baseClasses = 'border-b border-border';
  const hoverClasses = hoverable ? 'hover:bg-white/5 transition-colors' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <tr className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Ancho de la celda */
  width?: string;
  /** ColSpan para celdas que ocupan múltiples columnas */
  colSpan?: number;
}

export function TableCell({
  children,
  className = '',
  align = 'left',
  width,
  colSpan,
}: TableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const widthStyle = width ? { width } : undefined;

  return (
    <td
      className={`py-4 px-4 ${alignClasses[align]} ${className}`}
      style={widthStyle}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Ancho de la celda */
  width?: string;
  /** Hacer la celda sorteable (clickeable) */
  sortable?: boolean;
  /** Click handler para sorting */
  onSort?: () => void;
}

export function TableHeaderCell({
  children,
  className = '',
  align = 'left',
  width,
  sortable = false,
  onSort,
}: TableHeaderCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const widthStyle = width ? { width } : undefined;
  const sortableClasses = sortable
    ? 'cursor-pointer hover:text-accent-emerald transition-colors'
    : '';

  return (
    <th
      className={`py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider ${alignClasses[align]} ${sortableClasses} ${className}`}
      style={widthStyle}
      onClick={sortable ? onSort : undefined}
    >
      {children}
    </th>
  );
}
