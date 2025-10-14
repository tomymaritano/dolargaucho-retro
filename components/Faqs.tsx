import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: '¿Cómo se actualizan las cotizaciones?',
    answer:
      'Las cotizaciones en Dólar Gaucho se actualizan en tiempo real a través de diversas fuentes financieras confiables.',
  },
  {
    question: '¿Cuáles son los tipos de cambio que puedo consultar?',
    answer:
      'Puedes ver el dólar Oficial, Blue, MEP, CCL y Crypto, además de referencias económicas como inflación y riesgo país.',
  },
  {
    question: '¿Dólar Gaucho es un sitio oficial?',
    answer:
      'No, Dólar Gaucho es un servicio independiente que brinda información actualizada sobre el mercado cambiario en Argentina.',
  },
  {
    question: '¿Puedo usar la API de Dólar Gaucho?',
    answer:
      'Actualmente no contamos con una API pública, pero estamos trabajando en ello. ¡Pronto más novedades!',
  },
];

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Preguntas <span className="gradient-text">Frecuentes</span>
          </h2>
          <p className="text-secondary text-sm mb-4">
            Respuestas a las consultas más comunes
          </p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-accent-emerald hover:text-accent-teal transition-colors font-medium"
          >
            Ver todas las preguntas en Help Center →
          </Link>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-strong border border-border rounded-xl overflow-hidden hover:border-accent-emerald/30 transition-all"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center transition-all hover:bg-accent-emerald/5"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-foreground font-medium text-sm pr-4">{faq.question}</span>
                <FaChevronDown
                  className={`text-accent-emerald transition-transform flex-shrink-0 text-sm ${
                    openIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 text-secondary text-sm leading-relaxed border-t border-border">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
