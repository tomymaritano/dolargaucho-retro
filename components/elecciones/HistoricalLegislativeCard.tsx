'use client';

/**
 * HistoricalLegislativeCard - Compact card for past legislative elections
 *
 * Shows top party, seats won, and basic info
 * Expandable on click to show full details
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaTrophy } from 'react-icons/fa';
import type { HistoricalElectionData } from '@/types/api/historical-elections';
import { ElectionService } from '@/lib/services/ElectionService';

interface HistoricalLegislativeCardProps {
  election: HistoricalElectionData;
  delay?: number;
}

export const HistoricalLegislativeCard = React.memo(function HistoricalLegislativeCard({
  election,
  delay = 0,
}: HistoricalLegislativeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-panel/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Year + Date */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-black text-foreground">{election.year}</h3>
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase">
                {election.category === 'Senadores Nacionales' ? 'Senadores' : 'Diputados'}
              </span>
            </div>
            <p className="text-sm text-secondary mb-4">{election.date}</p>

            {/* Top Party */}
            <div className="flex items-start gap-3 mb-4">
              <FaTrophy className="text-yellow-400 text-lg flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base text-foreground truncate">
                  {election.agrupaciones[0]?.nombre || 'Sin datos'}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-lg font-black text-yellow-400">
                    {election.agrupaciones[0]
                      ? ElectionService.formatPercentage(election.agrupaciones[0].porcentaje)
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-secondary">
                    {ElectionService.formatVotes(election.agrupaciones[0]?.votos || 0)} votos
                  </div>
                </div>
              </div>
            </div>

            {/* Expand/Collapse Indicator */}
            <div className="flex items-center gap-2 text-sm text-purple-400 font-semibold">
              {isExpanded ? (
                <>
                  <span>Ver menos</span>
                  <FaChevronUp className="text-xs" />
                </>
              ) : (
                <>
                  <span>Ver detalles completos</span>
                  <FaChevronDown className="text-xs" />
                </>
              )}
            </div>
          </div>

          {/* Turnout + Voters Badge */}
          <div className="flex-shrink-0 text-right space-y-3">
            <div>
              <div className="text-xs text-secondary mb-1">Participación</div>
              <div className="text-2xl font-bold text-foreground">
                {(typeof election.participacion === 'string'
                  ? parseFloat(election.participacion)
                  : election.participacion
                ).toFixed(1)}
                %
              </div>
            </div>
            <div>
              <div className="text-xs text-secondary mb-1">Votantes</div>
              <div className="text-xl font-bold text-purple-400">
                {(election.total_votantes / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/5">
              {/* All Parties */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Resultados por Partido
                </h4>

                {election.agrupaciones.slice(0, 10).map((agrupacion, index) => {
                  const isTopParty = index === 0;
                  const maxPercentage =
                    typeof election.agrupaciones[0].porcentaje === 'string'
                      ? parseFloat(election.agrupaciones[0].porcentaje)
                      : election.agrupaciones[0].porcentaje;
                  const agrupacionPct =
                    typeof agrupacion.porcentaje === 'string'
                      ? parseFloat(agrupacion.porcentaje)
                      : agrupacion.porcentaje;
                  const barWidth = (agrupacionPct / maxPercentage) * 100;

                  // Asignar color basado en posición
                  const colors = [
                    '#87CEEB',
                    '#6B4C9A',
                    '#FFD700',
                    '#E74C3C',
                    '#F39C12',
                    '#3498DB',
                    '#95A5A6',
                    '#FF6B6B',
                    '#2ECC71',
                    '#9B59B6',
                  ];
                  const partyColor = colors[index % colors.length];

                  return (
                    <div
                      key={`${election.year}-${agrupacion.nombre}-${index}`}
                      className="space-y-2"
                    >
                      {/* Party Info */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Rank */}
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isTopParty
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950'
                                : 'bg-white/10 text-secondary'
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Party Name */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {agrupacion.nombre}
                            </div>
                            <div className="text-xs text-secondary">
                              {ElectionService.formatVotes(agrupacion.votos)} votos
                            </div>
                          </div>
                        </div>

                        {/* Percentage */}
                        <div
                          className={`text-right text-lg font-black ${
                            isTopParty ? 'text-yellow-400' : 'text-foreground'
                          }`}
                        >
                          {ElectionService.formatPercentage(agrupacion.porcentaje)}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ delay: 0.1 + index * 0.05, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: partyColor,
                            boxShadow: `0 0 10px ${partyColor}40`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wide mb-1">
                    Electores
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {ElectionService.formatVotes(election.total_electores)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wide mb-1">
                    Votantes
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {ElectionService.formatVotes(election.total_votantes)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wide mb-1">Mesas</div>
                  <div className="text-base font-bold text-purple-400">
                    {ElectionService.formatVotes(election.mesas_totalizadas)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
