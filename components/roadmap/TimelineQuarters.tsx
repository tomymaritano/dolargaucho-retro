/**
 * TimelineQuarters Component
 *
 * Modern tech-inspired timeline with clean card design
 * Responsive grid layout with visual hierarchy
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaClock, FaChevronRight } from 'react-icons/fa';
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
    label: 'Completado',
  },
  'in-progress': {
    icon: FaSpinner,
    color: 'text-brand',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
    label: 'En Progreso',
  },
  planned: {
    icon: FaClock,
    color: 'text-secondary',
    bg: 'bg-white/5',
    border: 'border-white/10',
    label: 'Planificado',
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

    quarters.forEach((q) => {
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
      onQuarterClick?.(null);
    } else {
      onQuarterClick?.(quarterId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <div className="bg-panel/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Progreso 2025-2026</h3>
            <p className="text-sm text-secondary mt-0.5">Roadmap de desarrollo por quarters</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand">{Math.round(progressWidth)}%</div>
            <div className="text-xs text-secondary">completado</div>
          </div>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-brand to-brand-light"
          />
        </div>
      </div>

      {/* Quarters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quarters.map((quarter, index) => {
          const config = statusConfig[quarter.status];
          const Icon = config.icon;
          const isSelected = selectedQuarter === quarter.id;
          const quarterLabel = QUARTER_LABELS[index];

          return (
            <motion.button
              key={quarter.id}
              onClick={() => handleQuarterClick(quarter.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative bg-panel border rounded-xl p-5 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-brand shadow-lg shadow-brand/20'
                  : 'border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/10'
              }`}
            >
              {/* Status Indicator Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                  quarter.status === 'completed'
                    ? 'bg-success'
                    : quarter.status === 'in-progress'
                      ? 'bg-brand'
                      : 'bg-white/10'
                }`}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg ${config.bg} ${config.border} border`}>
                    <Icon
                      className={`${config.color} text-lg ${
                        quarter.status === 'in-progress' && 'animate-spin-slow'
                      }`}
                    />
                  </div>

                  {/* Quarter Title */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-foreground">{quarter.label}</h4>
                      {quarterLabel.isCurrent && (
                        <span className="px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded-md uppercase">
                          Actual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5">{quarter.period}</p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <FaChevronRight
                  className={`text-secondary transition-all duration-300 ${
                    isSelected ? 'rotate-90 text-brand' : 'group-hover:translate-x-1'
                  }`}
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-foreground">
                    {quarter.features.length}
                  </span>
                  <span className="text-xs text-secondary">
                    {quarter.features.length === 1 ? 'feature' : 'features'}
                  </span>
                </div>

                <div className="h-4 w-px bg-white/10" />

                <div
                  className={`px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}
                >
                  {config.label}
                </div>
              </div>

              {/* Progress Bar */}
              {quarter.status !== 'planned' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary">Progreso</span>
                    <span className="text-xs font-bold text-brand">{quarter.completionRate}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${quarter.completionRate}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      className={`h-full rounded-full ${
                        quarter.status === 'completed' ? 'bg-success' : 'bg-brand'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Selected State Glow */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-xl bg-brand/5 pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Help Text */}
      <p className="text-center text-xs text-secondary">
        Click en un quarter para filtrar sus features
      </p>
    </div>
  );
}
