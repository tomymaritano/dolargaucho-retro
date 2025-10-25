'use client';

import React, { useState } from 'react';
import { useDiputados } from '@/hooks/usePolitica';
import { Card } from '@/components/ui/Card/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import {
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

export const DiputadosTable = React.memo(function DiputadosTable() {
  const { data: diputados, isLoading, error } = useDiputados();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedBloque, setSelectedBloque] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter diputados
  const filteredDiputados = React.useMemo(() => {
    if (!diputados) return [];

    return diputados.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        d.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.apellido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvincia = !selectedProvincia || d.provincia === selectedProvincia;
      const matchesBloque = !selectedBloque || d.bloque === selectedBloque;

      return matchesSearch && matchesProvincia && matchesBloque;
    });
  }, [diputados, searchTerm, selectedProvincia, selectedBloque]);

  // Pagination
  const totalPages = Math.ceil(filteredDiputados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDiputados = filteredDiputados.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProvincia, selectedBloque, itemsPerPage]);

  // Get unique provincias and bloques
  const provincias = React.useMemo(() => {
    if (!diputados) return [];
    return Array.from(new Set(diputados.map((d) => d.provincia))).sort();
  }, [diputados]);

  const bloques = React.useMemo(() => {
    if (!diputados) return [];
    return Array.from(new Set(diputados.map((d) => d.bloque))).sort();
  }, [diputados]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <FaSpinner className="animate-spin text-brand text-4xl" />
          <p className="text-secondary">Cargando diputados...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-error text-lg font-semibold">Error al cargar diputados</p>
          <p className="text-secondary text-sm">Intenta nuevamente más tarde</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card variant="elevated" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-panel border border-border/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* Provincia Filter */}
          <select
            value={selectedProvincia}
            onChange={(e) => setSelectedProvincia(e.target.value)}
            className="px-4 py-2.5 bg-panel border border-border/5 rounded-lg text-foreground focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="">Todas las provincias</option>
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Bloque Filter */}
          <select
            value={selectedBloque}
            onChange={(e) => setSelectedBloque(e.target.value)}
            className="px-4 py-2.5 bg-panel border border-border/5 rounded-lg text-foreground focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="">Todos los bloques</option>
            {bloques.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Results count and pagination controls */}
        <div className="mt-4 pt-4 border-t border-border/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-secondary">
            Mostrando{' '}
            <span className="text-brand font-semibold">
              {filteredDiputados.length === 0 ? 0 : startIndex + 1}
            </span>
            {' - '}
            <span className="text-brand font-semibold">
              {Math.min(endIndex, filteredDiputados.length)}
            </span>{' '}
            de <span className="text-foreground font-semibold">{filteredDiputados.length}</span>{' '}
            diputados
          </p>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary">Por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1.5 bg-panel border border-border/5 rounded-lg text-foreground text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table>
          <TableHeader className="bg-panel">
            <TableRow hoverable={false}>
              <TableHeaderCell align="left" className="px-6 py-4">
                Diputado
              </TableHeaderCell>
              <TableHeaderCell align="left" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-brand" />
                  Provincia
                </div>
              </TableHeaderCell>
              <TableHeaderCell align="left" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-brand" />
                  Bloque
                </div>
              </TableHeaderCell>
              <TableHeaderCell align="left" className="px-6 py-4">
                Mandato
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody
            className="divide-y divide-white/5"
            empty={paginatedDiputados.length === 0}
            emptyMessage="No se encontraron diputados"
            emptyColSpan={4}
          >
            {paginatedDiputados.map((diputado, index) => (
              <TableRow key={`${diputado.nombre}-${diputado.apellido}-${index}`}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                      <FaUser className="text-brand" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">
                        {diputado.nombre_completo || `${diputado.nombre} ${diputado.apellido}`}
                      </p>
                      {diputado.email && (
                        <p className="text-xs text-secondary mt-0.5">{diputado.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-foreground">{diputado.provincia}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    {diputado.bloque}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm">
                    {diputado.mandato_inicio && diputado.mandato_fin ? (
                      <p className="text-foreground">
                        {new Date(diputado.mandato_inicio).getFullYear()} -{' '}
                        {new Date(diputado.mandato_fin).getFullYear()}
                      </p>
                    ) : (
                      <p className="text-secondary">N/A</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Controls */}
      {filteredDiputados.length > 0 && totalPages > 1 && (
        <Card variant="elevated" padding="lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page info */}
            <p className="text-sm text-secondary">
              Página <span className="text-brand font-semibold">{currentPage}</span> de{' '}
              <span className="text-foreground font-semibold">{totalPages}</span>
            </p>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* First page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-border/5 bg-panel text-foreground hover:bg-panel/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Primera página"
              >
                <span className="text-sm font-medium">Primera</span>
              </button>

              {/* Previous page */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-border/5 bg-panel text-foreground hover:bg-panel/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Página anterior"
              >
                <FaChevronLeft />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg border transition-all ${
                        currentPage === pageNum
                          ? 'bg-brand text-background border-brand font-semibold'
                          : 'border-border/10 bg-panel text-foreground hover:bg-panel/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next page */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-border/5 bg-panel text-foreground hover:bg-panel/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Página siguiente"
              >
                <FaChevronRight />
              </button>

              {/* Last page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-border/5 bg-panel text-foreground hover:bg-panel/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Última página"
              >
                <span className="text-sm font-medium">Última</span>
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});
