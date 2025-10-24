'use client';

/**
 * ElectionCountdown - Horizontal countdown row (cotización style)
 *
 * Displays countdown to election day in a horizontal format
 * Matches the style of currency rows in the table
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tooltip } from '@/components/ui/Tooltip';

// TESTING: Para probar con datos pasados, cambia a '2023-10-22T00:00:00-03:00'
const ELECTION_DATE = new Date('2025-10-26T00:00:00-03:00'); // 26 de octubre 2025

export const ElectionCountdown = React.memo(function ElectionCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = ELECTION_DATE.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const isElectionDay = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;

  return (
    <Link href="/elecciones" className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ scale: 1.02, x: 4 }}
        className="relative w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-panel/50 border border-white/5 hover:border-brand/30 hover:bg-panel/80 transition-all duration-300 group cursor-pointer"
      >
        {/* Left side - Election Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm md:text-base font-bold text-foreground group-hover:text-brand transition-colors truncate">
            Elecciones 2025
          </div>
          <div className="text-xs text-secondary truncate">26 octubre • BUP</div>
        </div>

        {/* Center - Countdown */}
        <div className="text-right">
          <div className="text-xl md:text-2xl font-black text-foreground tabular-nums">
            {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h
          </div>
          <div
            className={`text-xs font-semibold ${
              timeLeft.days < 7
                ? 'text-warning'
                : timeLeft.days < 30
                  ? 'text-brand'
                  : 'text-secondary'
            }`}
          >
            {isElectionDay ? '¡Hoy!' : 'Quedan'}
          </div>
        </div>

        {/* Right - Arrow indicator (subtle, appears on hover) */}
        <div className="flex-shrink-0 hidden sm:block">
          <div className="w-8 h-8 rounded-lg bg-brand/0 group-hover:bg-brand/10 border border-white/0 group-hover:border-brand/20 flex items-center justify-center transition-all duration-300">
            <span className="text-brand text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});
