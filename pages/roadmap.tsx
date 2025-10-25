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
import { motion, AnimatePresence } from 'framer-motion';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { GradientText } from '@/components/ui/GradientText';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedOrbs } from '@/components/ui/AnimatedOrbs';
import { LinkButton } from '@/components/ui/Button';
import { TimelineQuarters } from '@/components/roadmap/TimelineQuarters';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useFeatureVotes } from '@/hooks/useFeatureVotes';
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
  FaSignInAlt,
  FaSortAmountDown,
  FaLayerGroup,
} from 'react-icons/fa';

const statusConfig = {
  completed: {
    label: 'Completado',
    icon: FaCheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    badgeBg: 'bg-success/20',
    gradientOverlay: 'from-success/5 to-transparent',
  },
  'in-progress': {
    label: 'En Progreso',
    icon: FaSpinner,
    color: 'text-brand',
    bgColor: 'bg-brand/10',
    borderColor: 'border-brand/30',
    badgeBg: 'bg-brand/20',
    gradientOverlay: 'from-brand/5 to-transparent',
  },
  planned: {
    label: 'Próximamente',
    icon: FaClock,
    color: 'text-secondary',
    bgColor: 'bg-panel/10',
    borderColor: 'border-border/10',
    badgeBg: 'bg-panel/20',
    gradientOverlay: 'from-white/5 to-transparent',
  },
};

