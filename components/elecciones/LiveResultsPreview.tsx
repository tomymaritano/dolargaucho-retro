'use client';

/**
 * LiveResultsPreview - Live election results preview for Hero
 *
 * Shows real-time election results with:
 * - ProgressRing for % of polling stations tallied
 * - Top 3 candidates with mini progress bars
 * - Difference between top 2 candidates
 * - Last update timestamp
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ProgressRing } from './ProgressRing';
import { LiveBadge } from './LiveBadge';
import type { ProcessedElectionResults } from '@/types/api/election';

interface LiveResultsPreviewProps {
  data: ProcessedElectionResults;
  lastFetch?: Date | null;
  isFetching?: boolean;
}

export const LiveResultsPreview = React.memo(function LiveResultsPreview({
  data,
  lastFetch,
  isFetching = false,
}: LiveResultsPreviewProps) {
  const topThree = data.candidates.slice(0, 3);
  const maxPercentage = topThree[0]?.percentage || 100;

  // Calculate difference between top 2
  const difference = topThree.length >= 2 ? topThree[0].percentage - topThree[1].percentage : 0;

  // Calculate time since last fetch
  const getTimeSinceLastFetch = () => {
    if (!lastFetch) return 'Actualizando...';

    const now = Date.now();
    const lastFetchTime = lastFetch.getTime();
    const seconds = Math.floor((now - lastFetchTime) / 1000);

    if (seconds < 10) return 'Hace unos segundos';
    if (seconds < 60) return `Hace ${seconds} segundos`;
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    return `Hace ${Math.floor(seconds / 3600)} horas`;
  };

  return (
    <div className="space-y-4">
      {/* Live Results Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-panel/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Header - Live Badge + Last Update */}
        <div className="flex items-center justify-between mb-6">
          <LiveBadge />
          <motion.div
            key={lastFetch?.getTime()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-secondary"
          >
            {getTimeSinceLastFetch()}
          </motion.div>
        </div>

        {/* Progress Ring - Center */}
        <div className="flex justify-center mb-6">
          <ProgressRing
            percentage={data.progress.talliedPercentage}
            size={140}
            strokeWidth={10}
            color="#a78bfa"
          />
        </div>

        {/* Candidates - Top 3 */}
        <div className="space-y-3 mb-4">
          {topThree.map((candidate, index) => {
            const barWidth = (candidate.percentage / maxPercentage) * 100;
            const isFirst = index === 0;

            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="space-y-1.5"
              >
                {/* Candidate Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isFirst
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950'
                          : 'bg-panel/20 text-secondary'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Name */}
                    <span className="text-xs font-semibold text-foreground truncate">
                      {candidate.fullName.split('/')[0]}
                    </span>
                  </div>

                  {/* Percentage */}
                  <span
                    className={`text-sm font-black ${
                      isFirst ? 'text-yellow-400' : 'text-purple-400'
                    }`}
                  >
                    {candidate.percentage.toFixed(2)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-panel/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: candidate.partyColor,
                      boxShadow: `0 0 10px ${candidate.partyColor}40`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Difference - Bottom */}
        {difference > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4 border-t border-white/10 text-center"
          >
            <div className="text-xs text-secondary mb-1">Diferencia</div>
            <div className="text-lg font-black text-purple-400">
              +{difference.toFixed(1)} puntos
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Cards - Below */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-panel/30 border border-white/5 rounded-xl p-4 text-center"
        >
          <div className="text-xs text-secondary mb-1">Mesas</div>
          <div className="text-xl font-black text-purple-400">
            {data.progress.talliedPollingStations.toLocaleString()}
          </div>
          <div className="text-xs text-secondary/60">
            de {data.progress.totalPollingStations.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-panel/30 border border-white/5 rounded-xl p-4 text-center"
        >
          <div className="text-xs text-secondary mb-1">Votos Validos</div>
          <div className="text-xl font-black text-blue-400">
            {(data.totalValidVotes / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-secondary/60">contabilizados</div>
        </motion.div>
      </div>
    </div>
  );
});
