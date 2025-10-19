/**
 * FaqItem - Componente reutilizable de FAQ Accordion
 *
 * Usado en:
 * - components/Faqs.tsx (landing page)
 * - pages/help.tsx (help center)
 *
 * Features:
 * - Animación de expand/collapse suave
 * - Hover effects con glow
 * - Chevron animado
 * - Estados visuales (open/closed)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { FAQ } from '@/constants/faqs';

interface FaqItemProps {
  /** FAQ data (question + answer) */
  faq: FAQ;
  /** Si el FAQ está abierto */
  isOpen: boolean;
  /** Callback cuando se hace clic */
  onToggle: () => void;
  /** Index para animaciones staggered (opcional) */
  index?: number;
}

export function FaqItem({ faq, isOpen, onToggle, index = 0 }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`bg-panel/50 border ${
          isOpen ? 'border-brand/30' : 'border-white/5'
        } rounded-xl overflow-hidden hover:border-brand/30 hover:bg-panel/80 transition-all`}
      >
        {/* Question Button */}
        <button
          className="w-full text-left p-4 flex items-center justify-between gap-4"
          onClick={onToggle}
        >
          {/* Question Text */}
          <span
            className={`flex-1 font-bold text-base ${
              isOpen ? 'text-brand' : 'text-foreground'
            } group-hover:text-brand transition-colors`}
          >
            {faq.question}
          </span>

          {/* Chevron Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0"
          >
            <FaChevronDown
              className={`text-sm ${isOpen ? 'text-brand' : 'text-secondary'} transition-colors`}
            />
          </motion.div>
        </button>

        {/* Answer Content (Animated) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-white/5">
                <p className="text-secondary text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
