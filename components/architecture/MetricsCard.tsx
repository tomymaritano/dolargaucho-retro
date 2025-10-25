/**
 * MetricsCard Component
 *
 * Displays a performance or scalability metric with visual indicator
 */

import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface MetricsCardProps {
  icon: IconType;
  title: string;
  value: string;
  unit?: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function MetricsCard({
  icon: Icon,
  title,
  value,
  unit,
  description,
  trend = 'neutral',
  color = 'brand',
}: MetricsCardProps) {
  const trendConfig = {
    up: {
      arrow: '↑',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    down: {
      arrow: '↓',
      color: 'text-error',
      bg: 'bg-error/10',
    },
    neutral: {
      arrow: '→',
      color: 'text-secondary',
      bg: 'bg-panel/10',
    },
  };

  const trendStyle = trendConfig[trend];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-panel border border-white/5 rounded-xl p-6 hover:border-brand/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`text-${color} text-2xl`} />
        </div>
        {trend !== 'neutral' && (
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${trendStyle.bg} ${trendStyle.color}`}
          >
            {trendStyle.arrow}
            <span>Trend</span>
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
        {title}
      </h4>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-black text-foreground">{value}</span>
        {unit && <span className="text-lg font-semibold text-secondary">{unit}</span>}
      </div>

      {/* Description */}
      <p className="text-sm text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}
