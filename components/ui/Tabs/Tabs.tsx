/**
 * Tabs - Componente de pestañas reutilizable
 *
 * Componente genérico para crear interfaces con tabs
 * Soporta iconos, badges, y diferentes variantes de estilo
 */

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

export interface Tab {
  id: string;
  label: string;
  icon?: IconType;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
}: TabsProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  const variantClasses = {
    default: {
      container: 'bg-panel border border-white/10 rounded-lg p-1',
      tab: 'rounded-md relative',
      active: 'text-foreground',
      inactive: 'text-secondary hover:text-foreground',
    },
    pills: {
      container: 'flex flex-wrap gap-2',
      tab: 'rounded-lg border transition-all',
      active: 'bg-brand/10 border-brand/30 text-brand',
      inactive:
        'bg-panel border-white/10 text-secondary hover:border-brand/20 hover:text-foreground',
    },
    underline: {
      container: 'border-b border-white/10',
      tab: 'relative pb-3',
      active: 'text-foreground',
      inactive: 'text-secondary hover:text-foreground',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={variant === 'default' ? 'flex gap-1' : 'flex gap-2'}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                ${styles.tab}
                ${sizeClasses[size]}
                ${isActive ? styles.active : styles.inactive}
                font-medium transition-colors flex items-center gap-2
              `}
            >
              {/* Background indicator for default variant */}
              {variant === 'default' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-background rounded-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Underline indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {Icon && <Icon className="text-base" />}
                {tab.label}
                {tab.badge && (
                  <span
                    className={`
                    text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${isActive ? 'bg-brand/20 text-brand' : 'bg-white/10 text-secondary'}
                  `}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
