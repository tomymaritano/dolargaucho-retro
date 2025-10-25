import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

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

  // Countdown effect
  useEffect(() => {
    const ELECTION_DATE = new Date('2025-10-26T00:00:00-03:00');

    const calculateTime = () => {
      const now = new Date();
      const diff = ELECTION_DATE.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
          {/* Main Card - Interactive */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-panel/50 border border-border/10 rounded-2xl p-8 backdrop-blur-sm text-center relative overflow-hidden group cursor-pointer"
            onClick={() => {
              document.getElementById('historial')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/5 to-brand/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <p className="text-sm font-bold text-secondary/80 uppercase tracking-wider mb-3">
                Elecciones Legislativas 2025
              </p>

              {/* Countdown Display */}
              <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-10 mb-4">
                {/* Days */}
                <div className="text-center min-w-[50px] md:min-w-[70px] lg:min-w-[90px]">
                  <div className="relative h-10 md:h-14 lg:h-20 flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={timeLeft.days}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-brand via-brand-light to-brand bg-clip-text text-transparent tabular-nums"
                      >
                        {timeLeft.days}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className="text-[10px] md:text-xs text-secondary/60 uppercase tracking-wide mt-1 md:mt-2">
                    días
                  </p>
                </div>

                {/* Hours */}
                <div className="text-center min-w-[50px] md:min-w-[70px] lg:min-w-[90px]">
                  <div className="relative h-10 md:h-14 lg:h-20 flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={timeLeft.hours}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-brand via-brand-light to-brand bg-clip-text text-transparent tabular-nums"
                      >
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className="text-[10px] md:text-xs text-secondary/60 uppercase tracking-wide mt-1 md:mt-2">
                    horas
                  </p>
                </div>

                {/* Minutes */}
                <div className="text-center min-w-[50px] md:min-w-[70px] lg:min-w-[90px]">
                  <div className="relative h-10 md:h-14 lg:h-20 flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={timeLeft.minutes}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-brand via-brand-light to-brand bg-clip-text text-transparent tabular-nums"
                      >
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className="text-[10px] md:text-xs text-secondary/60 uppercase tracking-wide mt-1 md:mt-2">
                    min
                  </p>
                </div>
              </div>

              <p className="text-sm text-secondary group-hover:text-foreground transition-colors">
                26 de octubre 2025
              </p>

              {/* Hover CTA - Expands from 0 height */}
              <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 ease-out">
                <div className="pt-4 mt-3 border-t border-border/10 group-hover:border-brand/20 transition-colors">
                  <p className="text-xs text-secondary/60 group-hover:text-brand transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    Hacé clic para ver el historial electoral
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </motion.div>

          {/* Stats Cards - Interactive */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Elecciones Historicas */}
            <motion.a
              href="#historial"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="bg-panel/30 border border-border/10 rounded-xl p-4 text-center relative overflow-hidden group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('historial')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                className="text-2xl font-black text-brand mb-1 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.15 }}
              >
                14
              </motion.div>
              <p className="text-xs text-secondary group-hover:text-foreground transition-colors relative z-10">
                Elecciones Históricas
              </p>

              {/* Arrow indicator on hover */}
              <motion.div
                className="absolute bottom-2 right-2 text-brand text-xs opacity-0 group-hover:opacity-100"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                →
              </motion.div>
            </motion.a>

            {/* Card 2: Desde 1983 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="bg-panel/30 border border-border/10 rounded-xl p-4 text-center relative overflow-hidden group cursor-pointer"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-success/0 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                className="text-2xl font-black text-success mb-1 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.15 }}
              >
                1983
              </motion.div>
              <p className="text-xs text-secondary group-hover:text-foreground transition-colors relative z-10">
                Retorno Democrático
              </p>

              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 border-2 border-success/20 rounded-xl opacity-0 group-hover:opacity-100"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
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
                <div className="flex gap-2 p-1 bg-panel/10 rounded-xl border border-border/10 max-w-md">
                  <button
                    onClick={() => setActiveLiveCategory('diputados')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeLiveCategory === 'diputados'
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-secondary hover:text-foreground hover:bg-panel/10'
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
                        : 'text-secondary hover:text-foreground hover:bg-panel/10'
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
                <div className="bg-panel/30 border border-border/10 rounded-2xl p-12 text-center">
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
                    <div className="bg-panel/50 border border-border/10 rounded-2xl p-6">
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

                    <div className="bg-panel/50 border border-border/10 rounded-2xl p-6">
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

                    <div className="bg-panel/50 border border-border/10 rounded-2xl p-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/5">
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
                        <div className="col-span-2 bg-panel/30 border border-border/10 rounded-2xl p-12 text-center">
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
