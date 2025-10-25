'use client';

/**
 * DataSourcesSection - De caos a claridad
 *
 * Muestra cómo consolidamos múltiples fuentes en una plataforma unificada
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaGlobe,
  FaUniversity,
  FaChartLine,
  FaBitcoin,
  FaLandmark,
} from 'react-icons/fa';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface DataSource {
  name: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  stats?: string;
}

const dataSources: DataSource[] = [
  {
    name: 'ArgentinaDatos',
    description: 'Agregador oficial de BCRA, INDEC y fuentes públicas argentinas',
    icon: FaUniversity,
    badge: 'Principal',
    stats: 'Inflación, tasas, riesgo país',
  },
  {
    name: 'DolarAPI',
    description: 'Cotizaciones del dólar actualizadas diariamente, todas las casas',
    icon: FaChartLine,
    badge: 'Actualizado',
    stats: '15+ tipos de cambio',
  },
  {
    name: 'CoinGecko',
    description: 'Datos de mercado cripto global, precios y capitalización',
    icon: FaBitcoin,
    badge: 'Cripto',
    stats: '10,000+ activos',
  },
  {
    name: 'FRED',
    description: 'Federal Reserve Economic Data - Indicadores macroeconómicos USA',
    icon: FaGlobe,
    badge: 'Internacional',
    stats: 'FED, inflación USA',
  },
  {
    name: 'ECB',
    description: 'Banco Central Europeo - Tipos de cambio y política monetaria',
    icon: FaGlobe,
    badge: 'Internacional',
    stats: 'EUR, tasas Europa',
  },
  {
    name: 'Congreso Argentina',
    description: 'Sistema oficial de votaciones y actas parlamentarias',
    icon: FaLandmark,
    badge: 'Político',
    stats: 'Senadores y diputados',
  },
  {
    name: 'Calendario Electoral',
    description: 'Próximas elecciones nacionales - 26 de octubre 2025',
    icon: FaLandmark,
    badge: 'Política',
    stats: 'Debut Boleta Única (BUP)',
  },
];

export const DataSourcesSection = React.memo(function DataSourcesSection() {
  return (
    <section className="relative w-full py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Problema/Solución */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6">
            <FaCheckCircle className="text-brand" />
            <span className="text-sm font-semibold text-brand">De Caos a Claridad</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Transparencia total.</span>
            <br />
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Fuentes verificables.
            </span>
          </h2>

          <p className="text-secondary text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Integramos datos de 7 fuentes oficiales y públicas: DolarAPI, ArgentinaDatos
            (BCRA/INDEC), CoinGecko, FRED, ECB, Congreso Argentino y calendario electoral.{' '}
            <span className="text-foreground font-medium">
              No inventamos datos, solo los organizamos y presentamos de forma clara.
            </span>
          </p>
        </motion.div>

        {/* Data Sources Grid - With SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dataSources.map((source, index) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <SpotlightCard
                  className="group bg-panel border border-white/5 rounded-xl p-6 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300"
                  spotlightColor="rgba(0, 71, 255, 0.3)"
                  spotlightOpacity={0.2}
                  spotlightSize={350}
                >
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-brand/10 group-hover:bg-brand/20 transition-colors">
                      <Icon className="text-brand text-xl" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-secondary border border-white/5">
                      {source.badge}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {source.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-secondary leading-relaxed mb-3">
                    {source.description}
                  </p>

                  {/* Stats */}
                  {source.stats && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-foreground/60 font-medium">{source.stats}</p>
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
