import React, { useState } from 'react';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { FaQuestionCircle, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';
import { FaqItem } from '@/components/ui/FaqItem';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { LinkButton } from '@/components/ui/Button';
import { FAQ_CATEGORIES } from '@/constants/faqCategories';
import Head from 'next/head';

const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<{ category: number; faq: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    if (openIndex?.category === categoryIndex && openIndex?.faq === faqIndex) {
      setOpenIndex(null);
    } else {
      setOpenIndex({ category: categoryIndex, faq: faqIndex });
    }
  };

  // Filter by category and search
  const filteredCategories = FAQ_CATEGORIES.filter((category, index) => {
    // Filter by selected category
    if (selectedCategory !== null && index !== selectedCategory) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const categoryMatch = category.title.toLowerCase().includes(query);
      const faqMatch = category.faqs.some(
        (faq) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      );
      return categoryMatch || faqMatch;
    }

    return true;
  });

  return (
    <>
      <Head>
        <title>Centro de Ayuda | Dólar Gaucho</title>
        <meta
          name="description"
          content="Encuentra respuestas a las preguntas más frecuentes sobre Dólar Gaucho"
        />
      </Head>

      <div className="bg-background text-foreground min-h-screen font-sans">
        <NavbarFloating />

        {/* Hero Section */}
        <section className="relative w-full bg-background text-foreground pt-32 pb-20 px-6">
          {/* Simple gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/10 to-background"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand/10 border border-brand/20"
            >
              <FaQuestionCircle className="text-brand text-lg" />
              <span className="text-xs uppercase tracking-wider text-brand font-semibold">
                Centro de Ayuda
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight"
            >
              ¿En qué podemos <GradientText className="font-black">ayudarte</GradientText>?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8"
            >
              Encuentra respuestas a las preguntas más frecuentes sobre Dólar Gaucho y todas sus
              funcionalidades
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm" />
                <input
                  type="text"
                  placeholder="Buscar en el centro de ayuda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-secondary/60 focus:bg-white/[0.07] focus:border-white/20 hover:border-white/15 transition-all outline-none"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter - Componente reutilizable */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <CategoryFilter
            categories={FAQ_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            allLabel="Todas las categorías"
            className="mb-16"
          />

          {/* FAQs - Enhanced with hover effects */}
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => {
              const actualCategoryIndex =
                selectedCategory !== null ? selectedCategory : categoryIndex;
              const Icon = category.icon;

              return (
                <motion.div
                  key={actualCategoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-brand/10 border border-brand/20">
                      <Icon className="text-brand text-xl" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  {/* FAQs List - Usando componente reutilizable */}
                  <div className="space-y-3">
                    {category.faqs.map((faq, faqIndex) => {
                      const isOpen =
                        openIndex?.category === actualCategoryIndex && openIndex?.faq === faqIndex;

                      return (
                        <FaqItem
                          key={faqIndex}
                          faq={faq}
                          isOpen={isOpen}
                          onToggle={() => toggleFaq(actualCategoryIndex, faqIndex)}
                          index={faqIndex}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 mb-12">
          <div className="bg-gradient-to-br from-panel/80 via-panel to-panel/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center border border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                ¿No encontraste lo que <GradientText className="font-black">buscabas</GradientText>?
              </h2>
              <p className="text-secondary mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                Contactanos y estaremos encantados de ayudarte con cualquier consulta sobre Dólar
                Gaucho
              </p>
              <LinkButton variant="primary" size="lg" href="/#contacto">
                Contactar Soporte
              </LinkButton>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
