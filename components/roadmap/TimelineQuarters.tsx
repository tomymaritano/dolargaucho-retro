/**
 * TimelineQuarters Component
 *
 * Interactive horizontal timeline showing quarters and their features
 * Now with dynamic calculation from roadmap data and full interactivity
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaCheckCircle, FaSpinner, FaClock, FaChevronDown } from 'react-icons/fa';
import { ROADMAP_FEATURES, RoadmapFeature } from '@/constants/roadmap';

interface Quarter {
  id: string;
  label: string;
  period: string;
  status: 'completed' | 'in-progress' | 'planned';
  features: RoadmapFeature[];
  completionRate: number;
}

const QUARTER_LABELS = [
  {
    id: 'Q1 2025',
    label: 'Q1 2025',
    period: 'Ene - Mar',
    months: ['2025-01', '2025-02', '2025-03'],
  },
  {
    id: 'Q2 2025',
    label: 'Q2 2025',
    period: 'Abr - Jun',
    months: ['2025-04', '2025-05', '2025-06'],
  },
  {
    id: 'Q3 2025',
    label: 'Q3 2025',
    period: 'Jul - Sep',
    months: ['2025-07', '2025-08', '2025-09'],
  },
  {
    id: 'Q4 2025',
    label: 'Q4 2025',
    period: 'Oct - Dic',
    months: ['2025-10', '2025-11', '2025-12'],
  },
];

const statusConfig = {
  completed: {
    icon: FaCheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
    glow: 'shadow-success/20',
  },
  'in-progress': {
    icon: FaSpinner,
    color: 'text-brand',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
    glow: 'shadow-brand/20',
  },
  planned: {
    icon: FaClock,
    color: 'text-secondary',
    bg: 'bg-white/5',
    border: 'border-white/10',
    glow: 'shadow-white/5',
  },
};

interface TimelineQuartersProps {
  onQuarterClick?: (quarterId: string | null) => void;
  selectedQuarter?: string | null;
}

export function TimelineQuarters({ onQuarterClick, selectedQuarter }: TimelineQuartersProps) {
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);

  // Calculate quarters dynamically from roadmap features
  const quarters = useMemo<Quarter[]>(() => {
    return QUARTER_LABELS.map((quarterLabel) => {
      // Get features for this quarter
      const features = ROADMAP_FEATURES.filter(
        (f) => f.quarter === quarterLabel.id || f.completedDate?.includes('2025-01')
      );

      // Calculate completion rate
      const completedCount = features.filter((f) => f.status === 'completed').length;
      const inProgressCount = features.filter((f) => f.status === 'in-progress').length;
      const completionRate =
        features.length > 0
          ? Math.round(((completedCount + inProgressCount * 0.5) / features.length) * 100)
          : 0;

      // Determine quarter status
      let status: Quarter['status'] = 'planned';
      if (completionRate >= 100) {
        status = 'completed';
      } else if (completionRate > 0) {
        status = 'in-progress';
      }

      return {
        id: quarterLabel.id,
        label: quarterLabel.label,
        period: quarterLabel.period,
        status,
        features,
        completionRate,
      };
    });
  }, []);

  // Calculate progress bar width
  const progressWidth = useMemo(() => {
    const totalQuarters = quarters.length;
    let progress = 0;

    quarters.forEach((q, index) => {
      if (q.status === 'completed') {
        progress += 100 / totalQuarters;
      } else if (q.status === 'in-progress') {
        progress += (q.completionRate / 100) * (100 / totalQuarters);
      }
    });

    return Math.min(progress, 100);
  }, [quarters]);

  const handleQuarterClick = (quarterId: string) => {
    if (selectedQuarter === quarterId) {
      // If clicking the same quarter, deselect
      onQuarterClick?.(null);
    } else {
      onQuarterClick?.(quarterId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-panel to-panel/50 border border-white/10 rounded-xl p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-brand/10 rounded-lg">
          <FaCalendarAlt className="text-brand text-xl" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Timeline de Desarrollo</h3>
          <p className="text-sm text-secondary">Clickea en cada quarter para ver sus features</p>
        </div>
      </div>

      {/* Timeline Container with horizontal scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="relative min-w-[700px]">
          {/* Background Line */}
          <div className="absolute top-8 left-12 right-12 h-1 bg-white/5 rounded-full" />

          {/* Progress Line */}
          <motion.div
            className="absolute top-8 left-12 h-1 bg-gradient-to-r from-success via-brand to-brand-light rounded-full shadow-lg shadow-brand/30"
            initial={{ width: 0 }}
            animate={{ width: `calc(${progressWidth}% - 6rem)` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Quarters Grid */}
          <div className="relative grid grid-cols-4 gap-4">
            {quarters.map((quarter, index) => {
              const config = statusConfig[quarter.status];
              const Icon = config.icon;
              const isSelected = selectedQuarter === quarter.id;
              const isHovered = hoveredQuarter === quarter.id;

              return (
                <motion.div
                  key={quarter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Quarter Node */}
                  <motion.button
                    onClick={() => handleQuarterClick(quarter.id)}
                    onMouseEnter={() => setHoveredQuarter(quarter.id)}
                    onMouseLeave={() => setHoveredQuarter(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-10 w-16 h-16 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-brand/30 shadow-xl ' + config.glow
                        : 'hover:shadow-lg ' + config.glow
                    }`}
                  >
                    <Icon
                      className={`${config.color} text-2xl ${
                        quarter.status === 'in-progress' && 'animate-spin-slow'
                      }`}
                    />

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-2 w-3 h-3 bg-brand rounded-full shadow-lg shadow-brand/50"
                      />
                    )}
                  </motion.button>

                  {/* Quarter Info */}
                  <div className="mt-4 text-center space-y-1">
                    <p className="text-sm font-bold text-foreground">{quarter.label}</p>
                    <p className="text-xs text-secondary">{quarter.period}</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-semibold text-foreground">
                        {quarter.features.length}
                      </span>
                      <span className="text-xs text-secondary">features</span>
                    </div>
                    {quarter.status !== 'planned' && (
                      <div className="w-full max-w-[80px] mx-auto">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quarter.completionRate}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                            className={`h-full rounded-full ${
                              quarter.status === 'completed'
                                ? 'bg-success'
                                : 'bg-gradient-to-r from-brand to-brand-light'
                            }`}
                          />
                        </div>
                        <p className="text-xs font-semibold text-brand mt-1">
                          {quarter.completionRate}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && quarter.features.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-24 mt-16 z-50 bg-panel border border-white/20 rounded-lg p-3 shadow-xl min-w-[200px] max-w-[250px]"
                      >
                        <p className="text-xs font-bold text-foreground mb-2">
                          Features en {quarter.label}:
                        </p>
                        <ul className="space-y-1">
                          {quarter.features.slice(0, 5).map((feature) => (
                            <li
                              key={feature.id}
                              className="text-xs text-secondary flex items-start gap-1.5"
                            >
                              <span className="text-brand mt-0.5">•</span>
                              <span>{feature.title}</span>
                            </li>
                          ))}
                          {quarter.features.length > 5 && (
                            <li className="text-xs text-secondary italic">
                              +{quarter.features.length - 5} más...
                            </li>
                          )}
                        </ul>
                        <p className="text-xs text-brand font-semibold mt-2 flex items-center gap-1">
                          Click para filtrar
                          <FaChevronDown className="text-[8px]" />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = quarters.filter((q) => q.status === status).length;

          return (
            <div key={status} className="flex items-center gap-2">
              <Icon className={config.color} />
              <span className="text-xs text-secondary">
                {status === 'in-progress'
                  ? 'En Progreso'
                  : status === 'planned'
                    ? 'Planificado'
                    : 'Completado'}
              </span>
              <span className="text-xs font-bold text-foreground">({count})</span>
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Progreso General 2025</span>
          <span className="text-sm font-bold text-brand">{Math.round(progressWidth)}%</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            className="h-full bg-gradient-to-r from-success via-brand to-brand-light rounded-full shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
