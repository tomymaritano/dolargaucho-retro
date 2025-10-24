import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useElectionResults, isElectionDay } from '@/hooks/useElectionResults';
import { ElectionHero } from '@/components/elecciones/ElectionHero';
import { HistoricalElectionCard } from '@/components/elecciones/HistoricalElectionCard';
import { HistoricalLegislativeCard } from '@/components/elecciones/HistoricalLegislativeCard';
import { CandidateBar } from '@/components/elecciones/CandidateBar';
import { LiveBadge } from '@/components/elecciones/LiveBadge';
import { LiveResultsPreview } from '@/components/elecciones/LiveResultsPreview';
import { CategoryTabs, type ElectionCategory } from '@/components/elecciones/CategoryTabs';
import { HISTORICAL_ELECTIONS } from '@/data/elections-history';
import { useHistoricalElections } from '@/hooks/useHistoricalElections';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaChartLine,
  FaSpinner,
} from 'react-icons/fa';
import { getMockDiputadosResults, getMockSenadoresResults } from '@/lib/utils/election-mock-data';

export default function EleccionesPage() {
  const shouldPoll = isElectionDay();

  // PRODUCTION MODE: Use real API data
  const TESTING_MODE = false;

  // State for active category - SEPARADO para cada sección
  const [activeLiveCategory, setActiveLiveCategory] = useState<'diputados' | 'senadores'>(
    'diputados'
  ); // Solo legislativas en 2025
  const [activeHistoricalCategory, setActiveHistoricalCategory] =
    useState<ElectionCategory>('presidente'); // Todas las categorías en historial

  const { data, isLoading, error, lastFetch, isFetching } = useElectionResults(
    shouldPoll && !TESTING_MODE // Only fetch from API if not in testing mode
  );

  // Obtener datos históricos de elecciones legislativas desde PostgreSQL
  // Filtrar por categoría activa del historial (independiente de la sección live)
  const {
    data: historicalElections,
    isLoading: isLoadingHistorical,
    error: historicalError,
  } = useHistoricalElections(
    activeHistoricalCategory === 'presidente' ? undefined : activeHistoricalCategory
  );

  // Use mock data in testing mode, real data in production
  const displayData = TESTING_MODE
    ? activeLiveCategory === 'diputados'
      ? getMockDiputadosResults(45) // 45% de mesas escrutadas para simular conteo en progreso
      : getMockSenadoresResults(42) // 42% para senadores
    : data;

  // Simulate lastFetch in testing mode
  const mockLastFetch = TESTING_MODE ? new Date() : null;

  const heroRightContent = (
    <div className="space-y-4">
      {displayData ? (
        <LiveResultsPreview
          data={displayData}
          lastFetch={TESTING_MODE ? mockLastFetch : lastFetch}
          isFetching={isFetching}
        />
      ) : (
        <>
          <div className="bg-panel/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
            <div className="text-6xl font-black bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              2025
            </div>
            <p className="text-lg font-bold text-foreground mb-2">Elecciones Legislativas</p>
            <p className="text-sm text-secondary mb-4">26 de octubre 2025</p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-secondary/60">
                Los resultados estaran disponibles el dia de la eleccion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-panel/30 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-purple-400 mb-1">10</div>
              <p className="text-xs text-secondary">Elecciones Historicas</p>
            </div>
            <div className="bg-panel/30 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400 mb-1">1983</div>
              <p className="text-xs text-secondary">Desde</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <SEO
        title="Elecciones Argentina | Dolar Gaucho"
        description="Resultados de elecciones presidenciales en tiempo real"
        type="article"
      />
      <div className="min-h-screen bg-background text-foreground font-sans">
        <NavbarFloating />

        <ElectionHero isLive={shouldPoll} rightContent={heroRightContent} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          <section id="resultados-2025" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                    Resultados 2025
                  </h2>
                  <p className="text-secondary">
                    {displayData
                      ? 'Datos oficiales del Ministerio del Interior'
                      : 'En espera del inicio del escrutinio'}
                  </p>
                </div>
                {shouldPoll && displayData && <LiveBadge />}
              </div>

              {/* Category Tabs - Solo Diputados y Senadores para 2025 */}
              <div className="mb-8">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 max-w-md">
                  <button
                    onClick={() => setActiveLiveCategory('diputados')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeLiveCategory === 'diputados'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-secondary hover:text-foreground hover:bg-white/5'
                    }`}
                    type="button"
                  >
                    Diputados
                  </button>
                  <button
                    onClick={() => setActiveLiveCategory('senadores')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeLiveCategory === 'senadores'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-secondary hover:text-foreground hover:bg-white/5'
                    }`}
                    type="button"
                  >
                    Senadores
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="animate-spin text-purple-500 text-4xl" />
                    <p className="text-secondary">Cargando resultados...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                  <FaExclamationCircle className="text-red-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar datos</h3>
                  <p className="text-secondary">{error.message}</p>
                </div>
              ) : !displayData ? (
                <div className="bg-panel/30 border border-white/10 rounded-2xl p-12 text-center">
                  <FaInfoCircle className="text-purple-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No hay datos disponibles
                  </h3>
                  <p className="text-secondary mb-2">
                    Los resultados de{' '}
                    {activeLiveCategory === 'diputados' ? 'Diputados' : 'Senadores'} estaran
                    disponibles cuando comience el escrutinio
                  </p>
                  <p className="text-xs text-secondary/60 mt-4">
                    Los datos se actualizaran automaticamente cada 10 segundos el dia de la eleccion
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-panel/50 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <FaChartLine className="text-purple-400 text-xl" />
                        <span className="text-sm font-semibold text-secondary uppercase">
                          Mesas Escrutadas
                        </span>
                      </div>
                      <div className="text-3xl font-black text-foreground mb-1">
                        {displayData.progress.talliedPercentage.toFixed(2)}%
                      </div>
                      <p className="text-xs text-secondary">
                        {displayData.progress.talliedPollingStations.toLocaleString()} de{' '}
                        {displayData.progress.totalPollingStations.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-panel/50 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <FaInfoCircle className="text-blue-400 text-xl" />
                        <span className="text-sm font-semibold text-secondary uppercase">
                          Participacion
                        </span>
                      </div>
                      <div className="text-3xl font-black text-foreground mb-1">
                        {(
                          (displayData.progress.talliedPollingStations /
                            displayData.progress.totalPollingStations) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                      <p className="text-xs text-secondary">del padron electoral</p>
                    </div>

                    <div className="bg-panel/50 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <FaCheckCircle className="text-green-400 text-xl" />
                        <span className="text-sm font-semibold text-secondary uppercase">
                          Estado
                        </span>
                      </div>
                      <div className="text-3xl font-black text-foreground mb-1">En Proceso</div>
                      <p className="text-xs text-secondary">
                        {lastFetch
                          ? `Actualizado ${new Date(lastFetch).toLocaleTimeString()}`
                          : 'Actualizando...'}
                      </p>
                    </div>
                  </div>

                  {displayData.candidates[0] && displayData.candidates[0].percentage > 31 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <FaCheckCircle className="text-purple-400 text-2xl" />
                        <h3 className="text-2xl font-black text-foreground">
                          Lista Mas Votada -{' '}
                          {activeLiveCategory === 'diputados' ? 'Diputados' : 'Senadores'}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-foreground mb-1">
                            {displayData.candidates[0].fullName}
                          </p>
                          <p className="text-secondary">{displayData.candidates[0].party}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-purple-400">
                            {displayData.candidates[0].percentage.toFixed(2)}%
                          </p>
                          <p className="text-sm text-secondary">
                            {displayData.candidates[0].votes.toLocaleString()} votos
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-foreground">Listas</h3>
                    {displayData.candidates.map((candidate, index) => (
                      <CandidateBar
                        key={candidate.id}
                        candidate={candidate}
                        rank={index + 1}
                        maxPercentage={displayData.candidates[0].percentage}
                        delay={0.1 + index * 0.05}
                      />
                    ))}
                  </div>

                  {displayData.otherVotes && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                      <div className="text-center p-4 bg-panel/30 rounded-xl">
                        <p className="text-sm text-secondary mb-1">Votos en Blanco</p>
                        <p className="text-xl font-bold text-foreground">
                          {displayData.otherVotes.blank.toLocaleString()}
                        </p>
                        {displayData.otherVotes.blankPercentage !== null && (
                          <p className="text-xs text-secondary mt-1">
                            {displayData.otherVotes.blankPercentage.toFixed(1)}%
                          </p>
                        )}
                      </div>
                      <div className="text-center p-4 bg-panel/30 rounded-xl">
                        <p className="text-sm text-secondary mb-1">Votos Nulos</p>
                        <p className="text-xl font-bold text-foreground">
                          {displayData.otherVotes.null.toLocaleString()}
                        </p>
                        {displayData.otherVotes.nullPercentage !== null && (
                          <p className="text-xs text-secondary mt-1">
                            {displayData.otherVotes.nullPercentage.toFixed(1)}%
                          </p>
                        )}
                      </div>
                      <div className="text-center p-4 bg-panel/30 rounded-xl">
                        <p className="text-sm text-secondary mb-1">Votos Impugnados</p>
                        <p className="text-xl font-bold text-foreground">
                          {displayData.otherVotes.challenged.toLocaleString()}
                        </p>
                        {displayData.otherVotes.challengedPercentage !== null && (
                          <p className="text-xs text-secondary mt-1">
                            {displayData.otherVotes.challengedPercentage.toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </section>

          <section id="historial" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                  Historial Electoral
                </h2>
                <p className="text-secondary mb-6">
                  {activeHistoricalCategory === 'presidente' &&
                    'Resultados de elecciones presidenciales anteriores'}
                  {activeHistoricalCategory === 'diputados' &&
                    'Resultados de elecciones legislativas anteriores (Diputados Nacionales)'}
                  {activeHistoricalCategory === 'senadores' &&
                    'Resultados de elecciones legislativas anteriores (Senadores Nacionales)'}
                </p>

                {/* Category Tabs - Todas las categorías para historial */}
                <CategoryTabs
                  activeCategory={activeHistoricalCategory}
                  onCategoryChange={setActiveHistoricalCategory}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Elecciones Presidenciales (datos hardcodeados) */}
                {activeHistoricalCategory === 'presidente' &&
                  HISTORICAL_ELECTIONS.map((election, index) => (
                    <HistoricalElectionCard
                      key={election.year}
                      election={election}
                      delay={0.1 + index * 0.1}
                    />
                  ))}

                {/* Elecciones Legislativas (datos desde archivos JSON) */}
                {(activeHistoricalCategory === 'diputados' ||
                  activeHistoricalCategory === 'senadores') && (
                  <>
                    {isLoadingHistorical && (
                      <div className="col-span-2 flex justify-center py-12">
                        <FaSpinner className="animate-spin text-purple-500 text-3xl" />
                      </div>
                    )}

                    {historicalError && (
                      <div className="col-span-2 bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                        <FaExclamationCircle className="text-red-400 text-3xl mx-auto mb-3" />
                        <p className="text-red-400">Error al cargar datos históricos</p>
                      </div>
                    )}

                    {!isLoadingHistorical &&
                      !historicalError &&
                      historicalElections &&
                      historicalElections.length > 0 && (
                        <>
                          {historicalElections.map((election, index) => (
                            <HistoricalLegislativeCard
                              key={`${election.year}-${election.category}`}
                              election={election}
                              delay={0.1 + index * 0.1}
                            />
                          ))}
                        </>
                      )}

                    {!isLoadingHistorical &&
                      !historicalError &&
                      historicalElections &&
                      historicalElections.length === 0 && (
                        <div className="col-span-2 bg-panel/30 border border-white/10 rounded-2xl p-12 text-center">
                          <FaInfoCircle className="text-purple-400 text-4xl mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            No hay datos disponibles
                          </h3>
                          <p className="text-secondary">
                            No se encontraron datos históricos para esta categoría
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </motion.div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
