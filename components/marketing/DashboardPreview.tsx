'use client';

/**
 * DashboardPreview - Simple dashboard preview for Hero
 *
 * Shows dashboard screenshot with badge
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const DashboardPreview = React.memo(function DashboardPreview() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-panel/50 border border-border/5 hover:border-brand/30 transition-all group aspect-video shadow-2xl shadow-brand/10">
      {/* Dashboard Screenshot */}
      <Image
        src="/thumbnail.png"
        alt="Vista previa del dashboard"
        fill
        className="object-cover"
        priority
      />

      {/* Badge "Dashboard Real" */}
      <div className="absolute top-4 left-4">
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-sm border border-brand shadow-lg shadow-brand/20"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Dashboard Real
          </span>
        </motion.div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
});
