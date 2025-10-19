/**
 * CategoryFilter - Botones de filtro por categoría
 *
 * Componente reutilizable para filtrar contenido por categorías
 * Usado principalmente en Help Center, pero extensible a otras páginas
 */

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface Category {
  title: string;
  icon: IconType;
}

interface CategoryFilterProps {
  /** Array de categorías disponibles */
  categories: Category[];
  /** Índice de categoría seleccionada (null = todas) */
  selectedCategory: number | null;
  /** Callback cuando se selecciona una categoría */
  onSelectCategory: (index: number | null) => void;
  /** Texto del botón "Todas" (opcional) */
  allLabel?: string;
  /** Clase CSS adicional (opcional) */
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  allLabel = 'Todas las categorías',
  className = '',
}: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`flex flex-wrap gap-3 justify-center ${className}`}
    >
      {/* Botón "Todas" */}
      <motion.button
        onClick={() => onSelectCategory(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-lg font-medium text-sm transition-all border ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-brand to-brand-light text-background-dark border-brand shadow-lg shadow-brand/30'
            : 'bg-panel border-white/10 text-secondary hover:text-foreground hover:border-brand/30'
        }`}
      >
        {allLabel}
      </motion.button>

      {/* Botones de Categorías */}
      {categories.map((category, index) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === index;

        return (
          <motion.button
            key={index}
            onClick={() => onSelectCategory(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all border flex items-center gap-2 ${
              isSelected
                ? 'bg-gradient-to-r from-brand to-brand-light text-background-dark border-brand shadow-lg shadow-brand/30'
                : 'bg-panel border-white/10 text-secondary hover:text-foreground hover:border-brand/30'
            }`}
          >
            <Icon className="text-base" />
            {category.title}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
