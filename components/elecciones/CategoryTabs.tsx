'use client';

/**
 * CategoryTabs - Tabs para cambiar entre categorías de elecciones
 *
 * Permite cambiar entre Presidente, Diputados, Senadores
 * Estilo consistente con AuthTabs
 */

import React from 'react';

export type ElectionCategory = 'presidente' | 'diputados' | 'senadores';

interface CategoryTabsProps {
  activeCategory: ElectionCategory;
  onCategoryChange: (category: ElectionCategory) => void;
}

const CATEGORIES = [
  { id: 'presidente' as const, label: 'Presidente' },
  { id: 'diputados' as const, label: 'Diputados' },
  { id: 'senadores' as const, label: 'Senadores' },
];

export const CategoryTabs = React.memo(function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-panel/10 rounded-xl border border-white/5">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'text-secondary hover:text-foreground hover:bg-panel/10'
            }`}
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
});
