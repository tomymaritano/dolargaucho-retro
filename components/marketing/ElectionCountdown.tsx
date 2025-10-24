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
    <Tooltip content="Informate">
      <Link href="/elecciones" className="block w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.01, x: 2 }}
          className="relative w-full flex items-center justify-between gap-2 md:gap-4 p-3 md:p-4 rounded-xl bg-panel/50 border border-white/5 hover:border-purple-500/30 hover:bg-panel/80 transition-all duration-300 group cursor-pointer"
        >
          {/* Left side - Election Info */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Badge/Icon area */}
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full" />
            </div>

            {/* Election Name */}
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-bold text-foreground group-hover:text-purple-400 transition-colors truncate">
                Elecciones 2025
              </div>
              <div className="text-[10px] md:text-xs text-secondary truncate">26 oct • BUP</div>
            </div>
          </div>

          {/* Center - Countdown Numbers */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Days */}
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tabular-nums">
                {timeLeft.days}
              </div>
              <div className="text-[9px] md:text-[10px] text-secondary uppercase tracking-wide">
                días
              </div>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-foreground/80 tabular-nums">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-[9px] md:text-[10px] text-secondary uppercase">hrs</div>
            </div>

            {/* Minutes - Hidden on very small screens */}
            <div className="hidden xs:block text-center">
              <div className="text-lg md:text-xl font-bold text-foreground/80 tabular-nums">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-[9px] md:text-[10px] text-secondary uppercase">min</div>
            </div>
          </div>

          {/* Right side - Status Badge */}
          <div className="hidden sm:block flex-shrink-0">
            {isElectionDay ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  EN VIVO
                </span>
              </motion.div>
            ) : (
              <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                  Ver más →
                </span>
              </div>
            )}
          </div>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-xl pointer-events-none" />
        </motion.div>
      </Link>
    </Tooltip>
  );
});
