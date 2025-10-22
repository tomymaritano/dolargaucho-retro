/**
 * TimelineQuarters Component
 *
 * Modern vertical timeline inspired by react-chrono and Linear
 * Clean, scalable design with smooth animations
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
    id: 'Q4 2025',
    label: 'Q4 2025',
    period: 'Oct - Dic',
    isCurrent: true,
  },
  {
    id: 'Q1 2026',
    label: 'Q1 2026',
    period: 'Ene - Mar',
    isCurrent: false,
  },
  {
    id: 'Q2 2026',
    label: 'Q2 2026',
    period: 'Abr - Jun',
    isCurrent: false,
  },
  {
    id: 'Q3 2026',
    label: 'Q3 2026',
    period: 'Jul - Sep',
    isCurrent: false,
  },
];

const statusConfig = {
  completed: {
    icon: FaCheckCircle,
    color: 'text-success',
    iconBg: 'bg-success',
    cardBorder: 'border-success/20',
    label: 'Completado',
  },
  'in-progress': {
    icon: FaSpinner,
    color: 'text-brand',
    iconBg: 'bg-brand',
    cardBorder: 'border-brand/20',
    label: 'En Progreso',
  },
  planned: {
    icon: FaClock,
    color: 'text-secondary',
    iconBg: 'bg-white/20',
    cardBorder: 'border-white/10',
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
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand via-brand-light to-brand rounded-full"
          />
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand/40 via-brand/20 to-transparent z-0" />

        {/* Timeline Items */}
        <div className="space-y-8">
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
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Node */}
                <div className="relative flex-shrink-0 z-20">
                  <motion.button
                    onClick={() => handleQuarterClick(quarter.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-brand/30 shadow-lg shadow-brand/40'
                        : 'ring-2 ring-white/10'
                    }`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${
                            quarter.status === 'completed'
                              ? '#10b981'
                              : quarter.status === 'in-progress'
                                ? '#3b82f6'
                                : '#6b7280'
                          } 0%, ${
                            quarter.status === 'completed'
                              ? '#059669'
                              : quarter.status === 'in-progress'
                                ? '#2563eb'
                                : '#4b5563'
                          } 100%)`
                        : 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Icon
                      className={`text-xl ${isSelected ? 'text-white' : config.color} ${
                        quarter.status === 'in-progress' && !isSelected && 'animate-spin-slow'
                      }`}
                    />
                  </motion.button>

                  {/* Connector Dot */}
                  {!isLast && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-14 w-1 h-1 bg-brand/40 rounded-full" />
                  )}
                </div>

                {/* Content Card */}
                <motion.button
                  onClick={() => handleQuarterClick(quarter.id)}
                  whileHover={{ x: 4 }}
                  className={`flex-1 text-left group transition-all duration-300 z-10 ${
                    isSelected ? 'translate-x-2' : ''
                  }`}
                >
                  <div
                    className={`relative bg-panel border rounded-xl p-5 transition-all duration-300 ${
                      isSelected
                        ? 'border-brand shadow-xl shadow-brand/20'
                        : `${config.cardBorder} hover:border-white/20 hover:shadow-lg`
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-bold text-foreground">{quarter.label}</h4>
                          {quarterLabel.isCurrent && (
                            <span className="px-2.5 py-0.5 bg-brand text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Actual
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                          quarter.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : quarter.status === 'in-progress'
                              ? 'bg-brand/10 text-brand'
                              : 'bg-white/5 text-secondary'
                        } text-xs font-semibold`}
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
                              delay: index * 0.15 + 0.3,
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

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeQuarter"
                        className="absolute -left-1 top-0 bottom-0 w-1 bg-brand"
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-secondary">
        Click en cualquier quarter para filtrar sus features
      </p>
    </div>
  );
}
