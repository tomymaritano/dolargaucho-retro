/**
 * TimelineQuarters Component
 *
 * Interactive vertical timeline showing quarters with lateral information
 * Clean design with dynamic calculation from roadmap data and full interactivity
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';
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
    id: 'Q4 2025',
    label: 'Q4 2025',
    period: 'Oct - Dic',
    months: ['2025-10', '2025-11', '2025-12'],
    isCurrent: true, // Quarter actual
  },
  {
    id: 'Q1 2026',
    label: 'Q1 2026',
    period: 'Ene - Mar',
    months: ['2026-01', '2026-02', '2026-03'],
    isCurrent: false,
  },
  {
    id: 'Q2 2026',
    label: 'Q2 2026',
    period: 'Abr - Jun',
    months: ['2026-04', '2026-05', '2026-06'],
    isCurrent: false,
  },
  {
    id: 'Q3 2026',
    label: 'Q3 2026',
    period: 'Jul - Sep',
    months: ['2026-07', '2026-08', '2026-09'],
    isCurrent: false,
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
    <div className="bg-panel border border-white/10 rounded-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-brand/10 rounded-lg">
          <FaCalendarAlt className="text-brand text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Timeline de Desarrollo</h3>
          <p className="text-sm text-secondary">
            Clickea en cada quarter para filtrar sus features
          </p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-0">
        {quarters.map((quarter, index) => {
          const config = statusConfig[quarter.status];
          const Icon = config.icon;
          const isSelected = selectedQuarter === quarter.id;
          const isLast = index === quarters.length - 1;
          const quarterLabel = QUARTER_LABELS[index];

          return (
            <motion.div
              key={quarter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Vertical Line Connector */}
              {!isLast && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />}

              {/* Quarter Row */}
              <motion.button
                onClick={() => handleQuarterClick(quarter.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isSelected
                    ? 'bg-brand/10 border-2 border-brand/30'
                    : 'bg-transparent border-2 border-transparent hover:bg-white/5'
                }`}
              >
                {/* Icon Node */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center z-10 relative`}
                  >
                    <Icon
                      className={`${config.color} text-xl ${
                        quarter.status === 'in-progress' && 'animate-spin-slow'
                      }`}
                    />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 rounded-full bg-brand/20 blur-md -z-10"
                    />
                  )}
                </div>

                {/* Quarter Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-lg font-bold text-foreground">{quarter.label}</h4>
                    <span className="text-sm text-secondary">({quarter.period})</span>
                    {quarterLabel.isCurrent && (
                      <span className="px-2 py-0.5 bg-brand text-white text-xs font-bold rounded-full">
                        ACTUAL
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Features Count */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {quarter.features.length}
                      </span>
                      <span className="text-xs text-secondary">
                        {quarter.features.length === 1 ? 'feature' : 'features'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {quarter.status !== 'planned' && (
                      <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[200px]">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quarter.completionRate}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                            className={`h-full rounded-full ${
                              quarter.status === 'completed' ? 'bg-success' : 'bg-brand'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-brand min-w-[32px]">
                          {quarter.completionRate}%
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} font-medium`}
                    >
                      {quarter.status === 'completed'
                        ? 'Completado'
                        : quarter.status === 'in-progress'
                          ? 'En Progreso'
                          : 'Planificado'}
                    </span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Progreso General 2025-2026</span>
          <span className="text-lg font-bold text-brand">{Math.round(progressWidth)}%</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            className="h-full bg-brand rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
