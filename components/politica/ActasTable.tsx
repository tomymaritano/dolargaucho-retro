/**
 * ActasTable Component
 *
 * Single Responsibility: Display actas in a table with expandable rows
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaFileAlt, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';
import { categorizarActa, getCategoriaColor, formatearFecha } from '@/lib/utils/actasUtils';

interface ActasTableProps {
  actas: (ActaSenado | ActaDiputados)[];
  limit: number;
}

export const ActasTable = React.memo(function ActasTable({ actas, limit }: ActasTableProps) {
  const [expandedActa, setExpandedActa] = useState<number | null>(null);

  if (actas.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-12">
          <FaFileAlt className="text-4xl text-secondary mx-auto mb-3" />
          <p className="text-secondary">No se encontraron actas con los filtros seleccionados</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-panel border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Reunión
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">
                Periodo
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {actas.map((acta, index) => {
              const categoria = categorizarActa(acta);
              const colorClass = getCategoriaColor(categoria);
              const isExpanded = expandedActa === acta.id;

              return (
                <React.Fragment key={`${acta.id}-${index}`}>
                  {/* Main row */}
                  <tr className="hover:bg-panel/10 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {new Date(acta.fecha).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${colorClass}`}
                      >
                        {categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {acta.numero_reunion !== undefined && acta.numero_reunion !== null
                        ? `Nº ${acta.numero_reunion}`
                        : new Date(acta.fecha).getFullYear()}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary hidden md:table-cell">
                      {acta.periodo && acta.periodo.trim() !== ''
                        ? acta.periodo
                        : `${categoria} ${new Date(acta.fecha).getFullYear()}`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {acta.url_pdf && (
                          <a
                            href={acta.url_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-foreground hover:text-brand transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Ver PDF"
                          >
                            <FaFileAlt />
                            <span className="hidden sm:inline">PDF</span>
                          </a>
                        )}
                        <button
                          onClick={() => setExpandedActa(isExpanded ? null : acta.id)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-secondary hover:text-foreground transition-colors"
                          title={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        >
                          <span className="hidden sm:inline">
                            {isExpanded ? 'Ocultar' : 'Ver más'}
                          </span>
                          {isExpanded ? (
                            <FaChevronUp className="text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 bg-background/50">
                        <div className="space-y-4">
                          {/* Orden del día */}
                          {acta.orden_dia && (
                            <div>
                              <h5 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                                Orden del Día
                              </h5>
                              <p className="text-sm text-foreground leading-relaxed">
                                {acta.orden_dia}
                              </p>
                            </div>
                          )}

                          {/* Additional details grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div>
                              <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                Fecha
                              </p>
                              <p className="text-sm text-foreground">
                                {formatearFecha(acta.fecha)}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                Tipo de Sesión
                              </p>
                              <p className="text-sm text-foreground">{categoria}</p>
                            </div>

                            {acta.numero_reunion !== undefined && acta.numero_reunion !== null && (
                              <div>
                                <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                  Número de Reunión
                                </p>
                                <p className="text-sm text-foreground">Nº {acta.numero_reunion}</p>
                              </div>
                            )}

                            {acta.periodo && acta.periodo.trim() !== '' && (
                              <div>
                                <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                  Periodo Legislativo
                                </p>
                                <p className="text-sm text-foreground">{acta.periodo}</p>
                              </div>
                            )}
                          </div>

                          {/* PDF link if available */}
                          {acta.url_pdf && (
                            <div className="pt-2 border-t border-border">
                              <a
                                href={acta.url_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaExternalLinkAlt className="text-xs" />
                                Abrir documento oficial en nueva pestaña
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {actas.length >= limit && (
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-sm text-secondary">
            Mostrando las primeras {limit} actas. Usa los filtros para refinar la búsqueda.
          </p>
        </div>
      )}
    </Card>
  );
});
