'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaCheckCircle,
  FaWrench,
  FaBug,
  FaStar,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import {
  CHANGELOG,
  getCurrentVersion,
  hasNewUpdates,
  skipVersion,
  isVersionSkipped,
  type ChangelogEntry,
} from '@/lib/changelog';

const STORAGE_KEY = 'dg_last_seen_version';

// Context para controlar el modal globalmente
interface ChangelogContextType {
  openChangelog: () => void;
}

const ChangelogContext = createContext<ChangelogContextType | null>(null);

export function useChangelog() {
  const context = useContext(ChangelogContext);
  if (!context) {
    throw new Error('useChangelog must be used within ChangelogProvider');
  }
  return context;
}

// Provider component
export const ChangelogProvider = React.memo(function ChangelogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has seen the latest version
    const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
    const currentVersion = getCurrentVersion();

    // No mostrar si ya vio esta versión O si la marcó como skip
    if (hasNewUpdates(lastSeenVersion) && !isVersionSkipped(currentVersion)) {
      // Small delay before showing
      setTimeout(() => {
        setIsOpen(true);
        setShowConfetti(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowConfetti(false);

    const currentVersion = getCurrentVersion();

    // Si tildo "No mostrar esta actualización", la skippeamos
    if (dontShowAgain) {
      skipVersion(currentVersion);
    } else {
      // Si no, marcamos como vista normalmente
      localStorage.setItem(STORAGE_KEY, currentVersion);
    }

    // Reset checkbox
    setDontShowAgain(false);

    // Notify ChangelogButton to update badge count
    window.dispatchEvent(new Event('changelog-viewed'));
  };

  // Función para abrir manualmente
  const openChangelog = () => {
    setIsOpen(true);
    setShowConfetti(false); // No confetti cuando se abre manualmente
  };

  return (
    <ChangelogContext.Provider value={{ openChangelog }}>
      {children}
      <WhatsNew
        isOpen={isOpen}
        showConfetti={showConfetti}
        dontShowAgain={dontShowAgain}
        setDontShowAgain={setDontShowAgain}
        handleClose={handleClose}
      />
    </ChangelogContext.Provider>
  );
});

// Modal component (now receives props from Provider)
interface WhatsNewProps {
  isOpen: boolean;
  showConfetti: boolean;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  handleClose: () => void;
}

const WhatsNew = React.memo(function WhatsNew({
  isOpen,
  showConfetti,
  dontShowAgain,
  setDontShowAgain,
  handleClose,
}: WhatsNewProps) {
  // Estado para controlar qué entradas están expandidas
  // Por defecto, solo la primera (índice 0) está expandida
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set([0]));

  const toggleEntry = useCallback((index: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleDontShowChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDontShowAgain(e.target.checked);
    },
    [setDontShowAgain]
  );

  const renderEntry = (entry: ChangelogEntry, index: number) => {
    const isExpanded = expandedEntries.has(index);
    const isFirstEntry = index === 0;

    return (
      <motion.div
        key={entry.version}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-4 ${entry.highlight && isExpanded ? 'border-l-4 border-brand pl-4' : ''} ${!isExpanded ? 'pb-4 border-b border-border' : ''}`}
      >
        {/* Header - Always visible, clickable for old entries */}
        <div
          className={`flex items-center gap-3 ${!isFirstEntry ? 'cursor-pointer hover:bg-panel/10 rounded-lg p-2 -m-2' : ''}`}
          onClick={() => !isFirstEntry && toggleEntry(index)}
        >
          {entry.emoji && <span className="text-3xl">{entry.emoji}</span>}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{entry.title}</h3>
              {entry.highlight && isExpanded && (
                <span className="px-2 py-0.5 bg-brand/20 text-brand text-xs font-semibold rounded-full">
                  Destacado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
              <span>v{entry.version}</span>
              <span>•</span>
              <span>
                {new Date(entry.date).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          {/* Toggle icon for old entries */}
          {!isFirstEntry && (
            <div className="text-secondary">{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</div>
          )}
        </div>

        {/* Collapsible content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                {/* Description */}
                <p className="text-sm text-secondary mb-3">{entry.description}</p>

                {/* Features */}
                {entry.features && entry.features.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaStar className="text-yellow-500 text-sm" />
                      <h4 className="text-sm font-semibold text-foreground">
                        Nuevas Funcionalidades
                      </h4>
                    </div>
                    <ul className="space-y-1.5 ml-6">
                      {entry.features.map((feature, i) => (
                        <li key={i} className="text-sm text-secondary flex items-start gap-2">
                          <span className="text-brand mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {entry.improvements && entry.improvements.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaWrench className="text-blue-500 text-sm" />
                      <h4 className="text-sm font-semibold text-foreground">Mejoras</h4>
                    </div>
                    <ul className="space-y-1.5 ml-6">
                      {entry.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm text-secondary flex items-start gap-2">
                          <span className="text-brand mt-0.5">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes */}
                {entry.fixes && entry.fixes.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBug className="text-green-500 text-sm" />
                      <h4 className="text-sm font-semibold text-foreground">Correcciones</h4>
                    </div>
                    <ul className="space-y-1.5 ml-6">
                      {entry.fixes.map((fix, i) => (
                        <li key={i} className="text-sm text-secondary flex items-start gap-2">
                          <span className="text-brand mt-0.5">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand rounded-full"
              initial={{
                top: '-10%',
                left: `${Math.random() * 100}%`,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                opacity: 0,
                rotate: 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative w-full max-w-2xl max-h-[85vh] bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-b from-panel to-panel/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
                        <FaStar className="text-brand text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">¡Novedades!</h2>
                        <p className="text-xs text-secondary">
                          Conocé las últimas actualizaciones de Dólar Gaucho
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-panel/10 transition-colors text-secondary hover:text-foreground"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
                  {CHANGELOG.map((entry, index) => renderEntry(entry, index))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gradient-to-t from-panel to-panel/95 backdrop-blur-sm border-t border-white/10 px-6 py-4 space-y-3">
                  {/* Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={handleDontShowChange}
                      className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 checked:bg-brand checked:border-brand transition-all cursor-pointer"
                    />
                    <span className="text-sm text-secondary group-hover:text-foreground transition-colors">
                      No mostrar esta actualización
                    </span>
                  </label>

                  {/* Button */}
                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-light transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    <span>¡Entendido!</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 71, 255, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 71, 255, 0.7);
        }
      `}</style>
    </>
  );
});
