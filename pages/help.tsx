import React, { useState } from 'react';
import Link from 'next/link';
import { NavbarPro } from '@/components/ui/NavbarPro/NavbarPro';
import Footer from '@/components/Footer';
import {
  FaChevronDown,
  FaQuestionCircle,
  FaChartLine,
  FaCalculator,
  FaBell,
  FaBook,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqCategories = [
  {
    title: 'General',
    icon: FaQuestionCircle,
    faqs: [
      {
        question: '¿Qué es Dólar Gaucho?',
        answer:
          'Dólar Gaucho es una plataforma completa de información financiera argentina que proporciona cotizaciones en tiempo real del dólar, inflación, riesgo país, calculadoras financieras, calendario económico, datos políticos y más.',
      },
      {
        question: '¿Cómo se actualizan las cotizaciones?',
        answer:
          'Las cotizaciones en Dólar Gaucho se actualizan automáticamente cada 30 segundos a través de diversas fuentes financieras confiables y APIs oficiales de Argentina.',
      },
      {
        question: '¿Dólar Gaucho es un sitio oficial?',
        answer:
          'No, Dólar Gaucho es un servicio independiente que brinda información actualizada sobre el mercado cambiario y financiero en Argentina. No estamos afiliados con ninguna entidad gubernamental.',
      },
      {
        question: '¿Los datos son confiables?',
        answer:
          'Sí, utilizamos fuentes oficiales y APIs verificadas como DolarAPI.com y ArgentinaDatos.com para garantizar la precisión de la información. Sin embargo, te recomendamos contrastar con fuentes oficiales antes de tomar decisiones financieras importantes.',
      },
    ],
  },
  {
    title: 'Cotizaciones',
    icon: FaChartLine,
    faqs: [
      {
        question: '¿Cuáles son los tipos de cambio que puedo consultar?',
        answer:
          'Puedes consultar: Dólar Oficial, Blue, MEP (Bolsa), CCL (Contado con Liquidación), Crypto, y cotizaciones internacionales como Euro, Real Brasileño, Peso Chileno y Peso Uruguayo.',
      },
      {
        question: '¿Qué significa cada tipo de dólar?',
        answer:
          'Oficial: tipo de cambio regulado por el BCRA. Blue: mercado paralelo o informal. MEP: operaciones bursátiles con bonos. CCL: transferencias al exterior vía bonos. Crypto: cotización en exchanges de criptomonedas.',
      },
      {
        question: '¿Cómo funcionan las variaciones diarias?',
        answer:
          'Las variaciones muestran el cambio porcentual entre el precio actual y el del día anterior. Verde indica baja (favorable para comprar), rojo indica suba (desfavorable para comprar).',
      },
      {
        question: '¿Puedo agregar cotizaciones a favoritos?',
        answer:
          'Sí, en el Dashboard puedes marcar tus cotizaciones favoritas haciendo clic en la estrella. Esto las destacará y te permitirá acceder rápidamente a ellas.',
      },
    ],
  },
  {
    title: 'Calculadoras',
    icon: FaCalculator,
    faqs: [
      {
        question: '¿Qué calculadoras están disponibles?',
        answer:
          'Ofrecemos: Calculadora de Inflación (poder adquisitivo), Plazo Fijo (rendimiento), UVA (ajuste por inflación), Conversores de Moneda y Crypto, y Calculadora de Activos.',
      },
      {
        question: '¿Cómo funciona la calculadora de inflación?',
        answer:
          'Ingresa un monto inicial y años de proyección. La calculadora estima la pérdida de valor del dinero debido a la inflación, mostrándote el poder adquisitivo futuro basado en la tasa de inflación interanual actual.',
      },
      {
        question: '¿Las calculadoras usan datos reales?',
        answer:
          'Sí, todas las calculadoras utilizan datos actualizados de APIs oficiales como tasas de inflación, cotizaciones de divisas y valores UVA en tiempo real.',
      },
      {
        question: '¿Puedo exportar los resultados?',
        answer:
          'Actualmente puedes copiar y guardar manualmente los resultados. Estamos trabajando en funciones de exportación a PDF y CSV.',
      },
    ],
  },
  {
    title: 'Dashboard y Alertas',
    icon: FaBell,
    faqs: [
      {
        question: '¿Cómo creo alertas de precio?',
        answer:
          'En el Dashboard, ve a la sección de Alertas y configura alertas personalizadas para recibir notificaciones cuando una cotización alcance el valor que definas.',
      },
      {
        question: '¿Qué es el Dashboard?',
        answer:
          'El Dashboard es tu panel personalizado donde puedes ver tus cotizaciones favoritas, alertas configuradas, gráficos históricos, calculadoras y más herramientas profesionales.',
      },
      {
        question: '¿Necesito crear una cuenta?',
        answer:
          'No es necesario para ver cotizaciones básicas. Sin embargo, para acceder al Dashboard completo, guardar favoritos y configurar alertas, recomendamos crear una cuenta gratuita.',
      },
    ],
  },
  {
    title: 'Técnico',
    icon: FaBook,
    faqs: [
      {
        question: '¿Puedo usar la API de Dólar Gaucho?',
        answer:
          'Actualmente no contamos con una API pública propia, pero estamos trabajando en ello. Mientras tanto, usamos APIs públicas como DolarAPI.com que puedes consultar directamente.',
      },
      {
        question: '¿Es open source?',
        answer:
          'Sí, Dólar Gaucho es un proyecto open source. Puedes ver el código fuente y contribuir en nuestro repositorio de GitHub.',
      },
      {
        question: '¿Qué tecnologías usa la plataforma?',
        answer:
          'Dólar Gaucho está construido con Next.js, React, TypeScript, TailwindCSS, TanStack Query, Zustand, Chart.js y otras tecnologías modernas.',
      },
      {
        question: '¿Cómo reporto un bug o sugiero una mejora?',
        answer:
          'Puedes reportar bugs o sugerir mejoras a través del formulario de contacto en la página principal, o directamente en nuestro repositorio de GitHub.',
      },
    ],
  },
];

const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<{ category: number; faq: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    if (openIndex?.category === categoryIndex && openIndex?.faq === faqIndex) {
      setOpenIndex(null);
    } else {
      setOpenIndex({ category: categoryIndex, faq: faqIndex });
    }
  };

  const filteredCategories =
    selectedCategory !== null ? [faqCategories[selectedCategory]] : faqCategories;

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <NavbarPro />

      {/* Hero Section */}
      <section className="relative w-full bg-background text-foreground pt-32 pb-20 px-6 border-b border-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <FaQuestionCircle className="text-accent-emerald text-2xl" />
            <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
              Centro de Ayuda
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            ¿En qué podemos <span className="gradient-text">ayudarte</span>?
          </h1>
          <p className="text-secondary text-lg max-w-7xl mx-auto">
            Encuentra respuestas a las preguntas más frecuentes sobre Dólar Gaucho
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all border ${
              selectedCategory === null
                ? 'bg-accent-emerald text-background-dark border-accent-emerald'
                : 'glass border-border text-secondary hover:text-foreground hover:border-accent-emerald/30'
            }`}
          >
            Todas
          </button>
          {faqCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                onClick={() => setSelectedCategory(index)}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all border flex items-center gap-2 ${
                  selectedCategory === index
                    ? 'bg-accent-emerald text-background-dark border-accent-emerald'
                    : 'glass border-border text-secondary hover:text-foreground hover:border-accent-emerald/30'
                }`}
              >
                <Icon className="text-base" />
                {category.title}
              </button>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => {
            const actualCategoryIndex =
              selectedCategory !== null ? selectedCategory : categoryIndex;
            const Icon = category.icon;

            return (
              <div key={actualCategoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="text-accent-emerald text-xl" />
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="glass-strong border border-border rounded-xl overflow-hidden hover:border-accent-emerald/30 transition-all"
                    >
                      <button
                        className="w-full text-left px-6 py-4 flex justify-between items-center transition-all hover:bg-accent-emerald/5"
                        onClick={() => toggleFaq(actualCategoryIndex, faqIndex)}
                      >
                        <span className="text-foreground font-medium text-base pr-4">
                          {faq.question}
                        </span>
                        <FaChevronDown
                          className={`text-accent-emerald transition-transform flex-shrink-0 text-sm ${
                            openIndex?.category === actualCategoryIndex &&
                            openIndex?.faq === faqIndex
                              ? 'rotate-180'
                              : 'rotate-0'
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openIndex?.category === actualCategoryIndex &&
                          openIndex?.faq === faqIndex && (
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
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="glass-strong p-8 md:p-12 rounded-2xl border border-border text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-secondary mb-8 max-w-7xl mx-auto">
            Contáctanos y estaremos encantados de ayudarte con cualquier consulta
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-base transition-all bg-accent-emerald hover:bg-accent-teal text-background-dark"
          >
            Contactar Soporte
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
