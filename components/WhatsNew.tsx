'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaWrench, FaBug, FaStar } from 'react-icons/fa';
import { CHANGELOG, getCurrentVersion, hasNewUpdates, type ChangelogEntry } from '@/lib/changelog';

const STORAGE_KEY = 'dg_last_seen_version';

export function WhatsNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Check if user has seen the latest version
    const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
    if (hasNewUpdates(lastSeenVersion)) {
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
    // Mark current version as seen
    localStorage.setItem(STORAGE_KEY, getCurrentVersion());
  };

  const renderEntry = (entry: ChangelogEntry) => (
    <motion.div
      key={entry.version}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 ${entry.highlight ? 'border-l-4 border-brand pl-4' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {entry.emoji && <span className="text-3xl">{entry.emoji}</span>}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{entry.title}</h3>
            {entry.highlight && (
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
      </div>

      {/* Description */}
      <p className="text-sm text-secondary mb-3">{entry.description}</p>

      {/* Features */}
      {entry.features && entry.features.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-500 text-sm" />
            <h4 className="text-sm font-semibold text-foreground">Nuevas Funcionalidades</h4>
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
    </motion.div>
  );

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
                className="relative w-full max-w-2xl max-h-[85vh] bg-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
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
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-secondary hover:text-foreground"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
                  {CHANGELOG.slice(0, 3).map(renderEntry)}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gradient-to-t from-panel to-panel/95 backdrop-blur-sm border-t border-white/10 px-6 py-4">
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
}
