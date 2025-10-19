import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';
import { FaqList } from '@/components/ui/FaqList';
import { FAQS } from '@/constants/faqs';

const Faqs: React.FC = () => {
  return (
    <section className="w-full py-20 sm:py-28 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Preguntas <GradientText className="font-black">Frecuentes</GradientText>
          </h2>
          <p className="text-secondary text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Todo lo que necesitás saber sobre Dólar Gaucho y sus funcionalidades
          </p>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand-light transition-colors font-semibold"
            >
              Ver guía completa en Help Center
              <FaArrowRight className="text-xs" />
            </Link>
          </motion.div>
        </motion.div>

        {/* FAQs List - Componente Reutilizable */}
        <FaqList faqs={FAQS} className="max-w-3xl mx-auto" />
      </div>
    </section>
  );
};

export default Faqs;
