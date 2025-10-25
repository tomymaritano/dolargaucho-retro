/**
 * FavoriteActionsBar Component
 *
 * Single Responsibility: Reusable action buttons bar with gradient overlay
 * (favorite toggle, copy, share)
 */

import React from 'react';
import { FaStar, FaCopy, FaShareAlt } from 'react-icons/fa';

interface FavoriteActionsBarProps {
  onToggleFavorite: () => void;
  onCopy: () => void;
  itemName: string;
  itemValue: string;
}

export function FavoriteActionsBar({
  onToggleFavorite,
  onCopy,
  itemName,
  itemValue,
}: FavoriteActionsBarProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: itemName,
        text: `${itemName}: ${itemValue}`,
      });
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-dark/95 via-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto flex items-center justify-end gap-1 pr-4">
      <button
        onClick={onToggleFavorite}
        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 text-brand hover:bg-brand/10"
        aria-label="Quitar de favoritos"
        title="Quitar de favoritos"
      >
        <FaStar className="text-sm" />
      </button>
      <button
        onClick={onCopy}
        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 text-secondary hover:text-brand hover:bg-panel/10"
        aria-label="Copiar"
        title="Copiar valor"
      >
        <FaCopy className="text-sm" />
      </button>
      <button
        onClick={handleShare}
        className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 text-secondary hover:text-brand hover:bg-panel/10"
        aria-label="Compartir"
        title="Compartir"
      >
        <FaShareAlt className="text-sm" />
      </button>
    </div>
  );
}
