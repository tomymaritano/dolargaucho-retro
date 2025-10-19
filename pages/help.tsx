/**
 * Centro de Ayuda - Dólar Gaucho
 *
 * FAQ organizado por categorías con búsqueda y filtros
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { LegalLayout } from '@/components/legal';
import { FaqItem } from '@/components/ui/FaqItem';
import { Tabs, Tab } from '@/components/ui/Tabs';
import { FAQ_CATEGORIES } from '@/constants/faqCategories';
import { FaSearch } from 'react-icons/fa';

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<{ category: number; faq: number } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    if (openIndex?.category === categoryIndex && openIndex?.faq === faqIndex) {
      setOpenIndex(null);
    } else {
      setOpenIndex({ category: categoryIndex, faq: faqIndex });
    }
  };

  // Create tabs from categories
  const tabs: Tab[] = [
    { id: 'all', label: 'Todas las categorías' },
    ...FAQ_CATEGORIES.map((category, index) => ({
      id: `category-${index}`,
      label: category.title,
      icon: category.icon,
    })),
  ];

  // Get selected category index from activeTab
  const selectedCategoryIndex = activeTab === 'all' ? null : parseInt(activeTab.split('-')[1]);

  // Filter by category and search
  const filteredCategories = FAQ_CATEGORIES.filter((category, index) => {
    // Filter by selected category
    if (selectedCategoryIndex !== null && index !== selectedCategoryIndex) return false;

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
          content="Encuentra respuestas a las preguntas más frecuentes sobre Dólar Gaucho y todas sus funcionalidades."
        />
      </Head>

      <LegalLayout title="Centro de Ayuda">
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="mb-8">
            <p className="text-secondary mb-6 leading-relaxed">
              Encuentra respuestas a las preguntas más frecuentes sobre Dólar Gaucho y todas sus
              funcionalidades.
            </p>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm" />
              <input
                type="text"
                placeholder="Buscar en el centro de ayuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-white/10 text-foreground placeholder-secondary/60 focus:bg-background/80 focus:border-brand/50 hover:border-white/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

          {/* FAQs by Category */}
          <div className="space-y-12 mt-8">
            {filteredCategories.map((category, categoryIndex) => {
              const actualCategoryIndex =
                selectedCategoryIndex !== null ? selectedCategoryIndex : categoryIndex;
              const Icon = category.icon;

              return (
                <div key={actualCategoryIndex}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/20">
                      <Icon className="text-brand text-lg" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  {/* FAQs List */}
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
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-secondary text-lg">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-6 bg-brand/5 border border-brand/20 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-secondary text-sm mb-4">
              Contactanos y estaremos encantados de ayudarte con cualquier consulta sobre Dólar
              Gaucho.
            </p>
            <a
              href="mailto:soporte@dolargaucho.com"
              className="inline-flex items-center text-brand hover:underline text-sm font-medium"
            >
              Contactar Soporte →
            </a>
          </div>
        </div>
      </LegalLayout>
    </>
  );
}
