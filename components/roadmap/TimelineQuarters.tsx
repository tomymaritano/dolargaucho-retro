/**
 * TimelineQuarters Component
 *
 * Interactive horizontal timeline showing quarters and their features
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';

interface Quarter {
  id: string;
  label: string;
  period: string;
  status: 'completed' | 'in-progress' | 'planned';
  featuresCount: number;
  completionRate?: number;
}

const QUARTERS: Quarter[] = [
  {
    id: 'q1-2025',
    label: 'Q1 2025',
    period: 'Ene - Mar',
    status: 'in-progress',
    featuresCount: 8,
    completionRate: 75,
  },
  {
    id: 'q2-2025',
    label: 'Q2 2025',
    period: 'Abr - Jun',
    status: 'planned',
    featuresCount: 5,
  },
  {
    id: 'q3-2025',
    label: 'Q3 2025',
    period: 'Jul - Sep',
    status: 'planned',
    featuresCount: 2,
  },
  {
    id: 'q4-2025',
    label: 'Q4 2025',
    period: 'Oct - Dic',
    status: 'planned',
    featuresCount: 1,
  },
];

const statusConfig = {
  completed: {
    icon: FaCheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  'in-progress': {
    icon: FaSpinner,
    color: 'text-brand',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
  },
  planned: {
    icon: FaClock,
    color: 'text-secondary',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
};

interface TimelineQuartersProps {
  onQuarterClick?: (quarterId: string) => void;
}

export function TimelineQuarters({ onQuarterClick }: TimelineQuartersProps) {
  return (
    <div className="bg-panel border border-white/10 rounded-xl p-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaCalendarAlt className="text-brand text-2xl" />
        <div>
          <h3 className="text-xl font-bold text-foreground">Timeline de Desarrollo</h3>
          <p className="text-sm text-secondary">
            Roadmap por quarters con features completadas y planificadas
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />

        {/* Progress Line (for completed and in-progress) */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-success via-brand to-brand -translate-y-1/2"
          style={{ width: '37.5%' }}
        />

        {/* Quarters */}
        <div className="relative flex items-center justify-between min-w-[600px]">
          {QUARTERS.map((quarter, index) => {
            const config = statusConfig[quarter.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={quarter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onQuarterClick?.(quarter.id)}
              >
                {/* Node */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon
                    className={`${config.color} text-2xl ${
                      quarter.status === 'in-progress' && 'animate-spin-slow'
                    }`}
                  />
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-foreground">{quarter.label}</p>
                  <p className="text-xs text-secondary">{quarter.period}</p>
                  <p className="text-xs text-secondary mt-1">{quarter.featuresCount} features</p>
                  {quarter.completionRate !== undefined && (
                    <p className="text-xs font-semibold text-brand mt-1">
                      {quarter.completionRate}% completo
                    </p>
                  )}
                </div>

                {/* Connector line (except for last item) */}
                {index < QUARTERS.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <div key={status} className="flex items-center gap-2">
              <Icon className={config.color} />
              <span className="text-xs text-secondary capitalize">
                {status === 'in-progress'
                  ? 'En Progreso'
                  : status === 'planned'
                    ? 'Planificado'
                    : 'Completado'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