const priorityConfig = {
  high: { label: 'Alta', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
  medium: {
    label: 'Media',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  low: { label: 'Baja', color: 'text-secondary', bg: 'bg-panel/10', border: 'border-border/10' },
};

interface VoteButtonProps {
  featureId: string;
  voteCount: number;
  hasVoted: boolean;
  onVote: () => void;
  isAuthenticated: boolean;
}

function VoteButton({ featureId, voteCount, hasVoted, onVote, isAuthenticated }: VoteButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    onVote();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-300 ${
          hasVoted
            ? 'bg-brand/20 border-brand/40 text-brand'
            : 'bg-panel/10 border-border/10 text-secondary hover:border-brand/30 hover:bg-brand/10'
        }`}
      >
        <motion.div animate={{ scale: hasVoted ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
          <FaThumbsUp className="text-xs" />
        </motion.div>
        <span className="text-xs font-bold">{voteCount}</span>
      </motion.button>

      {/* Tooltip for non-authenticated users */}
      <AnimatePresence>
        {showTooltip && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-panel border border-brand/30 rounded-lg shadow-xl whitespace-nowrap z-50"
          >
            <div className="flex items-center gap-2">
              <FaSignInAlt className="text-brand text-xs" />
              <span className="text-xs font-semibold text-foreground">
                Inicia sesión para votar
              </span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type SortOption = 'status' | 'votes' | 'priority' | 'quarter';

export default function RoadmapPage() {
  const [selectedStatus, setSelectedStatus] = useState<RoadmapStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('status');
  const featuresRef = React.useRef<HTMLElement>(null);

  // Auth and voting
  const { user } = useAuth();
  const { votes, userVotes, toggleVote } = useFeatureVotes();

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

  // Sort features based on selected sort option
  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (sortBy === 'votes') {
      const votesA = votes.get(a.id) || a.votes || 0;
      const votesB = votes.get(b.id) || b.votes || 0;
      return votesB - votesA; // Descending
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityA = a.priority ? priorityOrder[a.priority] : 0;
      const priorityB = b.priority ? priorityOrder[b.priority] : 0;
      return priorityB - priorityA; // Descending
    } else if (sortBy === 'quarter') {
      return (a.quarter || 'Z').localeCompare(b.quarter || 'Z');
    }
    return 0; // Default: keep status order
  });

  // Group by status
  const groupedFeatures = {
    completed: sortedFeatures.filter((f) => f.status === 'completed'),
    'in-progress': sortedFeatures.filter((f) => f.status === 'in-progress'),
    planned: sortedFeatures.filter((f) => f.status === 'planned'),
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
                      : 'bg-panel/10 text-secondary hover:bg-panel/20 border border-border/10'
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
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaLayerGroup className="text-brand" />
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-panel border border-border/10 text-foreground focus:border-brand/50 focus:outline-none transition-all"
            >
              {ROADMAP_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaSortAmountDown className="text-brand" />
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-4 py-2 rounded-lg bg-panel border border-border/10 text-foreground focus:border-brand/50 focus:outline-none transition-all"
            >
              <option value="status">Estado (Default)</option>
              <option value="votes">Más Votados</option>
              <option value="priority">Prioridad</option>
              <option value="quarter">Quarter</option>
            </select>
          </div>
        </div>

        {/* Stats Summary - Glassmorphism Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="relative overflow-hidden bg-gradient-to-br from-success/10 via-success/5 to-transparent backdrop-blur-sm border border-success/30 rounded-2xl p-6 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-success/10 rounded-xl">
                  <FaCheckCircle className="text-success text-2xl" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-black bg-gradient-to-br from-success to-success/70 bg-clip-text text-transparent"
                >
                  {groupedFeatures.completed.length}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Features Completadas</p>
              <p className="text-xs text-secondary">Listas para usar ahora</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="relative overflow-hidden bg-gradient-to-br from-brand/10 via-brand/5 to-transparent backdrop-blur-sm border border-brand/30 rounded-2xl p-6 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-brand/10 rounded-xl">
                  <FaSpinner className="text-brand text-2xl animate-spin-slow" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-black bg-gradient-to-br from-brand to-brand-light bg-clip-text text-transparent"
                >
                  {groupedFeatures['in-progress'].length}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">En Desarrollo</p>
              <p className="text-xs text-secondary">Trabajando activamente</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="relative overflow-hidden bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-sm border border-border/10 rounded-2xl p-6 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-panel/10 rounded-xl">
                  <FaClock className="text-secondary text-2xl" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-black text-foreground"
                >
                  {groupedFeatures.planned.length}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Planificadas</p>
              <p className="text-xs text-secondary">Próximamente</p>
            </div>
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
                        className={`group relative overflow-hidden bg-gradient-to-br from-panel via-panel/95 to-panel/90 backdrop-blur-sm border ${config.borderColor} hover:border-brand/60 rounded-2xl p-6 h-full transition-all duration-500 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1`}
                        spotlightColor="rgba(0, 71, 255, 0.3)"
                        spotlightOpacity={0.2}
                      >
                        {/* Gradient overlay on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${config.gradientOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                        />

                        {/* Content wrapper */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`p-3 rounded-xl ${config.bgColor} backdrop-blur-sm border border-border/5 shadow-lg`}
                            >
                              <Icon className={`${config.color} text-xl`} />
                            </motion.div>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.badgeBg} ${config.color} backdrop-blur-sm border border-border/10 shadow-sm`}
                            >
                              {feature.category}
                            </motion.span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-secondary leading-relaxed mb-4">
                            {feature.description}
                          </p>

                          {/* Metadata badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {feature.quarter && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-border/10"
                              >
                                <FaCalendarAlt className="text-brand text-xs" />
                                <span className="text-xs font-semibold text-foreground">
                                  {feature.quarter}
                                </span>
                              </motion.div>
                            )}
                            {feature.effort && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-border/10"
                              >
                                <FaHourglass className="text-secondary text-xs" />
                                <span className="text-xs text-secondary">{feature.effort}</span>
                              </motion.div>
                            )}
                          </div>

                          {/* Footer - Status specific info */}
                          <div className="pt-4 border-t border-border/10 mt-auto">
                            {feature.status === 'completed' && feature.completedDate && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-lg border border-success/20">
                                <FaCheckCircle className="text-success text-sm" />
                                <span className="text-xs font-semibold text-success">
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
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="text-sm font-bold bg-gradient-to-br from-brand to-brand-light bg-clip-text text-transparent"
                                  >
                                    {feature.progress}%
                                  </motion.span>
                                </div>
                                <div className="w-full h-2.5 bg-panel/20 rounded-full overflow-hidden backdrop-blur-sm border border-border/5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${feature.progress}%` }}
                                    viewport={{ once: true }}
                                    transition={{
                                      duration: 1.2,
                                      delay: 0.2,
                                      type: 'spring',
                                      stiffness: 50,
                                    }}
                                    className="h-full bg-gradient-to-r from-brand via-brand-light to-brand rounded-full shadow-lg shadow-brand/50"
                                  />
                                </div>
                              </div>
                            )}

                            {feature.status === 'planned' && (
                              <div className="flex items-center justify-between gap-3">
                                {feature.priority && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-secondary">Prioridad:</span>
                                    <motion.span
                                      whileHover={{ scale: 1.1 }}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm border ${
                                        priorityConfig[feature.priority].bg
                                      } ${priorityConfig[feature.priority].color} ${
                                        priorityConfig[feature.priority].border ||
                                        'border-border/10'
                                      }`}
                                    >
                                      {priorityConfig[feature.priority].label}
                                    </motion.span>
                                  </div>
                                )}
                                {/* Vote Button */}
                                <VoteButton
                                  featureId={feature.id}
                                  voteCount={votes.get(feature.id) || feature.votes || 0}
                                  hasVoted={userVotes.has(feature.id)}
                                  onVote={() => toggleVote(feature.id)}
                                  isAuthenticated={!!user}
                                />
                              </div>
                            )}
                          </div>
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
