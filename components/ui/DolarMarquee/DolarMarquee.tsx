'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown, FaMinus, FaChevronDown } from 'react-icons/fa';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { useRiesgoPaisWithVariation } from '@/hooks/useFinanzas';
import { useDolarTypeStore } from '@/lib/store/dolarType';
import type { DolarType } from '@/types/api/dolar';
import './DolarMarquee.css';

const dolarTypeConfig: Record<DolarType, { label: string }> = {
  blue: { label: 'Blue' },
  oficial: { label: 'Oficial' },
  cripto: { label: 'Cripto' },
  bolsa: { label: 'MEP' },
  contadoconliqui: { label: 'CCL' },
  tarjeta: { label: 'Tarjeta' },
  mayorista: { label: 'Mayorista' },
};

export function DolarMarquee() {
  const { data: dolares, isLoading: dolaresLoading } = useDolarVariations();
  const { data: riesgoPaisData, isLoading: riesgoLoading } = useRiesgoPaisWithVariation();
  const { selectedType, setDolarType } = useDolarTypeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (dolaresLoading || !dolares || dolares.length === 0) {
    return (
      <div className="bg-background border-b border-border">
        <div className="h-12 flex items-center justify-center">
          <div className="animate-pulse h-4 w-64 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  // Duplicate items for seamless loop
  const duplicatedItems = [...dolares, ...dolares];

  // Riesgo País data
  const riesgoPais = riesgoPaisData?.current;
  const riesgoVariation = riesgoPaisData?.variation;
  const riesgoTrend = riesgoVariation?.trend;
  const riesgoPercentage = riesgoVariation?.percentage;

  const RiesgoIcon =
    riesgoTrend === 'up' ? FaArrowUp : riesgoTrend === 'down' ? FaArrowDown : FaMinus;
  const riesgoColor =
    riesgoTrend === 'up' ? 'text-error' : riesgoTrend === 'down' ? 'text-success' : 'text-warning';

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-12">
        {/* Riesgo País */}
        {riesgoPais && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors flex-shrink-0"
            title="Ver detalles de Riesgo País"
          >
            <span className="text-xs text-secondary uppercase tracking-wider">Riesgo País</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {riesgoPais.valor.toLocaleString('es-AR')}
            </span>
            {riesgoTrend && riesgoTrend !== 'neutral' && (
              <div className={`flex items-center gap-0.5 ${riesgoColor}`}>
                <RiesgoIcon className="text-[10px]" />
                <span className="text-xs font-semibold tabular-nums">
                  {riesgoPercentage?.toFixed(1)}%
                </span>
              </div>
            )}
          </Link>
        )}

        {/* Dolar Type Selector */}
        <div className="relative flex-shrink-0 z-10" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-secondary/50 transition-all duration-200 relative z-10"
            aria-label="Seleccionar tipo de dólar"
          >
            <span className="text-xs text-secondary uppercase tracking-wider">Dólar</span>
            <span className="text-sm font-bold text-foreground">
              {dolarTypeConfig[selectedType].label}
            </span>
            <FaChevronDown
              className={`text-xs text-foreground/50 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-panel rounded-lg shadow-2xl overflow-hidden z-[60]">
              {(['blue', 'oficial', 'cripto'] as DolarType[]).map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setDolarType(type);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                      isSelected
                        ? 'bg-brand/10 text-brand'
                        : 'hover:bg-background-secondary text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium">{dolarTypeConfig[type].label}</span>
                    {isSelected && <div className="ml-auto w-2 h-2 rounded-full bg-brand" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border/20 flex-shrink-0" />

        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-container">
              {duplicatedItems.map((dolar, index) => {
                const { trend, percentage } = dolar.variation;

                const VariationIcon =
                  trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;

                const variationColor =
                  trend === 'up'
                    ? 'text-error'
                    : trend === 'down'
                      ? 'text-success'
                      : 'text-warning';

                return (
                  <Link
                    key={`${dolar.casa}-${index}`}
                    href="/dashboard"
                    className="marquee-item hover:bg-background-secondary/50 transition-colors"
                    title={`Ver detalle de ${dolar.nombre}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {dolar.nombre}
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        ${dolar.venta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={`flex items-center gap-1 ${variationColor}`}>
                        <VariationIcon className="text-xs" />
                        <span className="text-xs font-semibold tabular-nums">
                          {percentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
