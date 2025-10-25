'use client';

/**
 * HistoricalElectionCard - Compact card for past elections
 *
 * Shows winner, top 3, and basic info
 * Expandable on click to show full details
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaTrophy } from 'react-icons/fa';
import type { HistoricalElection } from '@/data/elections-history';
import { ElectionService } from '@/lib/services/ElectionService';

interface HistoricalElectionCardProps {
  election: HistoricalElection;
  delay?: number;
}

export const HistoricalElectionCard = React.memo(function HistoricalElectionCard({
  election,
  delay = 0,
}: HistoricalElectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const topThree = election.candidates.slice(0, 3);

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
        className="w-full p-6 text-left hover:bg-panel/10 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Year + Date */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-black text-foreground">{election.year}</h3>
              {election.hadBallotage && (
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2 py-0.5 rounded-full uppercase">
                  Ballotage
                </span>
              )}
            </div>
            <p className="text-sm text-secondary mb-4">{election.date}</p>

            {/* Winner */}
            <div className="flex items-start gap-3 mb-4">
              <FaTrophy className="text-yellow-400 text-lg flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base text-foreground truncate">
                  {election.winner.fullName}
                </div>
                <div className="text-sm text-secondary truncate">{election.winner.party}</div>
                <div className="text-lg font-black text-yellow-400 mt-1">
                  {ElectionService.formatPercentage(election.winner.percentage)}
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

          {/* Turnout Badge */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-secondary mb-1">Participación</div>
            <div className="text-2xl font-bold text-foreground">{election.turnout.toFixed(1)}%</div>
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
            <div className="px-6 pb-6 pt-2 border-t border-white/10">
              {/* Ballotage Info */}
              {election.hadBallotage && election.ballotageDate && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="text-sm font-semibold text-orange-400 mb-1">Segunda Vuelta</div>
                  <div className="text-xs text-secondary">{election.ballotageDate}</div>
                </div>
              )}

              {/* All Candidates */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Todos los Candidatos
                </h4>

                {election.candidates.map((candidate, index) => {
                  const isWinner = index === 0;
                  const maxPercentage = election.candidates[0].percentage;
                  const barWidth = (candidate.percentage / maxPercentage) * 100;

                  return (
                    <div key={candidate.id} className="space-y-2">
                      {/* Candidate Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Rank */}
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isWinner
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950'
                                : 'bg-white/10 text-secondary'
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {candidate.fullName}
                            </div>
                            <div className="text-xs text-secondary truncate">{candidate.party}</div>
                          </div>
                        </div>

                        {/* Percentage */}
                        <div
                          className={`text-right flex-shrink-0 text-lg font-black ${
                            isWinner ? 'text-yellow-400' : 'text-foreground'
                          }`}
                        >
                          {ElectionService.formatPercentage(candidate.percentage)}
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
                            backgroundColor: candidate.partyColor,
                            boxShadow: `0 0 10px ${candidate.partyColor}40`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wide mb-1">
                    Total Votos
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {ElectionService.formatVotes(election.totalVotes)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wide mb-1">
                    Votos Válidos
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {ElectionService.formatVotes(election.totalValidVotes)}
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
