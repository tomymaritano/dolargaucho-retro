'use client';

/**
 * CandidateBar - Horizontal bar showing candidate votes and percentage
 *
 * Animated progress bar with candidate info (fintech design)
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { SimplifiedCandidate } from '@/types/api/election';
import { ElectionService } from '@/lib/services/ElectionService';

interface CandidateBarProps {
  candidate: SimplifiedCandidate;
  /** Position in results (1st, 2nd, 3rd, etc.) */
  rank: number;
  /** Maximum percentage for scaling bars */
  maxPercentage: number;
  /** Animation delay */
  delay?: number;
}

export const CandidateBar = React.memo(function CandidateBar({
  candidate,
  rank,
  maxPercentage,
  delay = 0,
}: CandidateBarProps) {
  const isWinner = rank === 1;
  const barWidth = (candidate.percentage / maxPercentage) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      {/* Candidate Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Rank Badge */}
          <div
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isWinner
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950'
                : 'bg-white/10 text-secondary'
            }`}
          >
            {rank}
          </div>

          {/* Name & Party */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-foreground truncate">{candidate.fullName}</div>
            <div className="text-xs text-secondary truncate">{candidate.party}</div>
          </div>
        </div>

        {/* Percentage */}
        <div className="flex-shrink-0 text-right ml-4">
          <div
            className={`text-xl font-black ${
              isWinner
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent'
                : 'text-foreground'
            }`}
          >
            {ElectionService.formatPercentage(candidate.percentage)}
          </div>
          <div className="text-xs text-secondary">
            {ElectionService.formatVotes(candidate.votes)} votos
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Animated Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            backgroundColor: candidate.partyColor,
            boxShadow: `0 0 20px ${candidate.partyColor}40`,
          }}
        >
          {/* Shine Effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: delay + 1,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>

        {/* Glow on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 blur-md"
          style={{
            background: `linear-gradient(to right, ${candidate.partyColor}20, transparent)`,
          }}
        />
      </div>

      {/* Winner Badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 1.2, type: 'spring' }}
          className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30"
        >
          <span className="text-lg">👑</span>
          <span className="text-xs font-bold text-yellow-400 uppercase">Puntero</span>
        </motion.div>
      )}
    </motion.div>
  );
});
