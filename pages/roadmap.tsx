/**
 * Roadmap Page - Public roadmap showing completed, in-progress, and planned features
 *
 * Features:
 * - Status filtering (completed, in-progress, planned, all)
 * - Category filtering
 * - SpotlightCard effect on hover
 * - Progress bars for in-progress features
 * - Voting system (display only for now)
 * - Professional fintech design
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { GradientText } from '@/components/ui/GradientText';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedOrbs } from '@/components/ui/AnimatedOrbs';
import { LinkButton } from '@/components/ui/Button';
import { TimelineQuarters } from '@/components/roadmap/TimelineQuarters';
import {
  ROADMAP_FEATURES,
  ROADMAP_CATEGORIES,
  RoadmapFeature,
  RoadmapStatus,
} from '@/constants/roadmap';
import {
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaFilter,
  FaThumbsUp,
  FaCalendarAlt,
  FaHourglass,
  FaCode,
} from 'react-icons/fa';

const statusConfig = {
  completed: {
    label: 'Completado',
    icon: FaCheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    badgeBg: 'bg-success/20',
  },
  'in-progress': {
    label: 'En Progreso',
    icon: FaSpinner,
    color: 'text-brand',
    bgColor: 'bg-brand/10',
    borderColor: 'border-brand/30',
    badgeBg: 'bg-brand/20',
  },
  planned: {
    label: 'Próximamente',
    icon: FaClock,
    color: 'text-secondary',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
    badgeBg: 'bg-white/10',
  },
};

const priorityConfig = {
  high: { label: 'Alta', color: 'text-error', bg: 'bg-error/10' },
  medium: { label: 'Media', color: 'text-warning', bg: 'bg-warning/10' },
  low: { label: 'Baja', color: 'text-secondary', bg: 'bg-white/5' },
};

export default function RoadmapPage() {
  const [selectedStatus, setSelectedStatus] = useState<RoadmapStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const featuresRef = React.useRef<HTMLElement>(null);

  // Handle quarter selection from timeline
  const handleQuarterClick = (quarterId: string | null) => {
    setSelectedQuarter(quarterId);
    // Scroll to features section
    if (quarterId && featuresRef.current) {
      setTimeout(() => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Filter features
  const filteredFeatures = ROADMAP_FEATURES.filter((feature) => {
    const matchesStatus = selectedStatus === 'all' || feature.status === selectedStatus;
    const matchesCategory = selectedCategory === 'Todos' || feature.category === selectedCategory;
    const matchesQuarter =
      !selectedQuarter ||
      feature.quarter === selectedQuarter ||
      (feature.completedDate?.includes('2025-01') && selectedQuarter === 'Q1 2025');
    return matchesStatus && matchesCategory && matchesQuarter;
  });

  // Group by status
  const groupedFeatures = {
    completed: filteredFeatures.filter((f) => f.status === 'completed'),
    'in-progress': filteredFeatures.filter((f) => f.status === 'in-progress'),
    planned: filteredFeatures.filter((f) => f.status === 'planned'),
  };

  return (
    <div className="text-foreground min-h-screen font-sans">
      <NavbarFloating />

      {/* Hero Section */}
      <section className="relative w-full bg-background text-foreground pt-32 pb-20 px-6">
        <AnimatedOrbs opacity={0.2} />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand/10 border border-brand/20"
          >
            <FaCheckCircle className="text-brand text-lg" />
            <span className="text-xs uppercase tracking-wider text-brand font-semibold">
              Product Roadmap
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight"
          >
            Construyendo el futuro de{' '}
            <GradientText className="font-black">Dólar Gaucho</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg sm:text-xl max-w-3xl mx-auto"
          >
            Transparencia total sobre qué estamos construyendo, qué está en progreso y qué viene
            próximamente
          </motion.p>
        </div>
      </section>

      {/* Architecture Link Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-brand/10 via-purple-500/10 to-brand/10 border border-brand/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand/10 rounded-lg">
              <FaCode className="text-brand text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                ¿Querés ver cómo está construido?
              </h3>
              <p className="text-sm text-secondary">
                Explorá la arquitectura técnica, stack completo y por qué es escalable
              </p>
            </div>
          </div>
          <LinkButton variant="primary" size="md" href="/arquitectura">
            Ver Arquitectura Técnica
          </LinkButton>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <TimelineQuarters onQuarterClick={handleQuarterClick} selectedQuarter={selectedQuarter} />
      </section>

      {/* Active Quarter Filter Badge */}
      {selectedQuarter && (
        <section className="max-w-7xl mx-auto px-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/30 rounded-lg"
          >
            <FaFilter className="text-brand" />
            <span className="text-sm font-semibold text-foreground">
              Filtrando por: {selectedQuarter}
            </span>
            <button
              onClick={() => setSelectedQuarter(null)}
              className="ml-2 text-xs text-secondary hover:text-foreground transition-colors"
            >
              ✕ Limpiar
            </button>
          </motion.div>
        </section>
      )}

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaFilter className="text-brand" />
              Estado
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'in-progress', 'planned'] as const).map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedStatus === status
                      ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-lg shadow-brand/30'
                      : 'bg-white/5 text-secondary hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {status === 'all'
                    ? 'Todos'
                    : status === 'in-progress'
                      ? 'En Progreso'
                      : status === 'completed'
                        ? 'Completados'
                        : 'Próximamente'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 block">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-panel border border-white/10 text-foreground focus:border-brand/50 focus:outline-none transition-all"
            >
              {ROADMAP_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-success text-2xl" />
              <span className="text-3xl font-black text-success">
                {groupedFeatures.completed.length}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">Completados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FaSpinner className="text-brand text-2xl" />
              <span className="text-3xl font-black text-brand">
                {groupedFeatures['in-progress'].length}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">En Progreso</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-secondary text-2xl" />
              <span className="text-3xl font-black text-foreground">
                {groupedFeatures.planned.length}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">Próximamente</p>
          </motion.div>
        </div>
      </section>

      {/* Features List */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-6 pb-20">
        {(['in-progress', 'planned', 'completed'] as const).map((status) => {
          const features = groupedFeatures[status];
          if (features.length === 0) return null;

          const config = statusConfig[status];
          const StatusIcon = config.icon;

          return (
            <div key={status} className="mb-16">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
                  <StatusIcon className={`${config.color} text-xl`} />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {config.label}
                  <span className="text-secondary ml-3 text-lg">({features.length})</span>
                </h2>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <SpotlightCard
                        className={`group bg-panel border ${config.borderColor} hover:border-brand/50 rounded-xl p-6 h-full transition-all duration-300`}
                        spotlightColor="rgba(0, 71, 255, 0.25)"
                        spotlightOpacity={0.15}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <Icon className={`${config.color} text-xl`} />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${config.badgeBg} ${config.color}`}
                          >
                            {feature.category}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          {feature.description}
                        </p>

                        {/* Metadata badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {feature.quarter && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md">
                              <FaCalendarAlt className="text-brand text-xs" />
                              <span className="text-xs font-semibold text-foreground">
                                {feature.quarter}
                              </span>
                            </div>
                          )}
                          {feature.effort && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md">
                              <FaHourglass className="text-secondary text-xs" />
                              <span className="text-xs text-secondary">{feature.effort}</span>
                            </div>
                          )}
                        </div>

                        {/* Footer - Status specific info */}
                        <div className="pt-4 border-t border-white/5 mt-auto">
                          {feature.status === 'completed' && feature.completedDate && (
                            <div className="flex items-center gap-2">
                              <FaCheckCircle className="text-success text-sm" />
                              <span className="text-xs text-secondary">
                                Completado en {feature.completedDate}
                              </span>
                            </div>
                          )}

                          {feature.status === 'in-progress' && feature.progress !== undefined && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-foreground">
                                  Progreso
                                </span>
                                <span className="text-xs font-bold text-brand">
                                  {feature.progress}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${feature.progress}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full"
                                />
                              </div>
                            </div>
                          )}

                          {feature.status === 'planned' && (
                            <div className="flex items-center justify-between">
                              {feature.priority && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-secondary">Prioridad:</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                                      priorityConfig[feature.priority].bg
                                    } ${priorityConfig[feature.priority].color}`}
                                  >
                                    {priorityConfig[feature.priority].label}
                                  </span>
                                </div>
                              )}
                              {feature.votes !== undefined && (
                                <div className="flex items-center gap-1 text-secondary">
                                  <FaThumbsUp className="text-xs" />
                                  <span className="text-xs font-semibold">{feature.votes}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            ¿Tienes una <GradientText className="font-black">idea</GradientText>?
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto text-base sm:text-lg">
            Tu feedback es fundamental. Contáctanos para sugerir nuevas features, reportar bugs o
            compartir tu experiencia usando Dólar Gaucho
          </p>
          <LinkButton variant="primary" size="lg" href="mailto:tomymaritano@gmail.com" external>
            Enviar Feedback
          </LinkButton>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
