/**
 * CryptoSection Component
 *
 * Single Responsibility: Display cryptocurrency section with table and pagination
 * Composition: Uses Card, CryptoTable, and pagination controls
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaBitcoin, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CryptoTable } from './CryptoTable';
import type { DolarType, Quotation } from '@/types/api/dolar';
import type { CryptoData } from '@/types/api/crypto';

interface CryptoSectionProps {
  cryptos: CryptoData[] | undefined;
  isLoading: boolean;
  selectedDolar: Quotation | undefined;
  selectedDolarType: DolarType;
  favoriteCryptoIds: string[];
  cryptoPage: number;
  cryptoPerPage: number;
  onToggleFavorite: (id: string) => void;
  onPageChange: (page: number) => void;
  onDolarTypeChange: (type: DolarType) => void;
}

export function CryptoSection({
  cryptos,
  isLoading,
  selectedDolar,
  selectedDolarType,
  favoriteCryptoIds,
  cryptoPage,
  cryptoPerPage,
  onToggleFavorite,
  onPageChange,
  onDolarTypeChange,
}: CryptoSectionProps) {
  if (isLoading || !cryptos || cryptos.length === 0) {
    return null;
  }

  const startIndex = (cryptoPage - 1) * cryptoPerPage + 1;
  const endIndex = startIndex + cryptos.length - 1;

  return (
    <Card variant="elevated" padding="lg" className="mt-6">
      <Card.Header>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FaBitcoin className="text-accent-emerald text-xl" />
            <Card.Title className="mb-0">Todas las Criptomonedas</Card.Title>
          </div>

          {/* Dolar Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary">Precio en ARS con:</span>
            <div className="flex gap-1">
              {(['blue', 'oficial', 'cripto'] as DolarType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onDolarTypeChange(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDolarType === type
                      ? 'bg-accent-emerald text-background-dark'
                      : 'glass text-secondary hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {type === 'blue' ? 'Blue' : type === 'oficial' ? 'Oficial' : 'Cripto'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <CryptoTable
          cryptos={cryptos}
          selectedDolar={selectedDolar}
          favoriteCryptoIds={favoriteCryptoIds}
          cryptoPage={cryptoPage}
          cryptoPerPage={cryptoPerPage}
          onToggleFavorite={onToggleFavorite}
        />

        {/* Pagination Controls */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-secondary">
            Mostrando {startIndex} - {endIndex} criptomonedas
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, cryptoPage - 1))}
              disabled={cryptoPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                cryptoPage === 1
                  ? 'glass text-secondary/50 cursor-not-allowed'
                  : 'glass text-foreground hover:bg-white/10'
              }`}
            >
              <FaChevronLeft className="text-xs" />
              Anterior
            </button>

            <div className="px-4 py-2 glass rounded-lg">
              <span className="text-sm font-semibold text-foreground">Página {cryptoPage}</span>
            </div>

            <button
              onClick={() => onPageChange(cryptoPage + 1)}
              disabled={cryptos.length < cryptoPerPage}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                cryptos.length < cryptoPerPage
                  ? 'glass text-secondary/50 cursor-not-allowed'
                  : 'glass text-foreground hover:bg-white/10'
              }`}
            >
              Siguiente
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
