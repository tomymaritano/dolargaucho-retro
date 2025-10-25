/**
 * TechStackCard Component
 *
 * Displays a technology card with icon, name, version, and description
 */

import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface TechStackCardProps {
  icon: IconType;
  name: string;
  version?: string;
  description: string;
  category: 'frontend' | 'backend' | 'devops' | 'external';
  color: string;
  link?: string;
}

const categoryColors = {
  frontend: {
    bg: 'bg-brand/10',
    border: 'border-brand/30',
    text: 'text-brand',
  },
  backend: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  devops: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
  },
  external: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
};

export function TechStackCard({
  icon: Icon,
  name,
  version,
  description,
  category,
  color,
  link,
}: TechStackCardProps) {
  const categoryStyle = categoryColors[category];

  const content = (
    <SpotlightCard
      className={`bg-panel border ${categoryStyle.border} hover:border-brand/50 rounded-xl p-6 h-full transition-all duration-300 group`}
      spotlightColor="rgba(0, 71, 255, 0.15)"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${categoryStyle.bg}`}>
          <Icon className={`${categoryStyle.text} text-2xl`} />
        </div>
        {version && (
          <span className="px-2 py-1 bg-panel/10 border border-border rounded text-xs font-mono text-secondary">
            v{version}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary leading-relaxed">{description}</p>

      {/* Category Badge */}
      <div className="mt-4 pt-4 border-t border-border">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </div>
    </SpotlightCard>
  );

  if (link) {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="block"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  );
}
