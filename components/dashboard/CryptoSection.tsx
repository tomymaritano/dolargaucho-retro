/**
 * CryptoSection Component
 *
 * Single Responsibility: Display cryptocurrency section with table and pagination
 * Composition: Uses Card, CryptoTable, and pagination controls
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CryptoTable } from './CryptoTable';
import type { Quotation } from '@/types/api/dolar';
import type { CryptoData } from '@/types/api/crypto';

interface CryptoSectionProps {
  cryptos: CryptoData[] | undefined;
  isLoading: boolean;
  selectedDolar: Quotation | undefined;
  favoriteCryptoIds: string[];
  cryptoPage: number;
  cryptoPerPage: number;
  onToggleFavorite: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function CryptoSection({
  cryptos,
  isLoading,
  selectedDolar,
  favoriteCryptoIds,
  cryptoPage,
  cryptoPerPage,
  onToggleFavorite,
  onPageChange,
}: CryptoSectionProps) {
  if (isLoading || !cryptos || cryptos.length === 0) {
    return null;
  }

  const startIndex = (cryptoPage - 1) * cryptoPerPage + 1;
  const endIndex = startIndex + cryptos.length - 1;

  return (
    <Card variant="outlined" padding="none">
      <CryptoTable
        cryptos={cryptos}
        selectedDolar={selectedDolar}
        favoriteCryptoIds={favoriteCryptoIds}
        cryptoPage={cryptoPage}
        cryptoPerPage={cryptoPerPage}
        onToggleFavorite={onToggleFavorite}
      />

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-700/10 flex items-center justify-between">
        <div className="text-sm text-secondary">
          Mostrando {startIndex} - {endIndex} criptomonedas
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, cryptoPage - 1))}
            disabled={cryptoPage === 1}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              cryptoPage === 1
                ? 'text-secondary/50 cursor-not-allowed'
                : 'text-foreground hover:text-brand'
            }`}
          >
            <FaChevronLeft className="text-xs" />
            Anterior
          </button>

          <div className="px-4 py-2 rounded-lg">
            <span className="text-sm font-semibold text-foreground">Página {cryptoPage}</span>
          </div>

          <button
            onClick={() => onPageChange(cryptoPage + 1)}
            disabled={cryptos.length < cryptoPerPage}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              cryptos.length < cryptoPerPage
                ? 'text-secondary/50 cursor-not-allowed'
                : 'text-foreground hover:text-brand'
            }`}
          >
            Siguiente
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>
    </Card>
  );
}
