/**
 * TimelineQuarters Component
 *
 * Modern vertical timeline with proper layering
 * Shows completed Q1 2025 and future quarters
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';
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
    isCurrent: false,
    isPast: true,
  },
  {
    id: 'Q4 2025',
    label: 'Q4 2025',
    period: 'Oct - Dic',
    isCurrent: true,
    isPast: false,
  },
  {
    id: 'Q1 2026',
    label: 'Q1 2026',
    period: 'Ene - Mar',
    isCurrent: false,
    isPast: false,
  },
  {
    id: 'Q2 2026',
    label: 'Q2 2026',
    period: 'Abr - Jun',
    isCurrent: false,
    isPast: false,
  },
  {
    id: 'Q3 2026',
    label: 'Q3 2026',
    period: 'Jul - Sep',
    isCurrent: false,
    isPast: false,
  },
];

const statusConfig = {
  completed: {
    icon: FaCheckCircle,
    color: 'text-success',
    label: 'Completado',
  },
  'in-progress': {
    icon: FaSpinner,
    color: 'text-brand',
    label: 'En Progreso',
  },
  planned: {
    icon: FaClock,
    color: 'text-secondary',
    label: 'Planificado',
  },
};

interface TimelineQuartersProps {
  onQuarterClick?: (quarterId: string | null) => void;
  selectedQuarter?: string | null;
}

export function TimelineQuarters({ onQuarterClick, selectedQuarter }: TimelineQuartersProps) {
  const quarters = useMemo<Quarter[]>(() => {
    return QUARTER_LABELS.map((quarterLabel) => {
      const features = ROADMAP_FEATURES.filter(
        (f) => f.quarter === quarterLabel.id || f.completedDate?.includes('2025-01')
      );

      const completedCount = features.filter((f) => f.status === 'completed').length;
      const inProgressCount = features.filter((f) => f.status === 'in-progress').length;
      const completionRate =
        features.length > 0
          ? Math.round(((completedCount + inProgressCount * 0.5) / features.length) * 100)
          : 0;

      let status: Quarter['status'] = 'planned';
      if (completionRate >= 100 || quarterLabel.isPast) {
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
        completionRate: quarterLabel.isPast ? 100 : completionRate,
      };
    });
  }, []);

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
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-panel/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Roadmap 2025-2026</h3>
            <p className="text-sm text-secondary mt-1">Timeline de desarrollo por quarters</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-brand">{Math.round(progressWidth)}%</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Progreso</div>
          </div>
        </div>
        <div className="relative w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-success via-brand to-brand-light rounded-full"
          />
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Background Line (Non-Interactive Layer) */}
        <div
          className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-success/30 via-brand/20 to-transparent pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Timeline Items (Interactive Layer) */}
        <div className="relative space-y-6" style={{ zIndex: 1 }}>
          {quarters.map((quarter, index) => {
            const config = statusConfig[quarter.status];
            const Icon = config.icon;
            const isSelected = selectedQuarter === quarter.id;
            const quarterLabel = QUARTER_LABELS[index];

            return (
              <motion.div
                key={quarter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Node - Always on Top with Solid Background */}
                <motion.button
                  onClick={() => handleQuarterClick(quarter.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    zIndex: 10,
                    background: isSelected
                      ? quarter.status === 'completed'
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : quarter.status === 'in-progress'
                          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                          : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                      : quarter.status === 'completed'
                        ? '#0f172a'
                        : quarter.status === 'in-progress'
                          ? '#0f172a'
                          : '#0f172a',
                    border: isSelected
                      ? `3px solid ${quarter.status === 'completed' ? '#10b981' : '#3b82f6'}`
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isSelected
                      ? quarter.status === 'completed'
                        ? '0 0 20px rgba(16, 185, 129, 0.4)'
                        : '0 0 20px rgba(59, 130, 246, 0.4)'
                      : 'none',
                  }}
                >
                  <Icon
                    className={`text-xl ${isSelected ? 'text-white' : config.color} ${
                      quarter.status === 'in-progress' && !isSelected && 'animate-spin-slow'
                    }`}
                  />
                </motion.button>

                {/* Content Card */}
                <motion.button
                  onClick={() => handleQuarterClick(quarter.id)}
                  whileHover={{ x: 4 }}
                  className="flex-1 text-left group"
                  style={{ zIndex: 5 }}
                >
                  <div
                    className={`relative bg-panel rounded-xl p-5 transition-all duration-300 ${
                      isSelected
                        ? quarter.status === 'completed'
                          ? 'border-2 border-success shadow-xl shadow-success/20'
                          : 'border-2 border-brand shadow-xl shadow-brand/20'
                        : 'border border-white/10 hover:border-white/20 hover:shadow-lg'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-bold text-foreground">{quarter.label}</h4>
                          {quarterLabel.isCurrent && (
                            <span className="px-2.5 py-0.5 bg-brand text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Actual
                            </span>
                          )}
                          {quarterLabel.isPast && (
                            <span className="px-2.5 py-0.5 bg-success/20 text-success text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Pasado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-secondary">{quarter.period}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">
                          {quarter.features.length}
                        </div>
                        <div className="text-xs text-secondary">
                          {quarter.features.length === 1 ? 'feature' : 'features'}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          quarter.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : quarter.status === 'in-progress'
                              ? 'bg-brand/10 text-brand'
                              : 'bg-white/5 text-secondary'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            quarter.status === 'completed'
                              ? 'bg-success'
                              : quarter.status === 'in-progress'
                                ? 'bg-brand animate-pulse'
                                : 'bg-white/30'
                          }`}
                        />
                        {config.label}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {quarter.status !== 'planned' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                            Progreso
                          </span>
                          <span className="text-sm font-bold text-brand">
                            {quarter.completionRate}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quarter.completionRate}%` }}
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + 0.3,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className={`absolute inset-y-0 left-0 rounded-full ${
                              quarter.status === 'completed'
                                ? 'bg-gradient-to-r from-success to-success/80'
                                : 'bg-gradient-to-r from-brand to-brand-light'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
