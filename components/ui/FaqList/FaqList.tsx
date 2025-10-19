/**
 * FaqList - Lista de FAQs con estado de accordion
 *
 * Maneja el estado de qué FAQ está abierto y renderiza la lista completa
 * Componente reutilizable para landing page y help center
 */

import React, { useState } from 'react';
import { FAQ } from '@/constants/faqs';
import { FaqItem } from '@/components/ui/FaqItem';

interface FaqListProps {
  /** Array de FAQs a mostrar */
  faqs: FAQ[];
  /** Clase CSS adicional para el contenedor (opcional) */
  className?: string;
}

export function FaqList({ faqs, className = '' }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {faqs.map((faq, index) => (
        <FaqItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggleFaq(index)}
          index={index}
        />
      ))}
    </div>
  );
}
